use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

declare_id!("AsKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_train_earn {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.authority = authority;
        train_earn_config.total_tasks = 0;
        train_earn_config.total_rewards_distributed = 0;
        train_earn_config.bump = *ctx.bumps.get("train_earn_config").unwrap();
        
        Ok(())
    }

    pub fn create_task_pool(
        ctx: Context<CreateTaskPool>,
        name: String,
        reward_amount: u64,
        max_completions: u64,
    ) -> Result<()> {
        let task_pool = &mut ctx.accounts.task_pool;
        task_pool.authority = ctx.accounts.authority.key();
        task_pool.name = name;
        task_pool.reward_amount = reward_amount;
        task_pool.max_completions = max_completions;
        task_pool.current_completions = 0;
        task_pool.is_active = true;
        task_pool.bump = *ctx.bumps.get("task_pool").unwrap();
        
        Ok(())
    }

    pub fn complete_task(
        ctx: Context<CompleteTask>,
        task_data: String,
    ) -> Result<()> {
        let task_pool = &mut ctx.accounts.task_pool;
        
        // Check if task pool is active
        require!(task_pool.is_active, TrainEarnError::TaskPoolInactive);
        
        // Check if max completions has been reached
        require!(
            task_pool.current_completions < task_pool.max_completions,
            TrainEarnError::TaskPoolCompleted
        );
        
        // Create task completion record
        let task_completion = &mut ctx.accounts.task_completion;
        task_completion.user = ctx.accounts.user.key();
        task_completion.task_pool = ctx.accounts.task_pool.key();
        task_completion.task_data = task_data;
        task_completion.timestamp = Clock::get()?.unix_timestamp;
        task_completion.reward_claimed = false;
        task_completion.bump = *ctx.bumps.get("task_completion").unwrap();
        
        // Update task pool completions
        task_pool.current_completions = task_pool.current_completions.checked_add(1)
            .ok_or(TrainEarnError::Overflow)?;
        
        // Update total tasks in config
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.total_tasks = train_earn_config.total_tasks.checked_add(1)
            .ok_or(TrainEarnError::Overflow)?;
        
        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let task_completion = &mut ctx.accounts.task_completion;
        
        // Check if reward has already been claimed
        require!(!task_completion.reward_claimed, TrainEarnError::RewardAlreadyClaimed);
        
        let task_pool = &ctx.accounts.task_pool;
        
        // Transfer reward tokens to user
        let seeds = &[
            b"task-pool",
            task_pool.authority.as_ref(),
            task_pool.name.as_bytes(),
            &[ctx.bumps.task_pool],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.reward_pool_token_account.to_account_info(),
            to: ctx.accounts.user_reward_token_account.to_account_info(),
            authority: ctx.accounts.task_pool.to_account_info(),
            mint: ctx.accounts.reward_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(
            cpi_ctx,
            task_pool.reward_amount,
            ctx.accounts.reward_token_mint.decimals,
        )?;
        
        // Mark reward as claimed
        task_completion.reward_claimed = true;
        
        // Update config with total rewards distributed
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.total_rewards_distributed = train_earn_config.total_rewards_distributed
            .checked_add(task_pool.reward_amount)
            .ok_or(TrainEarnError::Overflow)?;
        
        // Issue SAS attestation for completed task
        // This would typically involve a cross-program call to the attestations program
        // For now, we'll just log that an attestation should be issued
        msg!("Task completion attestation should be issued for user: {}", ctx.accounts.user.key());
        
        Ok(())
    }

    pub fn issue_task_attestation(ctx: Context<IssueTaskAttestation>, task_type: String) -> Result<()> {
        // In a full implementation, this would involve:
        // 1. Verifying the task completion
        // 2. Calling the attestations program to issue a SAS-compliant attestation
        // 3. Recording the attestation for reputation purposes
        
        msg!("Issuing task attestation of type '{}' for user: {}", task_type, ctx.accounts.user.key());
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + TrainEarnConfig::INIT_SPACE,
        seeds = [b"train-earn-config"],
        bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateTaskPool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TaskPool::INIT_SPACE,
        seeds = [b"task-pool", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_data: String)]
pub struct CompleteTask<'info> {
    #[account(
        mut,
        seeds = [b"task-pool", task_pool.authority.as_ref(), task_pool.name.as_bytes()],
        bump = task_pool.bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + TaskCompletion::INIT_SPACE,
        seeds = [
            b"task-completion",
            task_pool.key().as_ref(),
            user.key().as_ref(),
            &task_pool.current_completions.to_le_bytes()
        ],
        bump
    )]
    pub task_completion: Account<'info, TaskCompletion>,
    
    #[account(
        seeds = [b"train-earn-config"],
        bump = train_earn_config.bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
        seeds = [b"task-pool", task_pool.authority.as_ref(), task_pool.name.as_bytes()],
        bump = task_pool.bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(
        mut,
        seeds = [
            b"task-completion",
            task_pool.key().as_ref(),
            task_completion.user.as_ref(),
            &(task_pool.current_completions - 1).to_le_bytes() // This is a simplification
        ],
        bump = task_completion.bump
    )]
    pub task_completion: Account<'info, TaskCompletion>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = task_pool,
    )]
    pub reward_pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        seeds = [b"train-earn-config"],
        bump = train_earn_config.bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueTaskAttestation<'info> {
    /// CHECK: This account is checked in the attestations program
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TrainEarnConfig {
    pub authority: Pubkey,
    pub total_tasks: u64,
    pub total_rewards_distributed: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TaskPool {
    pub authority: Pubkey,
    pub name: String,
    pub reward_amount: u64,
    pub max_completions: u64,
    pub current_completions: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TaskCompletion {
    pub user: Pubkey,
    pub task_pool: Pubkey,
    pub task_data: String,
    pub timestamp: i64,
    pub reward_claimed: bool,
    pub bump: u8,
}

#[error_code]
pub enum TrainEarnError {
    #[msg("Task pool is inactive")]
    TaskPoolInactive,
    
    #[msg("Task pool has reached maximum completions")]
    TaskPoolCompleted,
    
    #[msg("Reward has already been claimed")]
    RewardAlreadyClaimed,
    
    #[msg("Arithmetic overflow")]
    Overflow,
}use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

declare_id!("AsKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_train_earn {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.authority = authority;
        train_earn_config.total_tasks = 0;
        train_earn_config.total_rewards_distributed = 0;
        train_earn_config.bump = *ctx.bumps.get("train_earn_config").unwrap();
        
        Ok(())
    }

    pub fn create_task_pool(
        ctx: Context<CreateTaskPool>,
        name: String,
        reward_amount: u64,
        max_completions: u64,
    ) -> Result<()> {
        let task_pool = &mut ctx.accounts.task_pool;
        task_pool.authority = ctx.accounts.authority.key();
        task_pool.name = name;
        task_pool.reward_amount = reward_amount;
        task_pool.max_completions = max_completions;
        task_pool.current_completions = 0;
        task_pool.is_active = true;
        task_pool.bump = *ctx.bumps.get("task_pool").unwrap();
        
        Ok(())
    }

    pub fn complete_task(
        ctx: Context<CompleteTask>,
        task_data: String,
    ) -> Result<()> {
        let task_pool = &mut ctx.accounts.task_pool;
        
        // Check if task pool is active
        require!(task_pool.is_active, TrainEarnError::TaskPoolInactive);
        
        // Check if max completions has been reached
        require!(
            task_pool.current_completions < task_pool.max_completions,
            TrainEarnError::TaskPoolCompleted
        );
        
        // Create task completion record
        let task_completion = &mut ctx.accounts.task_completion;
        task_completion.user = ctx.accounts.user.key();
        task_completion.task_pool = ctx.accounts.task_pool.key();
        task_completion.task_data = task_data;
        task_completion.timestamp = Clock::get()?.unix_timestamp;
        task_completion.reward_claimed = false;
        task_completion.bump = *ctx.bumps.get("task_completion").unwrap();
        
        // Update task pool completions
        task_pool.current_completions = task_pool.current_completions.checked_add(1)
            .ok_or(TrainEarnError::Overflow)?;
        
        // Update total tasks in config
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.total_tasks = train_earn_config.total_tasks.checked_add(1)
            .ok_or(TrainEarnError::Overflow)?;
        
        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let task_completion = &mut ctx.accounts.task_completion;
        
        // Check if reward has already been claimed
        require!(!task_completion.reward_claimed, TrainEarnError::RewardAlreadyClaimed);
        
        let task_pool = &ctx.accounts.task_pool;
        
        // Transfer reward tokens to user
        let seeds = &[
            b"task-pool",
            task_pool.authority.as_ref(),
            task_pool.name.as_bytes(),
            &[ctx.bumps.task_pool],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.reward_pool_token_account.to_account_info(),
            to: ctx.accounts.user_reward_token_account.to_account_info(),
            authority: ctx.accounts.task_pool.to_account_info(),
            mint: ctx.accounts.reward_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(
            cpi_ctx,
            task_pool.reward_amount,
            ctx.accounts.reward_token_mint.decimals,
        )?;
        
        // Mark reward as claimed
        task_completion.reward_claimed = true;
        
        // Update config with total rewards distributed
        let train_earn_config = &mut ctx.accounts.train_earn_config;
        train_earn_config.total_rewards_distributed = train_earn_config.total_rewards_distributed
            .checked_add(task_pool.reward_amount)
            .ok_or(TrainEarnError::Overflow)?;
        
        // Issue SAS attestation for completed task
        // This would typically involve a cross-program call to the attestations program
        // For now, we'll just log that an attestation should be issued
        msg!("Task completion attestation should be issued for user: {}", ctx.accounts.user.key());
        
        Ok(())
    }

    pub fn issue_task_attestation(ctx: Context<IssueTaskAttestation>, task_type: String) -> Result<()> {
        // In a full implementation, this would involve:
        // 1. Verifying the task completion
        // 2. Calling the attestations program to issue a SAS-compliant attestation
        // 3. Recording the attestation for reputation purposes
        
        msg!("Issuing task attestation of type '{}' for user: {}", task_type, ctx.accounts.user.key());
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + TrainEarnConfig::INIT_SPACE,
        seeds = [b"train-earn-config"],
        bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateTaskPool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TaskPool::INIT_SPACE,
        seeds = [b"task-pool", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_data: String)]
pub struct CompleteTask<'info> {
    #[account(
        mut,
        seeds = [b"task-pool", task_pool.authority.as_ref(), task_pool.name.as_bytes()],
        bump = task_pool.bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + TaskCompletion::INIT_SPACE,
        seeds = [
            b"task-completion",
            task_pool.key().as_ref(),
            user.key().as_ref(),
            &task_pool.current_completions.to_le_bytes()
        ],
        bump
    )]
    pub task_completion: Account<'info, TaskCompletion>,
    
    #[account(
        seeds = [b"train-earn-config"],
        bump = train_earn_config.bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
        seeds = [b"task-pool", task_pool.authority.as_ref(), task_pool.name.as_bytes()],
        bump = task_pool.bump
    )]
    pub task_pool: Account<'info, TaskPool>,
    
    #[account(
        mut,
        seeds = [
            b"task-completion",
            task_pool.key().as_ref(),
            task_completion.user.as_ref(),
            &(task_pool.current_completions - 1).to_le_bytes() // This is a simplification
        ],
        bump = task_completion.bump
    )]
    pub task_completion: Account<'info, TaskCompletion>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = task_pool,
    )]
    pub reward_pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        seeds = [b"train-earn-config"],
        bump = train_earn_config.bump
    )]
    pub train_earn_config: Account<'info, TrainEarnConfig>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueTaskAttestation<'info> {
    /// CHECK: This account is checked in the attestations program
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TrainEarnConfig {
    pub authority: Pubkey,
    pub total_tasks: u64,
    pub total_rewards_distributed: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TaskPool {
    pub authority: Pubkey,
    pub name: String,
    pub reward_amount: u64,
    pub max_completions: u64,
    pub current_completions: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TaskCompletion {
    pub user: Pubkey,
    pub task_pool: Pubkey,
    pub task_data: String,
    pub timestamp: i64,
    pub reward_claimed: bool,
    pub bump: u8,
}

#[error_code]
pub enum TrainEarnError {
    #[msg("Task pool is inactive")]
    TaskPoolInactive,
    
    #[msg("Task pool has reached maximum completions")]
    TaskPoolCompleted,
    
    #[msg("Reward has already been claimed")]
    RewardAlreadyClaimed,
    
    #[msg("Arithmetic overflow")]
    Overflow,
}
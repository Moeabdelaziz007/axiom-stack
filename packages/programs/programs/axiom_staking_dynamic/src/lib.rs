use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Token, TokenAccount, Mint, Transfer, transfer},
    associated_token::AssociatedToken,
};

declare_id!("AXiomStkD111111111111111111111111111111111");

#[program]
pub mod axiom_staking_dynamic {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, reward_per_second: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.staked_token_mint = ctx.accounts.staked_token_mint.key();
        pool.reward_mint = ctx.accounts.reward_mint.key();
        pool.reward_per_second = reward_per_second;
        pool.last_reward_time = ctx.accounts.clock.unix_timestamp;
        pool.acc_reward_per_share = 0;
        pool.total_staked = 0;
        pool.bump = *ctx.bumps.get("pool").unwrap();
        
        msg!("Staking pool initialized with reward rate: {}", reward_per_second);
        Ok(())
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer(cpi_ctx, amount)?;
        
        // Update user stake account
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = user_stake.reward_debt.checked_add(
            ((amount as u128).checked_mul(ctx.accounts.pool.acc_reward_per_share as u128)
                .ok_or(StakingError::Overflow)? >> 40) as u64
        ).ok_or(StakingError::Overflow)?;
        
        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        
        msg!("Staked {} tokens", amount);
        Ok(())
    }

    pub fn stake_tokens_with_reputation(ctx: Context<StakeTokensWithReputation>, amount: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer(cpi_ctx, amount)?;
        
        // Get reputation score from PoHW attestation
        let reputation_score = if ctx.accounts.pohw_attestation.owner == &crate::id() {
            // If the attestation account is owned by our program, read the quality score
            let attestation_data = ctx.accounts.pohw_attestation.try_borrow_data()?;
            // This is a simplified approach - in reality, we'd deserialize the account properly
            // For now, we'll just use a mock value
            9500u16 // Mock high reputation score
        } else {
            // If no valid attestation, use default score
            5000u16
        };
        
        // Calculate reputation multiplier (1.0 to 2.0 based on reputation score)
        let max_reputation = 10000u64;
        let reputation_multiplier = 1.0 + (reputation_score as f64 / max_reputation as f64);
        
        // Apply reputation multiplier to the staked amount for reward calculations
        let effective_amount = (amount as f64 * reputation_multiplier) as u64;
        
        // Update user stake account
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.effective_amount = user_stake.effective_amount.checked_add(effective_amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = user_stake.reward_debt.checked_add(
            ((effective_amount as u128).checked_mul(ctx.accounts.pool.acc_reward_per_share as u128)
                .ok_or(StakingError::Overflow)? >> 40) as u64
        ).ok_or(StakingError::Overflow)?;
        user_stake.reputation_score = reputation_score;
        
        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        pool.total_effective_staked = pool.total_effective_staked.checked_add(effective_amount)
            .ok_or(StakingError::Overflow)?;
        
        msg!("Staked {} tokens with reputation score {} (effective amount: {})", amount, reputation_score, effective_amount);
        Ok(())
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        require!(user_stake.amount >= amount, StakingError::InsufficientStake);
        
        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        
        // Update user stake
        user_stake.amount = user_stake.amount.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = user_stake.reward_debt.checked_sub(
            ((amount as u128).checked_mul(pool.acc_reward_per_share as u128)
                .ok_or(StakingError::Overflow)? >> 40) as u64
        ).ok_or(StakingError::Overflow)?;
        
        // Transfer tokens from pool to user
        let seeds = &[
            b"pool",
            &[pool.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        
        transfer(cpi_ctx, amount)?;
        
        msg!("Unstaked {} tokens", amount);
        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        let pool = &mut ctx.accounts.pool;
        
        let pending_reward = ((user_stake.amount as u128).checked_mul(pool.acc_reward_per_share as u128)
            .ok_or(StakingError::Overflow)? >> 40) as u64
            .checked_sub(user_stake.reward_debt)
            .ok_or(StakingError::Overflow)?;
        
        if pending_reward > 0 {
            // Transfer rewards to user
            let seeds = &[
                b"pool",
                &[pool.bump],
            ];
            let signer_seeds = &[&seeds[..]];
            
            let cpi_accounts = Transfer {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_reward_token_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            
            transfer(cpi_ctx, pending_reward)?;
            
            msg!("Claimed {} reward tokens", pending_reward);
        }
        
        user_stake.reward_debt = ((user_stake.amount as u128).checked_mul(pool.acc_reward_per_share as u128)
            .ok_or(StakingError::Overflow)? >> 40) as u64;
        
        Ok(())
    }

    pub fn update_reward_rate(ctx: Context<UpdateRewardRate>, new_rate: u64) -> Result<()> {
        require!(ctx.accounts.authority.key() == ctx.accounts.pool.authority, StakingError::Unauthorized);
        
        let pool = &mut ctx.accounts.pool;
        pool.reward_per_second = new_rate;
        
        msg!("Updated reward rate to {}", new_rate);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"pool"],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    pub staked_token_mint: Account<'info, Mint>,
    pub reward_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        associated_token::mint = staked_token_mint,
        associated_token::authority = pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        associated_token::mint = reward_mint,
        associated_token::authority = pool,
    )]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user_stake", user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = pool.staked_token_mint,
        associated_token::authority = pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct StakeTokensWithReputation<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user_stake", user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: This account is checked in the instruction
    #[account(
        seeds = [
            b"po_hw_attestation",
            pool.key().as_ref(), // Using pool key as schema key for demo purposes
            user.key().as_ref()
        ],
        bump
    )]
    pub pohw_attestation: AccountInfo<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = pool.staked_token_mint,
        associated_token::authority = pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref()],
        bump = user_stake.bump,
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = pool.staked_token_mint,
        associated_token::authority = pool,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref()],
        bump = user_stake.bump,
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        associated_token::mint = pool.reward_mint,
        associated_token::authority = pool,
    )]
    pub reward_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = pool.reward_mint,
        associated_token::authority = user,
    )]
    pub user_reward_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UpdateRewardRate<'info> {
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"pool"],
        bump = pool.bump,
    )]
    pub pool: Account<'info, StakingPool>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub staked_token_mint: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_per_second: u64,
    pub last_reward_time: i64,
    pub acc_reward_per_share: u128,
    pub total_staked: u64,
    pub total_effective_staked: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub amount: u64,
    pub effective_amount: u64,
    pub reward_debt: u64,
    pub reputation_score: u16,
    pub bump: u8,
}

#[error_code]
pub enum StakingError {
    #[msg("Overflow error")]
    Overflow,
    #[msg("Insufficient stake")]
    InsufficientStake,
    #[msg("Unauthorized")]
    Unauthorized,
}
use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

declare_id!("3sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_staking {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, reward_rate: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.staked_token_mint = ctx.accounts.staked_token_mint.key();
        pool.reward_token_mint = ctx.accounts.reward_token_mint.key();
        pool.reward_rate = reward_rate;
        pool.total_staked = 0;
        pool.acc_reward_per_share = 0;
        pool.last_reward_time = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
            mint: ctx.accounts.staked_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.staked_token_mint.decimals)?;
        
        // Update user stake account
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = user_stake.reward_debt.checked_add(
            ((amount as u64).checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
                .ok_or(StakingError::Overflow)?) as u64
        ).ok_or(StakingError::Overflow)?;
        
        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        
        Ok(())
    }

    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Check if user has enough staked
        if user_stake.amount < amount {
            return err!(StakingError::InsufficientStakedAmount);
        }

        // Calculate pending rewards
        let pending_reward = (((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64)
            .checked_sub(user_stake.reward_debt)
            .ok_or(StakingError::Overflow)?;

        // Transfer staked tokens back to user
        let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
        let seeds = &[
            b"staking-pool",
            staked_token_mint_key.as_ref(),
            &[ctx.bumps.pool],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = TransferChecked {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
            mint: ctx.accounts.staked_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.staked_token_mint.decimals)?;

        // Transfer rewards to user
        if pending_reward > 0 {
            let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
            let seeds = &[
                b"staking-pool",
                staked_token_mint_key.as_ref(),
                &[ctx.bumps.pool],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = TransferChecked {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_reward_token_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
                mint: ctx.accounts.reward_token_mint.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            
            transfer_checked(cpi_ctx, pending_reward, ctx.accounts.reward_token_mint.decimals)?;
        }

        // Update user stake account
        user_stake.amount = user_stake.amount.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake.reward_debt = ((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64;

        // Update pool
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_sub(amount)
            .ok_or(StakingError::Overflow)?;

        Ok(())
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Calculate pending rewards
        let pending_reward = (((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64)
            .checked_sub(user_stake.reward_debt)
            .ok_or(StakingError::Overflow)?;

        if pending_reward > 0 {
            let staked_token_mint_key = ctx.accounts.staked_token_mint.key();
            let seeds = &[
                b"staking-pool",
                staked_token_mint_key.as_ref(),
                &[ctx.bumps.pool],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = TransferChecked {
                from: ctx.accounts.reward_token_account.to_account_info(),
                to: ctx.accounts.user_reward_token_account.to_account_info(),
                authority: ctx.accounts.pool.to_account_info(),
                mint: ctx.accounts.reward_token_mint.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            
            transfer_checked(cpi_ctx, pending_reward, ctx.accounts.reward_token_mint.decimals)?;
        }

        // Update user stake account
        user_stake.reward_debt = ((user_stake.amount as u64)
            .checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
            .ok_or(StakingError::Overflow)?) as u64;

        Ok(())
    }
    
    // New function for reputation-based staking (RaY)
    pub fn stake_with_reputation(ctx: Context<StakeWithReputation>, amount: u64, reputation_score: u64) -> Result<()> {
        // Transfer tokens from user to pool
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
            mint: ctx.accounts.staked_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.staked_token_mint.decimals)?;
        
        // Calculate reputation multiplier (1.0 to 2.0 based on reputation score)
        // For simplicity, we'll use a linear scale from 1.0 (0 reputation) to 2.0 (max reputation)
        let max_reputation = 10000u64; // Example max reputation score
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
            ((effective_amount as u64).checked_mul(ctx.accounts.pool.acc_reward_per_share as u64)
                .ok_or(StakingError::Overflow)?) as u64
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
    
    // New function for dynamic APY based on SAS attestations
    pub fn update_reward_rate(ctx: Context<UpdateRewardRate>, new_reward_rate: u64) -> Result<()> {
        // Only the pool authority can update the reward rate
        require!(
            ctx.accounts.authority.key() == ctx.accounts.pool.authority,
            StakingError::Unauthorized
        );
        
        let pool = &mut ctx.accounts.pool;
        pool.reward_rate = new_reward_rate;
        
        msg!("Updated reward rate to {}", new_reward_rate);
        Ok(())
    }
    
    // New function to calculate dynamic APY based on SAS attestations
    pub fn calculate_dynamic_apr(ctx: Context<CalculateDynamicAPR>, positive_attestations: u64, negative_attestations: u64) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        // Calculate base APR (e.g., 10%)
        let base_apr = 1000u64; // 10% in basis points (1000/10000 = 10%)
        
        // Calculate adjustment based on attestations
        // Positive attestations increase APR, negative attestations decrease it
        let positive_multiplier = positive_attestations.saturating_mul(50); // +0.5% per positive attestation
        let negative_multiplier = negative_attestations.saturating_mul(100); // -1% per negative attestation
        
        // Calculate new APR with bounds (min 1%, max 50%)
        let new_apr = base_apr
            .saturating_add(positive_multiplier)
            .saturating_sub(negative_multiplier)
            .max(100) // Minimum 1%
            .min(5000); // Maximum 50%
        
        // Convert APR to reward rate (simplified calculation)
        // In a real implementation, this would consider time periods and compounding
        let new_reward_rate = new_apr.saturating_mul(100); // Scale for precision
        
        // Update the pool reward rate
        pool.reward_rate = new_reward_rate;
        
        msg!("Calculated dynamic APR: {} basis points ({}%) based on {} positive and {} negative attestations", 
             new_apr, new_apr as f64 / 100.0, positive_attestations, negative_attestations);
        
        Ok(())
    }
    
    // New function to apply reputation boost multipliers for positive SAS attestations
    pub fn apply_reputation_boost(ctx: Context<ApplyReputationBoost>, positive_attestations: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Calculate boost multiplier based on positive attestations
        // Each positive attestation provides a 0.1% boost, capped at 10%
        let boost_percentage = (positive_attestations as f64 * 0.1).min(10.0);
        let boost_multiplier = 1.0 + (boost_percentage / 100.0);
        
        // Apply boost to effective amount
        let new_effective_amount = ((user_stake.effective_amount as f64) * boost_multiplier) as u64;
        
        // Update pool's total effective staked amount
        let pool = &mut ctx.accounts.pool;
        let effective_amount_diff = new_effective_amount.saturating_sub(user_stake.effective_amount);
        pool.total_effective_staked = pool.total_effective_staked.checked_add(effective_amount_diff)
            .ok_or(StakingError::Overflow)?;
        
        // Update user stake
        user_stake.effective_amount = new_effective_amount;
        user_stake.positive_attestations = user_stake.positive_attestations.checked_add(positive_attestations)
            .ok_or(StakingError::Overflow)?;
        
        // Update reward debt to maintain consistency
        user_stake.reward_debt = user_stake.reward_debt.checked_add(
            ((effective_amount_diff as u64).checked_mul(pool.acc_reward_per_share as u64)
                .ok_or(StakingError::Overflow)?) as u64
        ).ok_or(StakingError::Overflow)?;
        
        msg!("Applied reputation boost of {}% based on {} positive attestations", boost_percentage, positive_attestations);
        Ok(())
    }
    
    // New function to initialize cold-start trust for new agents
    pub fn initialize_cold_start_trust(ctx: Context<InitializeColdStartTrust>, initial_trust_score: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // For new agents, we provide a small initial trust score to help them get started
        // This is a cold-start mechanism to bootstrap trust for new agents
        let base_amount = 1000000u64; // 1 token as base amount
        let trust_multiplier = (initial_trust_score as f64 / 100.0).max(0.1).min(2.0); // 0.1 to 2.0 multiplier
        let effective_amount = (base_amount as f64 * trust_multiplier) as u64;
        
        // Initialize user stake with cold-start trust
        user_stake.amount = base_amount;
        user_stake.effective_amount = effective_amount;
        user_stake.reward_debt = 0;
        user_stake.reputation_score = initial_trust_score;
        user_stake.positive_attestations = 0;
        user_stake.is_cold_start = true;
        user_stake.cold_start_timestamp = Clock::get()?.unix_timestamp;
        
        // Update pool statistics
        let pool = &mut ctx.accounts.pool;
        pool.total_staked = pool.total_staked.checked_add(base_amount)
            .ok_or(StakingError::Overflow)?;
        pool.total_effective_staked = pool.total_effective_staked.checked_add(effective_amount)
            .ok_or(StakingError::Overflow)?;
        
        msg!("Initialized cold-start trust with score {} (effective amount: {})", initial_trust_score, effective_amount);
        Ok(())
    }
    
    // New function to graduate from cold-start trust
    pub fn graduate_from_cold_start(ctx: Context<GraduateFromColdStart>) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Check if user is in cold-start mode
        require!(user_stake.is_cold_start, StakingError::NotInColdStart);
        
        // Check if cold-start period has expired (7 days)
        let current_time = Clock::get()?.unix_timestamp;
        let cold_start_duration = current_time - user_stake.cold_start_timestamp;
        require!(cold_start_duration >= 604800, StakingError::ColdStartPeriodNotExpired); // 7 days in seconds
        
        // Graduate from cold-start by resetting the flag
        user_stake.is_cold_start = false;
        
        msg!("Graduated from cold-start trust");
        Ok(())
    }
    
    // New function to update user reputation score directly
    pub fn update_reputation_score(ctx: Context<UpdateReputationScore>, new_reputation: u64) -> Result<()> {
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.reputation_score = new_reputation;
        
        msg!("Updated user reputation score to {}", new_reputation);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = pool,
    )]
    pub reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = pool,
    )]
    pub reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = reward_token_mint,
        token::authority = user,
    )]
    pub user_reward_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    pub reward_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// New account context for reputation-based staking
#[derive(Accounts)]
pub struct StakeWithReputation<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = pool,
    )]
    pub pool_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// New account context for updating reward rate
#[derive(Accounts)]
pub struct UpdateRewardRate<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

// New account context for calculating dynamic APR based on SAS attestations
#[derive(Accounts)]
pub struct CalculateDynamicAPR<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump,
        constraint = pool.staked_token_mint == staked_token_mint.key()
    )]
    pub pool: Account<'info, StakingPool>,
    
    /// CHECK: This account can be the attestation program or an authorized entity
    pub attestation_authority: AccountInfo<'info>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

// New account context for applying reputation boost
#[derive(Accounts)]
pub struct ApplyReputationBoost<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    /// CHECK: This account can be the attestation program or an authorized entity
    pub attestation_authority: AccountInfo<'info>,
}

// New account context for initializing cold-start trust
#[derive(Accounts)]
pub struct InitializeColdStartTrust<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// New account context for graduating from cold-start trust
#[derive(Accounts)]
pub struct GraduateFromColdStart<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

// New account context for updating reputation score
#[derive(Accounts)]
pub struct UpdateReputationScore<'info> {
    #[account(
        mut,
        seeds = [b"staking-pool", staked_token_mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user-stake", pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub authority: Pubkey,
    pub staked_token_mint: Pubkey,
    pub reward_token_mint: Pubkey,
    pub reward_rate: u64,
    pub total_staked: u64,
    pub total_effective_staked: u64, // New field for reputation-weighted staking
    pub acc_reward_per_share: u128, // Accumulated reward per share
    pub last_reward_time: i64,      // Last time reward was calculated
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub amount: u64,       // Amount of tokens staked
    pub effective_amount: u64, // Reputation-weighted staked amount
    pub reward_debt: u64,  // Reward debt for calculating pending rewards
    pub reputation_score: u64, // User's reputation score
    pub positive_attestations: u64, // Count of positive SAS attestations
    pub is_cold_start: bool, // Flag indicating if user is in cold-start mode
    pub cold_start_timestamp: i64, // Timestamp when cold-start was initialized
}

#[error_code]
pub enum StakingError {
    #[msg("Insufficient staked amount")]
    InsufficientStakedAmount,
    
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Not in cold-start mode")]
    NotInColdStart,
    
    #[msg("Cold-start period not expired")]
    ColdStartPeriodNotExpired,
}
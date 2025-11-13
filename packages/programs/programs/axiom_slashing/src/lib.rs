use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked, Burn, burn},
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("9sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_slashing {
    use super::*;

    // Initialize the slashing configuration
    pub fn initialize_slashing_config(ctx: Context<InitializeSlashingConfig>, authority: Pubkey) -> Result<()> {
        let slashing_config = &mut ctx.accounts.slashing_config;
        slashing_config.authority = authority;
        slashing_config.total_slashes = 0;
        slashing_config.bump = *ctx.bumps.get("slashing_config").unwrap();
        
        msg!("Slashing configuration initialized");
        Ok(())
    }

    // Slash tokens from a malicious agent
    pub fn slash_agent(
        ctx: Context<SlashAgent>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        // Verify authority
        require!(
            ctx.accounts.authority.key() == ctx.accounts.slashing_config.authority,
            SlashingError::Unauthorized
        );

        // Transfer tokens from user to pool as penalty
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.penalty_pool.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
            mint: ctx.accounts.staked_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.staked_token_mint.decimals)?;

        // Update slashing config
        let slashing_config = &mut ctx.accounts.slashing_config;
        slashing_config.total_slashes = slashing_config.total_slashes.checked_add(1)
            .ok_or(SlashingError::Overflow)?;

        // Record the slash event
        let slash_record = &mut ctx.accounts.slash_record;
        slash_record.user = ctx.accounts.user.key();
        slash_record.amount = amount;
        slash_record.reason = reason;
        slash_record.timestamp = Clock::get()?.unix_timestamp;
        slash_record.bump = *ctx.bumps.get("slash_record").unwrap();

        // Update user stake account to reflect the slash
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_sub(amount)
            .ok_or(SlashingError::InsufficientFunds)?;

        msg!("Slashed {} tokens from user for reason: {}", amount, slash_record.reason);
        Ok(())
    }

    // Burn tokens as a more severe penalty
    pub fn burn_tokens(
        ctx: Context<BurnTokens>,
        amount: u64,
        reason: String,
    ) -> Result<()> {
        // Verify authority
        require!(
            ctx.accounts.authority.key() == ctx.accounts.slashing_config.authority,
            SlashingError::Unauthorized
        );

        // Burn tokens directly
        let cpi_accounts = Burn {
            mint: ctx.accounts.staked_token_mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        burn(cpi_ctx, amount)?;

        // Update slashing config
        let slashing_config = &mut ctx.accounts.slashing_config;
        slashing_config.total_slashes = slashing_config.total_slashes.checked_add(1)
            .ok_or(SlashingError::Overflow)?;

        // Record the burn event
        let slash_record = &mut ctx.accounts.slash_record;
        slash_record.user = ctx.accounts.user.key();
        slash_record.amount = amount;
        slash_record.reason = reason;
        slash_record.timestamp = Clock::get()?.unix_timestamp;
        slash_record.bump = *ctx.bumps.get("slash_record").unwrap();

        // Update user stake account to reflect the burn
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_sub(amount)
            .ok_or(SlashingError::InsufficientFunds)?;

        msg!("Burned {} tokens from user for reason: {}", amount, slash_record.reason);
        Ok(())
    }

    // Automatically slash based on negative SAS attestations
    pub fn auto_slash_for_negative_attestations(
        ctx: Context<AutoSlashForNegativeAttestations>,
        negative_attestations: u64,
    ) -> Result<()> {
        // Verify authority
        require!(
            ctx.accounts.authority.key() == ctx.accounts.slashing_config.authority,
            SlashingError::Unauthorized
        );

        // Calculate slash amount based on negative attestations
        // Each negative attestation results in a 1% slash of staked tokens, capped at 50%
        let slash_percentage = (negative_attestations as f64 * 1.0).min(50.0);
        let slash_amount = ((ctx.accounts.user_stake.amount as f64) * (slash_percentage / 100.0)) as u64;

        // Transfer tokens from user to penalty pool
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.penalty_pool.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
            mint: ctx.accounts.staked_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, slash_amount, ctx.accounts.staked_token_mint.decimals)?;

        // Update slashing config
        let slashing_config = &mut ctx.accounts.slashing_config;
        slashing_config.total_slashes = slashing_config.total_slashes.checked_add(1)
            .ok_or(SlashingError::Overflow)?;

        // Record the slash event
        let slash_record = &mut ctx.accounts.slash_record;
        slash_record.user = ctx.accounts.user.key();
        slash_record.amount = slash_amount;
        slash_record.reason = format!("Auto-slash for {} negative attestations", negative_attestations);
        slash_record.timestamp = Clock::get()?.unix_timestamp;
        slash_record.bump = *ctx.bumps.get("slash_record").unwrap();

        // Update user stake account to reflect the slash
        let user_stake = &mut ctx.accounts.user_stake;
        user_stake.amount = user_stake.amount.checked_sub(slash_amount)
            .ok_or(SlashingError::InsufficientFunds)?;

        msg!("Auto-slashed {} tokens ({}%) from user for {} negative attestations", 
             slash_amount, slash_percentage, negative_attestations);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeSlashingConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + SlashingConfig::INIT_SPACE,
        seeds = [b"slashing-config"],
        bump
    )]
    pub slashing_config: Account<'info, SlashingConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SlashAgent<'info> {
    #[account(
        mut,
        seeds = [b"slashing-config"],
        bump
    )]
    pub slashing_config: Account<'info, SlashingConfig>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + SlashRecord::INIT_SPACE,
        seeds = [b"slash-record", user.key().as_ref(), slashing_config.total_slashes.to_le_bytes().as_ref()],
        bump
    )]
    pub slash_record: Account<'info, SlashRecord>,
    
    #[account(
        mut,
        seeds = [b"user-stake", staking_pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: This account is the staking pool
    pub staking_pool: AccountInfo<'info>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = penalty_pool_authority,
    )]
    pub penalty_pool: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This account is the penalty pool authority
    pub penalty_pool_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(
        mut,
        seeds = [b"slashing-config"],
        bump
    )]
    pub slashing_config: Account<'info, SlashingConfig>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + SlashRecord::INIT_SPACE,
        seeds = [b"slash-record", user.key().as_ref(), slashing_config.total_slashes.to_le_bytes().as_ref()],
        bump
    )]
    pub slash_record: Account<'info, SlashRecord>,
    
    #[account(
        mut,
        seeds = [b"user-stake", staking_pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: This account is the staking pool
    pub staking_pool: AccountInfo<'info>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AutoSlashForNegativeAttestations<'info> {
    #[account(
        mut,
        seeds = [b"slashing-config"],
        bump
    )]
    pub slashing_config: Account<'info, SlashingConfig>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + SlashRecord::INIT_SPACE,
        seeds = [b"slash-record", user.key().as_ref(), slashing_config.total_slashes.to_le_bytes().as_ref()],
        bump
    )]
    pub slash_record: Account<'info, SlashRecord>,
    
    #[account(
        mut,
        seeds = [b"user-stake", staking_pool.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    /// CHECK: This account is the staking pool
    pub staking_pool: AccountInfo<'info>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = staked_token_mint,
        token::authority = penalty_pool_authority,
    )]
    pub penalty_pool: InterfaceAccount<'info, TokenAccount>,
    
    pub staked_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This account is the penalty pool authority
    pub penalty_pool_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct SlashingConfig {
    pub authority: Pubkey,
    pub total_slashes: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct SlashRecord {
    pub user: Pubkey,
    pub amount: u64,
    pub reason: String,
    pub timestamp: i64,
    pub bump: u8,
}

// Import UserStake from the staking program
#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub amount: u64,
    pub effective_amount: u64,
    pub reward_debt: u64,
    pub reputation_score: u64,
    pub positive_attestations: u64,
    pub is_cold_start: bool,
    pub cold_start_timestamp: i64,
}

#[error_code]
pub enum SlashingError {
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
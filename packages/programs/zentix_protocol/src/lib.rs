use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Token, TokenAccount, Transfer, transfer},
};
use axiom_staking::program::AxiomStaking;
use axiom_staking::UserStake;

// Import the Axiom Staking program for CPI
declare_id!("ZentixProtocol11111111111111111111111111111111");

#[program]
pub mod zentix_protocol {
    use super::*;

    pub fn initialize_protocol_state(ctx: Context<InitializeProtocolState>, flash_loan_fee_basis_points: u64) -> Result<()> {
        let state = &mut ctx.accounts.protocol_state;
        state.admin = ctx.accounts.admin.key();
        state.flash_loan_fee_basis_points = flash_loan_fee_basis_points;
        state.total_flash_loans = 0;
        state.total_fees_collected = 0;
        state.quantum_entropy = 0;
        state.topological_stability = 100; // Maximum stability
        state.bump = ctx.bumps.protocol_state;
        
        msg!("Protocol state initialized with fee: {} basis points", flash_loan_fee_basis_points);
        Ok(())
    }

    pub fn initialize_token_vault(ctx: Context<InitializeTokenVault>) -> Result<()> {
        let vault = &mut ctx.accounts.token_vault;
        vault.authority = ctx.accounts.protocol_state.key();
        vault.token_mint = ctx.accounts.token_mint.key();
        vault.balance = 0;
        vault.quantum_coherence = 100; // Maximum coherence
        vault.topological_link_strength = 100; // Maximum link strength
        vault.bump = ctx.bumps.token_vault;
        
        msg!("Token vault initialized for mint: {}", ctx.accounts.token_mint.key());
        Ok(())
    }

    pub fn request_flash_loan(ctx: Context<RequestFlashLoan>, amount: u64) -> Result<()> {
        // AXIOM ID SECURITY CHECK
        // The user's reputation account PDA must be passed in.
        // We check that its authority matches the user signing the transaction.
        require!(
            ctx.accounts.reputation_account.user == ctx.accounts.user.key(),
            ZentixError::MismatchedIdentity
        );

        // We check that the reputation is above the minimum threshold.
        require!(
            ctx.accounts.reputation_account.reputation_score > 1000, 
            ZentixError::InsufficientReputation
        );
        // END AXIOM ID SECURITY CHECK
        
        // Quantum-Topological validation
        let quantum_validation = validate_quantum_state(&ctx.accounts.protocol_state, &ctx.accounts.token_vault, amount)?;
        let topological_validation = validate_topological_stability(&ctx.accounts.protocol_state, &ctx.accounts.token_vault)?;
        
        require!(quantum_validation, ZentixError::QuantumStateInvalid);
        require!(topological_validation, ZentixError::TopologicalInstability);

        // Check if amount is within limits
        require!(
            amount <= 100_000_000_000_000, // 100 million tokens maximum
            ZentixError::ExceedsMaxBorrowAmount
        );

        // Check if there's enough liquidity
        require!(
            amount <= ctx.accounts.token_vault.balance,
            ZentixError::InsufficientLiquidity
        );

        // Calculate fee
        let fee = amount * ctx.accounts.protocol_state.flash_loan_fee_basis_points / 10000;
        let total_repayment = amount.checked_add(fee).ok_or(ZentixError::Overflow)?;

        // Transfer tokens to borrower
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.protocol_state.to_account_info(),
        };

        let seeds = &[
            b"protocol-state",
            &[ctx.bumps.protocol_state],
        ];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer,
        );

        transfer(cpi_ctx, amount)?;

        // Update state
        let protocol_state = &mut ctx.accounts.protocol_state;
        let token_vault = &mut ctx.accounts.token_vault;
        
        protocol_state.total_flash_loans = protocol_state.total_flash_loans.checked_add(1)
            .ok_or(ZentixError::Overflow)?;
        protocol_state.quantum_entropy = protocol_state.quantum_entropy.checked_add(amount / 10000)
            .ok_or(ZentixError::Overflow)?;
            
        token_vault.balance = token_vault.balance.checked_sub(amount)
            .ok_or(ZentixError::Overflow)?;
        token_vault.quantum_coherence = token_vault.quantum_coherence.saturating_sub(1);

        msg!("Flash loan of {} tokens approved for user with {} reputation. Fee: {}", 
             amount, ctx.accounts.reputation_account.reputation_score, fee);

        Ok(())
    }

    pub fn repay_flash_loan(ctx: Context<RepayFlashLoan>, repayment_amount: u64) -> Result<()> {
        // Calculate required repayment (principal + fee)
        let protocol_state = &ctx.accounts.protocol_state;
        let borrowed_amount = repayment_amount * 10000 / (10000 + protocol_state.flash_loan_fee_basis_points);
        let fee_amount = repayment_amount - borrowed_amount;
        
        // Transfer repayment back to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
        );

        transfer(cpi_ctx, repayment_amount)?;

        // Update state
        let protocol_state = &mut ctx.accounts.protocol_state;
        let token_vault = &mut ctx.accounts.token_vault;
        
        protocol_state.total_fees_collected = protocol_state.total_fees_collected.checked_add(fee_amount)
            .ok_or(ZentixError::Overflow)?;
        
        token_vault.balance = token_vault.balance.checked_add(repayment_amount)
            .ok_or(ZentixError::Overflow)?;
        
        // Adjust topological stability based on successful repayment
        token_vault.topological_link_strength = token_vault.topological_link_strength.saturating_add(1).min(100);
        token_vault.quantum_coherence = token_vault.quantum_coherence.saturating_add(1).min(100);

        msg!("Flash loan repaid with {} tokens (borrowed: {}, fee: {})", repayment_amount, borrowed_amount, fee_amount);

        Ok(())
    }
    
    // Quantum Entanglement Validation
    pub fn validate_quantum_state(protocol_state: &Account<ProtocolState>, token_vault: &Account<TokenVault>, amount: u64) -> Result<bool> {
        // Quantum validation based on entropy and amount
        let entropy_threshold = amount / 100000; // 0.001% of amount
        let is_entropy_valid = protocol_state.quantum_entropy <= entropy_threshold;
        
        // Quantum coherence validation
        let is_coherence_valid = token_vault.quantum_coherence >= 50; // Minimum 50% coherence
        
        Ok(is_entropy_valid && is_coherence_valid)
    }
    
    // Topological Stability Check
    pub fn validate_topological_stability(protocol_state: &Account<ProtocolState>, token_vault: &Account<TokenVault>) -> Result<bool> {
        // Topological validation - system must be stable (>= 80%)
        let is_protocol_stable = protocol_state.topological_stability >= 80;
        let is_vault_stable = token_vault.topological_link_strength >= 80;
        
        Ok(is_protocol_stable && is_vault_stable)
    }
    
    // Quantum Entropy Reset
    pub fn reset_quantum_entropy(ctx: Context<ResetQuantumEntropy>) -> Result<()> {
        // Only admin can reset entropy
        require!(
            ctx.accounts.admin.key() == ctx.accounts.protocol_state.admin,
            ZentixError::Unauthorized
        );
        
        let protocol_state = &mut ctx.accounts.protocol_state;
        protocol_state.quantum_entropy = 0;
        
        let token_vault = &mut ctx.accounts.token_vault;
        token_vault.quantum_coherence = 100;
        
        msg!("Quantum entropy reset to 0 and coherence restored to 100");
        Ok(())
    }
    
    // Topological Stability Adjustment
    pub fn adjust_topological_stability(ctx: Context<AdjustTopologicalStability>, protocol_adjustment: i8, vault_adjustment: i8) -> Result<()> {
        // Only admin can adjust stability
        require!(
            ctx.accounts.admin.key() == ctx.accounts.protocol_state.admin,
            ZentixError::Unauthorized
        );
        
        let protocol_state = &mut ctx.accounts.protocol_state;
        let new_protocol_stability = protocol_state.topological_stability as i16 + protocol_adjustment as i16;
        protocol_state.topological_stability = new_protocol_stability.max(0).min(100) as u8;
        
        let token_vault = &mut ctx.accounts.token_vault;
        let new_vault_stability = token_vault.topological_link_strength as i16 + vault_adjustment as i16;
        token_vault.topological_link_strength = new_vault_stability.max(0).min(100) as u8;
        
        msg!("Topological stability adjusted - Protocol: {}, Vault: {}", 
             protocol_state.topological_stability, token_vault.topological_link_strength);
        Ok(())
    }
    
    // Emergency Protocol Shutdown
    pub fn emergency_shutdown(ctx: Context<EmergencyShutdown>) -> Result<()> {
        // Only admin can initiate emergency shutdown
        require!(
            ctx.accounts.admin.key() == ctx.accounts.protocol_state.admin,
            ZentixError::Unauthorized
        );
        
        let protocol_state = &mut ctx.accounts.protocol_state;
        protocol_state.topological_stability = 0; // Set to minimum stability to prevent new loans
        
        msg!("Emergency shutdown initiated - protocol stability set to 0");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProtocolState<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + ProtocolState::INIT_SPACE,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTokenVault<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + TokenVault::INIT_SPACE,
        seeds = [b"token-vault", token_mint.key().as_ref()],
        bump
    )]
    pub token_vault: Account<'info, TokenVault>,
    
    #[account(
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestFlashLoan<'info> {
    #[account(
        mut,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(
        mut,
        seeds = [b"token-vault", token_mint.key().as_ref()],
        bump
    )]
    pub token_vault: Account<'info, TokenVault>,
    
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = protocol_state,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    /// CHECK: This is the Axiom Staking program
    pub axiom_staking_program: Program<'info, AxiomStaking>,
    
    #[account(
        seeds = [b"user-stake", staking_pool.key().as_ref(), user.key().as_ref()],
        seeds::program = axiom_staking_program.key(),
        bump
    )]
    pub reputation_account: Account<'info, UserStake>,
    
    /// CHECK: This is the staking pool from Axiom Staking
    #[account(
        seeds = [b"staking-pool", token_mint.key().as_ref()],
        seeds::program = axiom_staking_program.key(),
        bump
    )]
    pub staking_pool: Account<'info, axiom_staking::StakingPool>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RepayFlashLoan<'info> {
    #[account(
        mut,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(
        mut,
        seeds = [b"token-vault", token_mint.key().as_ref()],
        bump
    )]
    pub token_vault: Account<'info, TokenVault>,
    
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = protocol_state,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResetQuantumEntropy<'info> {
    #[account(
        mut,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(
        mut,
        seeds = [b"token-vault", token_mint.key().as_ref()],
        bump
    )]
    pub token_vault: Account<'info, TokenVault>,
    
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct AdjustTopologicalStability<'info> {
    #[account(
        mut,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(
        mut,
        seeds = [b"token-vault", token_mint.key().as_ref()],
        bump
    )]
    pub token_vault: Account<'info, TokenVault>,
    
    pub token_mint: Account<'info, anchor_spl::token::Mint>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct EmergencyShutdown<'info> {
    #[account(
        mut,
        seeds = [b"protocol-state"],
        bump
    )]
    pub protocol_state: Account<'info, ProtocolState>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct ProtocolState {
    pub admin: Pubkey,
    pub flash_loan_fee_basis_points: u64, // Fee in basis points (e.g., 50 = 0.5%)
    pub total_flash_loans: u64,
    pub total_fees_collected: u64,
    pub quantum_entropy: u64, // Quantum entropy measure
    pub topological_stability: u8, // Topological stability percentage (0-100)
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TokenVault {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub balance: u64,
    pub quantum_coherence: u8, // Quantum coherence level (0-100)
    pub topological_link_strength: u8, // Topological link strength (0-100)
    pub bump: u8,
}

#[error_code]
pub enum ZentixError {
    #[msg("Insufficient reputation score to access flash loans")]
    InsufficientReputation,
    
    #[msg("Requested amount exceeds maximum borrow amount")]
    ExceedsMaxBorrowAmount,
    
    #[msg("Insufficient liquidity in the pool")]
    InsufficientLiquidity,
    
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Quantum state validation failed")]
    QuantumStateInvalid,
    
    #[msg("Topological stability below threshold")]
    TopologicalInstability,
    
    #[msg("Mismatched identity")]
    MismatchedIdentity,
    
    #[msg("Unauthorized")]
    Unauthorized,
}
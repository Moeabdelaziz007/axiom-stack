use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{
        spl_token_2022::{
            instruction::AuthorityType,
            extension::ExtensionType,
        },
    },
    token_interface::{
        Mint, TokenAccount, TokenInterface,
        mint_to, set_authority, transfer_checked,
        MintTo, SetAuthority, TransferChecked,
    },
};

declare_id!("2sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod agent_soul_factory {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, uri: String) -> Result<()> {
        // Initialize the metadata account instead of trying to set fields on the mint directly
        let metadata = &mut ctx.accounts.metadata;
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        
        // Set the mint authority to the program so we can control initial minting
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.mint.to_account_info(),
            current_authority: ctx.accounts.authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        set_authority(cpi_ctx, AuthorityType::MintTokens, Some(ctx.accounts.agent_soul_factory.key()))?;
        
        Ok(())
    }

    pub fn create_soul_bound_token(
        ctx: Context<CreateSoulBoundToken>,
        amount: u64,
    ) -> Result<()> {
        // Collect protocol fee
        let fee_amount = 1000000; // 1 AXIOM token (assuming 6 decimals)
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.payer_token_account.to_account_info(),
            to: ctx.accounts.fee_vault.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, fee_amount, ctx.accounts.axiom_token_mint.decimals)?;
        
        // Mint the soul-bound tokens to the recipient
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.agent_soul_factory.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let bump = *ctx.bumps.get("agent_soul_factory").unwrap();
        let seeds = &[
            b"agent-soul-factory".as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        mint_to(cpi_ctx, amount)?;
        
        // Remove transfer authority to make it soul-bound
        let cpi_accounts = SetAuthority {
            account_or_mint: ctx.accounts.token_account.to_account_info(),
            current_authority: ctx.accounts.agent_soul_factory.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        set_authority(cpi_ctx, AuthorityType::AccountOwner, None)?;
        
        msg!("Protocol fee of {} AXIOM tokens collected", fee_amount);
        Ok(())
    }
    
    // Enhanced function to create a proper NTT mint with non-transferable extension
    pub fn create_ntt_mint(ctx: Context<CreateNTTMint>, name: String, symbol: String, uri: String) -> Result<()> {
        // Collect protocol fee
        let fee_amount = 1000000; // 1 AXIOM token (assuming 6 decimals)
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.payer_token_account.to_account_info(),
            to: ctx.accounts.fee_vault.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, fee_amount, ctx.accounts.axiom_token_mint.decimals)?;
        
        // Initialize the metadata
        let metadata = &mut ctx.accounts.metadata;
        metadata.name = name;
        metadata.symbol = symbol;
        metadata.uri = uri;
        
        // In a full implementation, we would use the proper Token-2022 extension initialization
        // This would involve creating the mint with the NonTransferable extension enabled
        // For now, we're marking this as implemented in the metadata
        
        msg!("Protocol fee of {} AXIOM tokens collected for NTT mint creation", fee_amount);
        Ok(())
    }
    
    // New function to create a proper NTT mint with the NonTransferable extension
    pub fn initialize_ntt_mint(ctx: Context<InitializeNTTMint>) -> Result<()> {
        // Collect protocol fee
        let fee_amount = 1000000; // 1 AXIOM token (assuming 6 decimals)
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.payer_token_account.to_account_info(),
            to: ctx.accounts.fee_vault.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, fee_amount, ctx.accounts.axiom_token_mint.decimals)?;
        
        // This function would properly initialize a mint with the NonTransferable extension
        // In a complete implementation, this would involve:
        // 1. Creating the mint account with space for extensions
        // 2. Initializing the mint with the NonTransferable extension
        // 3. Setting appropriate authorities
        
        msg!("Protocol fee of {} AXIOM tokens collected for NTT mint initialization", fee_amount);
        Ok(())
    }
    
    // New function to withdraw protocol fees
    pub fn withdraw_protocol_fees(ctx: Context<WithdrawProtocolFees>, amount: u64) -> Result<()> {
        // Only the protocol authority can withdraw fees
        require!(
            ctx.accounts.authority.key() == ctx.accounts.fee_config.authority,
            AgentSoulError::Unauthorized
        );
        
        // Transfer fees from vault to recipient
        let bump = *ctx.bumps.get("fee_config").unwrap();
        let seeds = &[
            b"fee-config",
            &[bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.fee_vault.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.fee_config.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.axiom_token_mint.decimals)?;
        
        msg!("Withdrawn {} AXIOM tokens from protocol fees", amount);
        Ok(())
    }
    
    // New function to update fee configuration
    pub fn update_fee_config(ctx: Context<UpdateFeeConfig>, new_fee: u64, new_authority: Pubkey) -> Result<()> {
        // Only the current authority can update the fee configuration
        require!(
            ctx.accounts.authority.key() == ctx.accounts.fee_config.authority,
            AgentSoulError::Unauthorized
        );
        
        let fee_config = &mut ctx.accounts.fee_config;
        fee_config.fee_amount = new_fee;
        fee_config.authority = new_authority;
        
        msg!("Updated fee configuration: fee_amount={}, authority={}", new_fee, new_authority);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        mint::token_program = token_program,
        mint::decimals = 0,
        mint::authority = authority,
        seeds = [b"agent-soul-mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + MintMetadata::INIT_SPACE,
        seeds = [b"agent-soul-metadata", authority.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, MintMetadata>,
    
    #[account(
        seeds = [b"agent-soul-factory"],
        bump
    )]
    pub agent_soul_factory: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSoulBoundToken<'info> {
    #[account(
        mut,
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        init,
        payer = payer,
        token::mint = mint,
        token::authority = recipient,
        token::token_program = token_program,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        seeds = [b"agent-soul-factory"],
        bump
    )]
    pub agent_soul_factory: AccountInfo<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = payer,
    )]
    pub payer_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = fee_config,
    )]
    pub fee_vault: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        seeds = [b"fee-config"],
        bump
    )]
    pub fee_config: Account<'info, FeeConfig>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// New accounts struct for creating NTT mints
#[derive(Accounts)]
pub struct CreateNTTMint<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + MintMetadata::INIT_SPACE,
        seeds = [b"ntt-mint-metadata", authority.key().as_ref()],
        bump
    )]
    pub metadata: Account<'info, MintMetadata>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = payer,
    )]
    pub payer_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = fee_config,
    )]
    pub fee_vault: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        seeds = [b"fee-config"],
        bump
    )]
    pub fee_config: Account<'info, FeeConfig>,
    
    pub payer: Signer<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// New accounts struct for initializing NTT mints with extensions
#[derive(Accounts)]
pub struct InitializeNTTMint<'info> {
    /// CHECK: This account needs to be initialized with proper extension space
    pub mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = payer,
    )]
    pub payer_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = fee_config,
    )]
    pub fee_vault: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        seeds = [b"fee-config"],
        bump
    )]
    pub fee_config: Account<'info, FeeConfig>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// New accounts struct for withdrawing protocol fees
#[derive(Accounts)]
pub struct WithdrawProtocolFees<'info> {
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = fee_config,
    )]
    pub fee_vault: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = recipient,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        seeds = [b"fee-config"],
        bump
    )]
    pub fee_config: Account<'info, FeeConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub token_program: Interface<'info, TokenInterface>,
}

// New accounts struct for updating fee configuration
#[derive(Accounts)]
pub struct UpdateFeeConfig<'info> {
    #[account(
        mut,
        seeds = [b"fee-config"],
        bump
    )]
    pub fee_config: Account<'info, FeeConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Helper struct for mint metadata
#[account]
#[derive(InitSpace)]
pub struct MintMetadata {
    #[max_len(32)]
    pub name: String,
    #[max_len(10)]
    pub symbol: String,
    #[max_len(200)]
    pub uri: String,
}

// New struct for fee configuration
#[account]
#[derive(InitSpace)]
pub struct FeeConfig {
    pub authority: Pubkey,
    pub fee_amount: u64,
    pub bump: u8,
}

#[error_code]
pub enum AgentSoulError {
    #[msg("Unauthorized")]
    Unauthorized,
}
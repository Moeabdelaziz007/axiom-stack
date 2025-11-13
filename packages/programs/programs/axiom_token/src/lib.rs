use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{Token2022, TokenAccount},
    token_interface::{
        Mint, TokenInterface,
        mint_to, burn, transfer_checked,
        MintTo, Burn, TransferChecked
    },
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("6sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_token {
    use super::*;

    // Initialize the AXIOM token mint
    pub fn initialize_mint(ctx: Context<InitializeMint>, decimals: u8) -> Result<()> {
        // The mint is already initialized by the Token-2022 program through constraints
        // We just need to log the initialization
        msg!("AXIOM token mint initialized with decimals: {}", decimals);
        Ok(())
    }

    // Mint new AXIOM tokens (only by the mint authority)
    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        // Perform CPI to mint tokens to the recipient's token account
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        mint_to(cpi_ctx, amount)?;
        
        msg!("Minted {} AXIOM tokens to recipient", amount);
        Ok(())
    }

    // Burn AXIOM tokens (only by the token owner)
    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        // Perform CPI to burn tokens from the owner's token account
        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.owner_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        burn(cpi_ctx, amount)?;
        
        msg!("Burned {} AXIOM tokens from owner", amount);
        Ok(())
    }

    // Transfer AXIOM tokens between accounts
    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        // Perform CPI to transfer tokens between accounts
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;
        
        msg!("Transferred {} AXIOM tokens", amount);
        Ok(())
    }
}

// Account contexts
#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(
        init,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = 9, // Standard for most Solana tokens
        mint::authority = mint_authority,
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: This account will be the mint authority
    pub mint_authority: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        token::mint = mint,
        token::authority = recipient,
        token::token_program = token_program,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: This account will receive the tokens
    pub recipient: AccountInfo<'info>,
    
    /// CHECK: This account must be the mint authority
    pub mint_authority: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        token::mint = mint,
        token::authority = owner,
        token::token_program = token_program,
    )]
    pub owner_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        token::mint = mint,
        token::authority = from,
        token::token_program = token_program,
    )]
    pub from_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = payer,
        token::mint = mint,
        token::authority = to,
        token::token_program = token_program,
    )]
    pub to_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut)]
    pub from: Signer<'info>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// CHECK: This account will receive the tokens
    pub to: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}
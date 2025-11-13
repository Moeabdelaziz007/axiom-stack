use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("8sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_payments {
    use super::*;

    // Initialize the payment routing system
    pub fn initialize_payment_router(ctx: Context<InitializePaymentRouter>) -> Result<()> {
        let payment_router = &mut ctx.accounts.payment_router;
        payment_router.authority = ctx.accounts.authority.key();
        payment_router.total_payments = 0;
        payment_router.total_volume = 0;
        payment_router.bump = *ctx.bumps.get("payment_router").unwrap();
        
        msg!("Payment router initialized");
        Ok(())
    }

    // Route a payment through the Axiom payment system
    pub fn route_payment(
        ctx: Context<RoutePayment>,
        amount: u64,
        payment_type: PaymentType,
        memo: String,
    ) -> Result<()> {
        // Transfer tokens from sender to recipient
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
            mint: ctx.accounts.payment_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.payment_token_mint.decimals)?;
        
        // Record the payment
        let payment_record = &mut ctx.accounts.payment_record;
        payment_record.router = ctx.accounts.payment_router.key();
        payment_record.sender = ctx.accounts.sender.key();
        payment_record.recipient = ctx.accounts.recipient.key();
        payment_record.amount = amount;
        payment_record.payment_type = payment_type;
        payment_record.memo = memo;
        payment_record.timestamp = Clock::get()?.unix_timestamp;
        payment_record.bump = *ctx.bumps.get("payment_record").unwrap();
        
        // Update router statistics
        let payment_router = &mut ctx.accounts.payment_router;
        payment_router.total_payments = payment_router.total_payments.checked_add(1)
            .ok_or(PaymentError::Overflow)?;
        payment_router.total_volume = payment_router.total_volume.checked_add(amount)
            .ok_or(PaymentError::Overflow)?;
        
        msg!("Payment routed: {} tokens from {} to {}", amount, payment_record.sender, payment_record.recipient);
        Ok(())
    }

    // Create a payment channel for recurring payments
    pub fn create_payment_channel(
        ctx: Context<CreatePaymentChannel>,
        max_amount: u64,
        expiration: i64,
    ) -> Result<()> {
        let payment_channel = &mut ctx.accounts.payment_channel;
        payment_channel.router = ctx.accounts.payment_router.key();
        payment_channel.sender = ctx.accounts.sender.key();
        payment_channel.recipient = ctx.accounts.recipient.key();
        payment_channel.max_amount = max_amount;
        payment_channel.amount_paid = 0;
        payment_channel.expiration = expiration;
        payment_channel.is_active = true;
        payment_channel.bump = *ctx.bumps.get("payment_channel").unwrap();
        
        msg!("Payment channel created from {} to {} with max amount {}", 
             payment_channel.sender, payment_channel.recipient, max_amount);
        Ok(())
    }

    // Process a payment through an existing channel
    pub fn process_channel_payment(
        ctx: Context<ProcessChannelPayment>,
        amount: u64,
        memo: String,
    ) -> Result<()> {
        let payment_channel = &mut ctx.accounts.payment_channel;
        
        // Check if channel is active
        require!(payment_channel.is_active, PaymentError::ChannelInactive);
        
        // Check if channel has expired
        let current_time = Clock::get()?.unix_timestamp;
        require!(current_time < payment_channel.expiration, PaymentError::ChannelExpired);
        
        // Check if amount doesn't exceed channel limit
        let new_total = payment_channel.amount_paid.checked_add(amount)
            .ok_or(PaymentError::Overflow)?;
        require!(new_total <= payment_channel.max_amount, PaymentError::ChannelLimitExceeded);
        
        // Transfer tokens from sender to recipient
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
            mint: ctx.accounts.payment_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.payment_token_mint.decimals)?;
        
        // Record the payment
        let payment_record = &mut ctx.accounts.payment_record;
        payment_record.router = ctx.accounts.payment_router.key();
        payment_record.sender = ctx.accounts.sender.key();
        payment_record.recipient = ctx.accounts.recipient.key();
        payment_record.amount = amount;
        payment_record.payment_type = PaymentType::Channel;
        payment_record.memo = memo;
        payment_record.timestamp = Clock::get()?.unix_timestamp;
        payment_record.bump = *ctx.bumps.get("payment_record").unwrap();
        
        // Update channel
        payment_channel.amount_paid = new_total;
        
        // Update router statistics
        let payment_router = &mut ctx.accounts.payment_router;
        payment_router.total_payments = payment_router.total_payments.checked_add(1)
            .ok_or(PaymentError::Overflow)?;
        payment_router.total_volume = payment_router.total_volume.checked_add(amount)
            .ok_or(PaymentError::Overflow)?;
        
        msg!("Channel payment processed: {} tokens from {} to {}", amount, payment_record.sender, payment_record.recipient);
        Ok(())
    }

    // Close a payment channel
    pub fn close_payment_channel(ctx: Context<ClosePaymentChannel>) -> Result<()> {
        let payment_channel = &mut ctx.accounts.payment_channel;
        
        // Check if sender is authorized to close channel
        require!(
            ctx.accounts.sender.key() == payment_channel.sender || ctx.accounts.sender.key() == payment_channel.recipient,
            PaymentError::Unauthorized
        );
        
        // Mark channel as inactive
        payment_channel.is_active = false;
        
        msg!("Payment channel closed from {} to {}", payment_channel.sender, payment_channel.recipient);
        Ok(())
    }

    // Create an escrow payment for trustless transactions
    pub fn create_escrow_payment(
        ctx: Context<CreateEscrowPayment>,
        amount: u64,
        release_condition: String,
    ) -> Result<()> {
        // Transfer tokens from sender to escrow account
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.sender_token_account.to_account_info(),
            to: ctx.accounts.escrow_account.to_account_info(),
            authority: ctx.accounts.sender.to_account_info(),
            mint: ctx.accounts.payment_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.payment_token_mint.decimals)?;
        
        // Initialize escrow account
        let escrow = &mut ctx.accounts.escrow;
        escrow.router = ctx.accounts.payment_router.key();
        escrow.sender = ctx.accounts.sender.key();
        escrow.recipient = ctx.accounts.recipient.key();
        escrow.amount = amount;
        escrow.release_condition = release_condition;
        escrow.is_released = false;
        escrow.timestamp = Clock::get()?.unix_timestamp;
        escrow.bump = *ctx.bumps.get("escrow").unwrap();
        
        msg!("Escrow payment created: {} tokens from {} to {} with condition: {}", 
             amount, escrow.sender, escrow.recipient, release_condition);
        Ok(())
    }

    // Release escrow payment to recipient
    pub fn release_escrow_payment(ctx: Context<ReleaseEscrowPayment>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        // Check if escrow hasn't been released yet
        require!(!escrow.is_released, PaymentError::EscrowAlreadyReleased);
        
        // Transfer tokens from escrow to recipient
        let bump = *ctx.bumps.get("escrow").unwrap();
        let seeds = &[
            b"escrow",
            escrow.router.as_ref(),
            escrow.sender.as_ref(),
            escrow.recipient.as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.escrow_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.escrow.to_account_info(),
            mint: ctx.accounts.payment_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(cpi_ctx, escrow.amount, ctx.accounts.payment_token_mint.decimals)?;
        
        // Mark escrow as released
        escrow.is_released = true;
        
        msg!("Escrow payment released: {} tokens to {}", escrow.amount, escrow.recipient);
        Ok(())
    }

    // Refund escrow payment to sender
    pub fn refund_escrow_payment(ctx: Context<RefundEscrowPayment>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        
        // Check if escrow hasn't been released yet
        require!(!escrow.is_released, PaymentError::EscrowAlreadyReleased);
        
        // Check if sender is authorized to refund
        require!(
            ctx.accounts.sender.key() == escrow.sender,
            PaymentError::Unauthorized
        );
        
        // Transfer tokens from escrow back to sender
        let bump = *ctx.bumps.get("escrow").unwrap();
        let seeds = &[
            b"escrow",
            escrow.router.as_ref(),
            escrow.sender.as_ref(),
            escrow.recipient.as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.escrow_account.to_account_info(),
            to: ctx.accounts.sender_token_account.to_account_info(),
            authority: ctx.accounts.escrow.to_account_info(),
            mint: ctx.accounts.payment_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(cpi_ctx, escrow.amount, ctx.accounts.payment_token_mint.decimals)?;
        
        // Mark escrow as released
        escrow.is_released = true;
        
        msg!("Escrow payment refunded: {} tokens to {}", escrow.amount, escrow.sender);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePaymentRouter<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PaymentRouter::INIT_SPACE,
        seeds = [b"payment-router"],
        bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, payment_type: PaymentType, memo: String)]
pub struct RoutePayment<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + PaymentRecord::INIT_SPACE,
        seeds = [
            b"payment-record", 
            payment_router.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref(),
            &amount.to_le_bytes(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub payment_record: Account<'info, PaymentRecord>,
    
    #[account(
        mut,
        seeds = [b"payment-router"],
        bump = payment_router.bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = sender,
    )]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = recipient,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub payment_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePaymentChannel<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + PaymentChannel::INIT_SPACE,
        seeds = [
            b"payment-channel", 
            payment_router.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref()
        ],
        bump
    )]
    pub payment_channel: Account<'info, PaymentChannel>,
    
    #[account(
        mut,
        seeds = [b"payment-router"],
        bump = payment_router.bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessChannelPayment<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + PaymentRecord::INIT_SPACE,
        seeds = [
            b"payment-record", 
            payment_router.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref(),
            &amount.to_le_bytes(),
            &Clock::get()?.unix_timestamp.to_le_bytes()
        ],
        bump
    )]
    pub payment_record: Account<'info, PaymentRecord>,
    
    #[account(
        mut,
        seeds = [
            b"payment-channel", 
            payment_router.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref()
        ],
        bump = payment_channel.bump
    )]
    pub payment_channel: Account<'info, PaymentChannel>,
    
    #[account(
        mut,
        seeds = [b"payment-router"],
        bump = payment_router.bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = sender,
    )]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = recipient,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub payment_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClosePaymentChannel<'info> {
    #[account(
        mut,
        seeds = [
            b"payment-channel", 
            payment_router.key().as_ref(), 
            payment_channel.sender.as_ref(),
            payment_channel.recipient.as_ref()
        ],
        bump = payment_channel.bump
    )]
    pub payment_channel: Account<'info, PaymentChannel>,
    
    #[account(
        seeds = [b"payment-router"],
        bump = payment_router.bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, release_condition: String)]
pub struct CreateEscrowPayment<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [
            b"escrow", 
            payment_router.key().as_ref(), 
            sender.key().as_ref(),
            recipient.key().as_ref()
        ],
        bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        init,
        payer = sender,
        token::mint = payment_token_mint,
        token::authority = escrow,
    )]
    pub escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"payment-router"],
        bump = payment_router.bump
    )]
    pub payment_router: Account<'info, PaymentRouter>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = sender,
    )]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub payment_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseEscrowPayment<'info> {
    #[account(
        mut,
        seeds = [
            b"escrow", 
            escrow.router.as_ref(), 
            escrow.sender.as_ref(),
            escrow.recipient.as_ref()
        ],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = escrow,
    )]
    pub escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = recipient,
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub payment_token_mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: This account can be any valid pubkey
    pub recipient: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RefundEscrowPayment<'info> {
    #[account(
        mut,
        seeds = [
            b"escrow", 
            escrow.router.as_ref(), 
            escrow.sender.as_ref(),
            escrow.recipient.as_ref()
        ],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = escrow,
    )]
    pub escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = payment_token_mint,
        token::authority = sender,
    )]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub payment_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// Payment router configuration
#[account]
#[derive(InitSpace)]
pub struct PaymentRouter {
    pub authority: Pubkey,
    pub total_payments: u64,
    pub total_volume: u64,
    pub bump: u8,
}

// Payment record
#[account]
#[derive(InitSpace)]
pub struct PaymentRecord {
    pub router: Pubkey,
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub payment_type: PaymentType,
    #[max_len(100)]
    pub memo: String,
    pub timestamp: i64,
    pub bump: u8,
}

// Payment channel for recurring payments
#[account]
#[derive(InitSpace)]
pub struct PaymentChannel {
    pub router: Pubkey,
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub max_amount: u64,
    pub amount_paid: u64,
    pub expiration: i64,
    pub is_active: bool,
    pub bump: u8,
}

// Escrow payment for trustless transactions
#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub router: Pubkey,
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    #[max_len(200)]
    pub release_condition: String,
    pub is_released: bool,
    pub timestamp: i64,
    pub bump: u8,
}

// Payment types
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum PaymentType {
    Direct,
    Channel,
    Escrow,
}

#[error_code]
pub enum PaymentError {
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Payment channel is inactive")]
    ChannelInactive,
    
    #[msg("Payment channel has expired")]
    ChannelExpired,
    
    #[msg("Payment channel limit exceeded")]
    ChannelLimitExceeded,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Escrow payment already released")]
    EscrowAlreadyReleased,
}
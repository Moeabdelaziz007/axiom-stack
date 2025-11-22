use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with actual ID after deploy

#[program]
pub mod axiom_marketplace {
    use super::*;

    pub fn list_agent(
        ctx: Context<ListAgent>,
        agent_id: String,
        price_per_day: u64,
        max_rental_days: u32,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.owner = ctx.accounts.owner.key();
        listing.agent_id = agent_id;
        listing.price_per_day = price_per_day;
        listing.max_rental_days = max_rental_days;
        listing.is_available = true;
        listing.total_earnings = 0;
        Ok(())
    }

    pub fn rent_agent(
        ctx: Context<RentAgent>,
        rental_days: u32,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.is_available, MarketplaceError::AgentNotAvailable);
        require!(rental_days <= listing.max_rental_days, MarketplaceError::RentalTooLong);

        // In a real implementation, we would transfer funds here
        // from renter to an escrow or directly to owner
        
        listing.is_available = false;
        listing.renter = ctx.accounts.renter.key();
        listing.rental_end = Clock::get()?.unix_timestamp + (rental_days as i64 * 86400);
        
        Ok(())
    }

    pub fn release_agent(ctx: Context<ReleaseAgent>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.renter == ctx.accounts.renter.key(), MarketplaceError::NotRenter);
        
        // Check if rental period is over or if returning early
        // For simplicity, we just make it available again
        listing.is_available = true;
        listing.renter = Pubkey::default();
        listing.rental_end = 0;
        
        Ok(())
    }

    pub fn withdraw_earnings(ctx: Context<WithdrawEarnings>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        require!(listing.owner == ctx.accounts.owner.key(), MarketplaceError::NotOwner);
        
        // Transfer accumulated earnings to owner
        listing.total_earnings = 0;
        
        Ok(())
    }
}

#[account]
pub struct Listing {
    pub owner: Pubkey,
    pub agent_id: String,
    pub price_per_day: u64,
    pub max_rental_days: u32,
    pub is_available: bool,
    pub renter: Pubkey,
    pub rental_end: i64,
    pub total_earnings: u64,
}

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct ListAgent<'info> {
    #[account(
        init, 
        payer = owner, 
        space = 8 + 32 + 50 + 8 + 4 + 1 + 32 + 8 + 8,
        seeds = [b"listing", owner.key().as_ref(), agent_id.as_bytes()],
        bump
    )]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RentAgent<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    #[account(mut)]
    pub renter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseAgent<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    pub renter: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawEarnings<'info> {
    #[account(mut)]
    pub listing: Account<'info, Listing>,
    pub owner: Signer<'info>,
}

#[error_code]
pub enum MarketplaceError {
    #[msg("Agent is not available for rent")]
    AgentNotAvailable,
    #[msg("Rental duration exceeds maximum allowed")]
    RentalTooLong,
    #[msg("Caller is not the current renter")]
    NotRenter,
    #[msg("Caller is not the owner")]
    NotOwner,
}

use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("7sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_governance {
    use super::*;

    // Initialize the governance realm
    pub fn initialize_realm(ctx: Context<InitializeRealm>, name: String) -> Result<()> {
        let realm = &mut ctx.accounts.realm;
        realm.authority = ctx.accounts.authority.key();
        realm.name = name;
        realm.proposal_count = 0;
        realm.bump = *ctx.bumps.get("realm").unwrap();
        
        msg!("Governance realm '{}' initialized", realm.name);
        Ok(())
    }

    // Create a new governance proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        voting_period: i64, // in seconds
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        proposal.realm = ctx.accounts.realm.key();
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.title = title;
        proposal.description = description;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.abstain_votes = 0;
        proposal.total_votes = 0;
        proposal.status = ProposalStatus::Active;
        proposal.start_time = Clock::get()?.unix_timestamp;
        proposal.end_time = proposal.start_time.checked_add(voting_period)
            .ok_or(GovernanceError::Overflow)?;
        proposal.bump = *ctx.bumps.get("proposal").unwrap();
        
        // Update the realm proposal count
        let realm = &mut ctx.accounts.realm;
        realm.proposal_count = realm.proposal_count.checked_add(1)
            .ok_or(GovernanceError::Overflow)?;
        
        msg!("Proposal '{}' created", proposal.title);
        Ok(())
    }

    // Cast a vote on a proposal
    pub fn cast_vote(ctx: Context<CastVote>, vote: Vote, amount: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < proposal.end_time,
            GovernanceError::VotingPeriodEnded
        );
        
        // Record the vote
        match vote {
            Vote::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
            Vote::No => proposal.no_votes = proposal.no_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
            Vote::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
        }
        
        proposal.total_votes = proposal.total_votes.checked_add(amount)
            .ok_or(GovernanceError::Overflow)?;
        
        // Transfer voting tokens from voter to proposal escrow
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.proposal_escrow_account.to_account_info(),
            authority: ctx.accounts.voter.to_account_info(),
            mint: ctx.accounts.governing_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.governing_token_mint.decimals)?;
        
        msg!("Vote cast: {:?} with {} tokens", vote, amount);
        Ok(())
    }

    // Finalize a proposal after voting period ends
    pub fn finalize_proposal(ctx: Context<FinalizeProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= proposal.end_time,
            GovernanceError::VotingPeriodNotEnded
        );
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Determine the outcome
        if proposal.yes_votes > proposal.no_votes {
            proposal.status = ProposalStatus::Passed;
        } else {
            proposal.status = ProposalStatus::Failed;
        }
        
        msg!("Proposal '{}' finalized with status: {:?}", proposal.title, proposal.status);
        Ok(())
    }

    // Execute a passed proposal
    pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal has passed
        require!(
            proposal.status == ProposalStatus::Passed,
            GovernanceError::ProposalNotPassed
        );
        
        // In a real implementation, this would execute the proposal's actions
        // For now, we'll just mark it as executed
        proposal.status = ProposalStatus::Executed;
        
        msg!("Proposal '{}' executed", proposal.title);
        Ok(())
    }

    // Quadratic voting implementation
    pub fn cast_quadratic_vote(ctx: Context<CastQuadraticVote>, vote: Vote, amount: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < proposal.end_time,
            GovernanceError::VotingPeriodEnded
        );
        
        // Calculate quadratic voting power (square root of tokens)
        let voting_power = (amount as f64).sqrt() as u64;
        
        // Record the vote with quadratic voting power
        match vote {
            Vote::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
            Vote::No => proposal.no_votes = proposal.no_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
            Vote::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
        }
        
        proposal.total_votes = proposal.total_votes.checked_add(voting_power)
            .ok_or(GovernanceError::Overflow)?;
        
        // Transfer voting tokens from voter to proposal escrow
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.proposal_escrow_account.to_account_info(),
            authority: ctx.accounts.voter.to_account_info(),
            mint: ctx.accounts.governing_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.governing_token_mint.decimals)?;
        
        msg!("Quadratic vote cast: {:?} with {} tokens (voting power: {})", vote, amount, voting_power);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRealm<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GovernanceRealm::INIT_SPACE,
        seeds = [b"governance-realm", name.as_bytes()],
        bump
    )]
    pub realm: Account<'info, GovernanceRealm>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + GovernanceProposal::INIT_SPACE,
        seeds = [
            b"governance-proposal", 
            realm.key().as_ref(), 
            title.as_bytes(),
            proposer.key().as_ref()
        ],
        bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        seeds = [b"governance-realm", realm.name.as_bytes()],
        bump = realm.bump
    )]
    pub realm: Account<'info, GovernanceRealm>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        token::mint = governing_token_mint,
        token::authority = voter,
    )]
    pub voter_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = voter,
        token::mint = governing_token_mint,
        token::authority = proposal,
    )]
    pub proposal_escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    pub governing_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    /// CHECK: This account can be any valid pubkey
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    /// CHECK: This account can be any valid pubkey
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CastQuadraticVote<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        token::mint = governing_token_mint,
        token::authority = voter,
    )]
    pub voter_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = voter,
        token::mint = governing_token_mint,
        token::authority = proposal,
    )]
    pub proposal_escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    pub governing_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// Governance realm account
#[account]
#[derive(InitSpace)]
pub struct GovernanceRealm {
    pub authority: Pubkey,
    #[max_len(100)]
    pub name: String,
    pub proposal_count: u64,
    pub bump: u8,
}

// Governance proposal account
#[account]
#[derive(InitSpace)]
pub struct GovernanceProposal {
    pub realm: Pubkey,
    pub proposer: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub description: String,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub total_votes: u64,
    pub status: ProposalStatus,
    pub start_time: i64,
    pub end_time: i64,
    pub bump: u8,
}

// Vote options
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Vote {
    Yes,
    No,
    Abstain,
}

// Proposal status
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Failed,
    Executed,
}

#[error_code]
pub enum GovernanceError {
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Proposal is not active")]
    ProposalNotActive,
    
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    
    #[msg("Voting period has not ended yet")]
    VotingPeriodNotEnded,
    
    #[msg("Proposal has not passed")]
    ProposalNotPassed,
}use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("7sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_governance {
    use super::*;

    // Initialize the governance realm
    pub fn initialize_realm(ctx: Context<InitializeRealm>, name: String) -> Result<()> {
        let realm = &mut ctx.accounts.realm;
        realm.authority = ctx.accounts.authority.key();
        realm.name = name;
        realm.proposal_count = 0;
        realm.bump = *ctx.bumps.get("realm").unwrap();
        
        msg!("Governance realm '{}' initialized", realm.name);
        Ok(())
    }

    // Create a new governance proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        voting_period: i64, // in seconds
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        proposal.realm = ctx.accounts.realm.key();
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.title = title;
        proposal.description = description;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.abstain_votes = 0;
        proposal.total_votes = 0;
        proposal.status = ProposalStatus::Active;
        proposal.start_time = Clock::get()?.unix_timestamp;
        proposal.end_time = proposal.start_time.checked_add(voting_period)
            .ok_or(GovernanceError::Overflow)?;
        proposal.bump = *ctx.bumps.get("proposal").unwrap();
        
        // Update the realm proposal count
        let realm = &mut ctx.accounts.realm;
        realm.proposal_count = realm.proposal_count.checked_add(1)
            .ok_or(GovernanceError::Overflow)?;
        
        msg!("Proposal '{}' created", proposal.title);
        Ok(())
    }

    // Cast a vote on a proposal
    pub fn cast_vote(ctx: Context<CastVote>, vote: Vote, amount: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < proposal.end_time,
            GovernanceError::VotingPeriodEnded
        );
        
        // Record the vote
        match vote {
            Vote::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
            Vote::No => proposal.no_votes = proposal.no_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
            Vote::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(amount)
                .ok_or(GovernanceError::Overflow)?,
        }
        
        proposal.total_votes = proposal.total_votes.checked_add(amount)
            .ok_or(GovernanceError::Overflow)?;
        
        // Transfer voting tokens from voter to proposal escrow
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.proposal_escrow_account.to_account_info(),
            authority: ctx.accounts.voter.to_account_info(),
            mint: ctx.accounts.governing_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.governing_token_mint.decimals)?;
        
        msg!("Vote cast: {:?} with {} tokens", vote, amount);
        Ok(())
    }

    // Finalize a proposal after voting period ends
    pub fn finalize_proposal(ctx: Context<FinalizeProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= proposal.end_time,
            GovernanceError::VotingPeriodNotEnded
        );
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Determine the outcome
        if proposal.yes_votes > proposal.no_votes {
            proposal.status = ProposalStatus::Passed;
        } else {
            proposal.status = ProposalStatus::Failed;
        }
        
        msg!("Proposal '{}' finalized with status: {:?}", proposal.title, proposal.status);
        Ok(())
    }

    // Execute a passed proposal
    pub fn execute_proposal(ctx: Context<ExecuteProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal has passed
        require!(
            proposal.status == ProposalStatus::Passed,
            GovernanceError::ProposalNotPassed
        );
        
        // In a real implementation, this would execute the proposal's actions
        // For now, we'll just mark it as executed
        proposal.status = ProposalStatus::Executed;
        
        msg!("Proposal '{}' executed", proposal.title);
        Ok(())
    }

    // Quadratic voting implementation
    pub fn cast_quadratic_vote(ctx: Context<CastQuadraticVote>, vote: Vote, amount: u64) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        
        // Check if proposal is active
        require!(
            proposal.status == ProposalStatus::Active,
            GovernanceError::ProposalNotActive
        );
        
        // Check if voting period has ended
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time < proposal.end_time,
            GovernanceError::VotingPeriodEnded
        );
        
        // Calculate quadratic voting power (square root of tokens)
        let voting_power = (amount as f64).sqrt() as u64;
        
        // Record the vote with quadratic voting power
        match vote {
            Vote::Yes => proposal.yes_votes = proposal.yes_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
            Vote::No => proposal.no_votes = proposal.no_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
            Vote::Abstain => proposal.abstain_votes = proposal.abstain_votes.checked_add(voting_power)
                .ok_or(GovernanceError::Overflow)?,
        }
        
        proposal.total_votes = proposal.total_votes.checked_add(voting_power)
            .ok_or(GovernanceError::Overflow)?;
        
        // Transfer voting tokens from voter to proposal escrow
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.voter_token_account.to_account_info(),
            to: ctx.accounts.proposal_escrow_account.to_account_info(),
            authority: ctx.accounts.voter.to_account_info(),
            mint: ctx.accounts.governing_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.governing_token_mint.decimals)?;
        
        msg!("Quadratic vote cast: {:?} with {} tokens (voting power: {})", vote, amount, voting_power);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRealm<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GovernanceRealm::INIT_SPACE,
        seeds = [b"governance-realm", name.as_bytes()],
        bump
    )]
    pub realm: Account<'info, GovernanceRealm>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + GovernanceProposal::INIT_SPACE,
        seeds = [
            b"governance-proposal", 
            realm.key().as_ref(), 
            title.as_bytes(),
            proposer.key().as_ref()
        ],
        bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        seeds = [b"governance-realm", realm.name.as_bytes()],
        bump = realm.bump
    )]
    pub realm: Account<'info, GovernanceRealm>,
    
    #[account(mut)]
    pub proposer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        token::mint = governing_token_mint,
        token::authority = voter,
    )]
    pub voter_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = voter,
        token::mint = governing_token_mint,
        token::authority = proposal,
    )]
    pub proposal_escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    pub governing_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    /// CHECK: This account can be any valid pubkey
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ExecuteProposal<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    /// CHECK: This account can be any valid pubkey
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CastQuadraticVote<'info> {
    #[account(
        mut,
        seeds = [
            b"governance-proposal", 
            proposal.realm.as_ref(), 
            proposal.title.as_bytes(),
            proposal.proposer.as_ref()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, GovernanceProposal>,
    
    #[account(
        mut,
        token::mint = governing_token_mint,
        token::authority = voter,
    )]
    pub voter_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = voter,
        token::mint = governing_token_mint,
        token::authority = proposal,
    )]
    pub proposal_escrow_account: InterfaceAccount<'info, TokenAccount>,
    
    pub governing_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// Governance realm account
#[account]
#[derive(InitSpace)]
pub struct GovernanceRealm {
    pub authority: Pubkey,
    #[max_len(100)]
    pub name: String,
    pub proposal_count: u64,
    pub bump: u8,
}

// Governance proposal account
#[account]
#[derive(InitSpace)]
pub struct GovernanceProposal {
    pub realm: Pubkey,
    pub proposer: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub description: String,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub abstain_votes: u64,
    pub total_votes: u64,
    pub status: ProposalStatus,
    pub start_time: i64,
    pub end_time: i64,
    pub bump: u8,
}

// Vote options
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Vote {
    Yes,
    No,
    Abstain,
}

// Proposal status
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Passed,
    Failed,
    Executed,
}

#[error_code]
pub enum GovernanceError {
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Proposal is not active")]
    ProposalNotActive,
    
    #[msg("Voting period has ended")]
    VotingPeriodEnded,
    
    #[msg("Voting period has not ended yet")]
    VotingPeriodNotEnded,
    
    #[msg("Proposal has not passed")]
    ProposalNotPassed,
}
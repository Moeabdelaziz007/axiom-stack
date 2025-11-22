use anchor_lang::prelude::*;

declare_id!("CooP8hJ3TMq2cAB5iFYxSZ6bYcnS9PmajbGENxXDGjkN");

// Enum to represent the status of a proposal
#[derive(Clone, Debug, AnchorDeserialize, AnchorSerialize)]
pub enum ProposalStatus {
    Draft,
    Voting,
    Succeeded,
    Failed,
}

// Enum to represent the vote side
#[derive(Clone, Debug, AnchorDeserialize, AnchorSerialize)]
pub enum VoteSide {
    Yes,
    No,
}

// Account structure for a proposal
#[account]
pub struct Proposal {
    pub proposer: Pubkey,           // Wallet that created the proposal
    pub status: ProposalStatus,     // Current status of the proposal
    pub votes_for: u64,             // Tally of 'Yes' votes
    pub votes_against: u64,         // Tally of 'No' votes
    pub execution_target: Option<Pubkey>, // Optional: Address of the program to be updated
    pub title: String,              // Title of the proposal
    pub description: String,        // Description of the proposal
    pub created_at: i64,            // Timestamp when proposal was created
    pub voting_ends_at: i64,        // Timestamp when voting period ends
}

// Account structure for recording votes
#[account]
pub struct VoteRecord {
    pub proposal: Pubkey,           // The proposal being voted on
    pub voter: Pubkey,              // The wallet that cast the vote
    pub side: VoteSide,             // The side of the vote (Yes/No)
    pub voting_power: u64,          // The voting power used for this vote
    pub timestamp: i64,             // When the vote was cast
}

#[program]
pub mod axiom_governance {
    use super::*;

    // Initialize a new proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        voting_duration: i64,  // Duration in seconds
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let clock = Clock::get()?;
        
        proposal.proposer = ctx.accounts.proposer.key();
        proposal.status = ProposalStatus::Draft;
        proposal.votes_for = 0;
        proposal.votes_against = 0;
        proposal.execution_target = None;
        proposal.title = title;
        proposal.description = description;
        proposal.created_at = clock.unix_timestamp;
        proposal.voting_ends_at = clock.unix_timestamp + voting_duration;
        
        msg!("Proposal '{}' created by {}", proposal.title, proposal.proposer);
        Ok(())
    }

    // Submit a vote for a proposal
    pub fn submit_vote(
        ctx: Context<SubmitVote>,
        side: VoteSide,
        voting_power: u64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_record = &mut ctx.accounts.vote_record;
        let clock = Clock::get()?;
        
        // Check if voting is still open
        if clock.unix_timestamp > proposal.voting_ends_at {
            return err!(GovernanceError::VotingPeriodEnded);
        }
        
        // Check if proposal is in voting status
        if !matches!(proposal.status, ProposalStatus::Voting) {
            return err!(GovernanceError::ProposalNotInVoting);
        }
        
        // Record the vote
        vote_record.proposal = proposal.key();
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.side = side.clone();
        vote_record.voting_power = voting_power;
        vote_record.timestamp = clock.unix_timestamp;
        
        // Update proposal vote counts
        match side {
            VoteSide::Yes => proposal.votes_for = proposal.votes_for.checked_add(voting_power).unwrap(),
            VoteSide::No => proposal.votes_against = proposal.votes_against.checked_add(voting_power).unwrap(),
        }
        
        msg!("Vote submitted for proposal '{}' by {}", proposal.title, vote_record.voter);
        Ok(())
    }

    // Start voting period for a proposal
    pub fn start_voting(ctx: Context<StartVoting>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let clock = Clock::get()?;
        
        // Check if proposal is in draft status
        if !matches!(proposal.status, ProposalStatus::Draft) {
            return err!(GovernanceError::ProposalNotInDraft);
        }
        
        // Check if voting period hasn't started yet
        if clock.unix_timestamp > proposal.voting_ends_at {
            return err!(GovernanceError::VotingPeriodEnded);
        }
        
        proposal.status = ProposalStatus::Voting;
        
        msg!("Voting started for proposal '{}'", proposal.title);
        Ok(())
    }

    // Finalize proposal after voting period
    pub fn finalize_proposal(ctx: Context<FinalizeProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let clock = Clock::get()?;
        
        // Check if voting period has ended
        if clock.unix_timestamp < proposal.voting_ends_at {
            return err!(GovernanceError::VotingPeriodNotEnded);
        }
        
        // Check if proposal is in voting status
        if !matches!(proposal.status, ProposalStatus::Voting) {
            return err!(GovernanceError::ProposalNotInVoting);
        }
        
        // Determine final status based on vote results
        if proposal.votes_for > proposal.votes_against {
            proposal.status = ProposalStatus::Succeeded;
        } else {
            proposal.status = ProposalStatus::Failed;
        }
        
        msg!("Proposal '{}' finalized with status: {:?}", proposal.title, proposal.status);
        Ok(())
    }
}

// Context for creating a proposal
#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + 32 + 1 + 8 + 8 + 1 + 32 + 4 + 100 + 4 + 1000 + 8 + 8
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub proposer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for submitting a vote
#[derive(Accounts)]
pub struct SubmitVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(
        init,
        payer = voter,
        space = 8 + 32 + 32 + 1 + 8 + 8
    )]
    pub vote_record: Account<'info, VoteRecord>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for starting voting
#[derive(Accounts)]
pub struct StartVoting<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    pub proposer: Signer<'info>,
}

// Context for finalizing proposal
#[derive(Accounts)]
pub struct FinalizeProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
}

// Custom errors for the governance program
#[error_code]
pub enum GovernanceError {
    #[msg("Voting period has already ended")]
    VotingPeriodEnded,
    #[msg("Proposal is not in draft status")]
    ProposalNotInDraft,
    #[msg("Proposal is not in voting status")]
    ProposalNotInVoting,
    #[msg("Voting period has not ended yet")]
    VotingPeriodNotEnded,
}
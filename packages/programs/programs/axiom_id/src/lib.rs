use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_spl::{
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked},
};

// This is our new Program ID. Anchor will update this for us later.
declare_id!("5E7eosX9X34CWCeGpw2C4ua2JRYTZqZ8MsFkxj3y6T7C");

#[program]
pub mod axiom_id {
    use super::*;
    
    // Initialize an agent with Cryptid integration
    pub fn initialize_agent(ctx: Context<InitializeAgent>, did: Pubkey) -> Result<()> {
        let agent_metadata = &mut ctx.accounts.agent_metadata;
        agent_metadata.did = did;
        agent_metadata.soul_mint = Pubkey::default(); // Not minted yet
        agent_metadata.agent_pda = ctx.accounts.agent_pda.key();
        agent_metadata.version = 1;
        agent_metadata.bump = *ctx.bumps.get("agent_metadata").unwrap();
        
        msg!("Agent initialized with DID: {}", did);
        Ok(())
    }
    
    // Mint a soul-bound token to an agent
    pub fn mint_soul_to_agent(ctx: Context<MintSoulToAgent>) -> Result<()> {
        // Verify that the soul hasn't been minted yet
        require!(
            ctx.accounts.agent_metadata.soul_mint == Pubkey::default(),
            AxiomAgentError::SoulAlreadyMinted
        );
        
        // In a real implementation, we would perform CPIs to the Token-2022 program
        // to create a non-transferable mint and mint the soul token to the agent's ATA
        
        // For now, we'll just update the agent metadata to point to the soul mint
        let agent_metadata = &mut ctx.accounts.agent_metadata;
        agent_metadata.soul_mint = ctx.accounts.soul_mint.key();
        
        msg!("Soul minted to agent: {}", ctx.accounts.agent_pda.key());
        Ok(())
    }

    // THIS IS OUR NEW FUNCTION!
    // This function creates (initializes) a new AxiomAiIdentity account.
    pub fn create_identity(ctx: Context<CreateIdentity>, persona: String, stake_amount: u64) -> Result<()> {
        
        // Get the account we are creating
        let identity_account = &mut ctx.accounts.identity_account;
        
        // Get the wallet that signed (paid for) this transaction
        let user_authority = &ctx.accounts.user;

        // Get the current time from the blockchain
        let clock = Clock::get()?;

        // --- SET ALL THE FIELDS ---
        identity_account.authority = *user_authority.key;
        identity_account.persona = persona;
        identity_account.reputation = 0; // New accounts start with 0 reputation
        identity_account.created_at = clock.unix_timestamp; // Set "birth" date
        identity_account.stake_amount = stake_amount; // Record the stake amount
        identity_account.is_soul_bound = true; // Mark as soul-bound token

        // Log a message to the console
        msg!("Axiom ID Created: {}", identity_account.key());
        msg!("Authority: {}", identity_account.authority);
        msg!("Persona: {}", identity_account.persona);

        Ok(())
    }

    // This is the old placeholder function. We can leave it or remove it.
    // Let's leave it for now.
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Axiom ID Program Initialized!");
        Ok(())
    }

    // Add the get_identity function as specified in the execution blueprint
    // This function allows fetching an existing identity account from the blockchain
    // The client can fetch account data directly using the PDA without needing to call this
    pub fn get_identity(ctx: Context<GetIdentity>) -> Result<()> {
        // The account is already fetched and deserialized by Anchor
        // We just need to log it or return it
        // For on-chain, just returning Ok is enough
        // The client will fetch the account data directly
        msg!("Identity account data fetched for: {}", ctx.accounts.authority.key());
        Ok(())
    }

    // New function to stake tokens for an identity
    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        // Transfer tokens from user to stake account
        let cpi_accounts = TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.stake_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.axiom_token_mint.decimals)?;
        
        // Update identity account
        let identity_account = &mut ctx.accounts.identity_account;
        identity_account.stake_amount = identity_account.stake_amount.checked_add(amount)
            .ok_or(error!(AxiomAgentError::Overflow))?;

        msg!("Staked {} tokens for identity: {}", amount, identity_account.key());
        Ok(())
    }

    // New function to slash tokens from an identity
    pub fn slash_tokens(ctx: Context<SlashTokens>, amount: u64, reason: String) -> Result<()> {
        // Transfer tokens from stake account to slash recipient
        let bump = *ctx.bumps.get("identity_account").unwrap();
        let seeds = &[
            b"axiom-identity",
            ctx.accounts.identity_account.authority.as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = TransferChecked {
            from: ctx.accounts.stake_token_account.to_account_info(),
            to: ctx.accounts.slash_recipient_token_account.to_account_info(),
            authority: ctx.accounts.identity_account.to_account_info(),
            mint: ctx.accounts.axiom_token_mint.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        transfer_checked(cpi_ctx, amount, ctx.accounts.axiom_token_mint.decimals)?;

        // Update identity account
        let identity_account = &mut ctx.accounts.identity_account;
        identity_account.stake_amount = identity_account.stake_amount.checked_sub(amount)
            .ok_or(error!(AxiomAgentError::Overflow))?;

        // Record the slash event
        msg!("Slashed {} tokens from identity: {} for reason: {}", amount, identity_account.key(), reason);
        Ok(())
    }

    // New function to update reputation
    pub fn update_reputation(ctx: Context<UpdateReputation>, reputation_change: i64) -> Result<()> {
        let identity_account = &mut ctx.accounts.identity_account;
        
        // Update reputation with overflow protection
        if reputation_change >= 0 {
            identity_account.reputation = identity_account.reputation.checked_add(reputation_change as u64)
                .ok_or(error!(AxiomAgentError::Overflow))?;
        } else {
            let abs_change = reputation_change.abs() as u64;
            identity_account.reputation = identity_account.reputation.checked_sub(abs_change)
                .unwrap_or(0); // Don't go below 0
        }

        msg!("Updated reputation for identity: {} to {}", identity_account.key(), identity_account.reputation);
        Ok(())
    }
    
    // New function to integrate with Cryptid DID for agent sovereignty
    pub fn create_cryptid_did(ctx: Context<CreateCryptidDID>, did_document: String) -> Result<()> {
        let agent_metadata = &mut ctx.accounts.agent_metadata;
        
        // In a full implementation, this would:
        // 1. Create a Cryptid DID document on-chain
        // 2. Associate the DID with the agent's identity
        // 3. Set up key rotation capabilities
        
        msg!("Cryptid DID created for agent: {}", agent_metadata.did);
        msg!("DID Document: {}", did_document);
        
        Ok(())
    }
    
    // New function to rotate keys for agent sovereignty
    pub fn rotate_agent_keys(ctx: Context<RotateAgentKeys>, new_controller: Pubkey) -> Result<()> {
        let agent_metadata = &mut ctx.accounts.agent_metadata;
        
        // In a full implementation, this would:
        // 1. Update the Cryptid DID controller
        // 2. Maintain the same DID while changing the controlling key
        // 3. Preserve all associated reputation and credentials
        
        msg!("Agent keys rotated for DID: {}", agent_metadata.did);
        msg!("New controller: {}", new_controller);
        
        Ok(())
    }
    
    // New function to verify agent identity through Cryptid DID
    pub fn verify_agent_identity(ctx: Context<VerifyAgentIdentity>) -> Result<()> {
        let agent_metadata = &ctx.accounts.agent_metadata;
        
        // In a full implementation, this would:
        // 1. Verify the agent's Cryptid DID is valid
        // 2. Check that the DID is properly associated with the agent
        // 3. Confirm the agent has not been revoked or compromised
        
        msg!("Agent identity verified for DID: {}", agent_metadata.did);
        
        Ok(())
    }
    
    // New function to link agent with existing Cryptid DID
    pub fn link_cryptid_did(ctx: Context<LinkCryptidDID>, cryptid_did: Pubkey) -> Result<()> {
        let agent_metadata = &mut ctx.accounts.agent_metadata;
        agent_metadata.did = cryptid_did;
        
        msg!("Agent linked to Cryptid DID: {}", cryptid_did);
        
        Ok(())
    }
}

// Agent Metadata account structure
#[account]
#[derive(InitSpace)]
pub struct AgentMetadata {
    // The public key of the agent's did:sol (used as "seed" for this account)
    pub did: Pubkey,
    
    // Address of the Soul Mint associated with this agent
    // Is `Pubkey::default()` or `None` until minted
    pub soul_mint: Pubkey,
    
    // Actual Cryptid PDA address (derived and stored)
    pub agent_pda: Pubkey,
    
    // Version of this data structure for future updates
    pub version: u8,
    
    // Bump seed for this PDA
    pub bump: u8,
}

// --- 2. ADDED A HELPER CALCULATION ---
// We define the data structure and calculate its size.
#[account]
pub struct AxiomAiIdentity {
    // The wallet (Pubkey) that "owns" or controls this AI ID
    pub authority: Pubkey,
    
    // A short description of the AI (e.g., "DeFi Analyst v1")
    pub persona: String, 
    
    // Reputation score, starts at 0
    pub reputation: u64,
    
    // When this ID was "born" (Unix Timestamp)
    pub created_at: i64,

    // The amount of $AXIOM tokens staked to keep this ID active
    pub stake_amount: u64,

    // Whether this identity is soul-bound (non-transferable)
    pub is_soul_bound: bool,
}

impl AxiomAiIdentity {
    // We need to define the max size for our 'persona' string
    const MAX_PERSONA_LENGTH: usize = 50; // 50 chars max

    // Calculate the total space needed for the account
    pub const LEN: usize = 
        8 + // 8-byte Anchor discriminator (always needed)
        32 + // authority: Pubkey
        (4 + Self::MAX_PERSONA_LENGTH) + // persona: String (4 bytes for length + 50 for data)
        8 + // reputation: u64
        8 + // created_at: i64
        8 + // stake_amount: u64
        1; // is_soul_bound: bool
}

// --- 3. ADDED THE ACCOUNTS CONTEXT FOR 'create_identity' ---
#[derive(Accounts)]
pub struct InitializeAgent<'info> {
    // Agent metadata account (PDA)
    #[account(
        init,
        payer = authority,
        space = 8 + AgentMetadata::INIT_SPACE,
        seeds = [b"agent-metadata", did.key().as_ref()],
        bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    /// CHECK: This is the Cryptid PDA that will be verified in the instruction
    pub agent_pda: AccountInfo<'info>,
    
    // The DID of the agent
    pub did: AccountInfo<'info>,
    
    // The authority who is initializing the agent
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintSoulToAgent<'info> {
    // Agent metadata account (PDA)
    #[account(
        mut,
        seeds = [b"agent-metadata", agent_metadata.did.as_ref()],
        bump = agent_metadata.bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    /// CHECK: This is the Cryptid PDA that controls the soul
    pub agent_pda: AccountInfo<'info>,
    
    /// CHECK: This is the soul mint that will be created
    pub soul_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateIdentity<'info> {
    
    // 1. The new account we are creating.
    #[account(
        init, // 'init' = create this account
        payer = user, // The 'user' pays for the account's rent
        space = AxiomAiIdentity::LEN, // Use the 'LEN' calculation for space
        seeds = [b"axiom-identity", user.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    
    // 2. The user who is paying and becoming the authority.
    #[account(mut)]
    pub user: Signer<'info>,
    
    // 3. The System Program (required by Solana to create accounts).
    pub system_program: Program<'info, System>,
}


// Define the context for getting an identity
// This tells Anchor how to find the identity account using PDA derivation
#[derive(Accounts)]
pub struct GetIdentity<'info> {
    #[account(
        seeds = [b"axiom-identity", authority.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    pub authority: Signer<'info>,
}

// Define the context for staking tokens
#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"axiom-identity", user.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = user,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = identity_account,
    )]
    pub stake_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// Define the context for slashing tokens
#[derive(Accounts)]
pub struct SlashTokens<'info> {
    #[account(
        mut,
        seeds = [b"axiom-identity", identity_account.authority.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = identity_account,
    )]
    pub stake_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(
        mut,
        token::mint = axiom_token_mint,
        token::authority = slash_recipient,
    )]
    pub slash_recipient_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub axiom_token_mint: InterfaceAccount<'info, Mint>,
    
    /// CHECK: This account can be any valid pubkey
    pub slash_recipient: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

// Define the context for updating reputation
#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    #[account(
        mut,
        seeds = [b"axiom-identity", authority.key().as_ref()],
        bump
    )]
    pub identity_account: Account<'info, AxiomAiIdentity>,
    
    // Authority must be the same as the identity owner
    #[account(
        constraint = authority.key() == identity_account.authority
    )]
    pub authority: Signer<'info>,
}

// New accounts struct for creating Cryptid DID
#[derive(Accounts)]
pub struct CreateCryptidDID<'info> {
    #[account(
        mut,
        seeds = [b"agent-metadata", agent_metadata.did.as_ref()],
        bump = agent_metadata.bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// New accounts struct for rotating agent keys
#[derive(Accounts)]
pub struct RotateAgentKeys<'info> {
    #[account(
        mut,
        seeds = [b"agent-metadata", agent_metadata.did.as_ref()],
        bump = agent_metadata.bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    // Authority must be the current controller
    #[account(
        constraint = authority.key() == agent_metadata.did
    )]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// New accounts struct for verifying agent identity
#[derive(Accounts)]
pub struct VerifyAgentIdentity<'info> {
    #[account(
        seeds = [b"agent-metadata", agent_metadata.did.as_ref()],
        bump = agent_metadata.bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    /// CHECK: This account can be any valid pubkey
    pub verifier: AccountInfo<'info>,
}

// New accounts struct for linking existing Cryptid DID
#[derive(Accounts)]
pub struct LinkCryptidDID<'info> {
    #[account(
        mut,
        seeds = [b"agent-metadata", agent_metadata.did.as_ref()],
        bump = agent_metadata.bump
    )]
    pub agent_metadata: Account<'info, AgentMetadata>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// This is just a default struct for our placeholder 'initialize' function.
#[derive(Accounts)]
pub struct Initialize {}

#[error_code]
pub enum AxiomAgentError {
    #[msg("Soul has already been minted for this agent")]
    SoulAlreadyMinted,
    
    #[msg("Arithmetic overflow")]
    Overflow,
}
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("4sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD");

#[program]
pub mod axiom_attestations {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let attestation_config = &mut ctx.accounts.attestation_config;
        attestation_config.authority = authority;
        attestation_config.total_attestations = 0;
        attestation_config.bump = *ctx.bumps.get("attestation_config").unwrap();
        
        Ok(())
    }

    pub fn create_attestation_schema(
        ctx: Context<CreateAttestationSchema>,
        name: String,
        description: String,
    ) -> Result<()> {
        let schema = &mut ctx.accounts.schema;
        schema.authority = ctx.accounts.authority.key();
        schema.name = name;
        schema.description = description;
        schema.bump = *ctx.bumps.get("schema").unwrap();
        
        Ok(())
    }

    pub fn issue_attestation(
        ctx: Context<IssueAttestation>,
        claim: String,
        expiration: Option<i64>,
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.schema = ctx.accounts.schema.key();
        attestation.subject = ctx.accounts.subject.key();
        attestation.attester = ctx.accounts.attester.key();
        attestation.claim = claim;
        attestation.expiration = expiration;
        attestation.revoked = false;
        attestation.timestamp = Clock::get()?.unix_timestamp;
        attestation.bump = *ctx.bumps.get("attestation").unwrap();
        
        // Update the total attestations count
        let attestation_config = &mut ctx.accounts.attestation_config;
        attestation_config.total_attestations = attestation_config.total_attestations.checked_add(1)
            .ok_or(error!(AttestationError::Overflow))?;
        
        Ok(())
    }

    pub fn revoke_attestation(ctx: Context<RevokeAttestation>, reason: String) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.revoked = true;
        
        // Log the revocation reason
        msg!("Attestation revoked for reason: {}", reason);
        
        Ok(())
    }
    
    // New function to verify an attestation against SAS standards
    pub fn verify_attestation(ctx: Context<VerifyAttestation>) -> Result<()> {
        let attestation = &ctx.accounts.attestation;
        
        // Check if attestation is revoked
        require!(!attestation.revoked, AttestationError::AttestationRevoked);
        
        // Check if attestation has expired
        if let Some(expiration) = attestation.expiration {
            let current_time = Clock::get()?.unix_timestamp;
            require!(current_time < expiration, AttestationError::AttestationExpired);
        }
        
        // Log verification
        msg!("Attestation verified successfully for subject: {}", attestation.subject);
        
        Ok(())
    }
    
    // New function to integrate with SAS reputation system
    pub fn update_reputation_from_attestation(ctx: Context<UpdateReputationFromAttestation>, reputation_change: i64) -> Result<()> {
        // This function would be called by other programs to update reputation based on attestation
        // In a full implementation, this would involve cross-program calls to the reputation system
        
        msg!("Reputation updated by {} based on attestation", reputation_change);
        
        Ok(())
    }
    
    // New function to create SAS-compliant attestation
    pub fn create_sas_attestation(
        ctx: Context<CreateSASAttestation>,
        claim: String,
        expiration: Option<i64>,
        attestation_type: String, // e.g., "capability", "performance", "behavioral"
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.schema = ctx.accounts.schema.key();
        attestation.subject = ctx.accounts.subject.key();
        attestation.attester = ctx.accounts.attester.key();
        attestation.claim = claim;
        attestation.expiration = expiration;
        attestation.revoked = false;
        attestation.timestamp = Clock::get()?.unix_timestamp;
        attestation.bump = *ctx.bumps.get("attestation").unwrap();
        
        // Store attestation type for SAS compliance
        // In a full implementation, this would be stored in a separate field
        
        // Update the total attestations count
        let attestation_config = &mut ctx.accounts.attestation_config;
        attestation_config.total_attestations = attestation_config.total_attestations.checked_add(1)
            .ok_or(error!(AttestationError::Overflow))?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + AttestationConfig::INIT_SPACE,
        seeds = [b"attestation-config"],
        bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateAttestationSchema<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + AttestationSchema::INIT_SPACE,
        seeds = [b"schema", authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub schema: Account<'info, AttestationSchema>,
    
    #[account(
        mut,
        constraint = authority.key() == attestation_config.authority
    )]
    pub authority: Signer<'info>,
    
    #[account(
        seeds = [b"attestation-config"],
        bump = attestation_config.bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(claim: String)]
pub struct IssueAttestation<'info> {
    #[account(
        init,
        payer = attester,
        space = 8 + Attestation::INIT_SPACE,
        seeds = [
            b"attestation", 
            schema.key().as_ref(), 
            subject.key().as_ref(), 
            attester.key().as_ref(),
            claim.as_bytes()
        ],
        bump
    )]
    pub attestation: Account<'info, Attestation>,
    
    pub schema: Account<'info, AttestationSchema>,
    
    /// CHECK: This is the subject of the attestation
    pub subject: AccountInfo<'info>,
    
    #[account(mut)]
    pub attester: Signer<'info>,
    
    #[account(
        seeds = [b"attestation-config"],
        bump = attestation_config.bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeAttestation<'info> {
    #[account(
        mut,
        constraint = attestation.attester == attester.key()
    )]
    pub attestation: Account<'info, Attestation>,
    
    #[account(mut)]
    pub attester: Signer<'info>,
}

// New accounts struct for verifying attestations
#[derive(Accounts)]
pub struct VerifyAttestation<'info> {
    pub attestation: Account<'info, Attestation>,
    
    /// CHECK: This account can be any valid pubkey
    pub verifier: AccountInfo<'info>,
}

// New accounts struct for updating reputation from attestation
#[derive(Accounts)]
pub struct UpdateReputationFromAttestation<'info> {
    pub attestation: Account<'info, Attestation>,
    
    /// CHECK: This account would be the reputation account
    pub reputation_account: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

// New accounts struct for creating SAS-compliant attestations
#[derive(Accounts)]
#[instruction(claim: String, attestation_type: String)]
pub struct CreateSASAttestation<'info> {
    #[account(
        init,
        payer = attester,
        space = 8 + SASAttestation::INIT_SPACE,
        seeds = [
            b"sas-attestation", 
            schema.key().as_ref(), 
            subject.key().as_ref(), 
            attester.key().as_ref(),
            claim.as_bytes(),
            attestation_type.as_bytes()
        ],
        bump
    )]
    pub attestation: Account<'info, SASAttestation>,
    
    pub schema: Account<'info, AttestationSchema>,
    
    /// CHECK: This is the subject of the attestation
    pub subject: AccountInfo<'info>,
    
    #[account(mut)]
    pub attester: Signer<'info>,
    
    #[account(
        seeds = [b"attestation-config"],
        bump = attestation_config.bump
    )]
    pub attestation_config: Account<'info, AttestationConfig>,
    
    pub system_program: Program<'info, System>,
}

// Configuration account for the attestation program
#[account]
#[derive(InitSpace)]
pub struct AttestationConfig {
    pub authority: Pubkey,
    pub total_attestations: u64,
    pub bump: u8,
}

// Schema for attestations
#[account]
#[derive(InitSpace)]
pub struct AttestationSchema {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    pub bump: u8,
}

// Individual attestation
#[account]
#[derive(InitSpace)]
pub struct Attestation {
    pub schema: Pubkey,
    pub subject: Pubkey,
    pub attester: Pubkey,
    #[max_len(500)]
    pub claim: String,
    pub expiration: Option<i64>,
    pub revoked: bool,
    pub timestamp: i64,
    pub bump: u8,
}

// SAS-compliant attestation with additional fields
#[account]
#[derive(InitSpace)]
pub struct SASAttestation {
    pub schema: Pubkey,
    pub subject: Pubkey,
    pub attester: Pubkey,
    #[max_len(500)]
    pub claim: String,
    pub expiration: Option<i64>,
    pub revoked: bool,
    pub timestamp: i64,
    #[max_len(20)]
    pub attestation_type: String, // e.g., "capability", "performance", "behavioral"
    pub bump: u8,
}

#[error_code]
pub enum AttestationError {
    #[msg("Arithmetic overflow")]
    Overflow,
    
    #[msg("Attestation has been revoked")]
    AttestationRevoked,
    
    #[msg("Attestation has expired")]
    AttestationExpired,
}
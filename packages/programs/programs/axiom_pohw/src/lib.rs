use anchor_lang::prelude::*;

declare_id!("AXiomPoHWProg111111111111111111111111111111");

#[program]
pub mod axiom_pohw {
    use super::*;

    pub fn initialize_schema(ctx: Context<InitializeSchema>) -> Result<()> {
        let schema = &mut ctx.accounts.schema;
        schema.version = 1;
        schema.authority = ctx.accounts.authority.key();
        schema.bump = *ctx.bumps.get("schema").unwrap();
        
        msg!("PoHW Schema initialized");
        Ok(())
    }

    pub fn record_human_work(ctx: Context<RecordHumanWork>, data: WorkData) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.axiom_id_holder = ctx.accounts.user.key();
        attestation.schema_version = data.schema_version;
        attestation.total_tasks = data.total_tasks;
        attestation.quality_score = data.quality_score;
        attestation.last_active_ts = data.last_active_ts;
        attestation.specialization_tier = data.specialization_tier;
        attestation.bump = *ctx.bumps.get("attestation").unwrap();
        
        msg!("Human work recorded for user: {}", attestation.axiom_id_holder);
        Ok(())
    }

    pub fn update_human_work(ctx: Context<UpdateHumanWork>, data: WorkData) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        attestation.schema_version = data.schema_version;
        attestation.total_tasks = data.total_tasks;
        attestation.quality_score = data.quality_score;
        attestation.last_active_ts = data.last_active_ts;
        attestation.specialization_tier = data.specialization_tier;
        
        msg!("Human work updated for user: {}", attestation.axiom_id_holder);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeSchema<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + Schema::INIT_SPACE,
        seeds = [b"pohw-schema"],
        bump
    )]
    pub schema: Account<'info, Schema>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: WorkData)]
pub struct RecordHumanWork<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// User (holder of the attestation)
    pub user: SystemAccount<'info>,

    /// Schema account
    #[account(
        seeds = [b"pohw-schema"],
        bump = schema.bump
    )]
    pub schema: Account<'info, Schema>,

    /// Attestation account (PDA)
    #[account(
        init,
        payer = payer,
        space = 8 + HumanWorkAttestation::INIT_SPACE,
        seeds = [
            b"pohw-attestation",
            schema.key().as_ref(),
            user.key().as_ref()
        ],
        bump
    )]
    pub attestation: Account<'info, HumanWorkAttestation>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: WorkData)]
pub struct UpdateHumanWork<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    /// User (holder of the attestation)
    pub user: SystemAccount<'info>,

    /// Schema account
    #[account(
        seeds = [b"pohw-schema"],
        bump = schema.bump
    )]
    pub schema: Account<'info, Schema>,

    /// Attestation account (PDA)
    #[account(
        mut,
        seeds = [
            b"pohw-attestation",
            schema.key().as_ref(),
            user.key().as_ref()
        ],
        bump = attestation.bump
    )]
    pub attestation: Account<'info, HumanWorkAttestation>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Schema {
    pub version: u8,
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct HumanWorkAttestation {
    pub axiom_id_holder: Pubkey,
    pub schema_version: u8,
    pub total_tasks: u64,
    pub quality_score: u16,
    pub last_active_ts: i64,
    pub specialization_tier: u8,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct WorkData {
    pub schema_version: u8,
    pub total_tasks: u64,
    pub quality_score: u16,
    pub last_active_ts: i64,
    pub specialization_tier: u8,
}
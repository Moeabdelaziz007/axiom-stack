import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { AxiomPohw } from '../target/types/axiom_pohw';
import { Keypair, PublicKey } from '@solana/web3.js';

describe('axiom_pohw', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AxiomPohw as Program<AxiomPohw>;
  const authority = provider.wallet;

  // Schema PDA
  const [schemaPda, schemaBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("pohw-schema")],
    program.programId
  );

  it('Initializes the PoHW schema', async () => {
    // Initialize the schema
    const tx = await program.methods
      .initializeSchema()
      .accounts({
        authority: authority.publicKey,
        schema: schemaPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Schema initialized with transaction:', tx);

    // Fetch the schema account
    const schemaAccount = await program.account.schema.fetch(schemaPda);
    console.log('Schema account:', schemaAccount);

    // Verify the schema was initialized correctly
    expect(schemaAccount.version).to.equal(1);
    expect(schemaAccount.authority.toString()).to.equal(authority.publicKey.toString());
  });

  it('Records human work attestation', async () => {
    // Create a test user
    const user = Keypair.generate();
    
    // Airdrop some SOL to the user for testing
    const airdropTx = await provider.connection.requestAirdrop(user.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);

    // Attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pohw-attestation"),
        schemaPda.toBuffer(),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    // Work data
    const workData = {
      schemaVersion: 1,
      totalTasks: new anchor.BN(5),
      qualityScore: 9500,
      lastActiveTs: new anchor.BN(Math.floor(Date.now() / 1000)),
      specializationTier: 2,
    };

    // Record human work
    const tx = await program.methods
      .recordHumanWork(workData)
      .accounts({
        payer: authority.publicKey,
        user: user.publicKey,
        schema: schemaPda,
        attestation: attestationPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Human work recorded with transaction:', tx);

    // Fetch the attestation account
    const attestationAccount = await program.account.humanWorkAttestation.fetch(attestationPda);
    console.log('Attestation account:', attestationAccount);

    // Verify the attestation was recorded correctly
    expect(attestationAccount.axiomIdHolder.toString()).to.equal(user.publicKey.toString());
    expect(attestationAccount.schemaVersion).to.equal(1);
    expect(attestationAccount.totalTasks.toNumber()).to.equal(5);
    expect(attestationAccount.qualityScore).to.equal(9500);
    expect(attestationAccount.specializationTier).to.equal(2);
  });

  it('Updates human work attestation', async () => {
    // Create a test user
    const user = Keypair.generate();
    
    // Airdrop some SOL to the user for testing
    const airdropTx = await provider.connection.requestAirdrop(user.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);

    // Attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pohw-attestation"),
        schemaPda.toBuffer(),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    // Initial work data
    const initialWorkData = {
      schemaVersion: 1,
      totalTasks: new anchor.BN(5),
      qualityScore: 9500,
      lastActiveTs: new anchor.BN(Math.floor(Date.now() / 1000)),
      specializationTier: 2,
    };

    // Record initial human work
    await program.methods
      .recordHumanWork(initialWorkData)
      .accounts({
        payer: authority.publicKey,
        user: user.publicKey,
        schema: schemaPda,
        attestation: attestationPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Updated work data
    const updatedWorkData = {
      schemaVersion: 1,
      totalTasks: new anchor.BN(10),
      qualityScore: 9800,
      lastActiveTs: new anchor.BN(Math.floor(Date.now() / 1000) + 3600), // 1 hour later
      specializationTier: 2,
    };

    // Update human work
    const tx = await program.methods
      .updateHumanWork(updatedWorkData)
      .accounts({
        payer: authority.publicKey,
        user: user.publicKey,
        schema: schemaPda,
        attestation: attestationPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log('Human work updated with transaction:', tx);

    // Fetch the updated attestation account
    const attestationAccount = await program.account.humanWorkAttestation.fetch(attestationPda);
    console.log('Updated attestation account:', attestationAccount);

    // Verify the attestation was updated correctly
    expect(attestationAccount.axiomIdHolder.toString()).to.equal(user.publicKey.toString());
    expect(attestationAccount.schemaVersion).to.equal(1);
    expect(attestationAccount.totalTasks.toNumber()).to.equal(10);
    expect(attestationAccount.qualityScore).to.equal(9800);
    expect(attestationAccount.specializationTier).to.equal(2);
  });
});
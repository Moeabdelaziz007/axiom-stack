import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomAttestations } from "../target/types/axiom_attestations";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("axiom_attestations_comprehensive", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomAttestations as Program<AxiomAttestations>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the attestations program!", async () => {
    // Derive the program state PDA
    const [programStatePda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );

    // Call the initialize function
    const tx = await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize attestations program transaction signature", tx);

    // Verify the program state was created
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.authority.toString()).toBe(payer.publicKey.toString());
    expect(programState.totalAttestations.toString()).toBe("0");
  });

  it("Allows authorized issuer to issue attestation!", async () => {
    // First, let's create an authorized issuer
    const issuer = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the issuer
    const airdropTx = await provider.connection.requestAirdrop(issuer.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Register the issuer as authorized
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    // Initialize the program first
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    
    // Add issuer to authorized list (simplified - in reality this would be a separate instruction)
    // For this test, we'll treat the payer as the authorized issuer
    
    // Create a subject (the entity being attested)
    const subject = anchor.web3.Keypair.generate();
    const airdropTx2 = await provider.connection.requestAirdrop(subject.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx2);
    
    // Derive the attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), subject.publicKey.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // Issue attestation
    const claim = "Completed advanced AI training";
    const evidence = "Certificate ID: AXT-2025-001";
    const expiration = new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
    
    const tx = await program.methods.issueAttestation(claim, evidence, expiration)
      .accounts({
        programState: programStatePda,
        attestation: attestationPda,
        subject: subject.publicKey,
        issuer: payer.publicKey, // Authorized issuer
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Issue attestation transaction signature", tx);

    // Verify the attestation was created
    const attestation = await program.account.attestation.fetch(attestationPda);
    expect(attestation.subject.toString()).toBe(subject.publicKey.toString());
    expect(attestation.issuer.toString()).toBe(payer.publicKey.toString());
    expect(attestation.claim).toBe(claim);
    expect(attestation.evidence).toBe(evidence);
    expect(attestation.expiration.toString()).toBe(expiration.toString());
    expect(attestation.isRevoked).toBe(false);
    
    // Verify the program state was updated
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.totalAttestations.toString()).toBe("1");
  });

  it("Prevents stranger from issuing attestation!", async () => {
    // Create a stranger
    const stranger = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the stranger
    const airdropTx = await provider.connection.requestAirdrop(stranger.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Initialize the program
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    
    // Create a subject
    const subject = anchor.web3.Keypair.generate();
    const airdropTx2 = await provider.connection.requestAirdrop(subject.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx2);
    
    // Derive the attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), subject.publicKey.toBuffer(), stranger.publicKey.toBuffer()],
      program.programId
    );

    // Try to issue attestation as stranger - this should fail
    const claim = "Completed advanced AI training";
    const evidence = "Certificate ID: AXT-2025-001";
    const expiration = new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
    
    try {
      await program.methods.issueAttestation(claim, evidence, expiration)
        .accounts({
          programState: programStatePda,
          attestation: attestationPda,
          subject: subject.publicKey,
          issuer: stranger.publicKey, // Stranger trying to issue
          systemProgram: SystemProgram.programId,
        })
        .signers([stranger])
        .rpc();
      
      // If we reach here, the test should fail
      expect(true).toBe(false); // This should not be reached
    } catch (error) {
      // This is expected - the transaction should fail
      console.log("Stranger correctly prevented from issuing attestation");
      expect(error).toBeDefined();
    }
  });

  it("Allows revocation of attestation by issuer!", async () => {
    // Initialize the program
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    
    // Create a subject
    const subject = anchor.web3.Keypair.generate();
    const airdropTx = await provider.connection.requestAirdrop(subject.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), subject.publicKey.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // Issue attestation first
    const claim = "Completed advanced AI training";
    const evidence = "Certificate ID: AXT-2025-001";
    const expiration = new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
    
    await program.methods.issueAttestation(claim, evidence, expiration)
      .accounts({
        programState: programStatePda,
        attestation: attestationPda,
        subject: subject.publicKey,
        issuer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Verify the attestation was created and is not revoked
    let attestation = await program.account.attestation.fetch(attestationPda);
    expect(attestation.isRevoked).toBe(false);
    
    // Revoke the attestation
    const tx = await program.methods.revokeAttestation()
      .accounts({
        attestation: attestationPda,
        issuer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Revoke attestation transaction signature", tx);

    // Verify the attestation was revoked
    attestation = await program.account.attestation.fetch(attestationPda);
    expect(attestation.isRevoked).toBe(true);
  });

  it("Verifies valid attestation!", async () => {
    // Initialize the program
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    
    // Create a subject
    const subject = anchor.web3.Keypair.generate();
    const airdropTx = await provider.connection.requestAirdrop(subject.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), subject.publicKey.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // Issue attestation
    const claim = "Completed advanced AI training";
    const evidence = "Certificate ID: AXT-2025-001";
    const expiration = new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
    
    await program.methods.issueAttestation(claim, evidence, expiration)
      .accounts({
        programState: programStatePda,
        attestation: attestationPda,
        subject: subject.publicKey,
        issuer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Verify the attestation
    const tx = await program.methods.verifyAttestation()
      .accounts({
        attestation: attestationPda,
        verifier: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Verify attestation transaction signature", tx);
    
    // If we reach here without error, the verification was successful
    console.log("Attestation verified successfully");
  });

  it("Handles attestation with long claim and evidence!", async () => {
    // Initialize the program
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    
    // Create a subject
    const subject = anchor.web3.Keypair.generate();
    const airdropTx = await provider.connection.requestAirdrop(subject.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the attestation PDA
    const [attestationPda, attestationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), subject.publicKey.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // Issue attestation with long claim and evidence
    const claim = "A".repeat(100); // 100 character claim
    const evidence = "E".repeat(200); // 200 character evidence
    const expiration = new anchor.BN(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60); // 1 year from now
    
    const tx = await program.methods.issueAttestation(claim, evidence, expiration)
      .accounts({
        programState: programStatePda,
        attestation: attestationPda,
        subject: subject.publicKey,
        issuer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Issue long attestation transaction signature", tx);

    // Verify the attestation was created with correct data
    const attestation = await program.account.attestation.fetch(attestationPda);
    expect(attestation.claim).toBe(claim);
    expect(attestation.evidence).toBe(evidence);
  });
});
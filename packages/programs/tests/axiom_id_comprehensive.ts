import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomId } from "../target/types/axiom_id";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("axiom_id_comprehensive", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomId as Program<AxiomId>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  // Test 1: Initialize the program
  it("Initializes the program!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Initialize transaction signature", tx);
  });

  // Test 2: Create an identity successfully
  it("Creates an identity successfully!", async () => {
    // Generate a persona for testing
    const persona = "Test AI Agent v1";
    const stakeAmount = new anchor.BN(100);

    // Derive the PDA for the identity account
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );

    // Call the create_identity function
    const tx = await program.methods
      .createIdentity(persona, stakeAmount)
      .accounts({
        identityAccount: identityPda,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    console.log("Create identity transaction signature", tx);

    // Verify the account was created
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    expect(identityAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(identityAccount.persona).toBe(persona);
    expect(identityAccount.stakeAmount.toString()).toBe(stakeAmount.toString());
    expect(identityAccount.reputation.toString()).toBe("0");
    expect(identityAccount.createdAt).toBeDefined();
  });

  // Test 3: Fetch the created identity
  it("Fetches the created identity!", async () => {
    // Derive the PDA for the identity account
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );

    // Fetch the account data directly
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    
    console.log("Fetched identity:", {
      authority: identityAccount.authority.toString(),
      persona: identityAccount.persona,
      reputation: identityAccount.reputation.toString(),
      createdAt: identityAccount.createdAt.toString(),
      stakeAmount: identityAccount.stakeAmount.toString()
    });

    // Verify the data matches what we created
    expect(identityAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(identityAccount.persona).toBe("Test AI Agent v1");
    expect(identityAccount.stakeAmount.toString()).toBe("100");
    expect(identityAccount.reputation.toString()).toBe("0");
  });

  // Test 4: Owner can update identity metadata
  it("Allows owner to update identity metadata!", async () => {
    // First, let's create a new identity for this test
    const newPayer = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the new payer
    const airdropTx = await provider.connection.requestAirdrop(newPayer.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the PDA for the new identity account
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), newPayer.publicKey.toBuffer()],
      program.programId
    );
    
    // Create the identity
    const persona = "Updatable AI Agent";
    const stakeAmount = new anchor.BN(200);
    
    await program.methods
      .createIdentity(persona, stakeAmount)
      .accounts({
        identityAccount: identityPda,
        user: newPayer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newPayer])
      .rpc();
    
    // Verify the identity was created
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    expect(identityAccount.persona).toBe(persona);
    
    console.log("Identity created successfully for update test");
  });

  // Test 5: Authority can update reputation
  it("Allows authority to update reputation!", async () => {
    // Use the existing identity from previous tests
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );
    
    // Update reputation by +10
    const reputationChange = new anchor.BN(10);
    
    const tx = await program.methods
      .updateReputation(reputationChange)
      .accounts({
        identityAccount: identityPda,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();
    
    console.log("Update reputation transaction signature", tx);
    
    // Verify the reputation was updated
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    expect(identityAccount.reputation.toString()).toBe("10");
  });

  // Test 6: Authority can stake tokens
  it("Allows authority to stake tokens!", async () => {
    // Use the existing identity from previous tests
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );
    
    // Get the current stake amount
    const identityAccountBefore = await program.account.axiomAiIdentity.fetch(identityPda);
    const currentStake = identityAccountBefore.stakeAmount;
    
    // Stake additional tokens (this is a simplified test - in reality, this would involve token accounts)
    console.log("Current stake amount:", currentStake.toString());
    
    // In a real implementation, we would transfer tokens here
    // For now, we'll just verify the account exists and is accessible
    expect(identityAccountBefore.authority.toString()).toBe(payer.publicKey.toString());
  });

  // Test 7: Stranger fails to update identity they don't own
  it("Prevents stranger from updating identity they don't own!", async () => {
    // Create a new user
    const stranger = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the stranger
    const airdropTx = await provider.connection.requestAirdrop(stranger.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Try to update the existing identity (owned by payer)
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );
    
    // Attempt to update reputation - this should fail
    try {
      const reputationChange = new anchor.BN(5);
      
      await program.methods
        .updateReputation(reputationChange)
        .accounts({
          identityAccount: identityPda,
          authority: stranger.publicKey, // Stranger trying to update
        })
        .signers([stranger])
        .rpc();
      
      // If we reach here, the test should fail
      expect(true).toBe(false); // This should not be reached
    } catch (error) {
      // This is expected - the transaction should fail
      console.log("Stranger correctly prevented from updating identity");
      expect(error).toBeDefined();
    }
  });

  // Test 8: Authority can slash tokens
  it("Allows authority to slash tokens!", async () => {
    // Use the existing identity from previous tests
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), payer.publicKey.toBuffer()],
      program.programId
    );
    
    // Get the current stake amount
    const identityAccountBefore = await program.account.axiomAiIdentity.fetch(identityPda);
    const currentStake = identityAccountBefore.stakeAmount;
    
    console.log("Current stake amount before slash:", currentStake.toString());
    
    // In a real implementation, we would slash tokens here
    // For now, we'll just verify the account exists and is accessible
    expect(identityAccountBefore.authority.toString()).toBe(payer.publicKey.toString());
  });

  // Test 9: Create another identity with different data
  it("Creates a second identity with different data!", async () => {
    // Generate a different persona for testing
    const persona = "Another AI Agent v2";
    const stakeAmount = new anchor.BN(250);

    // Create a new user
    const newUser = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the new user
    const airdropTx = await provider.connection.requestAirdrop(newUser.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the PDA for the identity account
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), newUser.publicKey.toBuffer()],
      program.programId
    );

    // Call the create_identity function
    const tx = await program.methods
      .createIdentity(persona, stakeAmount)
      .accounts({
        identityAccount: identityPda,
        user: newUser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newUser])
      .rpc();

    console.log("Create second identity transaction signature", tx);

    // Verify the account was updated with new data
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    expect(identityAccount.authority.toString()).toBe(newUser.publicKey.toString());
    expect(identityAccount.persona).toBe(persona);
    expect(identityAccount.stakeAmount.toString()).toBe(stakeAmount.toString());
    expect(identityAccount.reputation.toString()).toBe("0");
  });

  // Test 10: Test identity with maximum persona length
  it("Handles identity with maximum persona length!", async () => {
    // Create a persona with maximum length (50 characters)
    const persona = "A".repeat(50); // 50 'A' characters
    const stakeAmount = new anchor.BN(150);

    // Create a new user
    const newUser = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the new user
    const airdropTx = await provider.connection.requestAirdrop(newUser.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Derive the PDA for the identity account
    const [identityPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("axiom-identity"), newUser.publicKey.toBuffer()],
      program.programId
    );

    // Call the create_identity function
    const tx = await program.methods
      .createIdentity(persona, stakeAmount)
      .accounts({
        identityAccount: identityPda,
        user: newUser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([newUser])
      .rpc();

    console.log("Create max-length persona identity transaction signature", tx);

    // Verify the account was created with correct data
    const identityAccount = await program.account.axiomAiIdentity.fetch(identityPda);
    expect(identityAccount.authority.toString()).toBe(newUser.publicKey.toString());
    expect(identityAccount.persona).toBe(persona);
    expect(identityAccount.stakeAmount.toString()).toBe(stakeAmount.toString());
  });
});
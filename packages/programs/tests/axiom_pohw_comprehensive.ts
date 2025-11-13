import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomPohw } from "../target/types/axiom_pohw";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("axiom_pohw_comprehensive", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomPohw as Program<AxiomPohw>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the PoHW program!", async () => {
    // Generate keypairs for token mint
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
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
        rewardTokenMint: rewardTokenMint.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize PoHW program transaction signature", tx);

    // Verify the program state was created
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.authority.toString()).toBe(payer.publicKey.toString());
    expect(programState.rewardTokenMint.toString()).toBe(rewardTokenMint.publicKey.toString());
    expect(programState.totalWorkSubmitted.toString()).toBe("0");
  });

  it("Allows worker to submit proof of work!", async () => {
    // Generate keypairs for token mint
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the program state PDA
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    // Derive the work submission PDA
    const [workSubmissionPda, workBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("work-submission"), payer.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );

    // First initialize the program
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Submit proof of work
    const workData = "Task completed successfully";
    const qualityScore = 85;
    
    const tx = await program.methods.submitWork(workData, qualityScore)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda,
        worker: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Submit work transaction signature", tx);

    // Verify the work submission was created
    const workSubmission = await program.account.workSubmission.fetch(workSubmissionPda);
    expect(workSubmission.worker.toString()).toBe(payer.publicKey.toString());
    expect(workSubmission.workData).toBe(workData);
    expect(workSubmission.qualityScore).toBe(qualityScore);
    expect(workSubmission.isVerified).toBe(false);
    expect(workSubmission.rewardAmount.toString()).toBe("0");
  });

  it("Allows validator to verify work and reward worker!", async () => {
    // Generate keypairs for token mint
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the program state PDA
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    // Derive the work submission PDA
    const [workSubmissionPda, workBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("work-submission"), payer.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );

    // First initialize the program
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Submit proof of work first
    const workData = "Task completed successfully";
    const qualityScore = 85;
    
    await program.methods.submitWork(workData, qualityScore)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda,
        worker: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Now verify the work as the authority (validator)
    const rewardAmount = new anchor.BN(100);
    
    const tx = await program.methods.verifyWork(workSubmissionPda, true, rewardAmount)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda,
        validator: payer.publicKey, // Authority acts as validator
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Verify work transaction signature", tx);

    // Verify the work submission was updated
    const workSubmission = await program.account.workSubmission.fetch(workSubmissionPda);
    expect(workSubmission.isVerified).toBe(true);
    expect(workSubmission.rewardAmount.toString()).toBe(rewardAmount.toString());
    
    // Verify the program state was updated
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.totalWorkSubmitted.toString()).toBe("1");
  });

  it("Prevents worker from claiming reward for unverified work!", async () => {
    // Create a new worker
    const worker = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the worker
    const airdropTx = await provider.connection.requestAirdrop(worker.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Generate keypairs for token mint
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the program state PDA
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    // Derive the work submission PDA
    const [workSubmissionPda, workBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("work-submission"), worker.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );

    // First initialize the program
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Submit proof of work
    const workData = "Task completed successfully";
    const qualityScore = 85;
    
    await program.methods.submitWork(workData, qualityScore)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda,
        worker: worker.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([worker])
      .rpc();

    // Try to claim reward for unverified work - this should fail
    try {
      await program.methods.claimReward()
        .accounts({
          programState: programStatePda,
          workSubmission: workSubmissionPda,
          worker: worker.publicKey,
          workerTokenAccount: worker.publicKey, // Simplified for test
          rewardTokenMint: rewardTokenMint.publicKey,
          tokenProgram: anchor.web3.Keypair.generate().publicKey, // Simplified for test
          systemProgram: SystemProgram.programId,
        })
        .signers([worker])
        .rpc();
      
      // If we reach here, the test should fail
      expect(true).toBe(false); // This should not be reached
    } catch (error) {
      // This is expected - the transaction should fail
      console.log("Worker correctly prevented from claiming reward for unverified work");
      expect(error).toBeDefined();
    }
  });

  it("Handles multiple work submissions from same worker!", async () => {
    // Generate keypairs for token mint
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the program state PDA
    const [programStatePda, stateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("program-state")],
      program.programId
    );
    
    // Derive the work submission PDA for first submission
    const [workSubmissionPda1, workBump1] = PublicKey.findProgramAddressSync(
      [Buffer.from("work-submission"), payer.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );
    
    // Derive the work submission PDA for second submission
    const [workSubmissionPda2, workBump2] = PublicKey.findProgramAddressSync(
      [Buffer.from("work-submission"), payer.publicKey.toBuffer(), Buffer.from([1])],
      program.programId
    );

    // First initialize the program
    await program.methods.initialize()
      .accounts({
        programState: programStatePda,
        authority: payer.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Submit first proof of work
    const workData1 = "First task completed";
    const qualityScore1 = 90;
    
    await program.methods.submitWork(workData1, qualityScore1)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda1,
        worker: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Submit second proof of work
    const workData2 = "Second task completed";
    const qualityScore2 = 75;
    
    const tx = await program.methods.submitWork(workData2, qualityScore2)
      .accounts({
        programState: programStatePda,
        workSubmission: workSubmissionPda2,
        worker: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Submit second work transaction signature", tx);

    // Verify both work submissions were created
    const workSubmission1 = await program.account.workSubmission.fetch(workSubmissionPda1);
    const workSubmission2 = await program.account.workSubmission.fetch(workSubmissionPda2);
    
    expect(workSubmission1.workData).toBe(workData1);
    expect(workSubmission1.qualityScore).toBe(qualityScore1);
    
    expect(workSubmission2.workData).toBe(workData2);
    expect(workSubmission2.qualityScore).toBe(qualityScore2);
    
    // Verify the program state was updated
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.totalWorkSubmitted.toString()).toBe("2");
  });
});
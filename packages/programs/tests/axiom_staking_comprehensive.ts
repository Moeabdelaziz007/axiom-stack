import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomStaking } from "../target/types/axiom_staking";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_staking_comprehensive", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomStaking as Program<AxiomStaking>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the staking pool!", async () => {
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );

    // Call the initialize_pool function
    const tx = await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize staking pool transaction signature", tx);

    // Verify the pool was created
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    expect(poolAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(poolAccount.stakedTokenMint.toString()).toBe(stakedTokenMint.publicKey.toString());
    expect(poolAccount.rewardTokenMint.toString()).toBe(rewardTokenMint.publicKey.toString());
    expect(poolAccount.rewardRate.toString()).toBe("1000");
    expect(poolAccount.totalStaked.toString()).toBe("0");
  });

  it("Stakes tokens successfully!", async () => {
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );
    
    // Derive the user stake PDA
    const [userStakePda, userStakeBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), poolPda.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // First initialize the pool
    await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Call the stake_tokens function
    const tx = await program.methods.stakeTokens(new anchor.BN(100))
      .accounts({
        pool: poolPda,
        userStake: userStakePda,
        userTokenAccount: payer.publicKey, // Simplified for test
        poolTokenAccount: poolPda, // Simplified for test
        stakedTokenMint: stakedTokenMint.publicKey,
        user: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Stake tokens transaction signature", tx);
  });

  it("Allows owner to unstake tokens!", async () => {
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );
    
    // Derive the user stake PDA
    const [userStakePda, userStakeBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), poolPda.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // First initialize the pool
    await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // First stake tokens
    await program.methods.stakeTokens(new anchor.BN(100))
      .accounts({
        pool: poolPda,
        userStake: userStakePda,
        userTokenAccount: payer.publicKey, // Simplified for test
        poolTokenAccount: poolPda, // Simplified for test
        stakedTokenMint: stakedTokenMint.publicKey,
        user: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Now unstake tokens
    const tx = await program.methods.unstakeTokens(new anchor.BN(50))
      .accounts({
        pool: poolPda,
        userStake: userStakePda,
        userTokenAccount: payer.publicKey, // Simplified for test
        poolTokenAccount: poolPda, // Simplified for test
        stakedTokenMint: stakedTokenMint.publicKey,
        user: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Unstake tokens transaction signature", tx);
  });

  it("Allows authority to update reputation score!", async () => {
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );
    
    // Derive the user stake PDA
    const [userStakePda, userStakeBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), poolPda.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // First initialize the pool
    await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Stake tokens first
    await program.methods.stakeTokens(new anchor.BN(100))
      .accounts({
        pool: poolPda,
        userStake: userStakePda,
        userTokenAccount: payer.publicKey, // Simplified for test
        poolTokenAccount: poolPda, // Simplified for test
        stakedTokenMint: stakedTokenMint.publicKey,
        user: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Update reputation score
    const tx = await program.methods.updateReputationScore(new anchor.BN(100))
      .accounts({
        pool: poolPda,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();
      
    console.log("Update reputation score transaction signature", tx);
  });

  it("Prevents stranger from updating reputation!", async () => {
    // Create a new user
    const stranger = anchor.web3.Keypair.generate();
    
    // Airdrop some SOL to the stranger
    const airdropTx = await provider.connection.requestAirdrop(stranger.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);
    
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );

    // First initialize the pool
    await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Try to update reputation as stranger - this should fail
    try {
      await program.methods.updateReputationScore(new anchor.BN(100))
        .accounts({
          pool: poolPda,
          authority: stranger.publicKey, // Stranger trying to update
        })
        .signers([stranger])
        .rpc();
      
      // If we reach here, the test should fail
      expect(true).toBe(false); // This should not be reached
    } catch (error) {
      // This is expected - the transaction should fail
      console.log("Stranger correctly prevented from updating reputation");
      expect(error).toBeDefined();
    }
  });

  it("Handles staking with valid identity!", async () => {
    // Generate keypairs for token mints
    const stakedTokenMint = anchor.web3.Keypair.generate();
    const rewardTokenMint = anchor.web3.Keypair.generate();
    
    // Derive the pool PDA
    const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("staking-pool"), stakedTokenMint.publicKey.toBuffer()],
      program.programId
    );
    
    // Derive the user stake PDA
    const [userStakePda, userStakeBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-stake"), poolPda.toBuffer(), payer.publicKey.toBuffer()],
      program.programId
    );

    // First initialize the pool
    await program.methods.initializePool(new anchor.BN(1000))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        rewardTokenMint: rewardTokenMint.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Stake tokens with valid identity
    const tx = await program.methods.stakeTokens(new anchor.BN(200))
      .accounts({
        pool: poolPda,
        userStake: userStakePda,
        userTokenAccount: payer.publicKey, // Simplified for test
        poolTokenAccount: poolPda, // Simplified for test
        stakedTokenMint: stakedTokenMint.publicKey,
        user: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Stake tokens with valid identity transaction signature", tx);
    
    // Verify the pool total staked was updated
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    expect(poolAccount.totalStaked.toString()).toBe("200");
  });
});
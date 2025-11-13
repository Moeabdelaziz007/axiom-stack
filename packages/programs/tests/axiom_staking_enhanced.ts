import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomStaking } from "../target/types/axiom_staking";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_staking_enhanced", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomStaking as Program<AxiomStaking>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the staking pool with enhanced features!", async () => {
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
      
    console.log("Initialize enhanced staking pool transaction signature", tx);

    // Verify the pool was created
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    expect(poolAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(poolAccount.stakedTokenMint.toString()).toBe(stakedTokenMint.publicKey.toString());
    expect(poolAccount.rewardTokenMint.toString()).toBe(rewardTokenMint.publicKey.toString());
    expect(poolAccount.rewardRate.toString()).toBe("1000");
    expect(poolAccount.totalStaked.toString()).toBe("0");
    expect(poolAccount.totalEffectiveStaked.toString()).toBe("0");
  });

  it("Stakes tokens with reputation!", async () => {
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

    // Call the stake_with_reputation function
    const tx = await program.methods.stakeWithReputation(new anchor.BN(100), new anchor.BN(5000))
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
      
    console.log("Stake tokens with reputation transaction signature", tx);
    
    // Verify the stake was created with reputation
    const userStakeAccount = await program.account.userStake.fetch(userStakePda);
    expect(userStakeAccount.amount.toString()).toBe("100");
    expect(userStakeAccount.reputationScore.toString()).toBe("5000");
    expect(userStakeAccount.effectiveAmount.toNumber()).toBeGreaterThan(100); // Should be higher due to reputation multiplier
  });
  
  it("Updates reward rate!", async () => {
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

    // Call the update_reward_rate function
    const tx = await program.methods.updateRewardRate(new anchor.BN(2000))
      .accounts({
        pool: poolPda,
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();
      
    console.log("Update reward rate transaction signature", tx);
    
    // Verify the reward rate was updated
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    expect(poolAccount.rewardRate.toString()).toBe("2000");
  });
});
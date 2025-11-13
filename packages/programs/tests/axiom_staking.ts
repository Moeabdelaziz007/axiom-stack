import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomStaking } from "../target/types/axiom_staking";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_staking", () => {
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

  it("Stakes tokens!", async () => {
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
});
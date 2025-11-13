import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomStaking } from "../target/types/axiom_staking";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_staking_dynamic_apr", () => {
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

  it("Calculates dynamic APR based on SAS attestations!", async () => {
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

    // Call the calculate_dynamic_apr function with positive attestations
    const tx = await program.methods.calculateDynamicApr(new anchor.BN(5), new anchor.BN(2))
      .accounts({
        pool: poolPda,
        stakedTokenMint: stakedTokenMint.publicKey,
        attestationAuthority: payer.publicKey, // Simplified for test
        authority: payer.publicKey,
      })
      .signers([payer])
      .rpc();
      
    console.log("Calculate dynamic APR transaction signature", tx);
    
    // Verify the reward rate was updated based on attestations
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    // With 5 positive (+2.5%) and 2 negative (-2%) attestations, APR should be 10.5% (1050 basis points)
    // Reward rate should be 1050 * 100 = 105000
    expect(poolAccount.rewardRate.toString()).toBe("105000");
  });
});
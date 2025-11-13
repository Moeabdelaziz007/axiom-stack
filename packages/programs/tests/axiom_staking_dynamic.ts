import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { AxiomStakingDynamic } from '../target/types/axiom_staking_dynamic';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { 
  createMint, 
  createAssociatedTokenAccount, 
  mintTo, 
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

describe('axiom_staking_dynamic', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AxiomStakingDynamic as Program<AxiomStakingDynamic>;
  const authority = provider.wallet;

  // Pool PDA
  const [poolPda, poolBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("pool")],
    program.programId
  );

  // Token mints
  let stakedTokenMint: PublicKey;
  let rewardTokenMint: PublicKey;

  // Token accounts
  let poolStakedTokenAccount: PublicKey;
  let poolRewardTokenAccount: PublicKey;
  let userStakedTokenAccount: PublicKey;
  let userRewardTokenAccount: PublicKey;

  // User
  let user: Keypair;

  before(async () => {
    // Create test user
    user = Keypair.generate();
    
    // Airdrop some SOL to the user for testing
    const airdropTx = await provider.connection.requestAirdrop(user.publicKey, 1000000000);
    await provider.connection.confirmTransaction(airdropTx);

    // Create token mints
    stakedTokenMint = await createMint(
      provider.connection,
      (authority as any).payer,
      authority.publicKey,
      null,
      9
    );

    rewardTokenMint = await createMint(
      provider.connection,
      (authority as any).payer,
      authority.publicKey,
      null,
      9
    );

    // Create pool token accounts
    poolStakedTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      stakedTokenMint,
      poolPda
    );

    poolRewardTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      rewardTokenMint,
      poolPda
    );

    // Create user token accounts
    userStakedTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      stakedTokenMint,
      user.publicKey
    );

    userRewardTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      rewardTokenMint,
      user.publicKey
    );

    // Mint some tokens to the user
    await mintTo(
      provider.connection,
      (authority as any).payer,
      stakedTokenMint,
      userStakedTokenAccount,
      authority.publicKey,
      1000000000000
    );
  });

  it('Initializes the staking pool', async () => {
    // Initialize the pool
    const tx = await program.methods
      .initializePool(new anchor.BN(1000)) // 1000 rewards per second
      .accounts({
        authority: authority.publicKey,
        pool: poolPda,
        stakedTokenMint: stakedTokenMint,
        rewardMint: rewardTokenMint,
        poolTokenAccount: poolStakedTokenAccount,
        rewardTokenAccount: poolRewardTokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .rpc();

    console.log('Pool initialized with transaction:', tx);

    // Fetch the pool account
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    console.log('Pool account:', poolAccount);

    // Verify the pool was initialized correctly
    expect(poolAccount.authority.toString()).to.equal(authority.publicKey.toString());
    expect(poolAccount.stakedTokenMint.toString()).to.equal(stakedTokenMint.toString());
    expect(poolAccount.rewardMint.toString()).to.equal(rewardTokenMint.toString());
    expect(poolAccount.rewardPerSecond.toNumber()).to.equal(1000);
  });

  it('Stakes tokens without reputation', async () => {
    // Stake tokens
    const stakeAmount = new anchor.BN(1000000000); // 1 token (9 decimals)

    const tx = await program.methods
      .stakeTokens(stakeAmount)
      .accounts({
        user: user.publicKey,
        pool: poolPda,
        userStake: PublicKey.findProgramAddressSync(
          [Buffer.from("user_stake"), user.publicKey.toBuffer()],
          program.programId
        )[0],
        userTokenAccount: userStakedTokenAccount,
        poolTokenAccount: poolStakedTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log('Tokens staked with transaction:', tx);

    // Fetch the user stake account
    const [userStakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_stake"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const userStakeAccount = await program.account.userStake.fetch(userStakePda);
    console.log('User stake account:', userStakeAccount);

    // Verify the stake was recorded correctly
    expect(userStakeAccount.amount.toNumber()).to.equal(1000000000);
  });

  it('Stakes tokens with reputation', async () => {
    // For this test, we'll simulate the PoHW attestation account
    // In a real implementation, this would be the actual attestation account
    const [pohwAttestationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("po_hw_attestation"),
        poolPda.toBuffer(), // Using pool as schema for demo
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    // Create a mock attestation account for testing
    // In reality, this would be created by the PoHW program
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(pohwAttestationPda, 1000000000)
    );

    // Stake tokens with reputation
    const stakeAmount = new anchor.BN(1000000000); // 1 token (9 decimals)

    const tx = await program.methods
      .stakeTokensWithReputation(stakeAmount)
      .accounts({
        user: user.publicKey,
        pool: poolPda,
        userStake: PublicKey.findProgramAddressSync(
          [Buffer.from("user_stake"), user.publicKey.toBuffer()],
          program.programId
        )[0],
        pohwAttestation: pohwAttestationPda,
        userTokenAccount: userStakedTokenAccount,
        poolTokenAccount: poolStakedTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log('Tokens staked with reputation with transaction:', tx);

    // Fetch the user stake account
    const [userStakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_stake"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const userStakeAccount = await program.account.userStake.fetch(userStakePda);
    console.log('User stake account with reputation:', userStakeAccount);

    // Verify the stake was recorded correctly
    expect(userStakeAccount.amount.toNumber()).to.equal(2000000000); // 1 + 1 from previous test
    expect(userStakeAccount.reputationScore).to.be.greaterThan(0);
  });

  it('Unstakes tokens', async () => {
    // Unstake tokens
    const unstakeAmount = new anchor.BN(500000000); // 0.5 token

    const tx = await program.methods
      .unstakeTokens(unstakeAmount)
      .accounts({
        user: user.publicKey,
        pool: poolPda,
        userStake: PublicKey.findProgramAddressSync(
          [Buffer.from("user_stake"), user.publicKey.toBuffer()],
          program.programId
        )[0],
        userTokenAccount: userStakedTokenAccount,
        poolTokenAccount: poolStakedTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log('Tokens unstaked with transaction:', tx);

    // Fetch the user stake account
    const [userStakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_stake"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const userStakeAccount = await program.account.userStake.fetch(userStakePda);
    console.log('User stake account after unstaking:', userStakeAccount);

    // Verify the stake was reduced correctly
    expect(userStakeAccount.amount.toNumber()).to.equal(1500000000); // 2 - 0.5
  });

  it('Updates reward rate', async () => {
    // Update reward rate
    const newRate = new anchor.BN(2000); // 2000 rewards per second

    const tx = await program.methods
      .updateRewardRate(newRate)
      .accounts({
        authority: authority.publicKey,
        pool: poolPda,
      })
      .rpc();

    console.log('Reward rate updated with transaction:', tx);

    // Fetch the pool account
    const poolAccount = await program.account.stakingPool.fetch(poolPda);
    console.log('Pool account after rate update:', poolAccount);

    // Verify the rate was updated correctly
    expect(poolAccount.rewardPerSecond.toNumber()).to.equal(2000);
  });
});
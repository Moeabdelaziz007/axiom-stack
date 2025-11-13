import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomGovernance } from "../target/types/axiom_governance";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_governance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomGovernance as Program<AxiomGovernance>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the governance realm!", async () => {
    const realmName = "Axiom DAO Governance";

    // Derive the realm PDA
    const [realmPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("governance-realm"), Buffer.from(realmName)],
      program.programId
    );

    // Call the initialize_realm function
    const tx = await program.methods.initializeRealm(realmName)
      .accounts({
        realm: realmPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize governance realm transaction signature", tx);

    // Verify the realm was created
    const realmAccount = await program.account.governanceRealm.fetch(realmPda);
    expect(realmAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(realmAccount.name).toBe(realmName);
    expect(realmAccount.proposalCount.toString()).toBe("0");
  });

  it("Creates a governance proposal!", async () => {
    const realmName = "Axiom DAO Governance";
    const proposalTitle = "Increase Staking Rewards";
    const proposalDescription = "Proposal to increase staking rewards by 5% to attract more participants";
    const votingPeriod = new anchor.BN(86400); // 1 day in seconds

    // Derive the realm PDA
    const [realmPda, realmBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("governance-realm"), Buffer.from(realmName)],
      program.programId
    );

    // Derive the proposal PDA
    const [proposalPda, proposalBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("governance-proposal"), 
        realmPda.toBuffer(), 
        Buffer.from(proposalTitle),
        payer.publicKey.toBuffer()
      ],
      program.programId
    );

    // First initialize the realm
    await program.methods.initializeRealm(realmName)
      .accounts({
        realm: realmPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Call the create_proposal function
    const tx = await program.methods.createProposal(proposalTitle, proposalDescription, votingPeriod)
      .accounts({
        proposal: proposalPda,
        realm: realmPda,
        proposer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Create proposal transaction signature", tx);

    // Verify the proposal was created
    const proposalAccount = await program.account.governanceProposal.fetch(proposalPda);
    expect(proposalAccount.realm.toString()).toBe(realmPda.toString());
    expect(proposalAccount.proposer.toString()).toBe(payer.publicKey.toString());
    expect(proposalAccount.title).toBe(proposalTitle);
    expect(proposalAccount.description).toBe(proposalDescription);
    expect(proposalAccount.yesVotes.toString()).toBe("0");
    expect(proposalAccount.noVotes.toString()).toBe("0");
    expect(proposalAccount.abstainVotes.toString()).toBe("0");
    expect(proposalAccount.totalVotes.toString()).toBe("0");
    expect(proposalAccount.status).toBe({ active: {} });
  });
});import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomGovernance } from "../target/types/axiom_governance";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_governance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomGovernance as Program<AxiomGovernance>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the governance realm!", async () => {
    const realmName = "Axiom DAO Governance";

    // Derive the realm PDA
    const [realmPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("governance-realm"), Buffer.from(realmName)],
      program.programId
    );

    // Call the initialize_realm function
    const tx = await program.methods.initializeRealm(realmName)
      .accounts({
        realm: realmPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize governance realm transaction signature", tx);

    // Verify the realm was created
    const realmAccount = await program.account.governanceRealm.fetch(realmPda);
    expect(realmAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(realmAccount.name).toBe(realmName);
    expect(realmAccount.proposalCount.toString()).toBe("0");
  });

  it("Creates a governance proposal!", async () => {
    const realmName = "Axiom DAO Governance";
    const proposalTitle = "Increase Staking Rewards";
    const proposalDescription = "Proposal to increase staking rewards by 5% to attract more participants";
    const votingPeriod = new anchor.BN(86400); // 1 day in seconds

    // Derive the realm PDA
    const [realmPda, realmBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("governance-realm"), Buffer.from(realmName)],
      program.programId
    );

    // Derive the proposal PDA
    const [proposalPda, proposalBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("governance-proposal"), 
        realmPda.toBuffer(), 
        Buffer.from(proposalTitle),
        payer.publicKey.toBuffer()
      ],
      program.programId
    );

    // First initialize the realm
    await program.methods.initializeRealm(realmName)
      .accounts({
        realm: realmPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Call the create_proposal function
    const tx = await program.methods.createProposal(proposalTitle, proposalDescription, votingPeriod)
      .accounts({
        proposal: proposalPda,
        realm: realmPda,
        proposer: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Create proposal transaction signature", tx);

    // Verify the proposal was created
    const proposalAccount = await program.account.governanceProposal.fetch(proposalPda);
    expect(proposalAccount.realm.toString()).toBe(realmPda.toString());
    expect(proposalAccount.proposer.toString()).toBe(payer.publicKey.toString());
    expect(proposalAccount.title).toBe(proposalTitle);
    expect(proposalAccount.description).toBe(proposalDescription);
    expect(proposalAccount.yesVotes.toString()).toBe("0");
    expect(proposalAccount.noVotes.toString()).toBe("0");
    expect(proposalAccount.abstainVotes.toString()).toBe("0");
    expect(proposalAccount.totalVotes.toString()).toBe("0");
    expect(proposalAccount.status).toBe({ active: {} });
  });
});
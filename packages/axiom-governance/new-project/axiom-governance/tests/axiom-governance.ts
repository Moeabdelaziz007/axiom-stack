import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomGovernance } from "../target/types/axiom_governance";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("axiom-governance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomGovernance as Program<AxiomGovernance>;
  const provider = anchor.getProvider();
  const connection = provider.connection;

  // Generate a new keypair for the proposal
  const proposalKeypair = Keypair.generate();
  const voterKeypair = Keypair.generate();

  it("Creates a new proposal", async () => {
    // Add your test here.
    const title = "Test Proposal";
    const description = "This is a test proposal for the Axiom Governance system";
    const votingDuration = new anchor.BN(86400); // 1 day in seconds

    const tx = await program.methods
      .createProposal(title, description, votingDuration)
      .accounts({
        proposal: proposalKeypair.publicKey,
        proposer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([proposalKeypair])
      .rpc();

    console.log("Create proposal transaction signature", tx);

    // Fetch the proposal account
    const proposalAccount = await program.account.proposal.fetch(
      proposalKeypair.publicKey
    );

    // Verify the proposal was created correctly
    assert.equal(proposalAccount.proposer.toBase58(), provider.wallet.publicKey.toBase58());
    assert.equal(proposalAccount.title, title);
    assert.equal(proposalAccount.description, description);
    assert.equal(proposalAccount.status.name, "Draft");
    assert.equal(proposalAccount.votesFor.toNumber(), 0);
    assert.equal(proposalAccount.votesAgainst.toNumber(), 0);
  });

  it("Starts voting for a proposal", async () => {
    const tx = await program.methods
      .startVoting()
      .accounts({
        proposal: proposalKeypair.publicKey,
        proposer: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Start voting transaction signature", tx);

    // Fetch the proposal account
    const proposalAccount = await program.account.proposal.fetch(
      proposalKeypair.publicKey
    );

    // Verify the voting has started
    assert.equal(proposalAccount.status.name, "Voting");
  });

  it("Submits a vote for a proposal", async () => {
    // Generate a new keypair for the vote record
    const voteRecordKeypair = Keypair.generate();
    
    const tx = await program.methods
      .submitVote({ yes: {} }, new anchor.BN(100))
      .accounts({
        proposal: proposalKeypair.publicKey,
        voteRecord: voteRecordKeypair.publicKey,
        voter: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voteRecordKeypair])
      .rpc();

    console.log("Submit vote transaction signature", tx);

    // Fetch the proposal account
    const proposalAccount = await program.account.proposal.fetch(
      proposalKeypair.publicKey
    );

    // Verify the vote was recorded
    assert.equal(proposalAccount.votesFor.toNumber(), 100);
    assert.equal(proposalAccount.votesAgainst.toNumber(), 0);
  });
});
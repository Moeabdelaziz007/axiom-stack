import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentSoulFactory } from "../target/types/agent_soul_factory";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, createMint, createAccount, mintTo, getAccount } from "@solana/spl-token";

describe("agent_soul_factory", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AgentSoulFactory as Program<AgentSoulFactory>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  // Generate a new keypair for the mint
  const mintKeypair = anchor.web3.Keypair.generate();

  it("Initializes the agent soul factory!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize("Axiom Soul", "SOUL", "https://axiom.id/metadata").rpc();
    console.log("Your transaction signature", tx);
  });

  it("Creates a soul-bound token!", async () => {
    // Add your test here.
    const recipient = anchor.web3.Keypair.generate().publicKey;
    
    const [programAuthority, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("agent-soul-factory")],
      program.programId
    );
    
    const tx = await program.methods.createSoulBoundToken(new anchor.BN(1))
      .accounts({
        mint: mintKeypair.publicKey,
        programAuthority: programAuthority,
        recipient: recipient,
        payer: payer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Your transaction signature", tx);
  });
});
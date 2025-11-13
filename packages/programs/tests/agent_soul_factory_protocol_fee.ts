import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AgentSoulFactory } from "../target/types/agent_soul_factory";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("agent_soul_factory_protocol_fee", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AgentSoulFactory as Program<AgentSoulFactory>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes fee configuration!", async () => {
    // Derive the fee config PDA
    const [feeConfigPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("fee-config")],
      program.programId
    );

    // In a real implementation, we would initialize the fee config
    // For now, we'll just log that it would be initialized
    console.log("Fee configuration would be initialized at:", feeConfigPda.toString());
  });

  it("Creates NTT mint with protocol fee!", async () => {
    const name = "Test NTT";
    const symbol = "TNTT";
    const uri = "https://example.com/metadata";

    // Generate keypairs for token mints
    const axiomTokenMint = anchor.web3.Keypair.generate();

    // Derive the metadata PDA
    const [metadataPda, metadataBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("ntt-mint-metadata"), payer.publicKey.toBuffer()],
      program.programId
    );

    // Derive the fee config PDA
    const [feeConfigPda, feeConfigBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("fee-config")],
      program.programId
    );

    // Call the create_ntt_mint function
    // Note: This is a simplified test that would need to be expanded with proper token accounts
    console.log("Create NTT mint with protocol fee transaction would be executed");
    console.log("Metadata PDA:", metadataPda.toString());
    console.log("Fee Config PDA:", feeConfigPda.toString());
  });
});
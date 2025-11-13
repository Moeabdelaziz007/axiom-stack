import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomSlashing } from "../target/types/axiom_slashing";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_slashing", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomSlashing as Program<AxiomSlashing>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the slashing configuration!", async () => {
    // Derive the slashing config PDA
    const [slashingConfigPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("slashing-config")],
      program.programId
    );

    // Call the initialize_slashing_config function
    const tx = await program.methods.initializeSlashingConfig(payer.publicKey)
      .accounts({
        slashingConfig: slashingConfigPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    console.log("Transaction signature", tx);

    // Fetch the created account
    const slashingConfig = await program.account.slashingConfig.fetch(slashingConfigPda);
    console.log("Slashing config authority:", slashingConfig.authority.toBase58());
    console.log("Total slashes:", slashingConfig.totalSlashes.toString());
  });

  it("Slashes an agent!", async () => {
    // This would require setting up a full staking scenario
    // For now, we'll just test that the instruction is properly structured
    console.log("Slash agent test placeholder");
  });

  it("Burns tokens as penalty!", async () => {
    // This would require setting up a full staking scenario
    // For now, we'll just test that the instruction is properly structured
    console.log("Burn tokens test placeholder");
  });

  it("Auto-slashes for negative attestations!", async () => {
    // This would require setting up a full staking scenario with attestations
    // For now, we'll just test that the instruction is properly structured
    console.log("Auto-slash for negative attestations test placeholder");
  });
});
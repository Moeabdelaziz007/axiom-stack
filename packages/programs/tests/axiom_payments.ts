import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomPayments } from "../target/types/axiom_payments";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_payments", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomPayments as Program<AxiomPayments>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the payment router!", async () => {
    // Derive the payment router PDA
    const [paymentRouterPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("payment-router")],
      program.programId
    );

    // Call the initialize_payment_router function
    const tx = await program.methods.initializePaymentRouter()
      .accounts({
        paymentRouter: paymentRouterPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize payment router transaction signature", tx);

    // Verify the payment router was created
    const paymentRouterAccount = await program.account.paymentRouter.fetch(paymentRouterPda);
    expect(paymentRouterAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(paymentRouterAccount.totalPayments.toString()).toBe("0");
    expect(paymentRouterAccount.totalVolume.toString()).toBe("0");
  });

  it("Routes a payment!", async () => {
    // Generate keypairs for token mints
    const paymentTokenMint = anchor.web3.Keypair.generate();
    const recipient = anchor.web3.Keypair.generate();

    // Derive the payment router PDA
    const [paymentRouterPda, paymentRouterBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("payment-router")],
      program.programId
    );

    // Derive the payment record PDA
    const amount = 1000000; // 1 token (assuming 6 decimals)
    const timestamp = Math.floor(Date.now() / 1000);
    const [paymentRecordPda, paymentRecordBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment-record"), 
        paymentRouterPda.toBuffer(), 
        payer.publicKey.toBuffer(),
        recipient.publicKey.toBuffer(),
        new anchor.BN(amount).toArrayLike(Buffer, "le", 8),
        new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );

    // First initialize the payment router
    await program.methods.initializePaymentRouter()
      .accounts({
        paymentRouter: paymentRouterPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Call the route_payment function
    // Note: This is a simplified test that would need to be expanded with proper token accounts
    console.log("Route payment transaction would be executed");
    console.log("Payment record PDA:", paymentRecordPda.toString());
    console.log("Payment router PDA:", paymentRouterPda.toString());
  });
});import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AxiomPayments } from "../target/types/axiom_payments";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

describe("axiom_payments", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AxiomPayments as Program<AxiomPayments>;
  const provider = anchor.getProvider();
  const payer = (provider as any).wallet.payer;

  it("Initializes the payment router!", async () => {
    // Derive the payment router PDA
    const [paymentRouterPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("payment-router")],
      program.programId
    );

    // Call the initialize_payment_router function
    const tx = await program.methods.initializePaymentRouter()
      .accounts({
        paymentRouter: paymentRouterPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
      
    console.log("Initialize payment router transaction signature", tx);

    // Verify the payment router was created
    const paymentRouterAccount = await program.account.paymentRouter.fetch(paymentRouterPda);
    expect(paymentRouterAccount.authority.toString()).toBe(payer.publicKey.toString());
    expect(paymentRouterAccount.totalPayments.toString()).toBe("0");
    expect(paymentRouterAccount.totalVolume.toString()).toBe("0");
  });

  it("Routes a payment!", async () => {
    // Generate keypairs for token mints
    const paymentTokenMint = anchor.web3.Keypair.generate();
    const recipient = anchor.web3.Keypair.generate();

    // Derive the payment router PDA
    const [paymentRouterPda, paymentRouterBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("payment-router")],
      program.programId
    );

    // Derive the payment record PDA
    const amount = 1000000; // 1 token (assuming 6 decimals)
    const timestamp = Math.floor(Date.now() / 1000);
    const [paymentRecordPda, paymentRecordBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("payment-record"), 
        paymentRouterPda.toBuffer(), 
        payer.publicKey.toBuffer(),
        recipient.publicKey.toBuffer(),
        new anchor.BN(amount).toArrayLike(Buffer, "le", 8),
        new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );

    // First initialize the payment router
    await program.methods.initializePaymentRouter()
      .accounts({
        paymentRouter: paymentRouterPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Call the route_payment function
    // Note: This is a simplified test that would need to be expanded with proper token accounts
    console.log("Route payment transaction would be executed");
    console.log("Payment record PDA:", paymentRecordPda.toString());
    console.log("Payment router PDA:", paymentRouterPda.toString());
  });
});
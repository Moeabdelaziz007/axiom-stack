import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } from '@solana/web3.js';
import fs from 'fs';

async function testProgram() {
  try {
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Use the program ID from the .env file
    const programId = new PublicKey('CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
    
    // Load the payer keypair
    const keypairPath = '/Users/cryptojoker710/.config/solana/id.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    
    console.log('Testing program with correct instruction format...');
    
    // Derive the identity account PDA (for axiom_id program)
    const [identityPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("axiom-identity"), payerKeypair.publicKey.toBuffer()],
      programId
    );
    
    console.log(`Identity PDA: ${identityPDA.toBase58()}`);
    
    // Create instruction data for the create_identity function (instruction 0)
    // Parameters: persona: String, stake_amount: u64
    const persona = "Test Agent";
    const stakeAmount = 100n; // 100 tokens
    
    const instructionData = Buffer.concat([
      Buffer.from([0]), // Instruction index for create_identity
      Buffer.from(persona.padEnd(50, '\0').slice(0, 50)), // Persona (50 bytes max)
      Buffer.from(new Uint8Array(new BigUint64Array([stakeAmount]).buffer)).reverse() // Stake amount (8 bytes, little endian)
    ]);
    
    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: identityPDA,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: payerKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        }
      ],
      programId: programId,
      data: instructionData,
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    // Send and confirm the transaction
    console.log('Sending transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair]
    );
    
    console.log(`✅ Transaction successful with signature: ${signature}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testProgram();
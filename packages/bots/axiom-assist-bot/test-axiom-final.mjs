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
    
    console.log('Testing axiom_id_final program with correct instruction format...');
    
    // Use the correct PDA derivation for axiom_id_final
    const agentId = 'test-agent-001';
    const [agentPDA, bump] = await PublicKey.findProgramAddress(
      [Buffer.from("agent"), Buffer.from(agentId)],
      programId
    );
    
    console.log(`Agent PDA: ${agentPDA.toBase58()}`);
    
    // Create instruction data for the create_agent function (instruction 0)
    // Parameters: agent_id: String, initial_reputation: u64
    const initialReputation = 100n;
    
    const instructionData = Buffer.concat([
      Buffer.from([0]), // Instruction index for create_agent
      Buffer.from(agentId.padEnd(32, '\0').slice(0, 32)), // Agent ID (32 bytes max)
      Buffer.from(new Uint8Array(new BigUint64Array([initialReputation]).buffer)).reverse() // Initial reputation (8 bytes, little endian)
    ]);
    
    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: agentPDA,
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
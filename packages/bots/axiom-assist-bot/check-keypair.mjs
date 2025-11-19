import { Keypair } from '@solana/web3.js';
import fs from 'fs';

// Read the keypair file
const keypairData = JSON.parse(fs.readFileSync('/Users/cryptojoker710/Desktop/Axiom ID/axiom_id_final/target/deploy/axiom_id_final-keypair.json', 'utf8'));
const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));

console.log('Program ID from keypair:', keypair.publicKey.toBase58());
console.log('Expected program ID:', 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
console.log('Match:', keypair.publicKey.toBase58() === 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
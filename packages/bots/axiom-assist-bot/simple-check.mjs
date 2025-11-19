import { Connection, PublicKey } from '@solana/web3.js';

async function checkProgram() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Check the program ID from the .env file
  const programId = new PublicKey('CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
  
  try {
    const accountInfo = await connection.getAccountInfo(programId);
    console.log('Program account info:', accountInfo);
    
    if (accountInfo) {
      console.log('Program is deployed');
      console.log('Executable:', accountInfo.executable);
      console.log('Owner:', accountInfo.owner.toBase58());
    } else {
      console.log('Program is not deployed');
    }
  } catch (error) {
    console.error('Error checking program:', error.message);
  }
}

checkProgram();
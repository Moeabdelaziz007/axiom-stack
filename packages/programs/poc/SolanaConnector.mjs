// SolanaConnector.mjs - Handles connection to Solana network
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';

class SolanaConnector {
  constructor() {
    // Initialize connection to Solana testnet
    this.connection = new Connection("https://api.testnet.solana.com", "confirmed");
    
    // Initialize provider (will be set when we have a wallet)
    this.provider = null;
    
    // Will store loaded programs
    this.programs = new Map();
  }

  /**
   * Initialize provider with wallet
   * @param {string|Keypair} wallet - Wallet keypair or path to keypair file
   * @returns {AnchorProvider} Initialized provider
   */
  async initializeProvider(wallet) {
    let keypair;
    
    if (typeof wallet === 'string') {
      // If wallet is a string, treat it as a path to keypair file
      if (fs.existsSync(wallet)) {
        const keypairData = JSON.parse(fs.readFileSync(wallet, 'utf-8'));
        keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
      } else {
        throw new Error(`Wallet file not found: ${wallet}`);
      }
    } else if (wallet instanceof Keypair) {
      // If wallet is already a Keypair, use it directly
      keypair = wallet;
    } else {
      throw new Error('Invalid wallet parameter. Must be a Keypair or path to keypair file.');
    }
    
    // Create provider
    this.provider = new AnchorProvider(this.connection, {
      publicKey: keypair.publicKey,
      signTransaction: () => Promise.reject('Not implemented'),
      signAllTransactions: () => Promise.reject('Not implemented')
    }, {
      preflightCommitment: "confirmed",
      commitment: "confirmed"
    });
    
    // Set provider globally for Anchor
    web3.setProvider(this.provider);
    
    return this.provider;
  }

  /**
   * Load a program by IDL and program ID
   * @param {string} idlPath - Path to the IDL file
   * @param {string} programId - Program ID as string
   * @returns {Program} Loaded program
   */
  async loadProgram(idlPath, programId) {
    // Check if program is already loaded
    if (this.programs.has(programId)) {
      return this.programs.get(programId);
    }
    
    // Read IDL file
    if (!fs.existsSync(idlPath)) {
      throw new Error(`IDL file not found: ${idlPath}`);
    }
    
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
    
    // Create program instance
    const program = new Program(idl, new PublicKey(programId), this.provider);
    
    // Store program for future use
    this.programs.set(programId, program);
    
    return program;
  }

  /**
   * Get connection status
   * @returns {Object} Connection status information
   */
  async getConnectionStatus() {
    try {
      const version = await this.connection.getVersion();
      const slot = await this.connection.getSlot();
      const balance = this.provider ? await this.connection.getBalance(this.provider.wallet.publicKey) : 0;
      
      return {
        connected: true,
        version: version['solana-core'],
        slot: slot,
        balance: balance,
        endpoint: this.connection.rpcEndpoint
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Get program information
   * @param {string} programId - Program ID
   * @returns {Object} Program information
   */
  async getProgramInfo(programId) {
    try {
      const programAccount = await this.connection.getAccountInfo(new PublicKey(programId));
      
      return {
        exists: !!programAccount,
        programId: programId,
        executable: programAccount ? programAccount.executable : false,
        dataSize: programAccount ? programAccount.data.length : 0
      };
    } catch (error) {
      return {
        exists: false,
        programId: programId,
        error: error.message
      };
    }
  }

  /**
   * Request Airdrop for testing
   * @param {PublicKey} publicKey - Public key to receive airdrop
   * @param {number} amount - Amount in SOL (default 1 SOL)
   * @returns {string} Transaction signature
   */
  async requestAirdrop(publicKey, amount = 1) {
    try {
      const signature = await this.connection.requestAirdrop(publicKey, amount * web3.LAMPORTS_PER_SOL);
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      throw new Error(`Airdrop failed: ${error.message}`);
    }
  }
}

export default SolanaConnector;
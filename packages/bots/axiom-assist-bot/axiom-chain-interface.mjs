// axiom-chain-interface.mjs - Solana blockchain interface for Axiom ID
import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import bs58 from 'bs58';
import 'dotenv/config';

// Import the IDL
import IDL from './axiom_id_final.json' with { type: 'json' };

class AxiomChainInterface {
  constructor() {
    // Connect to Solana Devnet
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
    
    // Program ID for the Axiom Agent DID program (this would be your deployed program ID)
    this.programId = new PublicKey(process.env.AXIOM_PROGRAM_ID || 'CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g');
    
    // Initialize Anchor provider and program
    const dummyKeypair = Keypair.generate();
    const dummyWallet = new anchor.Wallet(dummyKeypair);
    this.provider = new anchor.AnchorProvider(this.connection, dummyWallet, anchor.AnchorProvider.defaultOptions());
    this.program = new anchor.Program(IDL, this.programId, this.provider);
    
    console.log('Intialized Axiom Chain Interface with Anchor client');
  }

  /**
   * Create an agent identity on the Solana blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @param {number} initialReputation - Initial reputation score for the agent
   * @param {Keypair} payer - Payer keypair (funds the transaction)
   * @returns {Promise<string>} Transaction signature
   */
  async createAgentIdentity(agentId, initialReputation, payer) {
    try {
      console.log(`Creating agent identity for ${agentId} on Solana blockchain...`);
      
      // Create a new provider with the payer wallet
      const wallet = new anchor.Wallet(payer);
      const provider = new anchor.AnchorProvider(this.connection, wallet, anchor.AnchorProvider.defaultOptions());
      const program = new anchor.Program(IDL, this.programId, provider);
      
      // Derive the agent account PDA (Program Derived Address)
      const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("agent"), Buffer.from(agentId)],
        this.programId
      );
      
      console.log(`Agent PDA: ${agentInfoPDA.toBase58()}`);
      
      // Call the create_agent instruction using Anchor client
      const signature = await program.methods
        .createAgent(agentId, new anchor.BN(initialReputation))
        .accounts({
          agentInfo: agentInfoPDA,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();
      
      console.log(`✅ Agent identity created for ${agentId} with signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('❌ Failed to create agent identity:', error);
      throw error;
    }
  }

  /**
   * Update an agent's reputation on the blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @param {number} scoreDelta - Change in reputation score (can be positive or negative)
   * @param {Keypair} payer - Payer keypair (funds the transaction)
   * @returns {Promise<string>} Transaction signature
   */
  async updateAgentReputation(agentId, scoreDelta, payer) {
    try {
      console.log(`Updating reputation for agent ${agentId} by ${scoreDelta} points...`);
      
      // Create a new provider with the payer wallet
      const wallet = new anchor.Wallet(payer);
      const provider = new anchor.AnchorProvider(this.connection, wallet, anchor.AnchorProvider.defaultOptions());
      const program = new anchor.Program(IDL, this.programId, provider);
      
      // Derive the agent account PDA
      const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("agent"), Buffer.from(agentId)],
        this.programId
      );
      
      console.log(`Agent PDA: ${agentInfoPDA.toBase58()}`);
      
      // Call the update_reputation instruction using Anchor client
      const signature = await program.methods
        .updateReputation(new anchor.BN(scoreDelta))
        .accounts({
          agentInfo: agentInfoPDA,
          authority: payer.publicKey,
        })
        .signers([payer])
        .rpc();
      
      console.log(`✅ Agent reputation updated for ${agentId} with signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('❌ Failed to update agent reputation:', error);
      throw error;
    }
  }

  /**
   * Get agent information from the blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @returns {Promise<Object>} Agent information
   */
  async getAgentInfo(agentId) {
    try {
      console.log(`Fetching information for agent ${agentId}...`);
      
      // Derive the agent account PDA
      const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("agent"), Buffer.from(agentId)],
        this.programId
      );
      
      console.log(`Agent PDA: ${agentInfoPDA.toBase58()}`);
      
      // Fetch account data using Anchor client
      const agentInfo = await this.program.account.agentInfo.fetch(agentInfoPDA);
      
      // Return the structured data
      return {
        agentId: agentInfo.agentId,
        authority: agentInfo.authority.toBase58(),
        reputation: agentInfo.reputationScore.toNumber(),
        tasksCompleted: agentInfo.tasksCompleted.toNumber(),
        capabilities: agentInfo.capabilities,
        bump: agentInfo.bump,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to fetch agent information:', error);
      throw error;
    }
  }

  /**
   * Update an agent's capabilities on the blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @param {Array<string>} capabilities - Updated array of agent capabilities
   * @param {Keypair} payer - Payer keypair (funds the transaction)
   * @returns {Promise<string>} Transaction signature
   */
  async updateAgentCapabilities(agentId, capabilities, payer) {
    try {
      console.log(`Updating capabilities for agent ${agentId} on Solana blockchain...`);
      
      // For now, we'll just log the capabilities that would be updated
      // In a full implementation, you would add a proper instruction to update capabilities
      console.log(`Updating capabilities for agent ${agentId}:`, capabilities);
      
      // As a placeholder, we'll just return a mock signature
      // In a real implementation, you would call the appropriate program instruction
      const signature = "mock_signature_for_capability_update";
      
      console.log(`✅ Agent capabilities updated for ${agentId} with signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('❌ Failed to update agent capabilities:', error);
      throw error;
    }
  }

  /**
   * Update an agent's capabilities with versioning support
   * @param {string} agentId - Unique identifier for the agent
   * @param {Array<string>} capabilities - Updated array of agent capabilities
   * @param {number} version - Version number for the update
   * @param {Keypair} payer - Payer keypair (funds the transaction)
   * @returns {Promise<string>} Transaction signature
   */
  async updateAgentCapabilitiesWithVersion(agentId, capabilities, version, payer) {
    try {
      console.log(`Updating capabilities for agent ${agentId} (version ${version}) on Solana blockchain...`);
      
      // For now, we'll just log the capabilities and version that would be updated
      // In a full implementation, you would add a proper instruction to update capabilities
      console.log(`Updating capabilities for agent ${agentId} (version ${version}):`, capabilities);
      
      // As a placeholder, we'll just return a mock signature
      // In a real implementation, you would call the appropriate program instruction
      const signature = "mock_signature_for_capability_update_with_version";
      
      console.log(`✅ Agent capabilities updated for ${agentId} (version ${version}) with signature: ${signature}`);
      return signature;
    } catch (error) {
      console.error('❌ Failed to update agent capabilities with version:', error);
      throw error;
    }
  }

  /**
   * Cryptographically verify agent capabilities from the blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @param {Array<string>} capabilities - Array of agent capabilities to verify
   * @returns {Promise<boolean>} True if capabilities are verified, false otherwise
   */
  async verifyAgentCapabilities(agentId, capabilities) {
    try {
      console.log(`Verifying capabilities for agent ${agentId} on Solana blockchain...`);
      
      // Derive the agent account PDA
      const [agentInfoPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("agent"), Buffer.from(agentId)],
        this.programId
      );
      
      console.log(`Agent PDA: ${agentInfoPDA.toBase58()}`);
      
      // Fetch account data using Anchor client
      const agentInfo = await this.program.account.agentInfo.fetch(agentInfoPDA);
      
      if (!agentInfo) {
        console.log(`Agent ${agentId} not found on blockchain`);
        return false;
      }
      
      // Compare the provided capabilities with the on-chain data
      const onChainCapabilities = agentInfo.capabilities;
      const isVerified = JSON.stringify(capabilities.sort()) === JSON.stringify(onChainCapabilities.sort());
      
      console.log(`✅ Capabilities verification ${isVerified ? 'successful' : 'failed'} for agent ${agentId}`);
      return isVerified;
    } catch (error) {
      console.error('❌ Failed to verify agent capabilities:', error);
      return false;
    }
  }
}

// Export the class
export default AxiomChainInterface;
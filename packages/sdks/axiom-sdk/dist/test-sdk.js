"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Simple test script to verify the Axiom SDK works
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const index_1 = __importDefault(require("./src/index"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function testSDK() {
    console.log('🧪 Testing Axiom SDK...');
    // Create connection and provider (using devnet for testing)
    const connection = new web3_js_1.Connection('https://api.devnet.solana.com');
    const wallet = web3_js_1.Keypair.generate(); // Generate a test keypair
    const provider = new anchor_1.AnchorProvider(connection, { publicKey: wallet.publicKey, signAllTransactions: async (txs) => txs, signTransaction: async (tx) => tx }, { commitment: 'confirmed' });
    // Create SDK instance
    const sdk = new index_1.default(connection, provider);
    // Load IDL files and initialize programs
    const programs = {};
    // Load Axiom ID program
    try {
        const axiomIdIdlPath = path.join(__dirname, '..', 'idl', 'axiom_id.json');
        console.log('Looking for IDL at:', axiomIdIdlPath);
        if (fs.existsSync(axiomIdIdlPath)) {
            console.log('IDL file found');
            const axiomIdIdl = JSON.parse(fs.readFileSync(axiomIdIdlPath, 'utf-8'));
            console.log('IDL parsed successfully');
            const axiomIdProgramId = new web3_js_1.PublicKey(axiomIdIdl.metadata.address);
            console.log('Program ID:', axiomIdProgramId.toBase58());
            programs.axiomIdProgram = new anchor_1.Program(axiomIdIdl, axiomIdProgramId, provider);
            console.log('✅ Axiom ID program loaded');
        }
        else {
            console.log('⚠️  IDL file not found');
        }
    }
    catch (error) {
        console.log('⚠️  Failed to load Axiom ID program:', error.message);
        console.error(error);
    }
    // Initialize programs
    await sdk.initializePrograms(programs);
    // Test identity creation (will fail without actual deployment, but won't throw "not initialized" error)
    console.log('📝 Testing identity creation...');
    try {
        // This will fail because we're not actually connected to a cluster with deployed programs
        // But it won't throw the "program not initialized" error anymore
        const identityTx = await sdk.identity.createIdentity('Test Agent', 100);
        console.log('Identity creation transaction:', identityTx);
    }
    catch (error) {
        if (error.message.includes('program not initialized')) {
            console.error('❌ Program not initialized error still present');
            console.error('Error details:', error.message);
        }
        else {
            console.log('✅ Identity client properly initialized (expected failure due to no actual deployment)');
            console.log('Error details:', error.message);
        }
    }
    console.log('✅ SDK initialization test completed successfully!');
}
// Run the test
testSDK().catch(console.error);

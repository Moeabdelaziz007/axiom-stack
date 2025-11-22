import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const SOLANA_NETWORK = 'devnet';
export const TREASURY_WALLET = new PublicKey('11111111111111111111111111111111'); // Replace with actual treasury

export const createPaymentTransaction = async (
    connection: Connection,
    payer: PublicKey,
    amountSOL: number
): Promise<Transaction> => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: TREASURY_WALLET,
            lamports: amountSOL * LAMPORTS_PER_SOL,
        })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    return transaction;
};

export const estimateNetworkFee = async (connection: Connection): Promise<number> => {
    const { feeCalculator } = await connection.getRecentBlockhash();
    return (feeCalculator?.lamportsPerSignature || 5000) / LAMPORTS_PER_SOL;
};

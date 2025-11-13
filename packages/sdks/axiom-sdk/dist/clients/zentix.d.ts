import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
export declare class ZentixClient {
    private connection;
    private provider;
    constructor(connection: Connection, provider: AnchorProvider);
    initialize(): void;
    requestFlashLoan(amount: number, strategy: string): Promise<string>;
    executeStrategy(strategy: string): Promise<string>;
    getAccountBalance(account: PublicKey): Promise<number>;
}
//# sourceMappingURL=zentix.d.ts.map
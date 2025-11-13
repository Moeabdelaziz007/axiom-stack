"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZentixClient = void 0;
class ZentixClient {
    constructor(connection, provider) {
        this.connection = connection;
        this.provider = provider;
    }
    initialize() {
    }
    async requestFlashLoan(amount, strategy) {
        console.log(`Requesting flash loan of ${amount} with strategy: ${strategy}`);
        return "transaction_signature_mock";
    }
    async executeStrategy(strategy) {
        console.log(`Executing strategy: ${strategy}`);
        return "transaction_signature_mock";
    }
    async getAccountBalance(account) {
        return 5000;
    }
}
exports.ZentixClient = ZentixClient;
//# sourceMappingURL=zentix.js.map
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiomStackSDK = exports.PROGRAM_IDS = void 0;
const web3_js_1 = require("@solana/web3.js");
const identity_1 = require("./clients/identity");
const staking_1 = require("./clients/staking");
const pohw_1 = require("./clients/pohw");
const attestations_1 = require("./clients/attestations");
const zentix_1 = require("./clients/zentix");
exports.PROGRAM_IDS = {
    AXIOM_ID: new web3_js_1.PublicKey("5E7eosX9X34CWCeGpw2C4ua2JRYTZqZ8MsFkxj3y6T7C"),
    AXIOM_STAKING: new web3_js_1.PublicKey("3sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_ATTESTATIONS: new web3_js_1.PublicKey("4sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_POHW: new web3_js_1.PublicKey("9sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AGENT_SOUL_FACTORY: new web3_js_1.PublicKey("6sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_GOVERNANCE: new web3_js_1.PublicKey("8sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_PAYMENTS: new web3_js_1.PublicKey("7sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_SLASHING: new web3_js_1.PublicKey("AsKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_TOKEN: new web3_js_1.PublicKey("7sKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD"),
    AXIOM_STAKING_DYNAMIC: new web3_js_1.PublicKey("AsKxhfHdQgjWBuoztEYonKepba2zGcN2QtWowCmAfWzD")
};
class AxiomStackSDK {
    constructor(connection, provider) {
        this.connection = connection;
        this.provider = provider;
        this.identity = new identity_1.IdentityClient(connection, provider);
        this.staking = new staking_1.StakingClient(connection, provider);
        this.pohw = new pohw_1.PoHWClient(connection, provider);
        this.attestations = new attestations_1.AttestationClient(connection, provider);
        this.zentix = new zentix_1.ZentixClient(connection, provider);
    }
    async initializePrograms(programs) {
        if (programs.axiomIdProgram) {
            this.identity.initialize(programs.axiomIdProgram);
        }
        if (programs.axiomStakingProgram) {
            this.staking.initialize(programs.axiomStakingProgram);
        }
        if (programs.axiomPoHWProgram) {
            this.pohw.initialize(programs.axiomPoHWProgram);
        }
        if (programs.axiomAttestationsProgram) {
            this.attestations.initialize(programs.axiomAttestationsProgram);
        }
        if (programs.agentSoulFactoryProgram) {
        }
    }
}
exports.AxiomStackSDK = AxiomStackSDK;
__exportStar(require("./clients/identity"), exports);
__exportStar(require("./clients/staking"), exports);
__exportStar(require("./clients/pohw"), exports);
__exportStar(require("./clients/attestations"), exports);
__exportStar(require("./clients/zentix"), exports);
__exportStar(require("./types"), exports);
exports.default = AxiomStackSDK;
//# sourceMappingURL=index.js.map
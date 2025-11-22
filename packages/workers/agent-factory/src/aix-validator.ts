import { AgentConfig, GenesisRules } from '@axiom-stack/core';

/**
 * AIX Protocol Validator
 * Enforces the 5 Genesis Rules of the Axiom ID Constitution
 */
export class AIXValidator {

    /**
     * Validate an agent configuration against AIX standards
     * @param config The agent configuration to validate
     * @returns True if valid, throws error if invalid
     */
    static validate(config: AgentConfig): boolean {
        // Rule 1: Stop-Loss Configuration
        // "No agent may execute a transaction without a defined stop-loss config"
        if (!config.manifest.genesis_rules || config.manifest.genesis_rules.stop_loss_pct === undefined) {
            throw new Error("AIX Rule 1 Violation: Missing mandatory stop-loss configuration.");
        }

        // Validate Stop-Loss Range (0.01 - 0.50)
        if (config.manifest.genesis_rules.stop_loss_pct <= 0 || config.manifest.genesis_rules.stop_loss_pct > 0.5) {
            throw new Error("AIX Rule 1 Violation: Stop-loss must be between 1% and 50%.");
        }

        // Rule 2: Verifiable Knowledge
        // "All knowledge and intentions must be verifiable"
        // We check if the agent has a grounding source configured if it's a data agent
        if (config.manifest.type === 'DataAgent' && (!config.strategy || !config.strategy.groundingSource)) {
            throw new Error("AIX Rule 2 Violation: Data Agents must have a verifiable grounding source.");
        }

        // Rule 3: Strict Capabilities
        // "Agent must adhere strictly to defined capabilities"
        // This is enforced at runtime, but we validate the list here
        if (!config.manifest.capabilities || config.manifest.capabilities.length === 0) {
            throw new Error("AIX Rule 3 Violation: Agent must have at least one defined capability.");
        }

        // Rule 4: Compliance
        // "No agent may violate platform compliance policies"
        // Check for restricted keywords in persona
        const restrictedKeywords = ['pump', 'dump', 'ponzi', 'scam', 'rug'];
        const description = config.manifest.description?.toLowerCase() || '';
        const name = config.manifest.name?.toLowerCase() || '';

        if (restrictedKeywords.some(kw => description.includes(kw) || name.includes(kw))) {
            throw new Error("AIX Rule 4 Violation: Agent configuration contains restricted compliance keywords.");
        }

        // Rule 5: Standardized Data (PHI)
        // "Agents handling PHI must use standardized formats"
        if (config.manifest.type === 'HealthAgent') {
            if (!config.strategy || config.strategy.dataStandard !== 'FHIR') {
                throw new Error("AIX Rule 5 Violation: Health Agents must enforce FHIR data standard.");
            }
        }

        return true;
    }
}

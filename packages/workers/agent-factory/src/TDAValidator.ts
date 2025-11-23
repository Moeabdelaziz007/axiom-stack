// packages/workers/agent-factory/src/TDAValidator.ts
// Topological Data Analysis (TDA) Validator for Agent Security
// "The Immune System" - Detects behavioral anomalies using topological shapes

export interface AgentAction {
    skillId: string;
    timestamp: number;
    features: number[]; // Normalized features: [latency, cost, risk_score, resource_usage]
}

export class TDAValidator {
    private BASELINE_TOPOLOGY: Set<string>;
    private ANOMALY_THRESHOLD = 0.8;

    constructor() {
        // Define a baseline of expected "safe" skill transitions
        // In a real system, this would be learned from training data (Persistent Homology)
        this.BASELINE_TOPOLOGY = new Set([
            'multi_source_research',
            'seo_content_optimizer',
            'skill_composer',
            'social_media_campaign',
            'competitive_analysis'
        ]);
    }

    /**
     * Simulates Persistent Homology to analyze the "shape" of agent behavior
     * Detects "tears" or "voids" in the expected topological manifold
     * 
     * @param actionHistory - Sequence of recent actions
     * @returns Anomaly Score (0.0 - 1.0)
     */
    public async analyzeTopology(actionHistory: AgentAction[]): Promise<number> {
        if (actionHistory.length === 0) return 0.0;

        const lastAction = actionHistory[actionHistory.length - 1];
        const lastSkill = lastAction.skillId;

        // 1. CRITICAL TOPOLOGICAL ANOMALY: "The Unsupervised Trade"
        // A trading action creates a topological "hole" if not preceded by research/analysis
        // This is like a wormhole in the manifold - jumping from A to Z without passing through B
        if (lastSkill.includes('trade') || lastSkill.includes('arbitrage')) {
            const hasPriorResearch = actionHistory.some(a =>
                a.skillId.includes('research') ||
                a.skillId.includes('analysis') ||
                a.skillId.includes('sentiment')
            );

            if (!hasPriorResearch) {
                console.warn(`[TDA ALERT] 🚨 Topological Tear Detected: Unsupervised Trading Action (${lastSkill})`);
                return 0.95; // Critical Anomaly
            }
        }

        // 2. UNKNOWN MANIFOLD REGION: Executing unknown/untrusted skills
        // If the agent uses a skill not in the baseline topology (and not explicitly allowed),
        // it's venturing into undefined topological space.
        const isTrading = lastSkill.includes('trade') || lastSkill.includes('arbitrage');
        if (!this.BASELINE_TOPOLOGY.has(lastSkill) && !isTrading) {
            console.warn(`[TDA ALERT] ⚠️ Agent entered undefined topological region: ${lastSkill}`);
            return 0.6; // Moderate Anomaly
        }

        // 3. FEATURE SPACE DISTORTION: Numerical anomalies
        // Simulating TDA on the feature vectors (e.g., using Betti numbers)
        // Here we use a simplified heuristic: unexpected spikes in features
        const featureAnomaly = lastAction.features.reduce((score, val, idx) => {
            // Feature 0: Latency (if > 0.9 normalized, it's a spike)
            // Feature 2: Risk Score (if > 0.8, it's risky)
            if (val > 0.9) return score + 0.2;
            return score;
        }, 0);

        // Combine topological and feature anomalies
        const totalScore = Math.min(1.0, featureAnomaly + 0.1);

        return totalScore;
    }

    /**
     * Determines if the agent should be frozen based on the anomaly score
     */
    public shouldFreeze(anomalyScore: number): boolean {
        return anomalyScore > this.ANOMALY_THRESHOLD;
    }

    /**
     * Get a human-readable status for the badge
     */
    public getStatus(anomalyScore: number): 'SAFE' | 'WARNING' | 'FROZEN' {
        if (anomalyScore > this.ANOMALY_THRESHOLD) return 'FROZEN';
        if (anomalyScore > 0.3) return 'WARNING';
        return 'SAFE';
    }
}

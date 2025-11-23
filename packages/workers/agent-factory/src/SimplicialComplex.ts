// packages/workers/agent-factory/src/SimplicialComplex.ts
// The Mathematical Brain of Axiom ID
// Defines valid state geometries and calculates topological weights for routing

// Vertices (Nodes) that define a state in the mission space
export type TradingVertex =
    | 'INIT'
    | 'PRICE_CHECKED_A'
    | 'PRICE_CHECKED_B'
    | 'FUNDS_AVAILABLE'
    | 'RISK_ASSESSED'
    | 'ARBITRAGE_EXECUTED';

// Defines a Simplex (a valid, reachable state combination)
// A Set of vertices that can coexist without violating logical or safety constraints
type Simplex = Set<TradingVertex>;

// Defines the Topological Weight factors for Topology-Aware Routing (TAR)
export interface TopologicalWeights {
    LATENCY: number;        // Cost of time (ms) - Critical for HFT
    COMPLIANCE_SCORE: number; // 0.0 - 1.0 (Higher is better)
    COST: number;           // Monetary cost (Gas fees, API costs)
}

export class SimplicialComplex {
    // The core set of valid, non-collapsible states for the trading mission
    // This defines the "Safe Manifold" of the agent's operation
    private readonly VALID_COMPLEX: Simplex[] = [
        new Set<TradingVertex>(['INIT']), // Initial State
        new Set(['INIT', 'PRICE_CHECKED_A']),
        new Set(['INIT', 'PRICE_CHECKED_B']),
        new Set(['INIT', 'PRICE_CHECKED_A', 'PRICE_CHECKED_B']), // Prices checked from multiple sources
        new Set(['INIT', 'PRICE_CHECKED_A', 'PRICE_CHECKED_B', 'FUNDS_AVAILABLE']),
        new Set(['INIT', 'PRICE_CHECKED_A', 'PRICE_CHECKED_B', 'FUNDS_AVAILABLE', 'RISK_ASSESSED']), // Ready to Execute (The 4-Simplex)
        new Set(['INIT', 'PRICE_CHECKED_A', 'PRICE_CHECKED_B', 'FUNDS_AVAILABLE', 'RISK_ASSESSED', 'ARBITRAGE_EXECUTED']), // Final Success State (The 5-Simplex)
    ];

    /**
     * 1. Validates if the next state (Simplex) is geometrically sound (not a "tear").
     * 2. Calculates the Topological Weight for the transition (TAR-aware routing).
     * 
     * @param currentState - The last valid Simplex achieved.
     * @param newVertex - The new condition achieved by the latest Skill execution.
     * @param weights - The dynamic weight factors (latency, cost).
     * @returns {isValid: boolean, topologicalWeight: number}
     */
    public validateAndWeighTransition(
        currentState: Set<TradingVertex>,
        newVertex: TradingVertex,
        weights: TopologicalWeights
    ): { isValid: boolean, topologicalWeight: number } {
        // Construct the potential next state
        const nextState = new Set([...currentState, newVertex]);

        // A. SIMPLICIAL VALIDATION: Check if the new Simplex is geometrically sound

        // 1. Critical Invariant Check (The "Execution Cone")
        // In a directed complex, we must enforce dependencies that standard simplicial sets might miss
        if (newVertex === 'ARBITRAGE_EXECUTED' && !currentState.has('RISK_ASSESSED')) {
            console.error(`[SIMPLICIAL ALERT] 🛑 Topological Violation: Attempted 'ARBITRAGE_EXECUTED' without 'RISK_ASSESSED'.`);
            return { isValid: false, topologicalWeight: Infinity };
        }

        // 2. Standard Complex Inclusion
        // We check if `nextState` is a subset of any defined valid simplex in the complex.
        const isGeometricallyValid = this.VALID_COMPLEX.some(validSimplex =>
            Array.from(nextState).every(v => validSimplex.has(v))
        );

        if (!isGeometricallyValid) {
            console.error(`[SIMPLICIAL ALERT] 🛑 Invalid state geometry detected: [${Array.from(nextState).join(', ')}]`);
            return { isValid: false, topologicalWeight: Infinity };
        }

        // B. TOPOLOGICAL WEIGHT CALCULATION (Topology-Aware Routing Logic)
        // We calculate a "cost" for this transition. Lower is better.
        // Formula: Weight = (LATENCY * Factor) + (COST * Factor) + (1 / COMPLIANCE_SCORE)

        // Normalize inputs roughly
        const normLatency = Math.min(weights.LATENCY / 1000, 1); // Cap at 1s for normalization
        const normCost = Math.min(weights.COST, 1); // Cap at $1 for normalization

        const topologicalWeight =
            (normLatency * 0.4) +
            (normCost * 0.3) +
            (1 / Math.max(0.1, weights.COMPLIANCE_SCORE)) * 0.3;
        // Minimizing weight means high compliance, low latency, low cost.

        return { isValid: true, topologicalWeight };
    }

    /**
     * Helper to get the canonical Simplex representation (for state lookup).
     */
    public static canonicalize(simplex: Set<TradingVertex>): string {
        return Array.from(simplex).sort().join('_');
    }
}

/**
 * Computational Ledger - Information-Preserving Execution Engine
 * 
 * Based on Landauer's Principle: Energy is only dissipated when information is erased.
 * This ledger NEVER erases - it only appends transformations, enabling:
 * 1. Zero-entropy execution (theoretical)
 * 2. Instant rollback without re-computation
 * 3. Full audit trail of agent reasoning
 * 
 * "In reversible computing, we don't delete - we transform backwards." - Rolf Landauer
 */

import { Mission, ExecutionStep, SkillResult } from './types';

// --- STATE SNAPSHOT ---
export interface ComputeState {
    stepId: string;
    stepIndex: number;
    timestamp: number;

    // Input context
    inputEntropy: string; // Quantum seed or hash
    inputData: any;

    // Execution details
    skillId: string;
    parameters: any;

    // Output state
    outputState: SkillResult;

    // Thermodynamic metrics
    bitsErased: number; // For Landauer cost calculation
    energyCostMicrojoules: number; // Theoretical kT ln(2) per bit
    reversible: boolean; // Can this step be undone?
}

// --- CHECKPOINT METADATA ---
export interface Checkpoint {
    checkpointId: string;
    label: string;
    stateSnapshot: ComputeState;
    timestamp: number;
}

// --- LEDGER STATISTICS ---
export interface LedgerStats {
    totalSteps: number;
    reversibleSteps: number;
    totalBitsErased: number;
    totalEnergyUsedMicrojoules: number;
    landauerEfficiency: number; // 0-100% (100% = perfect reversibility)
    entropyWastePercent: number; // 0-100% (0% = ideal)
}

/**
 * ComputationalLedger - Append-Only Execution History
 * 
 * Design Principles:
 * 1. Append-Only: Never overwrite previous states
 * 2. Reversible: Enable instant rollback via state snapshots
 * 3. Thermodynamically Aware: Track Landauer cost of each operation
 */
export class ComputationalLedger {
    private history: ComputeState[] = [];
    private checkpoints: Map<string, Checkpoint> = new Map();

    // Physical constants
    private readonly BOLTZMANN_CONSTANT = 1.380649e-23; // J/K
    private readonly ROOM_TEMPERATURE = 300; // Kelvin
    private readonly LN_2 = Math.log(2);

    constructor() {
        console.log('🧬 ComputationalLedger initialized - Zero-Entropy mode activated');
    }

    /**
     * Add a computation step to the ledger (Append-Only)
     * @param state - The state snapshot after this step
     */
    addStep(state: ComputeState): void {
        // Calculate Landauer cost if bits were erased
        if (state.bitsErased > 0) {
            const landauerCost = this.calculateLandauerCost(state.bitsErased);
            state.energyCostMicrojoules = landauerCost;
            state.reversible = false;
        } else {
            state.energyCostMicrojoules = 0;
            state.reversible = true;
        }

        this.history.push(state);

        console.log(
            `📝 Step ${state.stepId} recorded | ` +
            `Reversible: ${state.reversible} | ` +
            `Energy: ${state.energyCostMicrojoules.toExponential(2)} μJ`
        );
    }

    /**
     * Create a checkpoint for later rollback
     * @param label - Human-readable checkpoint name
     */
    createCheckpoint(label: string): string {
        const checkpointId = `checkpoint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        if (this.history.length === 0) {
            console.warn('⚠️ Cannot create checkpoint - no steps in ledger');
            return checkpointId;
        }

        const latestState = this.history[this.history.length - 1];

        this.checkpoints.set(checkpointId, {
            checkpointId,
            label,
            stateSnapshot: { ...latestState },
            timestamp: Date.now()
        });

        console.log(`🔖 Checkpoint created: "${label}" (${checkpointId})`);
        return checkpointId;
    }

    /**
     * Rollback to a previous checkpoint (Zero Re-Computation Cost)
     * In true reversible computing, we would "uncompute" steps.
     * Here, we restore state instantly from the ledger.
     * 
     * @param checkpointId - ID of checkpoint to restore
     * @returns The restored state, or null if checkpoint not found
     */
    rollbackTo(checkpointId: string): ComputeState | null {
        const checkpoint = this.checkpoints.get(checkpointId);

        if (!checkpoint) {
            console.error(`❌ Checkpoint not found: ${checkpointId}`);
            return null;
        }

        console.log(`⏪ Rolling back to checkpoint: "${checkpoint.label}"`);
        console.log(`   ↳ Zero re-computation cost (state preserved in ledger)`);

        // In a physical reversible computer, we would run operations backward
        // Here, we return the snapshot directly (O(1) complexity)
        return checkpoint.stateSnapshot;
    }

    /**
     * Rollback to a specific step by stepId
     * @param stepId - The step to rollback to
     */
    rollbackToStep(stepId: string): ComputeState | null {
        const index = this.history.findIndex(s => s.stepId === stepId);

        if (index === -1) {
            console.error(`❌ Step not found: ${stepId}`);
            return null;
        }

        console.log(`⏪ Rolling back to step: ${stepId} (index ${index})`);
        return this.history[index];
    }

    /**
     * Calculate the Landauer limit energy cost for erasing N bits
     * E = N × kT ln(2)
     * 
     * @param bitsErased - Number of bits erased (information destroyed)
     * @returns Energy in microjoules
     */
    private calculateLandauerCost(bitsErased: number): number {
        // E = kT ln(2) per bit
        const energyPerBit = this.BOLTZMANN_CONSTANT * this.ROOM_TEMPERATURE * this.LN_2;
        const totalEnergyJoules = energyPerBit * bitsErased;

        // Convert to microjoules for readability
        return totalEnergyJoules * 1e6;
    }

    /**
     * Get ledger statistics and thermodynamic efficiency
     */
    getStats(): LedgerStats {
        const totalSteps = this.history.length;
        const reversibleSteps = this.history.filter(s => s.reversible).length;
        const totalBitsErased = this.history.reduce((sum, s) => sum + s.bitsErased, 0);
        const totalEnergy = this.history.reduce((sum, s) => sum + s.energyCostMicrojoules, 0);

        // Landauer Efficiency: % of operations that were reversible (no erasure)
        const landauerEfficiency = totalSteps > 0 ? (reversibleSteps / totalSteps) * 100 : 0;

        // Entropy Waste: % of operations that erased information
        const entropyWastePercent = 100 - landauerEfficiency;

        return {
            totalSteps,
            reversibleSteps,
            totalBitsErased,
            totalEnergyUsedMicrojoules: totalEnergy,
            landauerEfficiency,
            entropyWastePercent
        };
    }

    /**
     * Synthesize final result from ledger (without destroying history)
     */
    synthesize(): any {
        if (this.history.length === 0) {
            return { result: null, stats: this.getStats() };
        }

        const finalState = this.history[this.history.length - 1];
        const stats = this.getStats();

        console.log(`🧬 Synthesis complete:`);
        console.log(`   ↳ ${stats.totalSteps} steps executed`);
        console.log(`   ↳ ${stats.landauerEfficiency.toFixed(1)}% Landauer efficiency`);
        console.log(`   ↳ ${stats.entropyWastePercent.toFixed(1)}% entropy waste`);

        return {
            result: finalState.outputState,
            stats,
            history: this.history // Full provenance
        };
    }

    /**
     * Get the complete execution history (for debugging/audit)
     */
    getHistory(): ComputeState[] {
        return [...this.history]; // Return copy to preserve immutability
    }

    /**
     * Clear the ledger (WARNING: This violates reversibility!)
     * Only use for testing or when explicitly required
     */
    clear(): void {
        console.warn('⚠️ WARNING: Clearing ledger - reversibility lost!');
        this.history = [];
        this.checkpoints.clear();
    }
}

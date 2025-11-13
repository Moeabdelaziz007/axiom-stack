// AI-based Fraud Detection System for Axiom ID
// This system analyzes user interaction behavior in real-time to detect fraud indicators

export class FraudDetectionSystem {
    private fraudPatterns: Map<string, FraudPattern>;
    private userBehaviorCache: Map<string, UserBehaviorProfile>;
    private flaggedUsers: Set<string>;
    private confidenceThreshold: number;

    constructor(confidenceThreshold: number = 0.8) {
        this.fraudPatterns = new Map();
        this.userBehaviorCache = new Map();
        this.flaggedUsers = new Set();
        this.confidenceThreshold = confidenceThreshold;
        
        // Initialize known fraud patterns
        this.initializeFraudPatterns();
    }

    /**
     * Initialize known fraud patterns
     */
    private initializeFraudPatterns() {
        // Pattern 1: Bot-like swipe patterns
        this.fraudPatterns.set('bot_swipe_pattern', {
            name: 'Bot-like Swipe Pattern',
            description: 'Users swiping at consistent, machine-like intervals',
            indicators: [
                { type: 'swipe_timing', threshold: 800, tolerance: 50 }, // 800ms ±50ms per swipe
                { type: 'swipe_consistency', threshold: 0.95 } // 95% consistent timing
            ],
            weight: 0.3
        });

        // Pattern 2: Superhuman reading speed
        this.fraudPatterns.set('superhuman_reading', {
            name: 'Superhuman Reading Speed',
            description: 'Users completing long-text tasks faster than humanly possible',
            indicators: [
                { type: 'reading_speed', threshold: 1000, unit: 'wpm' }, // 1000 words per minute
                { type: 'task_completion_time', threshold: 5, unit: 'seconds' } // 5 seconds for long task
            ],
            weight: 0.25
        });

        // Pattern 3: Suspicious consensus behavior
        this.fraudPatterns.set('suspicious_consensus', {
            name: 'Suspicious Consensus Behavior',
            description: 'Users matching consensus 100% or 50% of the time',
            indicators: [
                { type: 'consensus_match', threshold: 1.0 }, // 100% match (copying)
                { type: 'consensus_match', threshold: 0.5 } // 50% match (random guessing)
            ],
            weight: 0.25
        });

        // Pattern 4: Rapid task completion
        this.fraudPatterns.set('rapid_completion', {
            name: 'Rapid Task Completion',
            description: 'Users completing tasks at impossible speeds',
            indicators: [
                { type: 'tasks_per_minute', threshold: 60 }, // 60 tasks per minute
                { type: 'average_task_time', threshold: 1, unit: 'second' } // 1 second per task
            ],
            weight: 0.2
        });
    }

    /**
     * Analyze user interaction behavior in real-time
     * @param userId User identifier
     * @param interactionData Interaction data to analyze
     * @returns Fraud analysis result
     */
    public async analyzeUserBehavior(userId: string, interactionData: UserInteractionData): Promise<FraudAnalysisResult> {
        // Get or create user behavior profile
        let userProfile = this.userBehaviorCache.get(userId);
        if (!userProfile) {
            userProfile = this.createUserBehaviorProfile(userId);
            this.userBehaviorCache.set(userId, userProfile);
        }

        // Update user profile with new interaction data
        this.updateUserBehaviorProfile(userProfile, interactionData);

        // Check for fraud patterns
        const fraudIndicators = this.detectFraudPatterns(userProfile, interactionData);
        
        // Calculate overall fraud confidence
        const fraudConfidence = this.calculateFraudConfidence(fraudIndicators);
        
        // Determine if user should be flagged
        const isFlagged = fraudConfidence >= this.confidenceThreshold;
        
        // Update flagged users set
        if (isFlagged) {
            this.flaggedUsers.add(userId);
        } else {
            this.flaggedUsers.delete(userId);
        }

        // Create analysis result
        const result: FraudAnalysisResult = {
            userId,
            fraudConfidence,
            isFlagged,
            fraudIndicators,
            recommendedAction: this.getRecommendedAction(fraudConfidence, fraudIndicators),
            timestamp: Date.now()
        };

        return result;
    }

    /**
     * Create a new user behavior profile
     * @param userId User identifier
     * @returns User behavior profile
     */
    private createUserBehaviorProfile(userId: string): UserBehaviorProfile {
        return {
            userId,
            swipeTimings: [],
            taskCompletionTimes: [],
            consensusMatches: [],
            totalTasks: 0,
            flaggedInteractions: 0,
            behaviorHistory: [],
            createdAt: Date.now()
        };
    }

    /**
     * Update user behavior profile with new interaction data
     * @param profile User behavior profile
     * @param interactionData New interaction data
     */
    private updateUserBehaviorProfile(profile: UserBehaviorProfile, interactionData: UserInteractionData) {
        // Update swipe timings
        if (interactionData.swipeTiming !== undefined) {
            profile.swipeTimings.push(interactionData.swipeTiming);
            // Keep only last 50 timings to prevent memory issues
            if (profile.swipeTimings.length > 50) {
                profile.swipeTimings.shift();
            }
        }

        // Update task completion times
        if (interactionData.taskCompletionTime !== undefined) {
            profile.taskCompletionTimes.push(interactionData.taskCompletionTime);
            // Keep only last 50 timings to prevent memory issues
            if (profile.taskCompletionTimes.length > 50) {
                profile.taskCompletionTimes.shift();
            }
        }

        // Update consensus matches
        if (interactionData.consensusMatch !== undefined) {
            profile.consensusMatches.push(interactionData.consensusMatch);
            // Keep only last 50 matches to prevent memory issues
            if (profile.consensusMatches.length > 50) {
                profile.consensusMatches.shift();
            }
        }

        // Update counters
        profile.totalTasks++;
        
        // Add to behavior history
        profile.behaviorHistory.push({
            interactionData,
            timestamp: Date.now()
        });
        
        // Keep only last 100 history items
        if (profile.behaviorHistory.length > 100) {
            profile.behaviorHistory.shift();
        }
    }

    /**
     * Detect fraud patterns in user behavior
     * @param profile User behavior profile
     * @param interactionData Current interaction data
     * @returns Array of detected fraud indicators
     */
    private detectFraudPatterns(profile: UserBehaviorProfile, interactionData: UserInteractionData): FraudIndicator[] {
        const fraudIndicators: FraudIndicator[] = [];

        // Check for bot-like swipe patterns
        if (interactionData.swipeTiming !== undefined) {
            const botPattern = this.fraudPatterns.get('bot_swipe_pattern');
            if (botPattern) {
                const timingConsistency = this.calculateTimingConsistency(profile.swipeTimings);
                if (timingConsistency >= botPattern.indicators[1].threshold) {
                    fraudIndicators.push({
                        pattern: botPattern.name,
                        confidence: timingConsistency,
                        description: `Consistent swipe timing detected (${timingConsistency * 100}% consistency)`,
                        severity: 'high'
                    });
                }
            }
        }

        // Check for superhuman reading speed
        if (interactionData.taskTextLength !== undefined && interactionData.taskCompletionTime !== undefined) {
            const readingSpeed = (interactionData.taskTextLength / 5) / (interactionData.taskCompletionTime / 60); // WPM
            const superhumanPattern = this.fraudPatterns.get('superhuman_reading');
            if (superhumanPattern && readingSpeed > superhumanPattern.indicators[0].threshold) {
                fraudIndicators.push({
                    pattern: superhumanPattern.name,
                    confidence: Math.min(1, readingSpeed / superhumanPattern.indicators[0].threshold),
                    description: `Superhuman reading speed detected (${readingSpeed.toFixed(0)} WPM)`,
                    severity: 'high'
                });
            }
        }

        // Check for suspicious consensus behavior
        if (interactionData.consensusMatch !== undefined) {
            const consensusPattern = this.fraudPatterns.get('suspicious_consensus');
            if (consensusPattern) {
                if (interactionData.consensusMatch === 1.0) {
                    fraudIndicators.push({
                        pattern: consensusPattern.name,
                        confidence: 1.0,
                        description: 'Perfect consensus match (100%) - possible copying',
                        severity: 'high'
                    });
                } else if (interactionData.consensusMatch === 0.5) {
                    fraudIndicators.push({
                        pattern: consensusPattern.name,
                        confidence: 0.8,
                        description: 'Random consensus match (50%) - possible guessing',
                        severity: 'medium'
                    });
                }
            }
        }

        // Check for rapid task completion
        if (interactionData.taskCompletionTime !== undefined) {
            const rapidPattern = this.fraudPatterns.get('rapid_completion');
            if (rapidPattern && interactionData.taskCompletionTime < rapidPattern.indicators[1].threshold) {
                fraudIndicators.push({
                    pattern: rapidPattern.name,
                    confidence: 1 - (interactionData.taskCompletionTime / rapidPattern.indicators[1].threshold),
                    description: `Extremely rapid task completion (${interactionData.taskCompletionTime}s)`,
                    severity: 'high'
                });
            }
        }

        return fraudIndicators;
    }

    /**
     * Calculate timing consistency for swipe patterns
     * @param timings Array of swipe timings
     * @returns Consistency score (0-1)
     */
    private calculateTimingConsistency(timings: number[]): number {
        if (timings.length < 5) return 0; // Not enough data

        // Calculate average timing
        const average = timings.reduce((sum, time) => sum + time, 0) / timings.length;
        
        // Calculate variance
        const variance = timings.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / timings.length;
        
        // Calculate standard deviation
        const stdDev = Math.sqrt(variance);
        
        // Consistency is inverse of coefficient of variation (stdDev/average)
        // Higher consistency = lower variation
        const coefficientOfVariation = stdDev / average;
        const consistency = 1 - Math.min(1, coefficientOfVariation);
        
        return Math.max(0, consistency);
    }

    /**
     * Calculate overall fraud confidence based on detected indicators
     * @param fraudIndicators Array of detected fraud indicators
     * @returns Overall fraud confidence (0-1)
     */
    private calculateFraudConfidence(fraudIndicators: FraudIndicator[]): number {
        if (fraudIndicators.length === 0) return 0;

        // Weighted average of fraud indicator confidences
        let totalWeightedConfidence = 0;
        let totalWeight = 0;

        for (const indicator of fraudIndicators) {
            // Severity multiplier
            let severityMultiplier = 1;
            if (indicator.severity === 'high') {
                severityMultiplier = 1.5;
            } else if (indicator.severity === 'medium') {
                severityMultiplier = 1.2;
            }

            totalWeightedConfidence += indicator.confidence * severityMultiplier;
            totalWeight += severityMultiplier;
        }

        return Math.min(1, totalWeightedConfidence / totalWeight);
    }

    /**
     * Get recommended action based on fraud confidence and indicators
     * @param fraudConfidence Overall fraud confidence
     * @param fraudIndicators Detected fraud indicators
     * @returns Recommended action
     */
    private getRecommendedAction(fraudConfidence: number, fraudIndicators: FraudIndicator[]): RecommendedAction {
        if (fraudConfidence >= 0.9) {
            return 'block'; // High confidence fraud - block user
        } else if (fraudConfidence >= 0.7) {
            return 'review'; // Medium confidence fraud - manual review
        } else if (fraudConfidence >= 0.5) {
            return 'flag'; // Low confidence fraud - flag for monitoring
        } else {
            return 'allow'; // No significant fraud detected
        }
    }

    /**
     * Get data weight for a user (used in reward calculation)
     * @param userId User identifier
     * @returns Data weight (0-1, where 0 means data is ignored)
     */
    public getUserDataWeight(userId: string): number {
        if (this.flaggedUsers.has(userId)) {
            // Flagged users get reduced data weight
            return 0.1; // 10% weight
        }
        return 1.0; // Normal weight
    }

    /**
     * Get validation rate for a user (percentage of tasks to validate)
     * @param userId User identifier
     * @returns Validation rate (0-1, where 1 means 100% validation)
     */
    public getUserValidationRate(userId: string): number {
        if (this.flaggedUsers.has(userId)) {
            // Flagged users get 100% validation
            return 1.0;
        }
        return 0.1; // Normal 10% validation rate
    }

    /**
     * Get fraud statistics
     * @returns Fraud statistics
     */
    public getFraudStatistics(): FraudStatistics {
        return {
            totalUsers: this.userBehaviorCache.size,
            flaggedUsers: this.flaggedUsers.size,
            fraudDetectionRate: this.flaggedUsers.size / Math.max(1, this.userBehaviorCache.size),
            patternsDetected: Array.from(this.fraudPatterns.values()).map(pattern => pattern.name)
        };
    }
}

// Type definitions
interface FraudPattern {
    name: string;
    description: string;
    indicators: FraudIndicatorRule[];
    weight: number;
}

interface FraudIndicatorRule {
    type: string;
    threshold: number;
    tolerance?: number;
    unit?: string;
}

interface UserInteractionData {
    userId: string;
    swipeTiming?: number; // milliseconds
    taskCompletionTime?: number; // seconds
    taskTextLength?: number; // words
    consensusMatch?: number; // 0-1 (0 = no match, 1 = perfect match)
    [key: string]: any; // Additional interaction data
}

interface UserBehaviorProfile {
    userId: string;
    swipeTimings: number[];
    taskCompletionTimes: number[];
    consensusMatches: number[];
    totalTasks: number;
    flaggedInteractions: number;
    behaviorHistory: BehaviorHistoryItem[];
    createdAt: number;
}

interface BehaviorHistoryItem {
    interactionData: UserInteractionData;
    timestamp: number;
}

interface FraudIndicator {
    pattern: string;
    confidence: number;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

interface FraudAnalysisResult {
    userId: string;
    fraudConfidence: number;
    isFlagged: boolean;
    fraudIndicators: FraudIndicator[];
    recommendedAction: RecommendedAction;
    timestamp: number;
}

type RecommendedAction = 'allow' | 'flag' | 'review' | 'block';

interface FraudStatistics {
    totalUsers: number;
    flaggedUsers: number;
    fraudDetectionRate: number;
    patternsDetected: string[];
}
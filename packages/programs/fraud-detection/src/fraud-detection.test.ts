// Test file for Fraud Detection System
import { FraudDetectionSystem } from './fraud-detection';

describe('FraudDetectionSystem', () => {
    let fraudDetection: FraudDetectionSystem;

    beforeEach(() => {
        fraudDetection = new FraudDetectionSystem(0.7); // 70% threshold for testing
    });

    it('should initialize with default fraud patterns', () => {
        const stats = fraudDetection.getFraudStatistics();
        expect(stats.patternsDetected.length).toBeGreaterThan(0);
    });

    it('should detect bot-like swipe patterns', async () => {
        const userId = 'test-user-1';
        
        // Simulate bot-like behavior with consistent timings
        for (let i = 0; i < 10; i++) {
            const interactionData = {
                userId,
                swipeTiming: 800 // Consistently 800ms per swipe
            };
            
            const result = await fraudDetection.analyzeUserBehavior(userId, interactionData);
            
            // After several consistent swipes, should detect bot pattern
            if (i >= 5) {
                expect(result.fraudIndicators.some(indicator => 
                    indicator.pattern.includes('Bot-like')
                )).toBe(true);
            }
        }
    });

    it('should detect superhuman reading speed', async () => {
        const userId = 'test-user-2';
        
        // Simulate superhuman reading (1000 words in 5 seconds = 12000 WPM)
        const interactionData = {
            userId,
            taskTextLength: 1000, // 1000 words
            taskCompletionTime: 5 // 5 seconds
        };
        
        const result = await fraudDetection.analyzeUserBehavior(userId, interactionData);
        
        expect(result.fraudIndicators.some(indicator => 
            indicator.pattern.includes('Superhuman')
        )).toBe(true);
    });

    it('should detect suspicious consensus behavior', async () => {
        const userId = 'test-user-3';
        
        // Simulate perfect consensus matching
        const interactionData = {
            userId,
            consensusMatch: 1.0 // Perfect match
        };
        
        const result = await fraudDetection.analyzeUserBehavior(userId, interactionData);
        
        expect(result.fraudIndicators.some(indicator => 
            indicator.pattern.includes('Consensus')
        )).toBe(true);
        expect(result.isFlagged).toBe(true);
    });

    it('should detect rapid task completion', async () => {
        const userId = 'test-user-4';
        
        // Simulate extremely rapid task completion
        const interactionData = {
            userId,
            taskCompletionTime: 0.5 // 0.5 seconds
        };
        
        const result = await fraudDetection.analyzeUserBehavior(userId, interactionData);
        
        expect(result.fraudIndicators.some(indicator => 
            indicator.pattern.includes('Rapid')
        )).toBe(true);
    });

    it('should adjust data weight for flagged users', async () => {
        const userId = 'test-user-5';
        
        // Flag the user by simulating fraudulent behavior
        const fraudulentData = {
            userId,
            consensusMatch: 1.0 // Perfect match (fraudulent)
        };
        
        await fraudDetection.analyzeUserBehavior(userId, fraudulentData);
        
        // Check that data weight is reduced for flagged user
        const dataWeight = fraudDetection.getUserDataWeight(userId);
        expect(dataWeight).toBeLessThan(1.0);
        
        // Check that validation rate is increased for flagged user
        const validationRate = fraudDetection.getUserValidationRate(userId);
        expect(validationRate).toBe(1.0); // 100% validation
    });

    it('should maintain normal data weight for legitimate users', async () => {
        const userId = 'test-user-6';
        
        // Simulate legitimate behavior
        const legitimateData = {
            userId,
            swipeTiming: 1200, // Human-like timing
            taskCompletionTime: 30, // Reasonable time
            consensusMatch: 0.8 // Reasonable consensus
        };
        
        await fraudDetection.analyzeUserBehavior(userId, legitimateData);
        
        // Check that data weight remains normal
        const dataWeight = fraudDetection.getUserDataWeight(userId);
        expect(dataWeight).toBe(1.0);
        
        // Check that validation rate remains normal
        const validationRate = fraudDetection.getUserValidationRate(userId);
        expect(validationRate).toBe(0.1); // 10% validation
    });

    it('should provide fraud statistics', () => {
        const stats = fraudDetection.getFraudStatistics();
        expect(stats.totalUsers).toBeGreaterThanOrEqual(0);
        expect(stats.flaggedUsers).toBeGreaterThanOrEqual(0);
        expect(stats.patternsDetected.length).toBeGreaterThan(0);
    });
});
# Axiom ID Fraud Detection System

An AI-based fraud detection system for the Axiom ID protocol that analyzes user interaction behavior in real-time to detect and prevent fraudulent activities.

## Features

- **Real-time Analysis**: Continuously monitors user interactions for fraud indicators
- **Multi-pattern Detection**: Identifies various types of fraudulent behavior
- **Adaptive Weighting**: Adjusts data weight and validation rates based on user trustworthiness
- **Configurable Thresholds**: Customizable fraud confidence thresholds
- **Comprehensive Reporting**: Detailed fraud statistics and analysis results

## Fraud Patterns Detected

### 1. Bot-like Swipe Patterns
Detects users who swipe at consistent, machine-like intervals that are impossible for humans to maintain.

### 2. Superhuman Reading Speed
Identifies users who complete long-text tasks faster than humanly possible, indicating they're not actually reading the content.

### 3. Suspicious Consensus Behavior
Flags users who either:
- Match consensus 100% of the time (possible copying)
- Match consensus 50% of the time (random guessing)

### 4. Rapid Task Completion
Detects users who complete tasks at impossible speeds, suggesting automated behavior.

## How It Works

1. **Data Collection**: The system collects interaction data from the TMA interface, including:
   - Swipe timings
   - Task completion times
   - Text lengths
   - Consensus matches

2. **Behavioral Analysis**: Each interaction is analyzed against known fraud patterns using statistical methods.

3. **Confidence Scoring**: The system calculates a fraud confidence score (0-1) based on detected indicators.

4. **Action Recommendation**: Based on the confidence score, the system recommends:
   - `allow`: Normal user, no action needed
   - `flag`: Suspicious user, monitor closely
   - `review`: Medium confidence fraud, manual review needed
   - `block`: High confidence fraud, block user

5. **Adaptive Response**: The system adjusts how user data is treated:
   - **Flagged Users**: Data weight reduced to 10%, validation rate increased to 100%
   - **Normal Users**: Data weight at 100%, validation rate at 10%

## Integration

The fraud detection system can be integrated into the Axiom ID backend to:

1. **Filter Training Data**: Reduce the weight of suspicious data in RLHF training
2. **Increase Validation**: Send more tasks from flagged users to human validators
3. **Reward Adjustment**: Modify reward calculations based on trustworthiness
4. **Access Control**: Restrict access to sensitive features for flagged users

## API

### Initialize the System
```typescript
const fraudDetection = new FraudDetectionSystem(0.8); // 80% confidence threshold
```

### Analyze User Behavior
```typescript
const result = await fraudDetection.analyzeUserBehavior(userId, interactionData);
```

### Get Data Weight
```typescript
const weight = fraudDetection.getUserDataWeight(userId);
```

### Get Validation Rate
```typescript
const rate = fraudDetection.getUserValidationRate(userId);
```

### Get Statistics
```typescript
const stats = fraudDetection.getFraudStatistics();
```

## Configuration

The system can be configured with different confidence thresholds:
- **High Sensitivity** (0.5): Flags more users, higher false positive rate
- **Balanced** (0.7): Recommended for most use cases
- **High Specificity** (0.9): Flags fewer users, lower false positive rate

## Security Benefits

1. **Data Quality Protection**: Prevents poisoned training data from degrading AI models
2. **Economic Security**: Protects the token economy from fraudulent reward claims
3. **Reputation Integrity**: Maintains the trustworthiness of the PoHW reputation system
4. **System Stability**: Prevents abuse that could destabilize the entire ecosystem

## Future Enhancements

- Machine learning models for more sophisticated pattern recognition
- Integration with external threat intelligence feeds
- Behavioral biometrics for enhanced user identification
- Cross-platform fraud correlation
- Automated fraudster cluster detection
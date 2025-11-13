// RLHF Utilities for Axiom TMA
// Utility functions for formatting data according to Google Vertex AI Preference Tuning requirements

class RLHFUtils {
    /**
     * Format task data for Vertex AI Preference Tuning
     * @param {Object} taskData - The task data to format
     * @param {string} taskData.prompt - The prompt/question
     * @param {Array} taskData.completions - Array of completion objects
     * @param {string} taskData.systemInstruction - Optional system instruction
     * @returns {Object} Formatted data for Vertex AI
     */
    static formatForVertexAI(taskData) {
        const { prompt, completions, systemInstruction } = taskData;
        
        // Validate input
        if (!prompt || !completions || completions.length !== 2) {
            throw new Error('Invalid task data: prompt and exactly 2 completions required');
        }
        
        // Format the data according to Vertex AI requirements
        const formattedData = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            completions: completions.map((completion, index) => ({
                parts: [
                    {
                        text: completion.text
                    }
                ],
                score: completion.score || 0
            }))
        };
        
        // Add system instruction if provided
        if (systemInstruction) {
            formattedData.system_instruction = systemInstruction;
        }
        
        return formattedData;
    }
    
    /**
     * Create RLHF training example from user selection
     * @param {Object} task - The original task
     * @param {string} selectedOption - The user's selected option ('a' or 'b')
     * @returns {Object} Training example for RLHF
     */
    static createTrainingExample(task, selectedOption) {
        // Validate input
        if (!task || !task.prompt || !task.completions || task.completions.length !== 2) {
            throw new Error('Invalid task data');
        }
        
        if (selectedOption !== 'a' && selectedOption !== 'b') {
            throw new Error('Invalid selected option: must be "a" or "b"');
        }
        
        // Create training example
        const trainingExample = {
            prompt: task.prompt,
            completions: [
                {
                    text: task.completions[0].text,
                    score: selectedOption === 'a' ? 1 : 0
                },
                {
                    text: task.completions[1].text,
                    score: selectedOption === 'b' ? 1 : 0
                }
            ],
            metadata: {
                taskId: task.id,
                taskType: task.type,
                category: task.category,
                timestamp: new Date().toISOString(),
                userId: this.getUserId() // This would be implemented to get actual user ID
            }
        };
        
        return trainingExample;
    }
    
    /**
     * Batch format multiple tasks for Vertex AI
     * @param {Array} tasks - Array of tasks to format
     * @returns {Array} Array of formatted training examples
     */
    static batchFormatForVertexAI(tasks) {
        return tasks.map(task => this.formatForVertexAI(task));
    }
    
    /**
     * Validate RLHF data format
     * @param {Object} data - The data to validate
     * @returns {boolean} Whether the data is valid
     */
    static validateRLHFData(data) {
        try {
            // Check required fields
            if (!data.contents || !Array.isArray(data.contents)) {
                return false;
            }
            
            if (!data.completions || !Array.isArray(data.completions) || data.completions.length !== 2) {
                return false;
            }
            
            // Check contents structure
            const lastContent = data.contents[data.contents.length - 1];
            if (!lastContent || lastContent.role !== 'user') {
                return false;
            }
            
            // Check completions structure
            for (const completion of data.completions) {
                if (!completion.parts || !Array.isArray(completion.parts)) {
                    return false;
                }
                
                if (completion.score !== 0 && completion.score !== 1) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error validating RLHF data:', error);
            return false;
        }
    }
    
    /**
     * Convert training example to JSON Lines format for batch processing
     * @param {Object} example - The training example
     * @returns {string} JSON Lines formatted string
     */
    static toJSONLines(example) {
        return JSON.stringify(example);
    }
    
    /**
     * Batch convert examples to JSON Lines format
     * @param {Array} examples - Array of training examples
     * @returns {string} JSON Lines formatted string with newlines
     */
    static batchToJSONLines(examples) {
        return examples.map(example => this.toJSONLines(example)).join('\n');
    }
    
    /**
     * Get user ID (placeholder - would be implemented with actual user identification)
     * @returns {string} User ID
     */
    static getUserId() {
        // In a real implementation, this would return the actual user ID
        // For now, return a mock ID
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Generate dynamic tasks based on chat interactions
     * @param {Object} chatInteraction - The chat interaction data
     * @returns {Object} Generated task
     */
    static generateTaskFromChat(chatInteraction) {
        // Extract prompt from user message
        const prompt = chatInteraction.userMessage;
        
        // Generate completions from different models
        const completions = [
            {
                text: chatInteraction.modelAResponse,
                score: 0 // Will be set by user selection
            },
            {
                text: chatInteraction.modelBResponse,
                score: 0 // Will be set by user selection
            }
        ];
        
        // Create task
        const task = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            title: "Response Preference",
            description: "Choose the better AI response",
            prompt: prompt,
            completions: completions,
            type: "preference",
            category: "RLHF",
            reward: Math.floor(Math.random() * 50) + 30, // Random reward between 30-80 AX
            difficulty: "Easy",
            timeEstimate: "1 min"
        };
        
        return task;
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RLHFUtils;
}
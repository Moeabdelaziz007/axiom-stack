// Axiom Chat TMA - Train-to-Earn Interface
class AxiomTMA {
    constructor() {
        this.userData = {
            axiomBalance: 0,
            reputationScore: 0,
            apyRate: 0,
            tasks: [],
            rewards: []
        };
        this.sdk = null;
        this.userPublicKey = null;
    }

    async initialize() {
        // Initialize Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
        }

        // Initialize Axiom ID SDK
        // In a real implementation, this would connect to the actual SDK
        this.sdk = {
            identity: {
                getReputationScore: async (agent) => {
                    // Mock implementation
                    return Math.floor(Math.random() * 100) + 50;
                },
                presentCredentials: async (credentials) => {
                    // Mock implementation
                    return true;
                }
            },
            staking: {
                getStakingInfo: async (agent) => {
                    // Mock implementation
                    return {
                        balance: Math.floor(Math.random() * 10000),
                        apy: (Math.random() * 15).toFixed(2)
                    };
                }
            }
        };

        // Get user public key from Telegram
        // In a real implementation, this would come from wallet integration
        this.userPublicKey = this.generateMockPublicKey();

        // Load user data
        await this.loadUserData();

        // Initialize UI
        this.initUI();
    }

    generateMockPublicKey() {
        // Generate a mock public key for demonstration
        return 'AXIOM' + Math.random().toString(36).substring(2, 15).toUpperCase();
    }

    async loadUserData() {
        try {
            // Load reputation score
            this.userData.reputationScore = await this.sdk.identity.getReputationScore(this.userPublicKey);

            // Load staking info
            const stakingInfo = await this.sdk.staking.getStakingInfo(this.userPublicKey);
            this.userData.axiomBalance = stakingInfo.balance;
            this.userData.apyRate = stakingInfo.apy;

            // Load tasks
            this.userData.tasks = this.getSampleTasks();

            // Load rewards
            this.userData.rewards = this.getSampleRewards();

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading user data');
        }
    }

    getSampleTasks() {
        return [
            {
                id: 1,
                title: "Image Classification",
                description: "Classify 10 images as cats or dogs",
                reward: 50,
                type: "image",
                difficulty: "Easy",
                timeEstimate: "2 min",
                category: "Computer Vision"
            },
            {
                id: 2,
                title: "Text Quality Rating",
                description: "Rate the quality of AI-generated responses",
                reward: 75,
                type: "text",
                difficulty: "Medium",
                timeEstimate: "3 min",
                category: "Natural Language Processing"
            },
            {
                id: 3,
                title: "Data Validation",
                description: "Verify the accuracy of structured data entries",
                reward: 100,
                type: "data",
                difficulty: "Hard",
                timeEstimate: "5 min",
                category: "Data Quality"
            },
            {
                id: 4,
                title: "Sentiment Analysis",
                description: "Analyze the sentiment of social media posts",
                reward: 85,
                type: "text",
                difficulty: "Medium",
                timeEstimate: "4 min",
                category: "Natural Language Processing"
            },
            {
                id: 5,
                title: "Audio Transcription",
                description: "Transcribe short audio clips",
                reward: 120,
                type: "audio",
                difficulty: "Hard",
                timeEstimate: "6 min",
                category: "Speech Recognition"
            }
        ];
    }

    getSampleRewards() {
        return [
            { id: 1, amount: 50, task: "Image Classification", timestamp: "2023-06-15 14:30" },
            { id: 2, amount: 75, task: "Text Quality Rating", timestamp: "2023-06-14 10:15" },
            { id: 3, amount: 100, task: "Data Validation", timestamp: "2023-06-13 16:45" }
        ];
    }

    initUI() {
        // DOM Elements
        this.elements = {
            axiomBalance: document.getElementById('axiomBalance'),
            reputationScore: document.getElementById('reputationScore'),
            apyRate: document.getElementById('apyRate'),
            taskList: document.getElementById('taskList'),
            rewardHistory: document.getElementById('rewardHistory'),
            refreshTasks: document.getElementById('refreshTasks'),
            notification: document.getElementById('notification')
        };

        // Update UI with user data
        this.updateUserData();
        this.renderTasks();
        this.renderRewards();

        // Event listeners
        this.elements.refreshTasks.addEventListener('click', () => this.refreshTasks());
    }

    updateUserData() {
        if (this.elements.axiomBalance) {
            this.elements.axiomBalance.textContent = this.userData.axiomBalance.toLocaleString();
        }
        if (this.elements.reputationScore) {
            this.elements.reputationScore.textContent = this.userData.reputationScore;
        }
        if (this.elements.apyRate) {
            this.elements.apyRate.textContent = this.userData.apyRate + '%';
        }
    }

    renderTasks() {
        if (!this.elements.taskList) return;

        this.elements.taskList.innerHTML = '';

        this.userData.tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.innerHTML = `
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-reward">${task.reward} AX</div>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span>${task.difficulty}</span>
                    <span>${task.timeEstimate}</span>
                </div>
            `;

            taskCard.addEventListener('click', () => this.startTask(task));
            this.elements.taskList.appendChild(taskCard);
        });
    }

    renderRewards() {
        if (!this.elements.rewardHistory) return;

        if (this.userData.rewards.length === 0) {
            this.elements.rewardHistory.innerHTML = '<div class="empty-state">No rewards yet. Complete tasks to earn AXIOM!</div>';
            return;
        }

        this.elements.rewardHistory.innerHTML = '';
        this.userData.rewards.forEach(reward => {
            const rewardItem = document.createElement('div');
            rewardItem.className = 'reward-item';
            rewardItem.innerHTML = `
                <div>
                    <div>${reward.task}</div>
                    <div style="font-size: 12px; color: #999;">${reward.timestamp}</div>
                </div>
                <div class="reward-amount">+${reward.amount} AX</div>
            `;
            this.elements.rewardHistory.appendChild(rewardItem);
        });
    }

    async startTask(task) {
        this.showNotification(`Starting task: ${task.title}`);

        // Simulate task completion
        setTimeout(() => {
            this.completeTask(task);
        }, 3000);
    }

    async completeTask(task) {
        try {
            // In a real implementation, this would:
            // 1. Call the Train-to-Earn program to record completion
            // 2. Transfer AXIOM tokens as reward
            // 3. Issue SAS attestation for the completed task
            // 4. Update staking contract to increase APY

            // Update user data
            this.userData.axiomBalance += task.reward;
            this.userData.reputationScore += 5;

            // Add to rewards history
            const newReward = {
                id: this.userData.rewards.length + 1,
                amount: task.reward,
                task: task.title,
                timestamp: new Date().toLocaleString()
            };
            this.userData.rewards.unshift(newReward);

            // Update display
            this.updateUserData();
            this.renderRewards();

            // Show notification
            this.showNotification(`Task completed! Earned ${task.reward} AX and 5 reputation points.`);

            // Issue SAS attestation
            await this.issueSASAttestation(task);

        } catch (error) {
            console.error('Error completing task:', error);
            this.showNotification('Error completing task');
        }
    }

    async issueSASAttestation(task) {
        try {
            // In a real implementation, this would call the Axiom Attestations program
            // to issue a SAS-compliant attestation for the completed task
            console.log(`Issuing SAS attestation for task: ${task.title}`);

            // Mock implementation
            const attestationData = {
                subject: this.userPublicKey,
                issuer: "AxiomTMA",
                schema: "task_completion",
                data: {
                    taskId: task.id,
                    taskTitle: task.title,
                    completionTime: new Date().toISOString(),
                    reward: task.reward
                },
                timestamp: Math.floor(Date.now() / 1000)
            };

            // Present credentials for verification
            const verified = await this.sdk.identity.presentCredentials(attestationData);
            if (verified) {
                console.log('Attestation verified and recorded');
            }

        } catch (error) {
            console.error('Error issuing SAS attestation:', error);
        }
    }

    async refreshTasks() {
        this.showNotification('Refreshing tasks...');
        
        // In a real implementation, this would fetch new tasks from the backend
        setTimeout(() => {
            // For demo, we'll just shuffle the existing tasks
            this.userData.tasks = this.shuffleArray(this.userData.tasks);
            this.renderTasks();
            this.showNotification('Tasks refreshed!');
        }, 1500);
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    showNotification(message) {
        if (!this.elements.notification) return;

        this.elements.notification.textContent = message;
        this.elements.notification.classList.add('show');

        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the TMA when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const axiomTMA = new AxiomTMA();
    await axiomTMA.initialize();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxiomTMA;
}
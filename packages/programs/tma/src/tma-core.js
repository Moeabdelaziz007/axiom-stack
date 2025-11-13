// Axiom Chat TMA - Core Implementation
class AxiomTMA {
    constructor() {
        this.userData = {
            axiomBalance: 0,
            reputationScore: 0,
            apyRate: 0,
            tasks: [],
            rewards: [],
            identity: null
        };
        this.sdk = null;
        this.userPublicKey = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                Telegram.WebApp.MainButton.show();
                Telegram.WebApp.MainButton.setText('Connect Wallet');
                Telegram.WebApp.MainButton.onClick(() => this.connectWallet());
            }

            // Initialize Axiom ID SDK
            await this.initializeSDK();

            // Load user data
            await this.loadUserData();

            // Initialize UI
            this.initUI();
            
            this.isInitialized = true;
            console.log('Axiom TMA initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Axiom TMA:', error);
            this.showNotification('Initialization error. Please try again.');
        }
    }

    async initializeSDK() {
        // Mock SDK implementation
        this.sdk = {
            identity: {
                getReputationScore: async (agent) => {
                    return Math.floor(Math.random() * 100) + 50;
                },
                presentCredentials: async (credentials) => {
                    return true;
                },
                createIdentity: async (persona, stakeAmount) => {
                    return "mock_transaction_signature";
                }
            },
            staking: {
                getStakingInfo: async (agent) => {
                    return {
                        balance: Math.floor(Math.random() * 10000),
                        apy: (Math.random() * 15).toFixed(2)
                    };
                },
                stakeTokens: async (amount) => {
                    return "mock_stake_transaction";
                }
            },
            attestations: {
                requestAttestation: async (schema, data) => {
                    return "mock_attestation_transaction";
                }
            }
        };
    }

    async connectWallet() {
        try {
            this.userPublicKey = this.generateMockPublicKey();
            this.showNotification('Wallet connected successfully!');
            
            // Load user data after wallet connection
            await this.loadUserData();
            this.updateUserData();
            this.renderTasks();
            this.renderRewards();
            
            // Update UI to show connected state
            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.MainButton.setText('Refresh Data');
                Telegram.WebApp.MainButton.onClick(() => this.refreshData());
            }
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showNotification('Failed to connect wallet');
        }
    }

    generateMockPublicKey() {
        return 'AXIOM' + Math.random().toString(36).substring(2, 15).toUpperCase();
    }

    async loadUserData() {
        if (!this.userPublicKey) {
            console.log('No wallet connected, using demo data');
            this.loadDemoData();
            return;
        }

        try {
            // Load reputation score
            this.userData.reputationScore = await this.sdk.identity.getReputationScore(this.userPublicKey);

            // Load staking info
            const stakingInfo = await this.sdk.staking.getStakingInfo(this.userPublicKey);
            this.userData.axiomBalance = stakingInfo.balance;
            this.userData.apyRate = stakingInfo.apy;

            // Load tasks
            this.userData.tasks = this.getDynamicTasks();

            // Load rewards
            this.userData.rewards = this.getSampleRewards();

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading user data, using demo data');
            this.loadDemoData();
        }
    }

    loadDemoData() {
        this.userData = {
            axiomBalance: 1250,
            reputationScore: 85,
            apyRate: "12.5",
            tasks: this.getSampleTasks(),
            rewards: this.getSampleRewards(),
            identity: null
        };
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
                category: "Computer Vision",
                prompt: "Classify the following images",
                completions: [
                    { id: "a", text: "This is a cat", score: 0 },
                    { id: "b", text: "This is a dog", score: 1 }
                ]
            },
            {
                id: 2,
                title: "Text Quality Rating",
                description: "Rate the quality of AI-generated responses",
                reward: 75,
                type: "text",
                difficulty: "Medium",
                timeEstimate: "3 min",
                category: "Natural Language Processing",
                prompt: "How to create a Solana program?",
                completions: [
                    { id: "a", text: "Use Anchor framework to create a Solana program...", score: 1 },
                    { id: "b", text: "Solana programs are written in Rust...", score: 0 }
                ]
            }
        ];
    }

    getDynamicTasks() {
        return [
            {
                id: Math.floor(Math.random() * 1000),
                title: "Response Preference",
                description: "Choose the better AI response",
                reward: Math.floor(Math.random() * 50) + 30,
                type: "preference",
                difficulty: "Easy",
                timeEstimate: "1 min",
                category: "RLHF",
                prompt: "What is Solana?",
                completions: [
                    { id: "a", text: "Solana is a high-performance blockchain...", score: 0 },
                    { id: "b", text: "Solana is a blockchain platform known for its speed...", score: 1 }
                ]
            }
        ];
    }

    getSampleRewards() {
        return [
            { id: 1, amount: 50, task: "Image Classification", timestamp: "2023-06-15 14:30" },
            { id: 2, amount: 75, task: "Text Quality Rating", timestamp: "2023-06-14 10:15" }
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
        if (this.elements.refreshTasks) {
            this.elements.refreshTasks.addEventListener('click', () => this.refreshData());
        }
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

        if (this.userData.tasks.length === 0) {
            this.elements.taskList.innerHTML = '<div class="empty-state">No tasks available. Please connect your wallet to get started!</div>';
            return;
        }

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
        if (!this.userPublicKey) {
            this.showNotification('Please connect your wallet first!');
            return;
        }

        this.showNotification(`Starting task: ${task.title}`);
        this.showTaskInterface(task);
    }

    showTaskInterface(task) {
        // Create task interface modal
        const modal = document.createElement('div');
        modal.className = 'task-modal';
        modal.innerHTML = `
            <div class="task-modal-content">
                <div class="task-modal-header">
                    <h3>${task.title}</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="task-modal-body">
                    <div class="task-prompt">
                        <h4>Prompt:</h4>
                        <p>${task.prompt}</p>
                    </div>
                    <div class="task-completions">
                        <h4>Choose the better response:</h4>
                        <div class="completion-option" data-id="a">
                            <div class="completion-header">
                                <span>Option A</span>
                            </div>
                            <div class="completion-text">${task.completions[0].text}</div>
                        </div>
                        <div class="completion-option" data-id="b">
                            <div class="completion-header">
                                <span>Option B</span>
                            </div>
                            <div class="completion-text">${task.completions[1].text}</div>
                        </div>
                    </div>
                </div>
                <div class="task-modal-footer">
                    <button class="action-button" id="submitTask">Submit Choice</button>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(modal);

        // Add event listeners
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        const options = modal.querySelectorAll('.completion-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                options.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });

        const submitButton = modal.querySelector('#submitTask');
        submitButton.addEventListener('click', () => {
            const selectedOption = modal.querySelector('.completion-option.selected');
            if (selectedOption) {
                const selectedId = selectedOption.getAttribute('data-id');
                this.completeTask(task, selectedId);
                document.body.removeChild(modal);
            } else {
                this.showNotification('Please select an option first!');
            }
        });
    }

    async completeTask(task, selectedOption) {
        try {
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
            await this.issueSASAttestation(task, selectedOption);

        } catch (error) {
            console.error('Error completing task:', error);
            this.showNotification('Error completing task');
        }
    }

    async issueSASAttestation(task, selectedOption) {
        try {
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
                    reward: task.reward,
                    selectedOption: selectedOption
                },
                timestamp: Math.floor(Date.now() / 1000)
            };

            // Present credentials for verification
            const verified = await this.sdk.identity.presentCredentials(attestationData);
            if (verified) {
                console.log('Attestation verified and recorded');
                
                // Request actual attestation on-chain
                const tx = await this.sdk.attestations.requestAttestation(
                    "human_work_proof",
                    JSON.stringify(attestationData)
                );
                console.log('Attestation transaction:', tx);
            }

        } catch (error) {
            console.error('Error issuing SAS attestation:', error);
        }
    }

    async refreshData() {
        this.showNotification('Refreshing data...');
        
        try {
            await this.loadUserData();
            this.updateUserData();
            this.renderTasks();
            this.renderRewards();
            this.showNotification('Data refreshed successfully!');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showNotification('Error refreshing data');
        }
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
    
    // Expose to global scope for debugging
    window.axiomTMA = axiomTMA;
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxiomTMA;
}// Axiom Chat TMA - Core Implementation
class AxiomTMA {
    constructor() {
        this.userData = {
            axiomBalance: 0,
            reputationScore: 0,
            apyRate: 0,
            tasks: [],
            rewards: [],
            identity: null
        };
        this.sdk = null;
        this.userPublicKey = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Initialize Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.ready();
                Telegram.WebApp.expand();
                Telegram.WebApp.MainButton.show();
                Telegram.WebApp.MainButton.setText('Connect Wallet');
                Telegram.WebApp.MainButton.onClick(() => this.connectWallet());
            }

            // Initialize Axiom ID SDK
            await this.initializeSDK();

            // Load user data
            await this.loadUserData();

            // Initialize UI
            this.initUI();
            
            this.isInitialized = true;
            console.log('Axiom TMA initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Axiom TMA:', error);
            this.showNotification('Initialization error. Please try again.');
        }
    }

    async initializeSDK() {
        // Mock SDK implementation
        this.sdk = {
            identity: {
                getReputationScore: async (agent) => {
                    return Math.floor(Math.random() * 100) + 50;
                },
                presentCredentials: async (credentials) => {
                    return true;
                },
                createIdentity: async (persona, stakeAmount) => {
                    return "mock_transaction_signature";
                }
            },
            staking: {
                getStakingInfo: async (agent) => {
                    return {
                        balance: Math.floor(Math.random() * 10000),
                        apy: (Math.random() * 15).toFixed(2)
                    };
                },
                stakeTokens: async (amount) => {
                    return "mock_stake_transaction";
                }
            },
            attestations: {
                requestAttestation: async (schema, data) => {
                    return "mock_attestation_transaction";
                }
            }
        };
    }

    async connectWallet() {
        try {
            this.userPublicKey = this.generateMockPublicKey();
            this.showNotification('Wallet connected successfully!');
            
            // Load user data after wallet connection
            await this.loadUserData();
            this.updateUserData();
            this.renderTasks();
            this.renderRewards();
            
            // Update UI to show connected state
            if (window.Telegram && window.Telegram.WebApp) {
                Telegram.WebApp.MainButton.setText('Refresh Data');
                Telegram.WebApp.MainButton.onClick(() => this.refreshData());
            }
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showNotification('Failed to connect wallet');
        }
    }

    generateMockPublicKey() {
        return 'AXIOM' + Math.random().toString(36).substring(2, 15).toUpperCase();
    }

    async loadUserData() {
        if (!this.userPublicKey) {
            console.log('No wallet connected, using demo data');
            this.loadDemoData();
            return;
        }

        try {
            // Load reputation score
            this.userData.reputationScore = await this.sdk.identity.getReputationScore(this.userPublicKey);

            // Load staking info
            const stakingInfo = await this.sdk.staking.getStakingInfo(this.userPublicKey);
            this.userData.axiomBalance = stakingInfo.balance;
            this.userData.apyRate = stakingInfo.apy;

            // Load tasks
            this.userData.tasks = this.getDynamicTasks();

            // Load rewards
            this.userData.rewards = this.getSampleRewards();

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading user data, using demo data');
            this.loadDemoData();
        }
    }

    loadDemoData() {
        this.userData = {
            axiomBalance: 1250,
            reputationScore: 85,
            apyRate: "12.5",
            tasks: this.getSampleTasks(),
            rewards: this.getSampleRewards(),
            identity: null
        };
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
                category: "Computer Vision",
                prompt: "Classify the following images",
                completions: [
                    { id: "a", text: "This is a cat", score: 0 },
                    { id: "b", text: "This is a dog", score: 1 }
                ]
            },
            {
                id: 2,
                title: "Text Quality Rating",
                description: "Rate the quality of AI-generated responses",
                reward: 75,
                type: "text",
                difficulty: "Medium",
                timeEstimate: "3 min",
                category: "Natural Language Processing",
                prompt: "How to create a Solana program?",
                completions: [
                    { id: "a", text: "Use Anchor framework to create a Solana program...", score: 1 },
                    { id: "b", text: "Solana programs are written in Rust...", score: 0 }
                ]
            }
        ];
    }

    getDynamicTasks() {
        return [
            {
                id: Math.floor(Math.random() * 1000),
                title: "Response Preference",
                description: "Choose the better AI response",
                reward: Math.floor(Math.random() * 50) + 30,
                type: "preference",
                difficulty: "Easy",
                timeEstimate: "1 min",
                category: "RLHF",
                prompt: "What is Solana?",
                completions: [
                    { id: "a", text: "Solana is a high-performance blockchain...", score: 0 },
                    { id: "b", text: "Solana is a blockchain platform known for its speed...", score: 1 }
                ]
            }
        ];
    }

    getSampleRewards() {
        return [
            { id: 1, amount: 50, task: "Image Classification", timestamp: "2023-06-15 14:30" },
            { id: 2, amount: 75, task: "Text Quality Rating", timestamp: "2023-06-14 10:15" }
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
        if (this.elements.refreshTasks) {
            this.elements.refreshTasks.addEventListener('click', () => this.refreshData());
        }
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

        if (this.userData.tasks.length === 0) {
            this.elements.taskList.innerHTML = '<div class="empty-state">No tasks available. Please connect your wallet to get started!</div>';
            return;
        }

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
        if (!this.userPublicKey) {
            this.showNotification('Please connect your wallet first!');
            return;
        }

        this.showNotification(`Starting task: ${task.title}`);
        this.showTaskInterface(task);
    }

    showTaskInterface(task) {
        // Create task interface modal
        const modal = document.createElement('div');
        modal.className = 'task-modal';
        modal.innerHTML = `
            <div class="task-modal-content">
                <div class="task-modal-header">
                    <h3>${task.title}</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="task-modal-body">
                    <div class="task-prompt">
                        <h4>Prompt:</h4>
                        <p>${task.prompt}</p>
                    </div>
                    <div class="task-completions">
                        <h4>Choose the better response:</h4>
                        <div class="completion-option" data-id="a">
                            <div class="completion-header">
                                <span>Option A</span>
                            </div>
                            <div class="completion-text">${task.completions[0].text}</div>
                        </div>
                        <div class="completion-option" data-id="b">
                            <div class="completion-header">
                                <span>Option B</span>
                            </div>
                            <div class="completion-text">${task.completions[1].text}</div>
                        </div>
                    </div>
                </div>
                <div class="task-modal-footer">
                    <button class="action-button" id="submitTask">Submit Choice</button>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(modal);

        // Add event listeners
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        const options = modal.querySelectorAll('.completion-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                options.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });

        const submitButton = modal.querySelector('#submitTask');
        submitButton.addEventListener('click', () => {
            const selectedOption = modal.querySelector('.completion-option.selected');
            if (selectedOption) {
                const selectedId = selectedOption.getAttribute('data-id');
                this.completeTask(task, selectedId);
                document.body.removeChild(modal);
            } else {
                this.showNotification('Please select an option first!');
            }
        });
    }

    async completeTask(task, selectedOption) {
        try {
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
            await this.issueSASAttestation(task, selectedOption);

        } catch (error) {
            console.error('Error completing task:', error);
            this.showNotification('Error completing task');
        }
    }

    async issueSASAttestation(task, selectedOption) {
        try {
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
                    reward: task.reward,
                    selectedOption: selectedOption
                },
                timestamp: Math.floor(Date.now() / 1000)
            };

            // Present credentials for verification
            const verified = await this.sdk.identity.presentCredentials(attestationData);
            if (verified) {
                console.log('Attestation verified and recorded');
                
                // Request actual attestation on-chain
                const tx = await this.sdk.attestations.requestAttestation(
                    "human_work_proof",
                    JSON.stringify(attestationData)
                );
                console.log('Attestation transaction:', tx);
            }

        } catch (error) {
            console.error('Error issuing SAS attestation:', error);
        }
    }

    async refreshData() {
        this.showNotification('Refreshing data...');
        
        try {
            await this.loadUserData();
            this.updateUserData();
            this.renderTasks();
            this.renderRewards();
            this.showNotification('Data refreshed successfully!');
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showNotification('Error refreshing data');
        }
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
    
    // Expose to global scope for debugging
    window.axiomTMA = axiomTMA;
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxiomTMA;
}
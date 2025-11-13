// Task Component for Axiom TMA
// Reusable component for displaying and handling tasks

class TaskComponent {
    constructor(container, task, onComplete) {
        this.container = container;
        this.task = task;
        this.onComplete = onComplete;
        this.selectedOption = null;
    }

    // Render the task component
    render() {
        this.container.innerHTML = `
            <div class="task-component">
                <div class="task-header">
                    <h3>${this.task.title}</h3>
                    <div class="task-reward-badge">${this.task.reward} AX</div>
                </div>
                
                <div class="task-description">
                    <p>${this.task.description}</p>
                </div>
                
                <div class="task-prompt-section">
                    <h4>Prompt:</h4>
                    <div class="prompt-content">
                        <p>${this.task.prompt}</p>
                    </div>
                </div>
                
                <div class="task-completions-section">
                    <h4>Choose the better response:</h4>
                    <div class="completions-container">
                        <div class="completion-option" data-option="a">
                            <div class="completion-header">
                                <span class="option-label">Option A</span>
                            </div>
                            <div class="completion-content">
                                <p>${this.task.completions[0].text}</p>
                            </div>
                        </div>
                        
                        <div class="completion-option" data-option="b">
                            <div class="completion-header">
                                <span class="option-label">Option B</span>
                            </div>
                            <div class="completion-content">
                                <p>${this.task.completions[1].text}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="submit-button" id="submitTask">Submit Choice</button>
                    <button class="cancel-button" id="cancelTask">Cancel</button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    // Attach event listeners
    attachEventListeners() {
        // Option selection
        const options = this.container.querySelectorAll('.completion-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption(e.currentTarget);
            });
        });

        // Submit button
        const submitButton = this.container.querySelector('#submitTask');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.submitTask();
            });
        }

        // Cancel button
        const cancelButton = this.container.querySelector('#cancelTask');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.cancelTask();
            });
        }
    }

    // Select an option
    selectOption(optionElement) {
        // Remove selected class from all options
        const options = this.container.querySelectorAll('.completion-option');
        options.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        optionElement.classList.add('selected');

        // Store selected option
        this.selectedOption = optionElement.getAttribute('data-option');
    }

    // Submit the task
    submitTask() {
        if (!this.selectedOption) {
            this.showNotification('Please select an option first!');
            return;
        }

        // Call the onComplete callback with the selected option
        if (this.onComplete) {
            this.onComplete(this.task, this.selectedOption);
        }
    }

    // Cancel the task
    cancelTask() {
        // Clear the container
        this.container.innerHTML = '';
        
        // Call the onComplete callback with null to indicate cancellation
        if (this.onComplete) {
            this.onComplete(null, null);
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'task-notification';
        notification.textContent = message;
        
        // Add to container
        this.container.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskComponent;
}// Task Component for Axiom TMA
// Reusable component for displaying and handling tasks

class TaskComponent {
    constructor(container, task, onComplete) {
        this.container = container;
        this.task = task;
        this.onComplete = onComplete;
        this.selectedOption = null;
    }

    // Render the task component
    render() {
        this.container.innerHTML = `
            <div class="task-component">
                <div class="task-header">
                    <h3>${this.task.title}</h3>
                    <div class="task-reward-badge">${this.task.reward} AX</div>
                </div>
                
                <div class="task-description">
                    <p>${this.task.description}</p>
                </div>
                
                <div class="task-prompt-section">
                    <h4>Prompt:</h4>
                    <div class="prompt-content">
                        <p>${this.task.prompt}</p>
                    </div>
                </div>
                
                <div class="task-completions-section">
                    <h4>Choose the better response:</h4>
                    <div class="completions-container">
                        <div class="completion-option" data-option="a">
                            <div class="completion-header">
                                <span class="option-label">Option A</span>
                            </div>
                            <div class="completion-content">
                                <p>${this.task.completions[0].text}</p>
                            </div>
                        </div>
                        
                        <div class="completion-option" data-option="b">
                            <div class="completion-header">
                                <span class="option-label">Option B</span>
                            </div>
                            <div class="completion-content">
                                <p>${this.task.completions[1].text}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="submit-button" id="submitTask">Submit Choice</button>
                    <button class="cancel-button" id="cancelTask">Cancel</button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    // Attach event listeners
    attachEventListeners() {
        // Option selection
        const options = this.container.querySelectorAll('.completion-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption(e.currentTarget);
            });
        });

        // Submit button
        const submitButton = this.container.querySelector('#submitTask');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.submitTask();
            });
        }

        // Cancel button
        const cancelButton = this.container.querySelector('#cancelTask');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.cancelTask();
            });
        }
    }

    // Select an option
    selectOption(optionElement) {
        // Remove selected class from all options
        const options = this.container.querySelectorAll('.completion-option');
        options.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        optionElement.classList.add('selected');

        // Store selected option
        this.selectedOption = optionElement.getAttribute('data-option');
    }

    // Submit the task
    submitTask() {
        if (!this.selectedOption) {
            this.showNotification('Please select an option first!');
            return;
        }

        // Call the onComplete callback with the selected option
        if (this.onComplete) {
            this.onComplete(this.task, this.selectedOption);
        }
    }

    // Cancel the task
    cancelTask() {
        // Clear the container
        this.container.innerHTML = '';
        
        // Call the onComplete callback with null to indicate cancellation
        if (this.onComplete) {
            this.onComplete(null, null);
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'task-notification';
        notification.textContent = message;
        
        // Add to container
        this.container.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskComponent;
}
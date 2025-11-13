// TaskManager.mjs - Task Management for POC
class TaskManager {
  constructor() {
    this.tasks = [];
    this.taskIdCounter = 1;
  }

  /**
   * Create a new task
   * @param {string} title - Task title
   * @param {string} description - Task description
   * @param {Array} requiredCapabilities - Required capabilities to execute the task
   * @returns {Object} Created task
   */
  createTask(title, description, requiredCapabilities = []) {
    const task = {
      id: this.taskIdCounter++,
      title,
      description,
      requiredCapabilities,
      createdAt: new Date(),
      assignedAgent: null,
      status: 'pending', // pending, assigned, completed, failed
      result: null
    };

    this.tasks.push(task);
    return task;
  }

  /**
   * Get all tasks
   * @returns {Array} All tasks
   */
  getTasks() {
    return this.tasks;
  }

  /**
   * Get a task by ID
   * @param {number} id - Task ID
   * @returns {Object|null} Task or null if not found
   */
  getTaskById(id) {
    return this.tasks.find(task => task.id === id) || null;
  }

  /**
   * Assign a task to an agent
   * @param {number} taskId - Task ID
   * @param {Agent} agent - Agent to assign the task to
   * @returns {boolean} Success status
   */
  assignTask(taskId, agent) {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    // Check if agent has required capabilities
    const hasCapabilities = task.requiredCapabilities.every(cap => 
      agent.capabilities.includes(cap)
    );

    if (!hasCapabilities) return false;

    task.assignedAgent = agent;
    task.status = 'assigned';
    return true;
  }

  /**
   * Complete a task with result
   * @param {number} taskId - Task ID
   * @param {Object} result - Task result
   * @returns {boolean} Success status
   */
  completeTask(taskId, result) {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    task.status = result.success ? 'completed' : 'failed';
    task.result = result;
    return true;
  }

  /**
   * Get pending tasks
   * @returns {Array} Pending tasks
   */
  getPendingTasks() {
    return this.tasks.filter(task => task.status === 'pending');
  }

  /**
   * Get completed tasks
   * @returns {Array} Completed tasks
   */
  getCompletedTasks() {
    return this.tasks.filter(task => task.status === 'completed');
  }
}

export default TaskManager;
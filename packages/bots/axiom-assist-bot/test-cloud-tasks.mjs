// test-cloud-tasks.mjs - Test Cloud Tasks integration
import { CloudTasksClient } from '@google-cloud/tasks';
import dotenv from 'dotenv';

dotenv.config();

async function testCloudTasks() {
  try {
    // Initialize Cloud Tasks client
    const client = new CloudTasksClient();
    
    // Configuration
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
    const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    const queue = process.env.GOOGLE_CLOUD_TASKS_QUEUE || 'axiom-agent-queue';
    const serviceAccountEmail = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT || 'axiom-agent@axiom-id-project.iam.gserviceaccount.com';
    const agentServiceUrl = process.env.AGENT_SERVICE_URL || 'https://axiom-agent-service-abc123.a.run.app/run';
    
    console.log('Testing Cloud Tasks integration...');
    console.log(`Project ID: ${projectId}`);
    console.log(`Location: ${location}`);
    console.log(`Queue: ${queue}`);
    console.log(`Service Account: ${serviceAccountEmail}`);
    console.log(`Agent Service URL: ${agentServiceUrl}`);
    
    // Create a test task
    const parent = client.queuePath(projectId, location, queue);
    
    // Test payload
    const payload = {
      text: 'Test message for Cloud Tasks integration',
      clientId: 'test-client-123',
      timestamp: new Date().toISOString()
    };
    
    // Convert payload to Base64
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: agentServiceUrl,
        headers: { 'Content-Type': 'application/json' },
        body: body,
        // Use OIDC for secure authentication
        oidcToken: {
          serviceAccountEmail: serviceAccountEmail,
        },
      },
    };

    console.log('Creating test task...');
    
    // Send the task
    const [response] = await client.createTask({parent, task});
    console.log(`✅ Successfully created task: ${response.name}`);
    
    return response.name;
  } catch (error) {
    console.error('❌ Error testing Cloud Tasks integration:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCloudTasks()
    .then(taskName => {
      console.log(`Test completed successfully. Task name: ${taskName}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export default testCloudTasks;
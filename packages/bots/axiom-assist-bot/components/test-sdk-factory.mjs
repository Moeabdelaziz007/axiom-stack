// components/test-sdk-factory.mjs - Test script for AgentSDKFactory
import AgentSDKFactory from './AgentSDKFactory.mjs';

async function testSDKFactory() {
  console.log('🧪 Testing AgentSDKFactory...\n');
  
  try {
    const factory = new AgentSDKFactory();
    
    // Test available templates
    console.log('📋 Available Templates:');
    const templates = factory.getAvailableTemplates();
    templates.forEach(template => {
      console.log(`  - ${template.name}: ${template.description}`);
    });
    console.log('');
    
    // Test SDK generation
    console.log('🔧 Generating SDKs...\n');
    
    // Test 1: Custom Agent
    console.log('1️⃣ Generating Custom Agent SDK...');
    const customSDK = await factory.generateSDK({
      name: 'MyCustomAgent',
      type: 'custom',
      description: 'A custom agent for testing purposes'
    });
    console.log(`   ✅ Generated Custom Agent SDK (${customSDK.length} bytes)\n`);
    
    // Test 2: DeFi Agent
    console.log('2️⃣ Generating DeFi Agent SDK...');
    const defiSDK = await factory.generateSDK({
      name: 'DeFiTradingBot',
      type: 'defi',
      description: 'A DeFi trading bot for automated trading'
    });
    console.log(`   ✅ Generated DeFi Agent SDK (${defiSDK.length} bytes)\n`);
    
    // Test 3: Social Media Agent
    console.log('3️⃣ Generating Social Media Agent SDK...');
    const socialSDK = await factory.generateSDK({
      name: 'SocialMediaManager',
      type: 'social',
      description: 'A social media management agent'
    });
    console.log(`   ✅ Generated Social Media Agent SDK (${socialSDK.length} bytes)\n`);
    
    // Test 4: Analytics Agent
    console.log('4️⃣ Generating Analytics Agent SDK...');
    const analyticsSDK = await factory.generateSDK({
      name: 'DataAnalyzer',
      type: 'analytics',
      description: 'An analytics agent for data processing'
    });
    console.log(`   ✅ Generated Analytics Agent SDK (${analyticsSDK.length} bytes)\n`);
    
    console.log('🎉 All tests passed! AgentSDKFactory is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing AgentSDKFactory:', error);
    process.exit(1);
  }
}

testSDKFactory();
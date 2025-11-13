// test-strategist.mjs - Test the strategist engine
import { generateStrategicIdeas } from './strategist.mjs';

async function testStrategist() {
  console.log('🧪 Testing Axiom Strategist Engine...');
  
  try {
    const ideas = await generateStrategicIdeas();
    console.log('\n💡 Generated Strategic Ideas:\n');
    console.log(ideas);
  } catch (error) {
    console.error('❌ Error testing strategist engine:', error);
  }
}

testStrategist();
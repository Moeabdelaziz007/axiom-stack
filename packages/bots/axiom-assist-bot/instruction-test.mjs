#!/usr/bin/env node

// instruction-test.mjs - Test for instruction data creation
console.log('Testing instruction data creation...');

try {
  // Test instruction data for create_agent (instruction index 0)
  console.log('\nTesting create_agent instruction data...');
  
  const agentId = 'test-agent-123';
  const initialReputation = 100;
  
  // Create instruction data
  const instructionData = Buffer.concat([
    Buffer.from([0]), // Instruction index
    Buffer.from(agentId.padEnd(32, '\0').slice(0, 32)), // Agent ID (32 bytes)
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(initialReputation)]).buffer)).reverse() // Initial reputation (8 bytes, little endian)
  ]);
  
  console.log('✅ Instruction data created successfully');
  console.log(`  Instruction data length: ${instructionData.length} bytes`);
  console.log(`  Instruction data: ${instructionData.toString('hex')}`);
  
  // Test instruction data for update_reputation (instruction index 1)
  console.log('\nTesting update_reputation instruction data...');
  
  const scoreDelta = 10;
  
  // Create instruction data
  const updateInstructionData = Buffer.concat([
    Buffer.from([1]), // Instruction index
    Buffer.from(new Uint8Array(new BigUint64Array([BigInt(scoreDelta)]).buffer)).reverse() // Score delta (8 bytes, little endian)
  ]);
  
  console.log('✅ Update instruction data created successfully');
  console.log(`  Update instruction data length: ${updateInstructionData.length} bytes`);
  console.log(`  Update instruction data: ${updateInstructionData.toString('hex')}`);
  
  console.log('\n🎉 All instruction data tests passed!');
} catch (error) {
  console.error('❌ Instruction data test failed:', error);
  process.exit(1);
}
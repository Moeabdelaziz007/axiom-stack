#!/usr/bin/env node

// bigint-test.mjs - Test for BigInt and BigUint64Array usage
console.log('Testing BigInt and BigUint64Array...');

try {
  // Test BigInt
  const bigIntValue = BigInt(100);
  console.log('✅ BigInt works:', bigIntValue);
  
  // Test BigUint64Array
  const bigUint64Array = new BigUint64Array([BigInt(100)]);
  console.log('✅ BigUint64Array works:', bigUint64Array);
  
  // Test conversion to bytes
  const bytes = new Uint8Array(bigUint64Array.buffer);
  console.log('✅ Uint8Array conversion works:', bytes);
  
  // Test reverse for little-endian
  const reversed = new Uint8Array(bigUint64Array.buffer).reverse();
  console.log('✅ Reverse works:', reversed);
  
  console.log('\n🎉 All BigInt tests passed!');
} catch (error) {
  console.error('❌ BigInt test failed:', error);
  process.exit(1);
}
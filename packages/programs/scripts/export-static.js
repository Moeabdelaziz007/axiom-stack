const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting static export process...');

try {
  // Run next build
  console.log('Running next build...');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  console.log('Static export should be available in the "out" directory.');
  
  // Check if out directory exists
  if (fs.existsSync(path.join(__dirname, '..', 'out'))) {
    console.log('✅ Static export generated successfully!');
    console.log('Files in out directory:');
    const files = fs.readdirSync(path.join(__dirname, '..', 'out'));
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('⚠️  Warning: "out" directory not found. This might be due to Next.js configuration.');
    console.log('Checking .next directory for static files...');
    
    // Check if there are static files in .next
    const nextDir = path.join(__dirname, '..', '.next');
    if (fs.existsSync(nextDir)) {
      console.log('Files in .next directory:');
      const files = fs.readdirSync(nextDir);
      files.forEach(file => {
        console.log(`  - ${file}`);
      });
    }
  }
} catch (error) {
  console.error('❌ Error during static export:', error.message);
  process.exit(1);
}
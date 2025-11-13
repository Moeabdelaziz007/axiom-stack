#!/usr/bin/env node

// setup.mjs - Setup script for Axiom Assist Bot
import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Axiom Assist Bot Setup Script');
console.log('==================================\n');

// Check if we're in the right directory
if (!existsSync(join(__dirname, 'package.json'))) {
  console.error('❌ Error: Please run this script from the axiom-assist-bot directory');
  process.exit(1);
}

// Check if Node.js is available
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Error: Node.js is not installed or not in PATH');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm version: ${npmVersion}\n`);
} catch (error) {
  console.error('❌ Error: npm is not installed or not in PATH');
  process.exit(1);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if .env file exists, create from example if not
if (!existsSync(join(__dirname, '.env'))) {
  console.log('📝 Creating .env file from example...');
  try {
    const envExample = readFileSync(join(__dirname, '.env.example'), 'utf-8');
    writeFileSync(join(__dirname, '.env'), envExample);
    console.log('✅ .env file created. Please edit it to add your API keys.\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Instructions for next steps
console.log('📋 Next Steps:');
console.log('1. Edit the .env file to add your API keys:');
console.log('   - GEMINI_API_KEY: Your Google Gemini API key');
console.log('   - DISCORD_TOKEN: Your Discord bot token\n');

console.log('2. Run the knowledge base ingestion:');
console.log('   npm run ingest\n');

console.log('3. Test the core functionality:');
console.log('   npm start\n');

console.log('4. Run the Discord bot:');
console.log('   npm run bot\n');

console.log('📖 For detailed instructions, see the README.md file.');
console.log('🎉 Setup complete!');#!/usr/bin/env node

// setup.mjs - Setup script for Axiom Assist Bot
import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Axiom Assist Bot Setup Script');
console.log('==================================\n');

// Check if we're in the right directory
if (!existsSync(join(__dirname, 'package.json'))) {
  console.error('❌ Error: Please run this script from the axiom-assist-bot directory');
  process.exit(1);
}

// Check if Node.js is available
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Error: Node.js is not installed or not in PATH');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm version: ${npmVersion}\n`);
} catch (error) {
  console.error('❌ Error: npm is not installed or not in PATH');
  process.exit(1);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if .env file exists, create from example if not
if (!existsSync(join(__dirname, '.env'))) {
  console.log('📝 Creating .env file from example...');
  try {
    const envExample = readFileSync(join(__dirname, '.env.example'), 'utf-8');
    writeFileSync(join(__dirname, '.env'), envExample);
    console.log('✅ .env file created. Please edit it to add your API keys.\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Instructions for next steps
console.log('📋 Next Steps:');
console.log('1. Edit the .env file to add your API keys:');
console.log('   - GEMINI_API_KEY: Your Google Gemini API key');
console.log('   - DISCORD_TOKEN: Your Discord bot token\n');

console.log('2. Run the knowledge base ingestion:');
console.log('   npm run ingest\n');

console.log('3. Test the core functionality:');
console.log('   npm start\n');

console.log('4. Run the Discord bot:');
console.log('   npm run bot\n');

console.log('📖 For detailed instructions, see the README.md file.');
console.log('🎉 Setup complete!');
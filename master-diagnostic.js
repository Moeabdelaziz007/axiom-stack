/**
 * AXIOM ID - MASTER DIAGNOSTIC PROTOCOL
 * =====================================
 * This script is designed for AI Agents to autonomously verify
 * the integrity of the entire project ecosystem.
 * * Usage: node master-diagnostic.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    requiredFiles: [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        '.env.local' // or .env
    ],
    projectPaths: [
        'packages/web/landing-page',
        // Add other package paths here
    ],
    ports: [3000] // Ports to check availability
};

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m"
};

const log = (msg, type = 'info') => {
    const timestamp = new Date().toISOString();
    let color = colors.cyan;
    if (type === 'success') color = colors.green;
    if (type === 'error') color = colors.red;
    if (type === 'warn') color = colors.yellow;
    
    console.log(`${color}[${timestamp}] [${type.toUpperCase()}] ${msg}${colors.reset}`);
};

async function runDiagnostics() {
    console.log(`${colors.bold}🚀 STARTING AXIOM ID SYSTEM DIAGNOSTICS...${colors.reset}\n`);
    let errors = 0;

    // STEP 1: Environment Integrity
    try {
        log("Checking Environment...", 'info');
        const nodeVer = execSync('node -v').toString().trim();
        const npmVer = execSync('npm -v').toString().trim();
        log(`Node Version: ${nodeVer}`, 'success');
        log(`NPM Version: ${npmVer}`, 'success');
    } catch (e) {
        log("Failed to check environment versions", 'error');
        errors++;
    }

    // STEP 2: File System Structure
    log("Scanning Critical Files...", 'info');
    const basePath = path.join(__dirname, 'packages/web/landing-page'); 
    
    CONFIG.requiredFiles.forEach(file => {
        if (fs.existsSync(path.join(basePath, file))) {
            log(`Found: ${file}`, 'success');
        } else {
            log(`MISSING: ${file}`, 'error');
            // Don't count .env as critical error for build, but warn
            if(file.includes('.env')) log("Warning: .env file missing might cause runtime issues.", 'warn');
            else errors++;
        }
    });

    // STEP 3: TypeScript Static Analysis (Fast Check)
    log("Running TypeScript Type Check (Dry Run)...", 'info');
    try {
        // Only runs type checking, doesn't emit files (faster)
        execSync('cd packages/web/landing-page && npx tsc --noEmit', { stdio: 'ignore' });
        log("TypeScript Compilation: VALID", 'success');
    } catch (e) {
        log("TypeScript Compilation: FAILED", 'error');
        console.log(colors.red + "Hint: Run 'npm run build' manually to see detailed errors." + colors.reset);
        errors++;
    }

    // STEP 4: Dependency Audit
    log("Verifying Dependencies...", 'info');
    if (fs.existsSync(path.join(basePath, 'node_modules'))) {
        log("node_modules detected", 'success');
    } else {
        log("node_modules MISSING. Run 'npm install'", 'error');
        errors++;
    }

    // STEP 5: Network/API Simulation (If server is running)
    // This checks if the previous health-check script exists
    log("Checking for Health Protocol...", 'info');
    const healthScriptPath = path.join(basePath, 'scripts/health-check.mjs');
    if (fs.existsSync(healthScriptPath)) {
        log("Health Check Script Found. Ready for runtime verification.", 'success');
    } else {
        log("Health Check Script Not Found.", 'warn');
    }

    console.log(`\n${colors.bold}=========================================${colors.reset}`);
    if (errors === 0) {
        console.log(`${colors.green}${colors.bold}✅ SYSTEM STATUS: OPERATIONAL (READY FOR LAUNCH)${colors.reset}`);
        console.log(`${colors.green}The AI Agent can proceed with deployment or active tasks.${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`${colors.red}${colors.bold}❌ SYSTEM STATUS: CRITICAL ERRORS DETECTED (${errors})${colors.reset}`);
        console.log(`${colors.red}Immediate human intervention required before handing over to AI.${colors.reset}`);
        process.exit(1);
    }
}

runDiagnostics();
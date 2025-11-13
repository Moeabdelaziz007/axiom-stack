#!/bin/bash

# Build script for Axiom ID SDK

echo "Building Axiom ID SDK..."

# Navigate to the SDK directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the SDK
echo "Building SDK..."
npm run build

echo "Build complete! The SDK is now available in the dist/ directory."
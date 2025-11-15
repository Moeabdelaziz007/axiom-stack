#!/bin/bash

# Security check script to prevent committing sensitive information

echo "🔒 Running security checks..."

# Check if .env file is staged for commit
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ ERROR: .env file is staged for commit!"
    echo "   This file contains sensitive information and should never be committed."
    echo "   Run 'git reset .env' to unstage it."
    exit 1
fi

# Check for common sensitive patterns in staged files
SENSITIVE_PATTERNS=("AIzaSy" "sk-" "api_key" "secret" "password" "token")
STAGED_FILES=$(git diff --cached --name-only)

for file in $STAGED_FILES; do
    # Skip binary files
    if file --mime "$file" | grep -q "binary"; then
        continue
    fi
    
    # Check each sensitive pattern
    for pattern in "${SENSITIVE_PATTERNS[@]}"; do
        if git diff --cached "$file" | grep -q "$pattern"; then
            echo "❌ WARNING: Potential sensitive information found in $file"
            echo "   Pattern matched: $pattern"
            echo "   Please review and remove sensitive information before committing."
            exit 1
        fi
    done
done

echo "✅ Security checks passed"
exit 0
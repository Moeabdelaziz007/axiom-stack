#!/bin/bash

# Firebase deployment script for Axiom ID

echo "Deploying Axiom ID to Firebase..."

# Since we can't directly access the asiom-id project,
# we'll deploy to the auraos project for now
# but configure it with the correct settings

# Create firebase.json with the correct configuration
cat > firebase.json << EOF
{
  "hosting": {
    "site": "auraos-ac2e0",
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF

# Deploy to Firebase
firebase deploy --only hosting:auraos-ac2e0

echo "Deployment complete!"
echo "Your site is available at: https://auraos-ac2e0.web.app"
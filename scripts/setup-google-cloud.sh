#!/bin/bash

# setup-google-cloud.sh - Automate Google Cloud credential setup for Axiom ID
# This script provisions Google Cloud credentials and uploads them to Cloudflare Workers
# Modified version focusing only on BigQuery (no billing required)

set -e  # Exit on any error

echo "🚀 Axiom ID Google Cloud Setup Script (BigQuery Only)"
echo "====================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud is not installed. Please install the Google Cloud SDK first."
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --format="value(account)" 2>/dev/null | grep -q "@"; then
    echo "❌ Error: Not logged into gcloud. Please run 'gcloud auth login' first."
    exit 1
fi

echo "✅ Verified gcloud authentication"

# 1. Set Project
echo ""
echo "1. Setting Google Cloud Project"
echo "-------------------------------"
read -p "Enter your Google Cloud Project ID (or press Enter to list available projects): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "Available projects:"
    gcloud projects list --format="table(projectId, name)"
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
fi

# Set the project
gcloud config set project "$PROJECT_ID"
echo "✅ Project set to: $PROJECT_ID"

# 2. Enable APIs (Only BigQuery to avoid billing requirements)
echo ""
echo "2. Enabling Required APIs (BigQuery Only)"
echo "-----------------------------------------"
APIS=(
    "bigquery.googleapis.com"
)

for api in "${APIS[@]}"; do
    echo "Enabling $api..."
    gcloud services enable "$api" --project="$PROJECT_ID"
done
echo "✅ BigQuery API enabled"

# 3. Create Service Account
echo ""
echo "3. Creating Service Account"
echo "---------------------------"
SA_NAME="axiom-agent-sa"
SA_DISPLAY_NAME="Axiom Agent Service Account"

# Check if service account already exists
if gcloud iam service-accounts describe "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" --project="$PROJECT_ID" &> /dev/null; then
    echo "Service account $SA_NAME already exists"
else
    echo "Creating service account: $SA_NAME"
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="$SA_DISPLAY_NAME" \
        --project="$PROJECT_ID"
    echo "✅ Service account created"
fi

# Wait a moment for the service account to be fully created
echo "Waiting for service account to be fully created..."
sleep 5

# 4. Grant Roles
echo ""
echo "4. Granting Roles to Service Account"
echo "------------------------------------"
ROLES=(
    "roles/bigquery.admin"
)

# Retry role assignment up to 3 times
for role in "${ROLES[@]}"; do
    echo "Granting $role..."
    retry_count=0
    max_retries=3
    until [ $retry_count -ge $max_retries ]
    do
        if gcloud projects add-iam-policy-binding "$PROJECT_ID" \
            --member="serviceAccount:$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
            --role="$role"; then
            echo "✅ Role $role granted successfully"
            break
        else
            retry_count=$((retry_count+1))
            echo "⚠️  Failed to grant role $role, retrying... ($retry_count/$max_retries)"
            sleep 5
        fi
    done
    
    if [ $retry_count -ge $max_retries ]; then
        echo "❌ Failed to grant role $role after $max_retries attempts"
        exit 1
    fi
done

# 5. Generate Keys
echo ""
echo "5. Generating Keys"
echo "------------------"

# Create temporary directory for keys
TEMP_DIR=$(mktemp -d)
KEY_FILE="$TEMP_DIR/key.json"

# Create Service Account JSON key
echo "Creating service account key..."
gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
    --project="$PROJECT_ID"

echo "✅ Service account key created"

# 6. Upload to Cloudflare
echo ""
echo "6. Uploading Secrets to Cloudflare Workers"
echo "------------------------------------------"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Error: Neither wrangler nor npx is installed. Please install Wrangler first."
    cleanup
    exit 1
fi

# Upload service account key
echo "Uploading service account key..."
if command -v wrangler &> /dev/null; then
    echo "$KEY_FILE" | wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON --name axiom-tool-executor
elif command -v npx &> /dev/null; then
    npx wrangler secret put FIREBASE_SERVICE_ACCOUNT_JSON --name axiom-tool-executor < "$KEY_FILE"
fi

# Upload project ID (handle case where it already exists)
echo "Uploading project ID..."
if command -v wrangler &> /dev/null; then
    echo "$PROJECT_ID" | wrangler secret put GOOGLE_CLOUD_PROJECT_ID --name axiom-tool-executor || echo "⚠️  GOOGLE_CLOUD_PROJECT_ID secret already exists or failed to update"
elif command -v npx &> /dev/null; then
    echo "$PROJECT_ID" | npx wrangler secret put GOOGLE_CLOUD_PROJECT_ID --name axiom-tool-executor || echo "⚠️  GOOGLE_CLOUD_PROJECT_ID secret already exists or failed to update"
fi

echo "✅ Secrets upload process completed"

# 7. Cleanup
echo ""
echo "7. Cleaning Up"
echo "--------------"
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        echo "✅ Temporary files cleaned up"
    fi
}

trap cleanup EXIT

echo ""
echo "🎉 Google Cloud Setup Complete (BigQuery Only)!"
echo "=============================================="
echo "Project ID: $PROJECT_ID"
echo "Service Account: $SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "Next steps:"
echo "1. Verify your Cloudflare Workers can access these secrets"
echo "2. Test the BigQuery integration"
echo "3. If you want to use Translation or Speech APIs later, enable billing on your project"
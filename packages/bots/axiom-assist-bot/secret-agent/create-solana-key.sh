#!/bin/bash

# create-solana-key.sh - Script to create Solana keypair and store in GCSM
# usage: ./create-solana-key.sh <SECRET_NAME> <RENDER_SVC_ID> <RENDER_ENV_KEY>

SECRET_NAME=$1
RENDER_SVC_ID=$2
RENDER_ENV_KEY=$3
TOPIC_NAME="secret-updates-topic"
PROJECT_ID=$(gcloud config get-value project)

if [[ -z "$SECRET_NAME" || -z "$RENDER_SVC_ID" || -z "$RENDER_ENV_KEY" ]]; then
  echo "Usage: $0 <SECRET_NAME> <RENDER_SVC_ID> <RENDER_ENV_KEY>"
  exit 1
fi

echo "Generating Solana keypair for $SECRET_NAME and piping to GCSM..."

# [48] (keygen) + [43] (pipe to gcloud)
solana-keygen new --no-bip39-passphrase --outfile - \
  | gcloud secrets versions add $SECRET_NAME --data-file=-

# الخطوات الإضافية: إضافة علامات التوجيه وموضوع الحدث
echo "Tagging secret for Render sync..."
gcloud secrets update $SECRET_NAME --update-labels \
  "sync-target=render,render-service-id=$RENDER_SVC_ID,render-env-var-key=$RENDER_ENV_KEY"

echo "Attaching Pub/Sub topic for event notifications..."
gcloud secrets update $SECRET_NAME \
  --add-topic="projects/$PROJECT_ID/topics/$TOPIC_NAME"

echo "Solana keypair securely stored, tagged, and wired for sync."
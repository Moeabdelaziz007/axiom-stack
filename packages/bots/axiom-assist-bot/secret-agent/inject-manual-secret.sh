#!/bin/bash

# inject-manual-secret.sh - Secure injection script for manual secrets
# usage: ./inject_manual_secret.sh <SECRET_NAME> <RENDER_SVC_ID> <RENDER_ENV_KEY>
# مثال: ./inject_manual_secret.sh render-sync-DISCORD_BOT_TOKEN srv-123abc DISCORD_BOT_TOKEN

SECRET_NAME=$1
RENDER_SVC_ID=$2
RENDER_ENV_KEY=$3
TOPIC_NAME="secret-updates-topic"
PROJECT_ID=$(gcloud config get-value project)

if [[ -z "$SECRET_NAME" || -z "$RENDER_SVC_ID" || -z "$RENDER_ENV_KEY" ]]; then
  echo "Usage: $0 <SECRET_NAME> <RENDER_SVC_ID> <RENDER_ENV_KEY>"
  exit 1
fi

# 1. المطالبة الآمنة (Secure Prompt)
echo -n "Enter value for $SECRET_NAME (input will be hidden): "
read -s SECRET_VALUE
echo # لإضافة سطر جديد

# 2. الحقن الآمن (Secure Injection) [43, 44]
# نستخدم echo -n "$VAR" |... بدلاً من ملف
echo -n "$SECRET_VALUE" | gcloud secrets versions add $SECRET_NAME --data-file=-
echo "Secret $SECRET_NAME injected."

# 3. إضافة علامات التوجيه (Add Routing Labels) [18, 35]
echo "Tagging secret for Render sync..."
gcloud secrets update $SECRET_NAME --update-labels \
  "sync-target=render,render-service-id=$RENDER_SVC_ID,render-env-var-key=$RENDER_ENV_KEY"

# 4. ربط موضوع الإشعار (Wire Notification Topic)
echo "Attaching Pub/Sub topic for event notifications..."
gcloud secrets update $SECRET_NAME \
  --add-topic="projects/$PROJECT_ID/topics/$TOPIC_NAME"

echo "SUCCESS: $SECRET_NAME is now live and configured for automated sync."
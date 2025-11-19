#!/bin/bash

# setup-infrastructure.sh - Setup script for Secret Agent infrastructure
set -e

PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUM=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
REGION="us-central1" # اختر منطقتك

echo "🔧 Setting up Secret Agent infrastructure for project: $PROJECT_ID"

# 1. إنشاء حسابات الخدمة (SAs)
echo "Creating Service Accounts..."
gcloud iam service-accounts create sa-secret-agent --display-name="Secret Agent (Function Identity)"
gcloud iam service-accounts create sa-eventarc-trigger --display-name="Eventarc Trigger Identity"

# 2. إنشاء موضوع Pub/Sub
echo "Creating Pub/Sub topic..."
gcloud pubsub topics create secret-updates-topic

# 3. تطبيق سياسات IAM
echo "Applying IAM policies..."

# أ. السماح لـ GCSM بالنشر على Pub/Sub
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:service-$PROJECT_NUM@gcp-sa-secretmanager.iam.gserviceaccount.com" \
  --role="roles/pubsub.publisher"

# ب. السماح لـ Eventarc باستقبال الأحداث
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sa-eventarc-trigger@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/eventarc.eventReceiver"

# ج. تطبيق شرط الوصول العام لـ "الوكيل" [17, 21]
# يمنح هذا "الوكيل" الإذن بقراءة أي سر يبدأ بـ 'render-sync-'
echo "Applying conditional access for Secret Agent..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sa-secret-agent@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --condition='expression=resource.name.startsWith("projects/'$PROJECT_ID'/secrets/render-sync-"),title=render_sync_secrets'

echo "Infrastructure setup complete."
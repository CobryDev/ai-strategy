#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="open-ai-strategy"
REGION="europe-west2"
REPO_NAME="ai-strategy"
SERVICE_NAME="ai-strategy"

echo "==> Setting project to ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

echo "==> Enabling required APIs"
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com

echo "==> Creating Artifact Registry repository"
gcloud artifacts repositories create "${REPO_NAME}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="Docker images for ai-strategy" \
  2>/dev/null || echo "    (repository already exists)"

echo "==> Granting Cloud Build permission to deploy to Cloud Run"
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin" \
  --quiet

gcloud iam service-accounts add-iam-policy-binding \
  "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --quiet

echo ""
echo "==> Automated setup complete."
echo ""
echo "MANUAL STEP: Connect Cloud Build to GitHub and create the trigger."
echo "Run the following command, then follow the browser prompt to authorize:"
echo ""
echo "  gcloud builds triggers create github \\"
echo "    --name=\"deploy-on-push\" \\"
echo "    --repo-owner=\"CobryDev\" \\"
echo "    --repo-name=\"ai-strategy\" \\"
echo "    --branch-pattern=\"^main\$\" \\"
echo "    --build-config=\"cloudbuild.yaml\" \\"
echo "    --region=\"${REGION}\""
echo ""
echo "If you haven't connected GitHub to Cloud Build yet, do that first:"
echo "  https://console.cloud.google.com/cloud-build/triggers/connect?project=${PROJECT_ID}"

#!/bin/sh
# Deploys `dist` to the Netlify site's production URL through Netlify's API (a zip deploy),
# then waits until Netlify has processed it. Run after `yarn build`.
# Needs NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID; DEPLOY_TITLE (optional) labels the deploy.
set -eu

: "${NETLIFY_AUTH_TOKEN:?NETLIFY_AUTH_TOKEN is not set}"
: "${NETLIFY_SITE_ID:?NETLIFY_SITE_ID is not set}"

api=https://api.netlify.com/api/v1
zip_file=$(mktemp -d)/dist.zip
title=$(jq -rn --arg title "${DEPLOY_TITLE:-}" '$title | @uri')

(cd dist && zip -qr "$zip_file" .)

deploy=$(curl -sS --fail-with-body -X POST \
  -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  -H 'Content-Type: application/zip' \
  --data-binary "@$zip_file" \
  "$api/sites/$NETLIFY_SITE_ID/deploys?title=$title")
deploy_id=$(printf %s "$deploy" | jq -r .id)
echo "Uploaded deploy $deploy_id"

# A deploy goes uploaded → processing → ready (published), or ends in error.
for _ in $(seq 60); do
  deploy=$(curl -sS --fail-with-body -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" "$api/deploys/$deploy_id")
  state=$(printf %s "$deploy" | jq -r .state)
  case $state in
    ready)
      echo "Published $(printf %s "$deploy" | jq -r .ssl_url)"
      exit 0
      ;;
    error)
      echo "Deploy failed: $(printf %s "$deploy" | jq -r .error_message)" >&2
      exit 1
      ;;
  esac
  sleep 5
done

echo "Deploy $deploy_id was still '$state' after 5 minutes" >&2
exit 1

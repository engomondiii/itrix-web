#!/usr/bin/env bash
#
# itriX WEB (frontend) patch installer (v4.0.3 — realtime chat + live client-page generation)
#
# Run this from the ROOT of the itrix-web repo (the folder containing package.json + next.config.ts):
#
#     bash apply.sh
#
set -euo pipefail

REPO_ROOT="$(pwd)"

if [[ ! -f "$REPO_ROOT/package.json" || ! -d "$REPO_ROOT/src/app" ]]; then
  echo "✗ This does not look like the itrix-web root (no package.json / src/app/)."
  echo "  cd into the itrix-web repo root and run:  bash apply.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/files"
if [[ ! -d "$SRC" ]]; then
  echo "✗ Patch payload not found ($SRC). Unzip the patch here first."
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$REPO_ROOT/.patch-backup-$STAMP"
echo "→ Backing up any files this patch will overwrite into ./.patch-backup-$STAMP/"

while IFS= read -r abs; do
  rel="${abs#"$SRC"/}"
  dest="$REPO_ROOT/$rel"
  if [[ -f "$dest" ]]; then
    mkdir -p "$BACKUP/$(dirname "$rel")"
    cp "$dest" "$BACKUP/$rel"
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$abs" "$dest"
  echo "  ✓ $rel"
done < <(find "$SRC" -type f)

# Keep the safety backup out of git.
if [[ -f "$REPO_ROOT/.gitignore" ]] && ! grep -q '.patch-backup-' "$REPO_ROOT/.gitignore" 2>/dev/null; then
  printf '\n# itriX patch safety backups\n.patch-backup-*/\n' >> "$REPO_ROOT/.gitignore"
fi

echo "→ Cleaning up the patch files (they won't be committed)…"
rm -rf "$SRC"
find "$REPO_ROOT" -maxdepth 1 -type f -name 'itrix-web-patch*.zip' -delete 2>/dev/null || true
rm -f "$SCRIPT_DIR/apply.sh"
rmdir "$SCRIPT_DIR" 2>/dev/null || true

cat <<'DONE'

✓ Web patch applied.

WHAT CHANGED
  • The client-page & review chat proxies now normalize Django's reply into a proper
    ChatMessage → fixes the white-screen "Cannot read properties of undefined
    (reading 'length')" when you chat.
  • useAgentChat guarantees every message has a citations[] array and handles the
    live stream (message.delta → message.final) and the under-review state.
  • ChatThread reads citations defensively so it can never crash the page again.
  • socketEvents adds clientpage.delta / clientpage.final.
  • ClientPageLive now watches the page GENERATE live over the WebSocket (the "what we
    heard" narrative streams in token-by-token like Claude) and swaps to the finished
    AI page the moment it's ready — no reload, no blank wait. Falls back to polling
    only when realtime is off.

NEXT STEPS (on Railway, web service)
  1. Commit & push:   git add -A && git commit -m "realtime chat + live client-page streaming" && git push
  2. Confirm env vars: NEXT_PUBLIC_ENABLE_REALTIME=true, NEXT_PUBLIC_ENABLE_AGENT_CHAT=true,
     NEXT_PUBLIC_WS_URL=wss://itrix-backend-production.up.railway.app/ws
  3. Redeploy. (Deploy the BACKEND patch too — both are needed together.)

A timestamped backup of every overwritten file is in ./.patch-backup-*/  (safe to delete).
DONE

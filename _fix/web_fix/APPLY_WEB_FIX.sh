#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# itriX web (Next.js) fix applier
#
# Run this FROM THE itrix-web ROOT (the directory that contains package.json):
#
#     cd /path/to/itrix-web
#     unzip -o itrix-web-fix.zip -d _fix
#     bash _fix/APPLY_WEB_FIX.sh
#
# Backs up each overwritten file (…​.bak-YYYYmmddHHMMSS) then copies the fixed files
# into their exact locations. Idempotent + safe to re-run.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_ROOT="$(pwd)"
if [[ ! -f "$DEST_ROOT/package.json" ]]; then
  echo "ERROR: run this from the itrix-web root (the folder with package.json)." >&2
  echo "       current dir: $DEST_ROOT" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d%H%M%S)"
FILES=(
  "src/app/api/review/qualify/route.ts"
)

echo "itriX web fix → applying ${#FILES[@]} file(s) into: $DEST_ROOT"
for rel in "${FILES[@]}"; do
  src="$SRC_DIR/$rel"
  dest="$DEST_ROOT/$rel"
  if [[ ! -f "$src" ]]; then
    echo "  ! missing payload file: $rel (skipped)" >&2
    continue
  fi
  mkdir -p "$(dirname "$dest")"
  if [[ -f "$dest" ]]; then
    cp -p "$dest" "$dest.bak-$STAMP"
    echo "  • backed up  $rel  →  $rel.bak-$STAMP"
  fi
  cp -f "$src" "$dest"
  echo "  ✓ applied    $rel"
done

echo "Done. Rebuild/redeploy the web app (e.g. next build) to pick up the change."

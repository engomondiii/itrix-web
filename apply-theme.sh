#!/usr/bin/env bash
# =============================================================================
# itriX — apply "Mathematical Glass Intelligence" (Brand Bible v1.2) theme
# =============================================================================
# WHAT THIS DOES
#   Copies the 14 theme-layer files in this archive into their exact locations
#   inside itrix-web, overwriting the Atelier Indigo versions. It changes ONLY
#   colors / fonts / tokens / theme utilities — no architecture, routes, or
#   component logic are touched.
#
# HOW TO RUN
#   1. Put this archive (itrix-web-theme-v1.2.zip) in the itrix-web PROJECT ROOT
#      (the folder that contains package.json, tailwind.config.ts, and src/).
#   2. From that project root, run:
#         unzip -o itrix-web-theme-v1.2.zip && bash apply-theme.sh
#
#   The unzip expands a `theme-payload/` folder next to this script; the script
#   copies from there into ./src, ./public, and ./ (tailwind.config.ts).
#
# SAFETY
#   Every file it overwrites is first backed up to ./.theme-backup-<timestamp>/.
#   To undo: copy the files back from that backup folder (a restore hint prints
#   at the end).
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD_DIR="$SCRIPT_DIR/theme-payload"
PROJECT_ROOT="$(pwd)"

# --- sanity: are we in the itrix-web project root? -----------------------------
if [[ ! -f "$PROJECT_ROOT/package.json" || ! -d "$PROJECT_ROOT/src" ]]; then
  echo "ERROR: run this from the itrix-web project root (must contain package.json and src/)." >&2
  echo "       current dir: $PROJECT_ROOT" >&2
  exit 1
fi
if [[ ! -d "$PAYLOAD_DIR" ]]; then
  echo "ERROR: theme-payload/ not found next to this script." >&2
  echo "       Did you unzip the archive in the project root first?" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$PROJECT_ROOT/.theme-backup-$STAMP"

# The exact set of files shipped by this theme (relative to project root).
FILES=(
  "tailwind.config.ts"
  "src/app/globals.css"
  "src/app/layout.tsx"
  "src/context/ThemeContext.tsx"
  "src/styles/base.css"
  "src/styles/chat.css"
  "src/styles/glass.css"
  "src/styles/tokens/colors.css"
  "src/styles/tokens/typography.css"
  "src/styles/tokens/spacing.css"
  "src/styles/tokens/borders.css"
  "src/styles/tokens/shadows.css"
  "src/styles/tokens/motion.css"
  "public/fonts/README.md"
)

echo "itriX theme apply — Mathematical Glass Intelligence (Brand Bible v1.2)"
echo "project root : $PROJECT_ROOT"
echo "backup dir   : $BACKUP_DIR"
echo

copied=0
for rel in "${FILES[@]}"; do
  src="$PAYLOAD_DIR/$rel"
  dest="$PROJECT_ROOT/$rel"

  if [[ ! -f "$src" ]]; then
    echo "SKIP (missing in payload): $rel" >&2
    continue
  fi

  # Back up the current file if it exists.
  if [[ -f "$dest" ]]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
    cp -p "$dest" "$BACKUP_DIR/$rel"
  fi

  # Ensure the destination directory exists, then copy.
  mkdir -p "$(dirname "$dest")"
  cp -f "$src" "$dest"
  echo "applied: $rel"
  copied=$((copied + 1))
done

echo
echo "Done. $copied files applied."
if [[ -d "$BACKUP_DIR" ]]; then
  echo "Originals backed up in: $BACKUP_DIR"
  echo "To restore:  cp -R \"$BACKUP_DIR\"/. \"$PROJECT_ROOT\"/"
fi
echo
echo "Next steps:"
echo "  1) rm -rf .next        # clear the build cache so tokens re-generate"
echo "  2) npm install         # (only if you don't already have deps)"
echo "  3) npm run dev         # verify the new Glass theme renders"

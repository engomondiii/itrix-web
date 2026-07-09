#!/usr/bin/env bash
#
# apply.sh — install the itriX AI-app shell (Surface 1 v3.1) into itrix-web.
#
# WHAT IT DOES
#   Copies every file under ./files/ into the itrix-web repo at the SAME relative
#   path, replacing the current file where one exists. Before overwriting, it makes
#   a timestamped backup of each replaced file so you can roll back.
#
# HOW TO RUN
#   1. Unzip this package inside the itrix-web ROOT (the folder that has package.json).
#      You should end up with:  itrix-web/itrix-web-ai-shell/{apply.sh, files/, ...}
#   2. From the itrix-web root, run:
#         bash itrix-web-ai-shell/apply.sh
#      (or:  cd itrix-web-ai-shell && bash apply.sh)
#
# SAFETY
#   - Refuses to run unless it can see the itrix-web root (package.json + src/).
#   - Backs up every replaced file to itrix-web-ai-shell/backup-<timestamp>/.
#   - Dry-run available:  bash itrix-web-ai-shell/apply.sh --dry-run
#
set -euo pipefail

# ── locate the script dir and the repo root ─────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILES_DIR="$SCRIPT_DIR/files"

# Repo root = parent of this package dir. Allow override via $ITRIX_WEB_ROOT.
REPO_ROOT="${ITRIX_WEB_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

echo "itriX AI-app shell installer"
echo "  package : $SCRIPT_DIR"
echo "  repo    : $REPO_ROOT"
[ "$DRY_RUN" = "1" ] && echo "  mode    : DRY RUN (no files will be written)"
echo

# ── sanity checks ───────────────────────────────────────────────────────────
if [ ! -f "$REPO_ROOT/package.json" ] || [ ! -d "$REPO_ROOT/src" ]; then
  echo "ERROR: '$REPO_ROOT' does not look like the itrix-web root (missing package.json or src/)." >&2
  echo "       Place this package inside the itrix-web root, or set ITRIX_WEB_ROOT to the repo path:" >&2
  echo "         ITRIX_WEB_ROOT=/path/to/itrix-web bash apply.sh" >&2
  exit 1
fi

if [ ! -d "$FILES_DIR" ]; then
  echo "ERROR: files/ directory not found next to apply.sh." >&2
  exit 1
fi

# ── backup dir ──────────────────────────────────────────────────────────────
# Written OUTSIDE the repo tree (a sibling of the repo root) so the TypeScript
# compiler / linter never pick up the old copies (the project's tsconfig scans
# **/*.tsx). Override with $ITRIX_WEB_BACKUP_DIR if you prefer another location.
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${ITRIX_WEB_BACKUP_DIR:-$(cd "$REPO_ROOT/.." && pwd)/itrix-web-shell-backups/backup-$TS}"

copied=0
replaced=0
added=0

# ── copy loop ───────────────────────────────────────────────────────────────
# Iterate every file under files/ and mirror it into the repo.
while IFS= read -r -d '' src; do
  rel="${src#"$FILES_DIR"/}"          # e.g. src/components/shell/AppShell.tsx
  dest="$REPO_ROOT/$rel"
  dest_dir="$(dirname "$dest")"

  if [ -f "$dest" ]; then
    action="replace"
  else
    action="add"
  fi

  echo "  [$action] $rel"

  if [ "$DRY_RUN" = "1" ]; then
    continue
  fi

  # Back up an existing file before replacing it.
  if [ -f "$dest" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
    cp -p "$dest" "$BACKUP_DIR/$rel"
    replaced=$((replaced + 1))
  else
    added=$((added + 1))
  fi

  mkdir -p "$dest_dir"
  cp -p "$src" "$dest"
  copied=$((copied + 1))
done < <(find "$FILES_DIR" -type f -print0)

echo
if [ "$DRY_RUN" = "1" ]; then
  echo "Dry run complete. No files were written."
  exit 0
fi

echo "Done. Copied $copied file(s): $replaced replaced, $added added."
echo "Backups of replaced files: $BACKUP_DIR"
echo
echo "Next steps:"
echo "  1. Review the changes (git diff)."
echo "  2. npm run dev   # or your usual dev command"
echo "  3. If you ever need to roll back, copy files from the backup dir above."

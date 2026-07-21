#!/usr/bin/env bash
#
# itrix-web — v6.0 BACKEND CONTRACT FIX
#
# Two Next.js BFF routes called backend endpoints that do not exist. Both failed
# QUIETLY, which is why nothing looked broken.
#
# USAGE
#   Put this zip in the ROOT of itrix-web, unzip it, and run:
#
#       bash itrix-web-v6-contract-fix/APPLY.sh
#
# WHAT IT CHANGES
#   src/app/api/shell/route.ts          -> calls /threads/{id}/shell/, normalises casing
#   src/app/api/artifacts/[id]/route.ts -> reads artifacts from the thread detail
#
# NOTHING ELSE IS TOUCHED. No components, no types, no styling.

set -euo pipefail

PKG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${REPO_ROOT}/.v6-contract-fix-backup-${STAMP}"

BOLD=$'\033[1m'; RED=$'\033[31m'; GRN=$'\033[32m'; YLW=$'\033[33m'; DIM=$'\033[2m'; RST=$'\033[0m'
head1() { printf '\n%s%s%s\n' "$BOLD" "$*" "$RST"; }
ok()   { printf '  %s✓%s %s\n' "$GRN" "$RST" "$*"; }
warn() { printf '  %s!%s %s\n' "$YLW" "$RST" "$*"; }
die()  { printf '\n  %s✗ %s%s\n\n' "$RED" "$*" "$RST" >&2; exit 1; }

head1 "1/4  GUARD"
[[ -f "${REPO_ROOT}/package.json" ]] || die "No package.json here. Run this from the itrix-web root."
grep -q '"next"' "${REPO_ROOT}/package.json" || die "This does not look like a Next.js app."
[[ -d "${REPO_ROOT}/src/app/api" ]] || die "src/app/api is missing — wrong repo?"
[[ -f "${REPO_ROOT}/src/app/api/shell/route.ts" ]] || die "src/app/api/shell/route.ts is missing."
ok "itrix-web checkout confirmed"

if command -v git >/dev/null 2>&1 && git -C "${REPO_ROOT}" rev-parse --git-dir >/dev/null 2>&1; then
  if [[ -n "$(git -C "${REPO_ROOT}" status --porcelain)" ]]; then
    warn "Your working tree has uncommitted changes."
    read -r -p "  Continue? [y/N] " reply
    [[ "${reply}" =~ ^[Yy]$ ]] || die "Aborted. Nothing was changed."
  else
    ok "git working tree is clean"
  fi
fi

head1 "2/4  BACKUP"
mkdir -p "${BACKUP_DIR}"
n=0
while IFS= read -r rel; do
  [[ -z "${rel}" ]] && continue
  if [[ -f "${REPO_ROOT}/${rel}" ]]; then
    mkdir -p "${BACKUP_DIR}/$(dirname "${rel}")"
    cp -p "${REPO_ROOT}/${rel}" "${BACKUP_DIR}/${rel}"
    n=$((n+1))
  fi
done < "${PKG_DIR}/MANIFEST_INSTALL.txt"
ok "${n} file(s) backed up"
printf '  %s%s%s\n' "$DIM" "${BACKUP_DIR}" "$RST"
printf '  %sRestore: cp -a "%s"/. "%s"/%s\n' "$DIM" "${BACKUP_DIR}" "${REPO_ROOT}" "$RST"

head1 "3/4  INSTALL"
i=0
while IFS= read -r rel; do
  [[ -z "${rel}" ]] && continue
  [[ -f "${PKG_DIR}/files/${rel}" ]] || die "package is missing ${rel}"
  mkdir -p "${REPO_ROOT}/$(dirname "${rel}")"
  cp -p "${PKG_DIR}/files/${rel}" "${REPO_ROOT}/${rel}"
  i=$((i+1))
done < "${PKG_DIR}/MANIFEST_INSTALL.txt"
ok "${i} file(s) installed"

head1 "4/4  VERIFY"
failed=0
if grep -q 'API_BASE}/shell/' "${REPO_ROOT}/src/app/api/shell/route.ts" 2>/dev/null; then
  warn "shell route still calls the non-existent /shell/ endpoint"; failed=1
else
  ok "shell route now calls /threads/{id}/shell/"
fi
grep -q 'STATE_KEY_SLUG' "${REPO_ROOT}/src/app/api/shell/route.ts" && ok "state_key vocabulary mapped" || { warn "state_key mapping missing"; failed=1; }
grep -q 'sidebarSections' "${REPO_ROOT}/src/app/api/shell/route.ts" && ok "snake_case -> camelCase normalisation present" || { warn "normalisation missing"; failed=1; }

if command -v npx >/dev/null 2>&1 && [[ -f "${REPO_ROOT}/tsconfig.json" ]]; then
  printf '  %s… typechecking (this takes a moment)%s\n' "$DIM" "$RST"
  if npx --no-install tsc --noEmit >/tmp/itxweb-tsc.log 2>&1; then
    ok "tsc --noEmit clean"
  else
    warn "tsc reported errors:"
    tail -20 /tmp/itxweb-tsc.log | sed 's/^/      /'
    warn "(pre-existing errors are possible — compare against your baseline)"
  fi
else
  warn "npx/tsconfig not found — skipping the typecheck"
fi

cat <<'NEXT'

  NEXT
    1. Build and run locally against production:

         npm run build && npm run start

    2. Open the site with DevTools -> Network. Start a review, then check
       GET /api/shell?thread=... returns camelCase fields and a populated
       sidebarSections array.

    3. Walk the review far enough to reach the reflection. The sidebar should
       GROW at State 4 (documents, pathway appear). If it stays at five
       sections, the contract is still not landing — send me the response body.

    4. Deploy.

  WHAT WAS WRONG
    /api/shell called {API_BASE}/shell/, which Django does not mount. Every call
    404'd. The client's fallback is deliberately quiet — it drops to the five
    base sections — so the sidebar simply never grew and nothing logged an error.
    Django mounts the contract at /threads/{id}/shell/ and returns snake_case;
    this route now calls the real path and normalises the casing and the
    state_key vocabulary at the boundary.
NEXT

if [[ "${failed}" == "1" ]]; then
  printf '\n  %s! Verification reported problems.%s\n\n' "$YLW" "$RST"; exit 1
fi
printf '\n  %s✓ Contract fix applied.%s\n\n' "$GRN" "$RST"

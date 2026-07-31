# itrix-web - "View your page" button + no content pane on client page + itriX logo label
# 2026-08-01  (supersedes itrix-web-instant-page-and-logo-v1)
# ---------------------------------------------------------------------------
# WHAT THIS CHANGES (three things)
#
# 1. "VIEW YOUR PAGE" BUTTON (replaces auto-navigation).
#    When the backend reveals the personalised client page, the conversation now shows
#    a "View your page" button above the composer instead of jumping the visitor away
#    automatically. The visitor opens /c/<token> when they are ready. Navigation happens
#    only on the click, so the transcript's "never navigate on a turn" invariant holds.
#
# 2. NO CONTENT PANE ON THE CLIENT PAGE.
#    The right-hand content pane ("WHAT ITRIX HAS PREPARED" / Explore / Legal / Products
#    / Technology) no longer appears on the /c/<token> page. That page is its own content
#    surface, so the pane beside it was redundant and popped in every time a section
#    arrived. The LEFT conversation rail (New chat + history) is kept; only the right pane
#    is suppressed, and only on /c/ routes.
#
# 3. THE itriX TURN LABEL USES THE WORDMARK, NOT "ITRIX".
#    The speaker label above an itriX turn (and the "working" indicator that shares it)
#    was CSS-uppercased into "ITRIX". It now renders the supplied itriX logo. The generic
#    "YOU" label is unchanged.
#
# RUN FROM THE ROOT OF THE itrix-web REPO (the folder with package.json):
#     powershell -ExecutionPolicy Bypass -File .\itrix-web-instant-page-and-logo-v2\INSTALL.ps1
#
# Backs up every file it overwrites, refuses to run outside the repo root. No new
# dependencies. Uses the logo asset already in public/brand/.
# ---------------------------------------------------------------------------

$ErrorActionPreference = "Stop"

$ScriptDir  = Split-Path -LiteralPath $MyInvocation.MyCommand.Path -Parent
$PayloadDir = Join-Path -Path $ScriptDir -ChildPath "payload"

if (-not (Test-Path -LiteralPath "package.json")) {
    Write-Error "Run this from the itrix-web repo root (the folder with package.json). You are in: $((Get-Location).Path)"
    exit 1
}
if (-not (Test-Path -LiteralPath "src\components\shell")) {
    Write-Error "This does not look like itrix-web (src\components\shell is missing). Refusing to run."
    exit 1
}
if (-not (Test-Path -LiteralPath $PayloadDir)) {
    Write-Error "payload\ not found next to INSTALL.ps1. Unzip the package first, then run from the repo root."
    exit 1
}
if (-not (Test-Path -LiteralPath "public\brand\itrix-logo-primary.png")) {
    Write-Warning "public\brand\itrix-logo-primary.png not found - the itriX turn label needs it. Continuing, but confirm the asset exists."
}

$Stamp     = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = ".instant-page-and-logo-v2-backup-$Stamp"
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

Write-Host "itrix-web view-your-page + pane + logo - install $Stamp"
Write-Host "Backups -> $BackupDir\"
Write-Host ""

$PayloadRoot = (Resolve-Path -LiteralPath $PayloadDir).Path
$Updated = 0; $Added = 0
Get-ChildItem -LiteralPath $PayloadDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($PayloadRoot.Length + 1)
    $dst = Join-Path -Path (Get-Location).Path -ChildPath $rel

    if (Test-Path -LiteralPath $dst) {
        $b = Join-Path -Path $BackupDir -ChildPath $rel
        New-Item -ItemType Directory -Force -Path (Split-Path -LiteralPath $b -Parent) | Out-Null
        Copy-Item -LiteralPath $dst -Destination $b -Force
        $action = "updated"; $script:Updated++
    } else {
        $action = "added  "; $script:Added++
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -LiteralPath $dst -Parent) | Out-Null
    Copy-Item -LiteralPath $_.FullName -Destination $dst -Force
    if (-not (Test-Path -LiteralPath $dst)) { Write-Error "Failed to write $rel"; exit 1 }
    Write-Host "  $action  $rel"
}

Write-Host ""
Write-Host "Done. $Updated file(s) updated, $Added added, 0 removed. No new dependencies."
Write-Host ""
Write-Host "NEXT STEPS:"
Write-Host "  1. Verify:  npx tsc --noEmit"
Write-Host "              npm run build"
Write-Host "  2. git add -A"
Write-Host "  3. git commit -m 'View your page button; no content pane on client page; itriX logo label'"
Write-Host "  4. git push"
Write-Host ""
Write-Host "  After deploy: a 'View your page' button appears in the conversation when the"
Write-Host "  page is revealed; the right content pane no longer shows on /c/<token>; and"
Write-Host "  itriX turns show the wordmark instead of 'ITRIX'."
Write-Host ""
Write-Host "  Roll back by restoring from $BackupDir\ and deleting the new files"
Write-Host "  (ItrixTurnLabel.tsx, useClientPageReveal.ts, ViewYourPageButton.tsx)."

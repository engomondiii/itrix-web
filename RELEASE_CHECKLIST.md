# MVP release checklist

This is the lightweight release record for the frontend remediation branch. GitHub Actions validate; Railway continues to deploy automatically from `main` after the user merges.

## Release identity

- Backend base `main` SHA: `a4aa729aff322799101759f093fc3b4a7710848b`
- Frontend base `main` SHA: `9a155cfb0208366e8eb0a51d3778e4c8cd95d44d`
- Backend release branch: `mvp-release-hardening-20260907`
- Frontend release branch: `mvp-release-hardening-20260907`
- Final backend/frontend PR head SHAs: record immediately before merge.
- Backend/frontend PR numbers and URLs: record after PR creation.
- Rollback SHA for each repo: record the pre-merge `main` SHA.

## Frontend certification

- [ ] `npm ci`
- [ ] `npm run test:env`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] production `npm run build` with non-secret production-safe URLs/flags
- [ ] `npm run test:e2e:matrix`
- [ ] matrix count and one-partition-per-spec invariant recorded
- [ ] `npm run test:e2e:release` with real Chromium
- [ ] desktop/mobile responsive and accessibility partition included
- [ ] auth/logout, legal N→N+1, Try Again, thread continuity and safe-error regressions pass
- [ ] GitHub Actions green on the PR
- [ ] `git diff --check` clean

## Production environment verification

Verify values in Railway/Vercel-equivalent deployment settings without copying secrets into source or PRs:

- `NEXT_PUBLIC_SITE_URL` is the production site URL and not localhost.
- `NEXT_PUBLIC_API_URL` is the deployed backend URL and not localhost.
- `API_URL`, when set for server-side BFF calls, is valid and not localhost in production.
- `NEXT_PUBLIC_WS_URL` is configured when realtime is enabled; use `wss:` when the site is `https:`.
- `NEXT_PUBLIC_LEGAL_PUBLISHED=true` whenever open signup is enabled.
- Markdown allowed hosts exist when Markdown turns are enabled.
- Optional disabled features do not require unused configuration.
- All production feature flags match the intended MVP release surface.

Do not include secret values in this checklist or a PR.

## Railway deployment behavior

Do not add a GitHub deployment workflow. Railway automatic deployment from `main` remains the deployment mechanism.

Preferred merge order, subject to the final backward-compatibility review:

1. backend PR first
2. wait for backend Railway deploy, readiness, migrations/Knowledge actions and smoke checks
3. frontend PR second
4. wait for frontend automatic deploy
5. execute M01-M26 manual smoke matrix

## Smoke and rollback

Frontend smoke coverage must include EN/KO, mobile/responsive, accessibility, auth refresh/logout, rate limit, Try Again, thread continuity, legal version race and portal safe error classification.

Rollback:

1. use the recorded pre-merge frontend `main` SHA
2. revert the frontend merge commit on `main` rather than rewriting history
3. allow Railway automatic deployment of the revert
4. repeat critical frontend smoke tests

## Version/tag and GitHub Release

Do not create the final tag until both PRs are merged and production smoke checks pass.

```bash
git checkout main
git pull --ff-only
git tag -a <version> -m "itriX <version>"
git push origin <version>
```

Create the GitHub Release from the verified tag and include both PRs, final SHAs, validation results, environment verification, migration/Knowledge notes, smoke results and rollback SHAs.

# Deployment — GitHub Pages (gh-pages package)

This project deploys as a static Vite build to GitHub Pages using the [`gh-pages`](https://github.com/tschaub/gh-pages) npm package (branch method).

Live URL shape (project site):

```text
https://<USERNAME>.github.io/the-infinite-creep/
```

> If your repo is named differently, update `base` in `vite.config.ts` to `'/<REPO>/'`.
> Use `base: '/'` only for a user site (`<USER>.github.io`) or custom domain.
> Ref: https://vite.dev/guide/static-deploy

## Prerequisites

- Node LTS, `npm ci`
- GitHub repo with `main` branch (no remote configured yet in this checkout — add one first)
- `gh-pages` already in `devDependencies` (`npm install -D gh-pages` done)

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev (`vite --port=3000`) |
| `npm run build` | Production build to `dist/` + `postbuild` copies `dist/index.html` → `dist/404.html` (SPA refresh fallback) |
| `npm run preview` | Serve `dist/` locally to verify prod build (not a prod server) |
| `npm run lint` | `tsc --noEmit` typecheck |
| `npm run predeploy` | Alias for `npm run build` (runs automatically before `deploy`) |
| `npm run deploy` | `gh-pages -d dist -b gh-pages` — pushes `dist/` to `gh-pages` branch |

## First-time GitHub setup

1. Create repo on GitHub (e.g. `the-infinite-creep`), then:
   ```powershell
   git remote add origin https://github.com/<USERNAME>/the-infinite-creep.git
   git push -u origin main
   ```
2. Deploy once to create the branch:
   ```powershell
   npm run deploy
   ```
   This creates/pushes the `gh-pages` branch containing `dist/` + `.nojekyll`.
3. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from branch**, Branch: `gh-pages / (root)`, Save.
4. Wait 1–2 min, open `https://<USERNAME>.github.io/the-infinite-creep/`.

Subsequent deploys: just `npm run deploy`.

## Configuration notes

- `vite.config.ts: base: '/the-infinite-creep/'` — required so hashed assets resolve under the project subpath. Verified: `dist/index.html` references `/the-infinite-creep/assets/...`.
- `postbuild` creates `dist/404.html` so deep-refresh doesn't 404 on Pages (static host, no rewrites).
- `gh-pages -d dist -b gh-pages` includes `.nojekyll` by default so `_assets`/dotfiles aren't stripped by Jekyll.
- `preview` is local-only; never use it as production.

## CI variant (optional)

If you want Actions to deploy with the same package:

```yaml
- name: Deploy with gh-pages
  run: |
    git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
    npm run deploy -- -u "github-actions-bot <support+actions@github.com>"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Official Vite alternative is native Pages Actions (`actions/deploy-pages`), but this repo intentionally uses the `gh-pages` branch method per request — simpler, no workflow file needed.

## Troubleshooting

- **Blank page / 404 assets** → `base` doesn't match repo name. Rebuild after fixing.
- **404 on refresh** → missing `404.html`. `npm run build` recreates it via `postbuild`.
- **Old content cached** → hard refresh (`Ctrl+Shift+R`), Pages can lag ~1 min.
- **Pages shows README instead of app** → Source still set to `main`, switch to `gh-pages /(root)`.
- **Deploy auth fails** → `git remote -v` wrong; re-add origin with push rights, or use SSH remote.

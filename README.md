# MycelGlow

Shopify Hydrogen storefront skeleton generated on 2026-02-07 under the name MycelGlow; no store was connected and no custom code was added.

## Status

early stage

Both commits are from 2026-02-07 (`git log`): "Initial commit" and "Create a new Hydrogen project". Nothing was added after that. The tree is the stock `npm create @shopify/hydrogen` skeleton with the package name set to `MycelGlow`. The word MycelGlow appears nowhere else in the code. Development stopped the day it started. The code is kept for reference.

What does not work:

- The dev server starts and answers 500 with `Error: SESSION_SECRET environment variable is not set`. There is no `.env`, no linked Shopify store, and no storefront domain anywhere in the tree (only `example.myshopify.com` from the template).
- The Oxygen deploy workflow (`.github/workflows/oxygen-deployment-1000094531.yml`) has never run. Both triggers (2026-02-07 and 2026-03-01) failed after 3 seconds with "The job was not started because your account is locked due to a billing issue."
- `mycelglow.com` is not registered (NXDOMAIN; whois returns no match).
- Dependabot PR #1 (2026-03-01) is open and unmerged.

## Install and first run

Run on 2026-09-10 with Node 26.5.0 and npm 11.17.0 on macOS.

    npm ci
    npm run build

Output (tail): Hydrogen build completed, `dist/client` and `dist/server` written, exit 0.

    npm run typecheck

Output: `react-router typegen && tsc --noEmit` exits 0.

    npm run dev

Log: `Local: http://localhost:3000/`, then on the first request `Error: SESSION_SECRET environment variable is not set`. `curl http://localhost:3000/` returned HTTP 500.

To go further you need a Shopify store, `npx shopify hydrogen link`, and `npx shopify hydrogen env pull` to write `.env`. Not done today.

Not run today: `npm run preview`, `npm run lint`, any Shopify login, any deploy.

## What runs today

- `npm run build` and `npm run typecheck` on the stock skeleton.
- Template routes under `app/routes/` (products, collections, cart, search, account, blogs, policies, sitemap). All of them read from a Storefront API that is not configured here.

## Roadmap

None. Nothing is planned in the repository. A side branch `claude/nextjs-shopify-store-BQ9Uy` (2026-02-07) adds a Vercel config and was never merged.

## Limits

- This is Shopify's template, not a product. There is no MycelGlow catalog, theme, or copy in it.
- It cannot serve a store until a Shopify storefront is linked and the variables declared in `env.d.ts` are set.
- The GitHub Actions workflow will keep failing until the account billing lock is cleared and `OXYGEN_DEPLOYMENT_TOKEN_1000094531` exists as a repository secret.
- `CHANGELOG.md` is Hydrogen's upstream changelog, not this repository's history.

## License and contact

No license file.

Contact: michael@crowelogic.com

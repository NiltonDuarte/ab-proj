---
name: corre-mana-content
description: Manage the Corre, Mana static site's JSON content, feature lists, and content CLI without hardcoding page copy in the TypeScript UI.
---

# Corre, Mana content

Use this skill when adding or changing copy, experiences, running routes, breakfast recommendations, home workouts, challenges, nutrition content, partners, or coupons in this project.

- Keep page copy and lists in `src/content/`; the TypeScript renderer in `src/main.ts` should render those files instead of duplicating their content.
- Run `npm run content -- list` and `npm run content -- validate` after content changes. Use the CLI for item collections; edit `src/content/site.json` for brand and page copy.
- Never invent local venues, active partner deals, or coupon terms. Routes and breakfast recommendations require a city; publish partner offers only after their details are confirmed. Empty states are intentional until the community supplies real entries.
- Keep nutrition content general and educational. Individual food plans should be represented as an option to consult a qualified nutritionist, not generated as medical advice.
- When adding a feature collection, create its JSON file, register it in `src/content/index.ts` and `scripts/content.mjs`, and render its entries in `src/main.ts`.
- Preserve relative asset paths and the Vite `base: './'` setting so the release and nested feature previews work at GitHub Pages URLs. All remote branches except `main` receive nested previews automatically; keep non-main branch validation read-only and publish through the trusted workflow in `main`.
- After changing the renderer, CLI, or content shape, run `npm run build` and `npm run content -- validate` before handing off.

See `src/content/README.md` for the file map and CLI field requirements.

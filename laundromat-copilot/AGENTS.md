<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Project layout

Single Next.js 16 app in `/workspace/laundromat-copilot/`. No monorepo tooling.

### Key commands (run from `laundromat-copilot/`)

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` (ESLint 9) |
| Build | `npm run build` |
| Prisma generate | `DATABASE_URL="file:./prisma/dev.db" npx prisma generate` |
| Prisma migrate | `DATABASE_URL="file:./prisma/dev.db" npx prisma migrate dev` |

### Non-obvious gotchas

- **Prisma + dotenv**: `prisma.config.ts` uses `import "dotenv/config"` which loads `.env` (not `.env.local`). When running Prisma CLI commands, pass `DATABASE_URL` as an env var prefix: `DATABASE_URL="file:./prisma/dev.db" npx prisma ...`
- **Prisma generate before dev server**: You must run `npx prisma generate` before starting `npm run dev`, otherwise API routes that use `@prisma/client` will fail with "Cannot find module '.prisma/client/default'".
- **Dev server restart after Prisma generate**: If you generate the Prisma client while the dev server is running, you must restart the dev server (and clear `.next/` with `rm -rf .next`) for the new client to be picked up.
- **TypeScript strict mode**: The build (`next build`) will fail due to a pre-existing implicit `any` type error in `src/app/api/deals/route.ts`. The dev server works fine regardless.
- **ESLint**: Has 2 pre-existing errors (variable declaration order, prefer-const) and 3 warnings. These are in checked-in code.
- **OPENAI_API_KEY required**: The `/api/analyze` endpoint requires a valid `OPENAI_API_KEY` env var. Without it, deal analysis will fail. Set it in `.env.local`.
- **Playwright Chromium**: Used for URL scraping fallback. Install with `npx playwright install chromium` and system deps with `npx playwright install-deps chromium`.

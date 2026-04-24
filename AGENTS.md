<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Local Development

## Setup (Required Order)
1. `docker compose up -d` - Start PostgreSQL
2. `npm install` - Install dependencies
3. `npx prisma generate` - Generate Prisma client (only after schema changes)

## Commands
```bash
npm run dev     # Dev server (port 3000)
npm run build   # Production build
npm run lint   # ESLint only (no typecheck script in package.json)
```

## Database
- PostgreSQL via Docker: `postgresql://postgres:postgres@localhost:5432/ai-knowledge-app`
- Prisma 7.7.0 with PrismaPg adapter (not the default driver)
- Schema: `prisma/schema.prisma`
- Generated client: `app/generated/prisma/` (custom output path)

## Key Files
- `app/lib/db.ts` - Prisma singleton with adapter
- `app/api/chat/route.ts` - Main chat endpoint
- `app/api/search/route.ts` - Search endpoint
- `app/api/ingest/route.ts` - Document ingestion
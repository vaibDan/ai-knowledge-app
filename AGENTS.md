<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Local Development

## Database
- Uses Docker PostgreSQL (`docker compose up -d`)
- Connection: `postgresql://postgres:postgres@localhost:5432/ai-knowledge-app`

## Prisma 7.7.0 Setup
- Schema: `prisma/schema.prisma`
- Config: `prisma.config.ts`
- Generated client: `app/generated/prisma/` (custom output path)
- After editing schema: run `npx prisma generate`
- Client initialization uses PrismaPg adapter (see `app/lib/db.ts`)

## Commands
```bash
npm run dev     # Start dev server (port 3000)
npm run lint   # ESLint
npx prisma generate  # Regenerate Prisma client
```

## Key Files
- `app/lib/db.ts` - Prisma client singleton
- `app/api/route/route.ts` - Example API route
- `prisma/schema.prisma` - Database schema
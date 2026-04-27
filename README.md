# AI Knowledge App

A Next.js 16.2.4 application with PostgreSQL, Prisma 7.7.0, and Google Generative AI for knowledge management and chat.

## Quick Start

```bash
# Start PostgreSQL (required)
docker compose up -d

# Install dependencies
npm install

# Generate Prisma client (after schema changes)
npx prisma generate

# Start dev server
npm run dev
```

## Environment

Create `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai-knowledge-app
GOOGLE_API_KEY=your-key-here
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx prisma generate` | Regenerate Prisma client |

## API Routes

- `POST /api/chat` - Chat endpoint
- `POST /api/search` - Search documents
- `POST /api/ingest` - Ingest documents
- `GET /api/test` - Test endpoint

## Tech Stack

- Next.js 16.2.4
- Prisma 7.7.0 with PrismaPg adapter
- PostgreSQL (Docker)
- Google Generative AI
- React 19 / Tailwind 4
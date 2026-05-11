# AI Knowledge App

AI Knowledge App is a Next.js 16 app for building a personal, authenticated knowledge base. Users can register, add documents as raw text, and chat against their own stored content with retrieval-augmented responses.

## What It Does

- User registration and login with NextAuth credentials-based auth
- Per-user document storage in PostgreSQL
- Document chunking plus vector embeddings with Google Generative AI
- Hybrid retrieval using pgvector similarity and PostgreSQL full-text search
- Cohere reranking before answer generation
- Streaming chat responses with saved chat history

## Tech Stack

- Next.js 16.2.4
- React 19
- Prisma 7.7.0 with `@prisma/adapter-pg`
- PostgreSQL with `pgvector`
- NextAuth v5 beta
- Google Generative AI
- Cohere Rerank
- Tailwind CSS 4

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- A Google AI API key
- A Cohere API key

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_knowledge
GOOGLE_API_KEY=your_google_api_key
COHERE_API_KEY=your_cohere_api_key
AUTH_SECRET=replace-with-a-long-random-string
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

Notes:

- `DATABASE_URL` above matches the checked-in [`docker-compose.yml`](/home/vaibhav/ai-knowledge-app/docker-compose.yml:1).
- The older `ai-knowledge-app` database name shown in some project notes does not match the current compose file. Use `ai_knowledge` unless you also change the compose config.

## Local Development

Start services in this order:

```bash
docker compose up -d
npm install
npx prisma generate
```

For a first-time setup on a fresh database, also create the tables:

```bash
npx prisma db push
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server on port 3000 |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate the Prisma client |
| `npx prisma db push` | Push the schema to the database |

## Typical Workflow

1. Register a new account at `/register`.
2. Sign in at `/login`.
3. Open `/ingest` and add a document title plus plain text content.
4. Open `/chat` and ask questions against your uploaded content.

Current ingestion is text-based. The UI does not currently upload PDFs or files directly even if some landing-page copy still suggests that future direction.

## How Retrieval Works

When a document is added:

- The content is split into chunks
- Each chunk gets an embedding from `gemini-embedding-001`
- Chunks are stored in PostgreSQL with vector and full-text search data

When a user asks a question:

- The question is embedded
- Candidate chunks are retrieved with a hybrid semantic plus keyword query
- Results are reranked with Cohere `rerank-english-v3.0`
- Top context is sent to Gemini for a streamed response
- Messages are saved to the user’s chat history

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/register` | `POST` | Create a user account |
| `/api/auth/[...nextauth]` | auth handlers | NextAuth routes |
| `/api/ingest` | `POST` | Add a document for the signed-in user |
| `/api/chat` | `POST` | Ask a question and stream an answer |
| `/api/chats` | `GET` | List saved chats for the signed-in user |
| `/api/chats/[id]` | `GET`, `DELETE` | Fetch or delete a saved chat |

## Project Structure

- [`app/api/chat/route.ts`](/home/vaibhav/ai-knowledge-app/app/api/chat/route.ts:1): main chat pipeline
- [`app/api/ingest/route.ts`](/home/vaibhav/ai-knowledge-app/app/api/ingest/route.ts:1): document ingestion
- [`app/lib/db.ts`](/home/vaibhav/ai-knowledge-app/app/lib/db.ts:1): Prisma singleton with PrismaPg adapter
- [`app/lib/embedding.ts`](/home/vaibhav/ai-knowledge-app/app/lib/embedding.ts:1): embedding generation
- [`app/lib/rerank.ts`](/home/vaibhav/ai-knowledge-app/app/lib/rerank.ts:1): Cohere reranking
- [`prisma/schema.prisma`](/home/vaibhav/ai-knowledge-app/prisma/schema.prisma:1): data model

## Important Notes

- This project uses a custom Prisma client output path: `app/generated/prisma/`.
- The database image in Docker is `ankane/pgvector`, which is required for vector search.
- `npm run lint` is available, but there is no dedicated typecheck script in `package.json`.

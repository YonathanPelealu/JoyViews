# JoyViews 🔥

**Code Roasting as a Service** - AI-powered code reviews delivered with the brutal honesty of a stand-up comedian.

Get your code absolutely destroyed with savage feedback that's actually helpful. Our AI reviewers will tear your code apart while teaching you to write better code. Warning: Your ego may not survive.

## Features

- **Savage Roasts**: Get brutally honest feedback delivered with comedic timing
- **Actually Helpful**: Every roast comes with real technical feedback and suggestions
- **Multiple AI Roasters**: Choose between GPT-4o and Claude for different roasting styles
- **GitHub Integration**: Roast pull requests directly from your repositories
- **Roast History**: Keep a record of all your code's public humiliation
- **Rate Limiting**: Built-in rate limiting with Upstash Redis (optional)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth.js v5 with GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI SDK, Anthropic SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Deployment**: Docker, Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Vercel Postgres, Neon, Supabase, or local)
- GitHub OAuth App
- OpenAI and/or Anthropic API keys

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/joyviews.git
cd joyviews
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
# AI Providers
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Rate Limiting (optional)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

5. Set up the database:

```bash
npx prisma db push
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Setting up GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: JoyViews
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret to your `.env` file

## Project Structure

```
JoyViews/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login page
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Header, sidebar
│   │   ├── review/             # Code review components
│   │   └── github/             # GitHub integration components
│   ├── lib/
│   │   ├── ai/                 # AI provider implementations
│   │   ├── auth/               # NextAuth config
│   │   ├── db/                 # Prisma client
│   │   ├── github/             # GitHub API client
│   │   └── utils/              # Helpers, validators
│   ├── stores/                 # Zustand state
│   └── hooks/                  # React Query hooks
├── prisma/
│   └── schema.prisma           # Database schema
└── public/                     # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Docker (Recommended for Self-Hosting)

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Configure your `.env` file with your credentials

3. Start all services with Docker Compose:

```bash
docker compose up -d
```

4. Run database migrations:

```bash
docker compose run --rm migrate
```

5. Access the application at [http://localhost:3000](http://localhost:3000)

#### Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Remove all data (volumes)
docker compose down -v
```

#### Development with Docker

For local development, you can use Docker just for the database:

```bash
# Start only database and Redis
docker compose -f docker-compose.dev.yml up -d

# Then run the app locally
npm run dev
```

Update your `.env` with the local database URL:
```env
DATABASE_URL=postgresql://joyviews:joyviews_dev@localhost:5432/joyviews_dev
```

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- Update `NEXTAUTH_URL` to your production URL
- Generate a secure `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- Use your production database URL

## API Endpoints

- `POST /api/ai/review` - Create a code review
- `GET /api/reviews` - List reviews (paginated)
- `GET /api/reviews/[id]` - Get review details
- `DELETE /api/reviews?id=xxx` - Delete a review
- `GET /api/github/repos` - List user's GitHub repos
- `GET /api/github/prs` - List PRs for a repo
- `GET /api/github/diff` - Get PR diff
- `POST /api/github/review` - Review a PR

## License

MIT

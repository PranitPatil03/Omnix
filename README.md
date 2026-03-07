# Omnixx — AI-Powered Customer Support Platform

An open-source, multi-tenant AI customer support platform — deploy an intelligent chatbot on any website that answers questions from your knowledge base, handles voice calls, and escalates to human operators when needed. Built with **Next.js 15**, **Convex**, **Claude AI**, **Stripe**, and **Vapi**.

---

## Features

- **AI Chat Agent** — Claude-powered chatbot that answers customer questions using your business context
- **RAG Knowledge Base** — Upload docs (PDF, images, text); AI extracts, embeds, and searches them at query time
- **Embeddable Widget** — Drop a `<script>` tag on any website to add a chat widget
- **Voice AI** — In-browser voice calls and phone support powered by Vapi
- **Real-time Dashboard** — Manage conversations, escalations, and operator handoffs live
- **Multi-Tenant Orgs** — Isolated workspaces with team invitations and role management
- **Stripe Billing** — Pro plan subscriptions with self-service billing portal
- **OAuth + Email Auth** — Sign in with GitHub, Google, or email/password via Better Auth

---

## Features — Detailed

### AI Chat Agent

- AI agent **"Milo"** powered by **Claude Haiku 4.5** (Anthropic) for fast, context-aware responses
- AI-powered **file extraction** — OCR for images, text extraction from PDFs and HTML
- **Operator response enhancement** — AI-assisted response drafting for human operators (Pro plan)
- Built-in tools: knowledge base search, conversation escalation, and resolution
- **RAG knowledge base** — upload PDFs, images, or text files; content is extracted, chunked, embedded (OpenAI `text-embedding-3-small`), and searched at query time

### Embeddable Chat Widget

- Lightweight **embed script** (`<script>` tag) that loads a chat widget iframe on any website
- Real-time **text chat** with the AI agent
- **Vapi voice AI** integration — in-browser voice calls and phone number support
- Configurable via `data-organization-id` and `data-position` attributes
- Customizable appearance: company name, tagline, greeting message, default suggestions

### Dashboard

- **Conversations** — view and manage all customer support threads in real-time
- **Knowledge Base** — upload and manage documents that power the AI agent's responses
- **Business Info** — configure business context (company details, policies, hours) used by the AI
- **Widget Customization** — customize the widget's look, greeting, and suggested questions
- **Integrations & Plugins** — manage third-party integrations (Vapi voice AI)
- **Plans & Billing** — Stripe-powered subscription management with Pro plan features

### Multi-Tenant Organizations

- Create and manage multiple organizations
- Invite team members via email (powered by Resend)
- Organization-scoped data isolation
- Switch between organizations seamlessly

### Authentication

- **Email/password** authentication
- **Social OAuth** — GitHub and Google
- Organization invitations and member management
- JWT-based session management with middleware-protected routes

### Billing & Subscriptions

- Stripe Checkout for Pro plan subscriptions
- Stripe Customer Portal for self-service billing management
- Webhook-driven subscription lifecycle tracking

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-EE342F?style=for-the-badge&logo=convex&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Anthropic](https://img.shields.io/badge/Claude_AI-D4A574?style=for-the-badge&logo=anthropic&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Jotai](https://img.shields.io/badge/Jotai-000000?style=for-the-badge&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Vapi](https://img.shields.io/badge/Vapi_Voice_AI-5046E5?style=for-the-badge&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logoColor=white)

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework (App Router, Turbopack) |
| **React 19** | UI library |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui** + **Radix UI** | Component library |
| **Jotai** | State management |
| **React Hook Form** + **Zod** | Form handling and validation |
| **Lucide React** | Icons |
| **Recharts** | Analytics charts |
| **Sonner** | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| **Convex** | Real-time backend-as-a-service (database, serverless functions, subscriptions) |
| **Better Auth** | Authentication (email/password, OAuth, organizations) |
| **Stripe** | Payments and subscription billing |
| **Resend** | Transactional emails (invitations) |

### AI / ML

| Technology | Purpose |
|---|---|
| **@convex-dev/agent** | AI agent framework |
| **@convex-dev/rag** | RAG pipeline (chunking, embedding, search) |
| **Vercel AI SDK** | LLM integration layer |
| **Anthropic Claude Haiku 4.5** | Primary LLM for chat responses |
| **OpenAI** | Text embeddings (`text-embedding-3-small`) |
| **Vapi** | Voice AI (in-browser + phone) |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Turborepo** | Monorepo build orchestration |
| **pnpm** | Package management |
| **Vite** | Embed script bundler |
| **Sentry** | Error monitoring and performance tracking |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10
- A **Convex** account ([convex.dev](https://convex.dev))
- A **Stripe** account (for billing features)
- API keys for **Anthropic** and **OpenAI** (for AI features)

### 1. Clone and Install

```bash
git clone https://github.com/PranitPatil03/Omnix.git
cd Omnix
pnpm install
```

### 2. Set Up Convex

```bash
npx convex dev
```

This will prompt you to create a new Convex project and generate the necessary configuration.

### 3. Configure Environment Variables

#### `apps/web/.env.local`

```env
NEXT_PUBLIC_CONVEX_URL="<your-convex-deployment-url>"
NEXT_PUBLIC_CONVEX_SITE_URL="<your-convex-site-url>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_PRO_PRODUCT_ID="prod_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

#### `apps/widget/.env.local`

```env
NEXT_PUBLIC_CONVEX_URL="<your-convex-deployment-url>"
```

#### `apps/embed/.env`

```env
VITE_WIDGET_URL="http://localhost:3001"
```

#### Convex Dashboard Environment Variables

Set these in your Convex project dashboard:

```
BETTER_AUTH_SECRET          # Random secret for auth token signing
SITE_URL                    # Your dashboard URL (http://localhost:3000 for dev)

# OAuth (optional)
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

# AI
ANTHROPIC_API_KEY           # For Claude Haiku (chat agent)
OPENAI_API_KEY              # For text embeddings (RAG)

# Email (optional)
RESEND_API_KEY              # For organization invitations

# Encryption
ENCRYPTION_KEY              # 64-character hex string for AES-256-GCM

# Stripe
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### 4. Run Development Servers

```bash
pnpm dev
```

This starts all apps concurrently:

| App | URL | Description |
|---|---|---|
| Dashboard | [http://localhost:3000](http://localhost:3000) | Admin dashboard |
| Widget | [http://localhost:3001](http://localhost:3001) | Chat widget |
| Embed Dev | [http://localhost:3002](http://localhost:3002) | Embed script dev server |

### 5. Build for Production

```bash
pnpm build
```

---

## Embedding the Widget

Add this script tag to any website to load the Omnixx chat widget:

```html
<script
  src="https://your-embed-url/embed.js"
  data-organization-id="your-org-id"
  data-position="right"
  defer
></script>
```

| Attribute | Description |
|---|---|
| `data-organization-id` | Your organization ID from the dashboard |
| `data-position` | Widget position — `"left"` or `"right"` (default: `"right"`) |

---

## Data Model

| Table | Description |
|---|---|
| `conversations` | Support conversations with status tracking (`unresolved` → `escalated` / `resolved` / `operator_review`) |
| `contactSessions` | Customer browser sessions with device/platform metadata |
| `businessInfo` | Organization business context used by the AI agent |
| `widgetSettings` | Widget customization config per organization |
| `plugins` | Third-party integration credentials (encrypted) |
| `subscriptions` | Stripe billing status per organization |
| `users` | User accounts |

---

## Key Architecture Decisions

- **Multi-tenant isolation** — all data is scoped by `organizationId`; organizations are the primary boundary
- **Real-time subscriptions** — Convex provides live updates for conversations and messages without polling
- **RAG pipeline** — documents → AI text extraction → chunking → OpenAI embeddings → vector search at query time
- **Encrypted secrets** — plugin credentials are encrypted with AES-256-GCM before storage
- **Component architecture** — Convex components for Agent, RAG, and Better Auth are composed via `convex.config.ts`
- **Monorepo** — shared UI components, TypeScript configs, and backend code across all apps

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm format` | Format code with Prettier |

---

## Project Structure

```
omnixx/
├── apps/
│   ├── web/                          # Dashboard app (Next.js 15, port 3000)
│   │   ├── app/
│   │   │   ├── (auth)/              # Auth pages — sign-in, sign-up, org-selection
│   │   │   ├── (dashboard)/         # Protected dashboard pages
│   │   │   │   ├── conversations/   # Customer support threads
│   │   │   │   ├── files/           # Knowledge base file uploads
│   │   │   │   ├── business-info/   # Business context editor
│   │   │   │   ├── customization/   # Widget appearance settings
│   │   │   │   ├── integrations/    # Third-party integrations
│   │   │   │   ├── plugins/         # Plugin config (Vapi voice)
│   │   │   │   ├── billing/         # Stripe subscription management
│   │   │   │   └── settings/        # Organization/account settings
│   │   │   ├── (marketing)/         # Public landing page
│   │   │   ├── (onboarding)/        # New user onboarding flow
│   │   │   ├── api/                 # Next.js API routes (Stripe, auth)
│   │   │   └── invite/              # Organization invitation acceptance
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                # Auth views and components
│   │   │   ├── dashboard/           # Conversation management UI
│   │   │   ├── business-info/       # Business context forms
│   │   │   ├── customization/       # Widget settings UI
│   │   │   ├── files/               # Knowledge base management
│   │   │   ├── billing/             # Billing UI
│   │   │   ├── integrations/        # Integration management
│   │   │   ├── plugins/             # Vapi plugin hooks + UI
│   │   │   └── settings/            # Settings UI
│   │   ├── lib/                     # Auth client, utilities
│   │   └── public/                  # Static assets, images
│   │
│   ├── widget/                      # Chat widget app (Next.js 15, port 3001)
│   │   ├── app/                     # Widget app shell
│   │   └── modules/widget/
│   │       ├── atoms/               # Jotai state atoms
│   │       ├── hooks/               # Custom hooks (Vapi, etc.)
│   │       └── ui/
│   │           ├── components/      # Footer, header, streaming text
│   │           └── screens/         # Chat, voice, inbox, auth,
│   │                                # selection, contact, error screens
│   │
│   └── embed/                       # Embed script (Vite, port 3002)
│       ├── embed.ts                 # Script entry — creates iframe + chat button
│       ├── config.ts                # Widget configuration
│       ├── icons.ts                 # SVG icons for the button
│       ├── demo.html                # Local dev testing page
│       └── landing.html             # Landing page demo
│
├── packages/
│   ├── backend/                     # Convex backend (serverless)
│   │   └── convex/
│   │       ├── schema.ts            # Database schema
│   │       ├── auth.config.ts       # Better Auth configuration
│   │       ├── convex.config.ts     # Convex component composition
│   │       ├── http.ts              # HTTP routes (auth, Stripe webhook)
│   │       ├── playground.ts        # AI agent playground
│   │       ├── public/              # Public API (conversations, messages,
│   │       │                        # contacts, widget settings, orgs)
│   │       ├── private/             # Authenticated API (business info,
│   │       │                        # files, plugins, subscriptions, Vapi)
│   │       ├── system/              # System functions (AI agent, billing,
│   │       │                        # seeding, internal ops)
│   │       └── lib/                 # Shared utils (encryption, text
│   │                                # extraction, secrets management)
│   │
│   ├── ui/                          # Shared UI library (shadcn/ui + Radix)
│   │   └── src/
│   │       ├── components/          # Button, Dialog, Dropdown, Sidebar,
│   │       │                        # AI chat components, etc.
│   │       ├── hooks/               # Shared React hooks
│   │       └── lib/                 # Utilities (cn, etc.)
│   │
│   ├── eslint-config/               # Shared ESLint configurations
│   ├── typescript-config/           # Shared TypeScript configs
│   └── math/                        # Shared math utilities
```

# Collective Agreements RAG — Frontend

Frontend application for an AI-powered system that enables users to query Collective Labor Agreements using natural language.

## Overview

This application provides the user interface for the Collective Agreements RAG project.

The platform is designed to support semantic document search and display AI-generated answers grounded in retrieved document excerpts.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm
- ESLint

## Requirements

- Node.js 22
- pnpm 11

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Code Quality

Run ESLint:

```bash
pnpm lint
```

Check TypeScript types:

```bash
pnpm exec tsc --noEmit
```

Create a production build:

```bash
pnpm build
```

## Development Status

The initial frontend setup is complete.

The chat interface, API integration, and document source visualization will be implemented incrementally in subsequent pull requests.

## Backend

The backend is developed separately using FastAPI, LangChain, OpenAI, and FAISS.

Repository: https://github.com/Denilson-P/collective-agreements-rag

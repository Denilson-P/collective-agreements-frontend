# Collective Agreements RAG — Frontend

Frontend application for an AI-powered platform that enables users to query Collective Labor Agreements using natural language and manage document indexing.

## Overview

The Collective Agreements RAG frontend provides an interface for interacting with a Retrieval-Augmented Generation (RAG) system.

Users can upload collective agreement documents, monitor indexing results, and ask questions about indexed content. Answers are generated using relevant document excerpts retrieved by the backend.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm
- ESLint
- Docker

## Features

### AI-Powered Chat

- Natural-language questions about collective agreements
- Integration with the FastAPI backend
- AI-generated answers grounded in retrieved document content
- Supporting document sources for response verification

### Document Upload

- Individual and batch document uploads
- Support for TXT, PDF, DOCX, and DOC files
- Up to 50 documents per batch
- Maximum file size of 10 MB per document
- Client-side file validation
- Individual indexing results for each uploaded document
- Summary of successful and failed uploads
- Informative messages for previously indexed documents

### User Experience

- Responsive interface
- Loading and error states
- Prevention of simultaneous upload requests
- Upload request cancellation and state cleanup
- Scrollable document and result lists

## Requirements

For local development:

- Node.js 22
- pnpm 11
- Running backend API

For containerized execution:

- Docker
- Docker Compose

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Denilson-P/collective-agreements-frontend.git
cd collective-agreements-frontend
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Backend Integration

The frontend communicates with the backend through Next.js API rewrites.

The following routes are supported:

| Frontend Route | Backend Route | Description |
|---|---|---|
| `/api/chat` | `/chat` | Submit natural-language questions |
| `/api/documents/upload` | `/documents/upload` | Upload a single document |
| `/api/documents/upload/batch` | `/documents/upload/batch` | Upload multiple documents |

The backend URL is configured through the `BACKEND_URL` environment variable.

For local development, the default backend address is:

```env
BACKEND_URL=http://127.0.0.1:8000
```

When running through Docker Compose, the backend is accessed through the internal service hostname:

```env
BACKEND_URL=http://backend:8000
```

## Document Upload Workflow

The document upload process follows these steps:

1. Users select one or more supported documents.
2. The frontend validates the selected files.
3. Documents are submitted to the backend using multipart form data.
4. The backend processes and indexes each document.
5. The frontend displays the batch summary and individual results.

A batch can contain between 1 and 50 documents.

Each document must be no larger than 10 MB.

Previously uploaded documents are not automatically overwritten. Duplicate filenames are reported individually without interrupting the remaining documents in the batch.

The **Clear** button resets the frontend selection and displayed results. It does not delete previously indexed documents.

## Running with Docker

The project includes a Dockerfile for containerized execution.

The frontend can be started alongside the backend and supporting services through the separate infrastructure repository.

From the infrastructure directory:

```bash
docker compose up -d --build frontend
```

The application will be available at:

http://localhost:3000

For the complete infrastructure setup, refer to the infrastructure repository.

## Code Quality

Run ESLint:

```bash
pnpm exec eslint .
```

Check TypeScript types:

```bash
pnpm exec tsc --noEmit
```

Create a production build:

```bash
pnpm build
```

## Architecture

The frontend separates responsibilities across reusable components, custom hooks, API services, and TypeScript types.

The document upload workflow follows this structure:

```text
DocumentUpload Component
        |
        v
useDocumentUpload Hook
        |
        v
Document Service
        |
        v
Next.js API Rewrite
        |
        v
FastAPI Backend
```

This separation keeps UI rendering independent from request handling, state management, and response validation.

## Development Status

The frontend currently supports AI-powered document queries and document upload integration.

Batch uploading, file validation, individual processing results, and duplicate-document feedback have been implemented.

The project remains under active development, with additional improvements planned for document management, usability, and automated frontend testing.

## Related Repositories

**Backend:** https://github.com/Denilson-P/collective-agreements-rag

The backend handles document processing, indexing, vector retrieval, and AI-generated responses.

## License

Refer to the repository's license file, if available.
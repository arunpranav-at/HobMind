# HobMind

HobMind — Master your passion, one hobby at a time.

HobMind helps people learn and make measurable progress on hobbies by breaking learning into plans, techniques, and tracked progress. It's designed as a lightweight full-stack app with a Next.js frontend and a Node/Express backend that stores data in MongoDB and can optionally connect to an AI service for assistance.

Key ideas
- Create structured practice plans for hobbies.
- Store and browse techniques and steps to learn skills.
- Track progress entries over time and visualize improvements.
- Optionally augment content or generate practice suggestions using an AI service.

Contents of this repo
- `backend/` — Node.js + Express backend, MongoDB models, API routes and small scripts (seed, etc.).
- `frontend/` — Next.js 13+ (app router) React frontend, Tailwind CSS, client components and utilities.
- `README.md` — This file.

Tech stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (via mongoose)
- Optional: Azure OpenAI for AI-assisted features + Tavily for Web Search

Quick start (development)

The project expects Node.js and npm installed. Recommended Node version: 18+.

Open two terminals. Windows PowerShell examples:

```powershell
# Backend
cd .\backend
npm install
npm run dev

# In a separate terminal - Frontend
cd .\frontend
npm install --legacy-peer-deps
npm run dev
```

After both servers start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000 (default)

Configuration and environment variables

Copy and edit the backend environment example file to provide secrets and connections:

```powershell
cd .\backend
copy .env.example .env
# then edit .env with your values
notepad .env
```

Seed data

The backend includes a `scripts/seed.js` helper to populate example data. To run it:

```powershell
cd .\backend
node scripts/seed.js
```

Project structure (high level)

- backend/
	- server.js — main Express server
	- src/models — Mongoose models (Plan, Progress, Technique)
	- services — helpers (aiService, dbService)
	- scripts/seed.js — seed data script

- frontend/
	- app/ — Next.js app router pages and layout
	- components/ — React components used across the UI
	- lib/api.js — frontend API client
	- utils/ — client-side stores and hooks

Development tips
- When working on both front and back, run them in separate terminals to get hot reload.
- Use the browser devtools and the backend logs to debug API issues.
- For dependency problems in the frontend, `npm install --legacy-peer-deps` is included in the Quick start to work around legacy peer conflicts.

Deployment notes

- Backend: can be deployed to any Node-compatible host or containerized via the provided `Dockerfile` in `backend/`.
- Frontend: designed to work with Vercel or any static + serverless hosting that supports Next.js app router. Environment variables for production should be set in the hosting provider's settings.
- If using Azure OpenAI, confirm your production keys and region strings are stored securely (Key Vault or provider environment settings).

Contributing

Contributions are welcome. Good things to include with a PR:
- A short description of the change
- Any setup or migration steps
- Tests or manual verification steps

License

This project is released under the MIT license (see [LICENSE](./LICENSE)).

Contact / support

For questions about running or extending the project, open an issue on the repository or contact the maintainers listed in the project settings.
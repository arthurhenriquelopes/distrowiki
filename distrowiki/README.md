# DistroWiki

React + Vite frontend for DistroWiki - Linux distribution catalog.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:
```
VITE_API_BASE=http://127.0.0.1:8000
```

For production (Vercel), set via Environment Variables in project settings:
```
VITE_API_BASE=https://distrowiki-api.vercel.app
```

## Build

```bash
npm run build
```

## Deployment

Deploy to Vercel with:
```bash
vercel
```

The frontend will be available at `https://distrowiki.vercel.app`

## Features

- Browse 70+ Linux distributions
- Compare distributions
- Filter by family and desktop environment
- Detailed information for each distribution

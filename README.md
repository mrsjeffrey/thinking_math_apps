# Math Explorer Hub

This is a merged Vite + React mega app that contains two Google AI Studio exports in one codebase:

- Paper Folding Explorer
- Warehouse Problem Explorer

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Build

```bash
npm run build
```

## How it works

- `src/App.tsx` is the launcher/home page.
- `src/apps/PaperFoldingExplorer.tsx` contains the original paper folding app.
- `src/apps/WarehouseExplorer.tsx` contains the original warehouse app.
- Navigation uses the URL hash so there is no extra router dependency required.

## GitHub

Push this folder to a GitHub repo, then deploy with Vercel or Netlify as a standard Vite app.

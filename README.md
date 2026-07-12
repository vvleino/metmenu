# MetMenu – Metioniinihaku

A progressive web app for searching a Google Spreadsheet of methionine content data.
The app fetches the whole spreadsheet (all tabs) once from a Google Apps Script JSON
endpoint, caches it in localStorage, and searches entirely client-side — instant
search-as-you-type and offline support after the first load.

Live app: https://vvleino.github.io/metmenu/

## Architecture

- **Backend** — `appsscript/Code.gs`, a container-bound Apps Script deployed as a
  web app. `doGet()` returns every tab of the spreadsheet as JSON:
  `{ generatedAt, headers: ["Sheet Name", ...], rows: [[sheetName, ...cells], ...] }`.
  The spreadsheet itself stays private; the endpoint is readable by anyone with the URL.
- **Frontend** — Vite + vanilla TypeScript PWA (this repo), deployed to GitHub Pages
  by `.github/workflows/deploy.yml` on every push to `main`.
- A row matches a search when any cell (including the tab name) contains the query
  as a case-insensitive substring — same semantics as the original Apps Script UI.

## Development

```sh
npm install
npm run dev       # dev server against the real endpoint
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build locally
```

## Configuration

`.env` (committed — the URL is not a secret) holds the Apps Script deployment URL:

```
VITE_API_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Use `.env.local` (gitignored) to override it locally.

## Updating the Apps Script backend

1. Open the spreadsheet → Extensions → Apps Script, paste the contents of
   `appsscript/Code.gs`.
2. First time: **Deploy → New deployment → Web app**, *Execute as: Me*,
   *Who has access: Anyone*. Copy the `/exec` URL into `.env`.
3. Later changes: **Deploy → Manage deployments → ✏️ Edit → Version: New version →
   Deploy.** Editing the existing deployment keeps the URL stable; creating a *new*
   deployment would change the URL and require a `.env` update + redeploy.

Sanity check: open the `/exec` URL in a private browser window — it should return
raw JSON.

## Hosting

GitHub Pages, served from GitHub Actions: repo **Settings → Pages → Source:
"GitHub Actions"** (one-time setup). Every push to `main` builds and deploys.

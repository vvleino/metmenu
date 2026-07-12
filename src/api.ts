import type { Dataset } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchDataset(): Promise<Dataset> {
  if (!API_URL || !API_URL.startsWith('http')) {
    throw new Error('VITE_API_URL puuttuu — lisää Apps Script -julkaisun URL .env-tiedostoon.');
  }

  // Plain GET with default options only: Apps Script never answers a CORS
  // preflight, so the request must stay a "simple request" (no custom headers),
  // and it 302-redirects to script.googleusercontent.com which allows any origin.
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // A failing script returns an HTML error page with status 200.
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Palvelin ei palauttanut JSON-muotoista vastausta.');
  }
  if (!isDataset(data)) {
    throw new Error('Palvelimen vastaus oli odottamattoman muotoinen.');
  }
  return data;
}

function isDataset(value: unknown): value is Dataset {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.generatedAt === 'string' &&
    Array.isArray(v.headers) &&
    Array.isArray(v.rows) &&
    v.rows.every(row => Array.isArray(row))
  );
}

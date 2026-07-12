import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { fetchDataset } from './api';
import { loadCached, saveCached } from './storage';
import { buildIndex, search, type SearchIndex } from './search';
import { renderMessage, renderResults } from './render';

const RESULT_CAP = 300;
const DEBOUNCE_MS = 150;

const searchInput = document.getElementById('search') as HTMLInputElement;
const statusEl = document.getElementById('status') as HTMLElement;
const resultsEl = document.getElementById('results') as HTMLElement;

let index: SearchIndex | null = null;

function setStatus(text: string, isError = false): void {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

function updatedText(fetchedAt: number): string {
  const stamp = new Date(fetchedAt).toLocaleString('fi-FI', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  return `Päivitetty ${stamp}`;
}

function runSearch(): void {
  if (!index) return;
  const query = searchInput.value;
  if (query === '') {
    renderMessage(resultsEl, 'Kirjoita hakusana.');
    return;
  }
  renderResults(resultsEl, index.dataset.headers, search(index, query), RESULT_CAP);
}

function renderFetchError(error: unknown): void {
  resultsEl.replaceChildren();
  const box = document.createElement('div');
  box.className = 'error-box';

  const message = document.createElement('p');
  message.textContent = 'Tietojen lataus epäonnistui.';
  box.appendChild(message);

  const detail = document.createElement('p');
  detail.className = 'error-detail';
  detail.textContent = error instanceof Error ? error.message : String(error);
  box.appendChild(detail);

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Yritä uudelleen';
  retry.addEventListener('click', () => {
    setStatus('Ladataan tietoja…');
    renderMessage(resultsEl, '');
    void refresh();
  });
  box.appendChild(retry);

  resultsEl.appendChild(box);
}

async function refresh(): Promise<void> {
  try {
    const dataset = await fetchDataset();
    const cached = saveCached(dataset);
    index = buildIndex(dataset);
    setStatus(updatedText(cached.fetchedAt));
    runSearch();
  } catch (error) {
    if (index) {
      setStatus('Ei yhteyttä – näytetään tallennetut tiedot.', true);
    } else {
      setStatus('');
      renderFetchError(error);
    }
  }
}

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

function init(): void {
  registerSW({ immediate: true });

  searchInput.addEventListener('input', debounce(runSearch, DEBOUNCE_MS));
  // Enter closes the on-screen keyboard on mobile; search already ran on input.
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchInput.blur();
  });

  const cached = loadCached();
  if (cached) {
    index = buildIndex(cached.dataset);
    setStatus(updatedText(cached.fetchedAt));
    runSearch();
  } else {
    setStatus('Ladataan tietoja…');
  }
  void refresh();
}

init();

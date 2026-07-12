import type { Dataset } from './types';

const KEY = 'metmenu.dataset.v1';

export interface CachedDataset {
  fetchedAt: number;
  dataset: Dataset;
}

export function loadCached(): CachedDataset | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedDataset;
    if (typeof parsed?.fetchedAt !== 'number' || !parsed.dataset) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCached(dataset: Dataset): CachedDataset {
  const cached: CachedDataset = { fetchedAt: Date.now(), dataset };
  try {
    localStorage.setItem(KEY, JSON.stringify(cached));
  } catch {
    // Storage full or disabled: the app still works, it just won't have
    // offline data on the next visit.
  }
  return cached;
}

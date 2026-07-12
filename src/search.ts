import type { Dataset } from './types';

export interface SearchIndex {
  dataset: Dataset;
  lowerRows: string[][];
}

export function buildIndex(dataset: Dataset): SearchIndex {
  return {
    dataset,
    // String() guards against non-string cells from an older cache or a
    // changed backend.
    lowerRows: dataset.rows.map(row => row.map(cell => String(cell).toLowerCase())),
  };
}

// Same semantics as the original Apps Script searchData(): a row matches when
// any cell (including the sheet name) contains the query as a
// case-insensitive substring.
export function search(index: SearchIndex, query: string): string[][] {
  const q = query.toLowerCase();
  const matches: string[][] = [];
  index.lowerRows.forEach((lowerRow, i) => {
    if (lowerRow.some(cell => cell.includes(q))) {
      matches.push(index.dataset.rows[i]);
    }
  });
  return matches;
}

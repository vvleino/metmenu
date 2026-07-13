// All rendering uses DOM APIs with textContent so spreadsheet content can
// never be interpreted as HTML.

export function renderMessage(container: HTMLElement, text: string, className = 'hint'): void {
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  container.appendChild(p);
}

// The first three columns are combined into a single cell: the 3rd value on
// the first line, the 1st and 2nd on the line below it.
const MERGED_COLUMNS = 3;

function appendMergedCell(parent: HTMLTableRowElement, tag: 'th' | 'td', values: string[]): void {
  const cell = document.createElement(tag);
  cell.className = 'merged-cell';

  const primary = document.createElement('div');
  primary.className = 'cell-primary';
  primary.textContent = String(values[2] ?? '');
  cell.appendChild(primary);

  const secondary = document.createElement('div');
  secondary.className = 'cell-secondary';
  secondary.textContent = values
    .slice(0, 2)
    .map(v => String(v ?? ''))
    .filter(v => v !== '')
    .join(' · ');
  cell.appendChild(secondary);

  parent.appendChild(cell);
}

export function renderResults(
  container: HTMLElement,
  headers: string[],
  rows: string[][],
  cap: number,
): void {
  if (rows.length === 0) {
    renderMessage(container, 'Ei hakutuloksia.', 'no-results');
    return;
  }

  container.replaceChildren();

  if (rows.length > cap) {
    const note = document.createElement('p');
    note.className = 'result-note';
    note.textContent = `Näytetään ensimmäiset ${cap} tulosta (yhteensä ${rows.length}).`;
    container.appendChild(note);
  }

  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');

  const merge = headers.length >= MERGED_COLUMNS;

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  if (merge) appendMergedCell(headRow, 'th', headers);
  for (const header of merge ? headers.slice(MERGED_COLUMNS) : headers) {
    const th = document.createElement('th');
    th.textContent = String(header);
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of rows.slice(0, cap)) {
    const tr = document.createElement('tr');
    if (merge) appendMergedCell(tr, 'td', row);
    for (const cell of merge ? row.slice(MERGED_COLUMNS) : row) {
      const td = document.createElement('td');
      td.textContent = String(cell);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  wrap.appendChild(table);
  container.appendChild(wrap);
}

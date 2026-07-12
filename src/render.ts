// All rendering uses DOM APIs with textContent so spreadsheet content can
// never be interpreted as HTML.

export function renderMessage(container: HTMLElement, text: string, className = 'hint'): void {
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  container.appendChild(p);
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

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  for (const header of headers) {
    const th = document.createElement('th');
    th.textContent = String(header);
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const row of rows.slice(0, cap)) {
    const tr = document.createElement('tr');
    for (const cell of row) {
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

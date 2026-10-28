// Build-time table labels for MDX articles (a Sätteri hast plugin; Astro's
// default MDX processor does not run rehype plugins).
// Each body cell gets data-label from its column header, so the CSS in
// global.css can turn rows into labeled blocks on phones without JavaScript.
// Columns headed "Fillout", "Softr" or "Noloco" get data-chapter for their
// swatch. Explicit roles keep table semantics when rows are display: block.
// Handles plain elements (Markdown tables) and MDX JSX elements (<table> in MDX).

const PRODUCTS = new Set(['fillout', 'softr', 'noloco']);
const JSX = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

const nameOf = (node) => (node.type === 'element' ? node.tagName : JSX.has(node.type) ? node.name : undefined);
const kids = (node, name) => (node.children ?? []).filter((c) => nameOf(c) === name);
const cellsOf = (row) => (row.children ?? []).filter((c) => nameOf(c) === 'th' || nameOf(c) === 'td');

function spans(cell) {
  const props = cell.type === 'element' ? cell.properties ?? {} : Object.fromEntries((cell.attributes ?? []).map((a) => [a.name, a.value]));
  return Number(props.colSpan ?? props.colspan ?? 1) > 1;
}

function labelTable(table, ctx) {
  const head = kids(table, 'thead')[0];
  const body = kids(table, 'tbody')[0];
  const headRow = head && kids(head, 'tr')[0];
  if (!headRow || !body) return;
  const headCells = cellsOf(headRow);
  const labels = headCells.map((c) => ctx.textContent(c).replace(/\s+/g, ' ').trim());
  const rows = kids(body, 'tr');
  if (headCells.some(spans) || rows.some((r) => cellsOf(r).some(spans) || cellsOf(r).length > labels.length)) return;

  const chapters = labels.map((l) => (PRODUCTS.has(l.toLowerCase()) ? l.toLowerCase() : undefined));
  const set = (node, key, value) => ctx.setProperty(node, key, value);
  set(table, 'data-stack', '');
  set(table, 'role', 'table');
  set(head, 'role', 'rowgroup');
  set(body, 'role', 'rowgroup');
  set(headRow, 'role', 'row');
  headCells.forEach((c, i) => {
    set(c, 'role', 'columnheader');
    if (chapters[i]) set(c, 'data-chapter', chapters[i]);
  });
  for (const row of rows) {
    set(row, 'role', 'row');
    cellsOf(row).forEach((cell, i) => {
      const isRowHeader = nameOf(cell) === 'th';
      set(cell, 'role', isRowHeader ? 'rowheader' : 'cell');
      if (!isRowHeader && labels[i]) set(cell, 'data-label', labels[i]);
      if (chapters[i]) set(cell, 'data-chapter', chapters[i]);
    });
  }
  // Markdown tables (blog posts) get the same scroll region the hand-written
  // tables in guides use, so enlarged text scrolls inside the table instead of
  // widening the page. Keyboard users can focus the region to scroll it.
  if (table.type === 'element') {
    const cls = ctx.parent(table)?.properties?.className;
    const classes = Array.isArray(cls) ? cls : String(cls ?? '').split(/\s+/);
    if (!classes.includes('table-scroll')) {
      ctx.wrapNode(table, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], role: 'region', tabIndex: 0, ariaLabel: `Table: ${labels.join(', ')}` },
        children: [],
      });
    }
  }
}

const visitTable = { filter: ['table'], visit: (node, ctx) => labelTable(node, ctx) };

export const tableLabels = {
  name: 'table-labels',
  element: visitTable,
  mdxJsxFlowElement: visitTable,
};

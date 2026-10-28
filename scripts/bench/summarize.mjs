// Print a compact per-page summary of measured computed styles.
// Run: node scripts/bench/summarize.mjs <dir> [width=1440]
import fs from 'node:fs/promises';
import path from 'node:path';

const [dir, width = '1440'] = process.argv.slice(2);
const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json')).sort();
const t = (x) => (x ? `${x.size}/${x.lh} w${x.weight} ls${x.ls} ${x.family}` : '-');
for (const f of files) {
  const r = JSON.parse(await fs.readFile(path.join(dir, f), 'utf8'));
  const w = r.widths?.[width];
  if (!w || w.error || !w.measure) { console.log(`## ${r.id} [${width}] ERROR ${w?.error ?? r.error ?? ''}`); continue; }
  const m = w.measure;
  const b = m.buttons[0];
  console.log(`## ${r.id} [${width}] ${r.url}`);
  console.log(`bg ${m.bodyBg} | font ${m.bodyFont} | docH ${m.docHeight} | header ${m.header ? `${m.header.h}px ${m.header.position} bg ${m.header.bg} bb ${m.header.borderBottom}` : '-'}`);
  console.log(`nav ${m.navLinks.slice(0, 4).map((n) => `${n.text.slice(0, 14)}:${n.size}/w${n.weight}`).join(', ')}`);
  console.log(`h1 ${t(m.h1)} w${m.h1?.width} "${m.h1?.text.slice(0, 50)}"`);
  console.log(`h2 ${m.h2.map((h) => `${h.size}/${h.lh} w${h.weight} ls${h.ls}`).join(' | ')}`);
  console.log(`h3 ${m.h3.map((h) => `${h.size}/${h.lh} w${h.weight}`).join(' | ')}`);
  console.log(`p  ${m.paras.map((p) => `${p.size}/${p.lh} ${p.color} w${p.width}`).join(' | ')}`);
  console.log(`btn ${m.buttons.slice(0, 3).map((b) => `"${b.text.slice(0, 16)}" ${b.size}/w${b.weight} h${b.h} r${b.radius} pad ${b.pad} bg ${b.bg}`).join(' || ')}`);
  console.log(`containers ${m.containerWidths.join(', ')}`);
  console.log(`section pad ${m.sectionPadding.slice(0, 5).join(', ')}`);
  console.log(`radii ${m.radii.slice(0, 6).join(', ')}`);
  console.log(`borders ${m.borders.slice(0, 4).join(', ')}`);
  console.log(`bgArea ${m.bgByArea.slice(0, 4).join(', ')}`);
  if (m.table) console.log(`table th ${t(m.table.th)} | td ${t(m.table.td)} pad ${m.table.tdPad} row ${m.table.rowBorder} w${m.table.width}`);
  if (m.footer) console.log(`footer h${m.footer.h} bg ${m.footer.bg} pad ${m.footer.pad} link ${m.footer.links?.size}/w${m.footer.links?.weight} head ${m.footer.heads?.size}/w${m.footer.heads?.weight}`);
  console.log(`libs ${Object.entries(m.libs).filter(([, v]) => v).map(([k, v]) => (v === true ? k : `${k}=${v}`)).join(' ')} | heroAnims ${w.heroAnims.length} | motion steps ${w.motion.length}: ${w.motion.slice(0, 4).map((s) => `@${s.y} ${s.anims.slice(0, 3).join('; ')}`).join(' // ')}`);
  console.log('');
}

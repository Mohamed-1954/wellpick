// Color theme controls: the header's toggle (.theme-toggle) and the footer's
// switch ([data-theme-set="light|dark"]). An explicit choice persists;
// otherwise the head script follows the system. Every control reflects the
// current theme, and a themechange event lets other scripts follow.
let started = false;

export function initTheme() {
  if (started) return;
  started = true;
  const root = document.documentElement;
  const toggles = document.querySelectorAll<HTMLButtonElement>('.theme-toggle');
  const setters = document.querySelectorAll<HTMLButtonElement>('[data-theme-set]');

  const sync = () => {
    const dark = root.dataset.theme === 'dark';
    toggles.forEach((t) => {
      t.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
      t.setAttribute('title', dark ? 'Use light theme' : 'Use dark theme');
    });
    setters.forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.themeSet === root.dataset.theme)));
  };
  const apply = (next: 'light' | 'dark') => {
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    sync();
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  };

  toggles.forEach((t) => t.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark')));
  setters.forEach((s) => s.addEventListener('click', () => apply(s.dataset.themeSet === 'dark' ? 'dark' : 'light')));
  sync();
}

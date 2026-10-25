type Theme = 'dark' | 'light';

const root = document.documentElement;
const mq = matchMedia('(prefers-color-scheme: light)');

const stored = (): Theme | null => {
  try {
    const s = localStorage.getItem('theme');
    return s === 'dark' || s === 'light' ? s : null;
  } catch {
    return null;
  }
};

function sync(pref: Theme | null) {
  const theme: Theme = pref ?? (mq.matches ? 'light' : 'dark');
  root.dataset.theme = theme;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.content = theme === 'light' ? '#F4F5F6' : '#0B0C0E';
  });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', (theme === 'dark' ? b.dataset.toLight : b.dataset.toDark) ?? '');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-option]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.themeOption === (pref ?? 'system')));
  });
}

/** null = follow the system (removes the stored preference). */
export function applyTheme(t: Theme | null) {
  try {
    if (t) localStorage.setItem('theme', t);
    else localStorage.removeItem('theme');
  } catch {}
  sync(t);
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')),
);
document.querySelectorAll<HTMLButtonElement>('[data-theme-option]').forEach((b) =>
  b.addEventListener('click', () => {
    const v = b.dataset.themeOption;
    applyTheme(v === 'dark' || v === 'light' ? v : null);
  }),
);
mq.addEventListener('change', () => {
  if (!stored()) sync(null);
});
sync(stored());

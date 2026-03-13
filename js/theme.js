window.Portfolio = window.Portfolio || {};

window.Portfolio.Theme = (function () {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function get() {
    return localStorage.getItem(STORAGE_KEY) || getSystemTheme();
  }

  function set(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcon(theme);
    document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function updateIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Sun icon for dark mode (click to go light), moon icon for light mode (click to go dark)
    if (theme === 'dark') {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  function init() {
    var theme = get();
    set(theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        set(e.matches ? 'dark' : 'light');
      }
    });
  }

  return { init: init, toggle: toggle, get: get };
})();

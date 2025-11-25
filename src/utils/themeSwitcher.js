
export const THEMES = ['light', 'dark', 'liquid-glass'];

export function getStoredTheme() {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('focus_theme');
}

export function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored && THEMES.includes(stored)) return stored;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export function setTheme(theme) {
    if (!THEMES.includes(theme)) return;

    const root = document.documentElement;
    // Remove all theme classes
    THEMES.forEach(t => root.classList.remove(`theme-${t}`));
    // Remove legacy 'dark' class if it exists/conflicts, or map 'dark' theme to 'dark' class if you prefer.
    // The user requested .theme-liquid-glass. 
    // Standardize: .theme-light, .theme-dark, .theme-liquid-glass.
    // BUT existing code uses 'dark' class for Tailwind dark mode.
    // Tailwind looks for 'dark' class. So for 'dark' theme, we MUST add 'dark'.
    // For 'liquid-glass', maybe we want dark mode features too? Or custom?
    // The user said: ":root { /* light as default */ ... } .theme-liquid-glass { ... }"
    // And "Expose setTheme(themeName) which toggles class on <html>: theme-light, theme-dark, theme-liquid-glass."

    root.classList.add(`theme-${theme}`);

    // Handle Tailwind 'dark' class compatibility
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    localStorage.setItem('focus_theme', theme);

    // Dispatch event
    window.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
}

export function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
}

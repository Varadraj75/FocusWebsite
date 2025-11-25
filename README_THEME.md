
# macOS 26 Liquid Glass Theme

This document describes the new Liquid Glass theme implementation.

## Overview
The theme adds a "Liquid Glass" visual style with a frosted glass effect, custom background, and refined color palette. It sits alongside the existing Light and Dark themes.

## Usage
- **Theme Chooser**: A floating widget on the right side of the screen allows switching between Light, Dark, and Liquid Glass.
- **Persistence**: The selected theme is saved in `localStorage` (`focus_theme`) and persists across sessions.
- **Auto-detection**: If no theme is selected, it defaults to the OS preference (Dark/Light).

## Developer Notes

### Feature Flag
The Liquid Glass theme can be toggled via a CSS variable in `src/index.css`:
```css
:root {
  --enable-theme-macos26: 1; /* Set to 0 to hide the option */
}
```

### Customization
Theme variables are defined in `src/index.css` under `.theme-liquid-glass`:
- `--lg-bg`: Base background color.
- `--lg-glass`: Glass panel background (translucent).
- `--lg-accent`: Primary accent color (pinkish).
- `--lg-accent-2`: Secondary accent (orange/peach).
- Background image is at `/public/liquid-glass-bg.png`.

### Files
- `src/utils/themeSwitcher.js`: Core logic for theme toggling.
- `src/components/ThemeChooser.jsx`: UI component.
- `src/index.css`: Theme styles and variables.

## Test Checklist
1. [ ] **Chooser Visibility**: Verify the theme chooser appears on the right edge.
2. [ ] **Switching**: Click "Liquid Glass" (droplet icon) -> Verify background changes and glass effect appears.
3. [ ] **Persistence**: Refresh the page -> Verify the theme remains selected.
4. [ ] **Dark Mode**: Switch to Dark -> Verify standard dark mode works.
5. [ ] **Responsiveness**: Check on mobile; the chooser should be accessible (it's fixed on the right).
6. [ ] **Fallback**: Verify fallback styles if `backdrop-filter` is not supported (can be tested by disabling it in DevTools).


import React, { useState, useEffect } from 'react';
import { Sun, Moon, Droplets } from 'lucide-react';
import { setTheme, getStoredTheme, THEMES } from '../utils/themeSwitcher';

export default function ThemeChooser() {
    const [currentTheme, setCurrentTheme] = useState('light');
    const [isOpen, setIsOpen] = useState(false);
    const [isLiquidEnabled, setIsLiquidEnabled] = useState(true);

    useEffect(() => {
        // Check feature flag
        const checkFlag = () => {
            const val = getComputedStyle(document.documentElement).getPropertyValue('--enable-theme-macos26').trim();
            setIsLiquidEnabled(val === '1');
        };
        checkFlag();

        // Initial check
        const stored = getStoredTheme();
        if (stored) setCurrentTheme(stored);
        else {
            // Fallback to checking class or media query
            if (document.documentElement.classList.contains('theme-dark')) setCurrentTheme('dark');
            else if (document.documentElement.classList.contains('theme-liquid-glass')) setCurrentTheme('liquid-glass');
            else setCurrentTheme('light');
        }

        const handleThemeChange = (e) => {
            setCurrentTheme(e.detail.theme);
        };

        window.addEventListener('theme:changed', handleThemeChange);
        return () => window.removeEventListener('theme:changed', handleThemeChange);
    }, []);

    const visibleThemes = THEMES.filter(t => t !== 'liquid-glass' || isLiquidEnabled);

    return (
        <div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[100]"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                className={`
            flex flex-col items-center gap-4 
            bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg
            border-y border-l border-slate-200 dark:border-slate-700
            shadow-2xl rounded-l-2xl py-4 px-2
            transition-transform duration-300 ease-out
            ${isOpen ? 'translate-x-0' : 'translate-x-[50%]'}
        `}
                role="radiogroup"
                aria-label="Theme Chooser"
            >
                {visibleThemes.map(theme => {
                    const isActive = currentTheme === theme;
                    return (
                        <button
                            key={theme}
                            onClick={() => setTheme(theme)}
                            className={`
                        p-2.5 rounded-full transition-all duration-200 relative group
                        ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg scale-110 ring-2 ring-blue-200 dark:ring-blue-900'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400'}
                    `}
                            aria-checked={isActive}
                            role="radio"
                            title={theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ')}
                        >
                            {theme === 'light' && <Sun className="w-5 h-5" />}
                            {theme === 'dark' && <Moon className="w-5 h-5" />}
                            {theme === 'liquid-glass' && <Droplets className="w-5 h-5" />}

                            {/* Label tooltip */}
                            <span className={`
                        absolute right-full mr-3 px-2 py-1 
                        bg-slate-900 text-white text-xs font-medium rounded 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity whitespace-nowrap pointer-events-none
                        ${isOpen ? '' : 'hidden'}
                    `}>
                                {theme === 'liquid-glass' ? 'Liquid Glass' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

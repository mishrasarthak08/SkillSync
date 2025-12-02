import React, { useState, useEffect } from 'react';

export default function ThemeToggle({ fixedPosition = true, className = '' }) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored) {
                return stored === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;


        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');

        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');

        }
    }, [isDark]);

    const toggleTheme = () => {

        setIsDark(prev => !prev);
    };

    const baseClasses = "w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg flex items-center justify-center";
    const positionClasses = fixedPosition ? "fixed top-4 right-4 z-50" : "";

    return (
        <button
            onClick={toggleTheme}
            className={`${positionClasses} ${baseClasses} ${className}`}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <span className="material-symbols-outlined text-yellow-400 text-2xl">light_mode</span>
            ) : (
                <span className="material-symbols-outlined text-gray-700 text-2xl">dark_mode</span>
            )}
        </button>
    );
}

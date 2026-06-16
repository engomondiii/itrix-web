'use client';

import { createContext, useContext } from 'react';

/**
 * Atelier Indigo is a single, light, warm-paper theme. ThemeContext exists so
 * components can read the active theme name without hard-coding it, and so a
 * future variant could be introduced without touching call sites.
 */
export type ThemeName = 'atelier-indigo';

interface ThemeContextValue {
  theme: ThemeName;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'atelier-indigo' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'atelier-indigo' }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

'use client';

import { createContext, useContext } from 'react';

/**
 * Mathematical Glass Intelligence (Brand Bible v1.2) is a single, light,
 * cool-paper theme. ThemeContext exists so components can read the active theme
 * name without hard-coding it, and so a future variant could be introduced
 * without touching call sites.
 */
export type ThemeName = 'mathematical-glass';

interface ThemeContextValue {
  theme: ThemeName;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'mathematical-glass' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'mathematical-glass' }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

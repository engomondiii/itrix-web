'use client';

import { createContext, useContext } from 'react';

/**
 * itriX Brand Manual v1.5 EN — "Mathematical Glass Intelligence".
 *
 * A single, light, cool-paper theme: Soft Signal White canvas, Deep Navy Slate
 * ink, Ice Blue glass, a restrained holographic soft-blue accent. Atelier Indigo
 * is retired — there is no warm paper, no brushed gold, and no second theme.
 *
 * ThemeContext exists so components can read the active theme name without
 * hard-coding it, and so a future variant could be introduced without touching
 * call sites.
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

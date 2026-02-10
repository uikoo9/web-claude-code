'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes, getTheme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>('developer-dark');
  const [mounted, setMounted] = useState(false);

  // 只在客户端挂载后运行
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme-id');
    if (savedTheme) {
      setThemeId(savedTheme);
    }
  }, []);

  // 应用主题到 CSS 变量
  useEffect(() => {
    if (mounted) {
      const theme = getTheme(themeId);
      localStorage.setItem('theme-id', themeId);
      applyTheme(theme);
    }
  }, [themeId, mounted]);

  const applyTheme = (theme: Theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
  };

  const value = {
    currentTheme: getTheme(themeId),
    setTheme: setThemeId,
    themes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

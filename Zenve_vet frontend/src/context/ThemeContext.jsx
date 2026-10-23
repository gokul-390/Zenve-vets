import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('zenve_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.setAttribute('data-mode', 'dark');
      root.classList.add('dark', 'dark-theme');
      if (body) {
        body.setAttribute('data-theme', 'dark');
        body.setAttribute('data-mode', 'dark');
        body.classList.add('dark', 'dark-theme');
      }
    } else {
      root.removeAttribute('data-theme');
      root.removeAttribute('data-mode');
      root.classList.remove('dark', 'dark-theme');
      if (body) {
        body.removeAttribute('data-theme');
        body.removeAttribute('data-mode');
        body.classList.remove('dark', 'dark-theme');
      }
    }
    try {
      localStorage.setItem('zenve_theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

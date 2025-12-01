import React from 'react';
import { useContext } from 'react';
const ThemeContext=React.createContext('light');
const ThemeProvider=({children})=>{
  const [theme,setTheme]=React.useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    } catch (e) {
      return 'light';
    }
  });

  const toggleTheme=()=>{
    setTheme((prevTheme)=>{
      const next = prevTheme==='light'?'dark':'light';
      try { localStorage.setItem('theme', next); } catch(e) {}
      return next;
    });
  }

  React.useEffect(() => {
    try {
      // apply current theme as a data attribute on the root element
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      // ignore server-side or restricted environments
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export { ThemeProvider, ThemeContext };
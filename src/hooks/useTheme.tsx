import { useState, useEffect, useContext, createContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    // document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    console.log("Toggling theme from", theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Debugging statements
    console.log("Applying dark class:", newTheme === 'dark');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    console.log("Current HTML classes:", document.documentElement.className);
    
    console.log("New theme is", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

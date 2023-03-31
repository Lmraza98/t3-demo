import { useState, useEffect, createContext, useContext } from 'react';
import { ClerkProvider } from "@clerk/nextjs";

type Theme = 'light' | 'dark';
type Scroll = boolean;

interface GlobalContextData {
  theme: Theme,
  setTheme:  React.Dispatch<React.SetStateAction<Theme>> | null;
  scroll: Scroll,
  setScroll: React.Dispatch<React.SetStateAction<Scroll>> | null;
}

const GlobalContext = createContext<GlobalContextData>({ 
  theme: 'light',
  setTheme: () => null,
  scroll: false,
  setScroll: () => {}
});

export const GlobalProvider: React.FC = ({ children }) => {
  const [ theme, setTheme ] = useState<Theme>('light')
  const [ scroll, setScroll ] = useState<Scroll>(false)
  console.log(scroll)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;

    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const value = {
    theme,
    setTheme,
    scroll,
    setScroll
  }
  return (
    <GlobalContext.Provider value={ value }>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </GlobalContext.Provider>
  );
};
export const useGlobal = () => {
  return useContext(GlobalContext);
}
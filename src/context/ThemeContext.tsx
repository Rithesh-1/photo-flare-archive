
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppConfig } from './AppConfigContext';

export type ThemeStyle = 'glass' | 'matte' | 'transparent';

export interface ThemeOptions {
  style: ThemeStyle;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface ThemeContextType {
  themeOptions: ThemeOptions;
  setThemeStyle: (style: ThemeStyle) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  applyTheme: (options: Partial<ThemeOptions>) => void;
}

const defaultThemeOptions: ThemeOptions = {
  style: 'glass',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useAppConfig();
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(() => {
    const savedTheme = localStorage.getItem('themeOptions');
    return savedTheme ? JSON.parse(savedTheme) : defaultThemeOptions;
  });

  useEffect(() => {
    localStorage.setItem('themeOptions', JSON.stringify(themeOptions));
    applyThemeToDOM(themeOptions, isDarkMode);
  }, [themeOptions, isDarkMode]);

  const setThemeStyle = (style: ThemeStyle) => {
    setThemeOptions(prev => ({ ...prev, style }));
  };

  const setPrimaryColor = (color: string) => {
    setThemeOptions(prev => ({ ...prev, primaryColor: color }));
  };

  const setSecondaryColor = (color: string) => {
    setThemeOptions(prev => ({ ...prev, secondaryColor: color }));
  };

  const setBackgroundColor = (color: string) => {
    setThemeOptions(prev => ({ ...prev, backgroundColor: color }));
  };

  const setTextColor = (color: string) => {
    setThemeOptions(prev => ({ ...prev, textColor: color }));
  };

  const applyTheme = (options: Partial<ThemeOptions>) => {
    setThemeOptions(prev => ({ ...prev, ...options }));
  };

  const applyThemeToDOM = (options: ThemeOptions, isDark: boolean) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for primary color (for shadcn compatibility)
    root.style.setProperty('--primary', convertHexToHsl(options.primaryColor));
    root.style.setProperty('--secondary', convertHexToHsl(options.secondaryColor));
    
    // Set background and text colors based on theme style
    if (options.style === 'glass') {
      root.style.setProperty('--theme-bg-opacity', isDark ? '0.7' : '0.85');
      root.style.setProperty('--theme-blur', '8px');
      root.classList.add('theme-glass');
      root.classList.remove('theme-matte', 'theme-transparent');
    } else if (options.style === 'matte') {
      root.style.setProperty('--theme-bg-opacity', '1');
      root.style.setProperty('--theme-blur', '0px');
      root.classList.add('theme-matte');
      root.classList.remove('theme-glass', 'theme-transparent');
    } else if (options.style === 'transparent') {
      root.style.setProperty('--theme-bg-opacity', isDark ? '0.3' : '0.6');
      root.style.setProperty('--theme-blur', '5px');
      root.classList.add('theme-transparent');
      root.classList.remove('theme-glass', 'theme-matte');
    }
    
    // Apply background and text colors
    root.style.setProperty('--theme-bg', options.backgroundColor);
    root.style.setProperty('--theme-text', options.textColor);
  };

  // Helper function to convert hex to HSL
  const convertHexToHsl = (hex: string): string => {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };

  return (
    <ThemeContext.Provider
      value={{
        themeOptions,
        setThemeStyle,
        setPrimaryColor,
        setSecondaryColor,
        setBackgroundColor,
        setTextColor,
        applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

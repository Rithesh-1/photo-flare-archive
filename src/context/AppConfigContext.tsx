import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AppConfigContextType {
  appName: string;
  setAppName: (name: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  storageLimitMB: number;
  setStorageLimitMB: (limit: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toast: typeof toast;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [appName, setAppNameState] = useState<string>(() => {
    return localStorage.getItem('appName') || 'PhotoFlare';
  });
  
  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });
  
  const [logoUrl, setLogoUrlState] = useState<string>(() => {
    return localStorage.getItem('logoUrl') || '';
  });
  
  const [storageLimitMB, setStorageLimitMBState] = useState<number>(() => {
    const savedLimit = localStorage.getItem('storageLimitMB');
    return savedLimit ? parseInt(savedLimit) : 100;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? savedMode === 'true' : false;
  });

  // Update localStorage when state changes
  const setAppName = (name: string) => {
    setAppNameState(name);
    localStorage.setItem('appName', name);
    document.title = name; // Update page title
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
    document.documentElement.style.setProperty('--primary', convertHexToHsl(color));
  };

  const setLogoUrl = (url: string) => {
    setLogoUrlState(url);
    localStorage.setItem('logoUrl', url);
  };

  const setStorageLimitMB = (limit: number) => {
    setStorageLimitMBState(limit);
    localStorage.setItem('storageLimitMB', limit.toString());
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply primary color to CSS variables when component mounts
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', convertHexToHsl(primaryColor));
    document.title = appName;
  }, [primaryColor, appName]);

  // Helper function to convert hex color to HSL format for CSS variables
  const convertHexToHsl = (hex: string): string => {
    // Default to blue if conversion fails
    try {
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
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        
        h = h / 6;
      }
      
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      return `${h} ${s}% ${l}%`;
    } catch (e) {
      console.error("Error converting hex to HSL:", e);
      return "210 100% 50%"; // Default blue
    }
  };

  return (
    <AppConfigContext.Provider
      value={{
        appName,
        setAppName,
        primaryColor,
        setPrimaryColor,
        logoUrl,
        setLogoUrl,
        storageLimitMB,
        setStorageLimitMB,
        isDarkMode,
        toggleDarkMode,
        toast,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};

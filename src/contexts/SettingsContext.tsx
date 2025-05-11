
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SettingsContextType {
  autoCompare: boolean;
  setAutoCompare: (value: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [autoCompare, setAutoCompare] = useState<boolean>(true);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  return (
    <SettingsContext.Provider value={{ 
      autoCompare, 
      setAutoCompare, 
      autoScroll, 
      setAutoScroll 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

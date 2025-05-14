import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for Unicode escape options
export type UnicodeQuoteOption = 'none' | 'single' | 'both';

interface SettingsContextType {
  autoCompare: boolean;
  setAutoCompare: (value: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
  unicodeQuoteEscaping: UnicodeQuoteOption;
  setUnicodeQuoteEscaping: (value: UnicodeQuoteOption) => void;
  escapeKeysInJson: boolean;
  setEscapeKeysInJson: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [autoCompare, setAutoCompare] = useState<boolean>(true);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [unicodeQuoteEscaping, setUnicodeQuoteEscaping] = useState<UnicodeQuoteOption>('none');
  const [escapeKeysInJson, setEscapeKeysInJson] = useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        autoCompare,
        setAutoCompare,
        autoScroll,
        setAutoScroll,
        unicodeQuoteEscaping,
        setUnicodeQuoteEscaping,
        escapeKeysInJson,
        setEscapeKeysInJson,
      }}
    >
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

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppMode = 'simple' | 'advanced';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isSimpleMode: boolean;
  isAdvancedMode: boolean;
  isBasicMode: boolean;
  isProMode: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};

interface AppModeProviderProps {
  children: ReactNode;
}

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('simple');

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('appMode') as AppMode;
    if (savedMode && (savedMode === 'simple' || savedMode === 'advanced')) {
      setMode(savedMode);
    }
  }, []);

  // Save mode to localStorage whenever it changes
  const handleSetMode = (newMode: AppMode) => {
    setMode(newMode);
    localStorage.setItem('appMode', newMode);
  };

  const value: AppModeContextType = {
    mode,
    setMode: handleSetMode,
    isSimpleMode: mode === 'simple',
    isAdvancedMode: mode === 'advanced',
    isBasicMode: mode === 'simple', // Alias for isSimpleMode
    isProMode: mode === 'advanced', // Alias for isAdvancedMode
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

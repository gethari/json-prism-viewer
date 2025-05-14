
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDiff, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileDiff className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">JSON Localization Tools</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

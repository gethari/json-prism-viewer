
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDiff, Github, Sun, Moon } from 'lucide-react';
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
            <h1 className="text-2xl font-bold">JSON Prism Viewer</h1>
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
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Github className="mr-1 h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

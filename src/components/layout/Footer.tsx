
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            JSON Prism Viewer - A tool for visualizing JSON differences
          </p>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            <a 
              href="https://github.com/yourusername/json-prism-viewer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              View source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

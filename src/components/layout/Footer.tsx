
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            JSON Localization Tools - Finding missing translation keys and comparing JSON files
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-xs text-muted-foreground md:text-sm">
          JSON Toolkit - Advanced JSON tools for developers. © {new Date().getFullYear()} All Rights
          Reserved.
        </p>
        <div className="flex items-center gap-4 md:gap-2 md:px-0">
          <p className="text-xs text-muted-foreground md:text-sm">Translation Checker v1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

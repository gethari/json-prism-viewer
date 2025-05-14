
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, GitCompare, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Home', 
      path: '/',
      icon: <Home className="h-5 w-5 mr-3" />
    },
    { 
      name: 'JSON Compare', 
      path: '/json-compare',
      icon: <GitCompare className="h-5 w-5 mr-3" />
    },
    { 
      name: 'Translation Checker', 
      path: '/translation-checker',
      icon: <FileJson className="h-5 w-5 mr-3" />
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">JSON Prism</h2>
        <p className="text-sm text-muted-foreground">JSON Tools</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

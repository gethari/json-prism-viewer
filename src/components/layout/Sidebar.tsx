
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, GitCompare, FileJson, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
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
    <aside 
      className={cn(
        "hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        onClick={() => setCollapsed(prev => !prev)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className={cn("p-4 border-b border-gray-200 dark:border-gray-800", collapsed && "flex justify-center")}>
        {collapsed ? (
          <div className="font-bold text-xl">JP</div>
        ) : (
          <>
            <h2 className="text-xl font-bold">JSON Prism</h2>
            <p className="text-sm text-muted-foreground">JSON Tools</p>
          </>
        )}
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center py-2 rounded-md text-sm font-medium transition-colors",
                  collapsed ? "px-2 justify-center" : "px-4",
                  location.pathname === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                title={collapsed ? item.name : undefined}
              >
                <div className={cn("flex items-center", collapsed ? "mr-0" : "mr-3")}>
                  {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                </div>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

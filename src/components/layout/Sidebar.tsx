import React from 'react';
import { Link } from 'react-router-dom';
import { Home, GitCompare, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sidebar = () => {
  const location = useLocation();
  // Always collapsed
  const collapsed = true;

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'JSON Compare',
      path: '/json-compare',
      icon: <GitCompare className="h-5 w-5" />,
    },
    {
      name: 'Translation Checker',
      path: '/translation-checker',
      icon: <FileJson className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
        'w-16' // Always use the collapsed width
      )}
    >
      <div
        className={cn('p-4 border-b border-gray-200 dark:border-gray-800', 'flex justify-center')}
      >
        <div className="font-bold text-xl">JT</div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.path}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center py-2 rounded-md text-sm font-medium transition-colors',
                        'px-2 justify-center',
                        location.pathname === item.path
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <div className="flex items-center">
                        {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

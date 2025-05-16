
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLineStatus } from '@/utils/jsonDiffUtils';
import { Plus, Minus, Edit } from 'lucide-react';

interface SplitViewProps {
  formattedOriginal: string;
  formattedModified: string;
  changes: any;
  fontSize: number;
  showLineNumbers: boolean;
  copyToClipboard: (text: string, type: string) => void;
}

const SplitView: React.FC<SplitViewProps> = ({
  formattedOriginal,
  formattedModified,
  changes,
  fontSize,
  showLineNumbers,
  copyToClipboard,
}) => {
  // For JSX rendering in React component
  const renderDiff = (text: string, isOriginal: boolean) => {
    if (!text) return <pre style={{ fontSize: `${fontSize}px` }}>{text}</pre>;
    
    const lines = text.split('\n');
    
    return (
      <pre style={{ fontSize: `${fontSize}px` }} className="font-mono">
        {lines.map((line, i) => {
          const status = getLineStatus(line, i, isOriginal, formattedOriginal, formattedModified, changes);
          let statusIcon = null;
          let statusClass = '';
          
          if (status === 'added') {
            statusIcon = <Plus className="h-3 w-3 inline mr-1 text-green-600 dark:text-green-400 flex-shrink-0" />;
            statusClass = 'bg-green-100 dark:bg-green-900/30';
          } else if (status === 'removed') {
            statusIcon = <Minus className="h-3 w-3 inline mr-1 text-red-600 dark:text-red-400 flex-shrink-0" />;
            statusClass = 'bg-red-100 dark:bg-red-900/30';
          } else if (status === 'changed') {
            statusIcon = <Edit className="h-3 w-3 inline mr-1 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />;
            statusClass = 'bg-yellow-100 dark:bg-yellow-900/30';
          }
          
          return (
            <div key={i} className={`flex ${statusClass}`}>
              {showLineNumbers && (
                <span className="text-gray-400 dark:text-gray-500 mr-4 text-right select-none" style={{ minWidth: '2.5rem' }}>
                  {i + 1}
                </span>
              )}
              <div className="flex items-start">
                {statusIcon}
                <span>{line}</span>
              </div>
            </div>
          );
        })}
      </pre>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="relative">
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(formattedOriginal, 'original')}
            disabled={!formattedOriginal}
            className="h-6 w-6"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="h-[500px] rounded-md border">
          <div className="p-4">
            {renderDiff(formattedOriginal, true)}
          </div>
        </ScrollArea>
      </div>
      <div className="relative">
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(formattedModified, 'modified')}
            disabled={!formattedModified}
            className="h-6 w-6"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="h-[500px] rounded-md border">
          <div className="p-4">
            {renderDiff(formattedModified, false)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SplitView;

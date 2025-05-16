
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MonacoDiffEditor from './diff/MonacoDiffEditor';
import DiffViewerControls from './diff/DiffViewerControls';
import { calculateDiffSummary, formatSummaryText } from '@/utils/diffUtils';
import { openExpandedDiffView } from '@/utils/expandedViewHelper';

interface MonacoDiffViewerProps {
  originalJson: string;
  modifiedJson: string;
}

const MonacoDiffViewer: React.FC<MonacoDiffViewerProps> = ({ originalJson, modifiedJson }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('diff');
  const [fontSize, setFontSize] = useState(14);
  const [summary, setSummary] = useState<{
    additions: number;
    deletions: number;
    changes: number;
  }>({ additions: 0, deletions: 0, changes: 0 });
  
  // Detect OS for keyboard shortcuts
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  useEffect(() => {
    // Calculate diff summary
    setSummary(calculateDiffSummary(originalJson, modifiedJson));
    
    // Add keyboard shortcut for toggling between diff and split view
    const handleKeyDown = (e: KeyboardEvent) => {
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      
      // Ctrl+D / Cmd+D - Toggle between diff views
      if (modKey && e.key === 'd') {
        e.preventDefault();
        setActiveTab(prev => prev === 'diff' ? 'split' : 'diff');
        toast({
          title: `Switched to ${activeTab === 'diff' ? 'Split' : 'Inline'} View`,
          description: `Using keyboard shortcut ${isMac ? '⌘' : 'Ctrl'}+D`,
        });
      }
      
      // Ctrl+Plus / Cmd+Plus - Increase font size
      if (modKey && e.key === '+') {
        e.preventDefault();
        increaseFontSize();
      }
      
      // Ctrl+Minus / Cmd+Minus - Decrease font size
      if (modKey && e.key === '-') {
        e.preventDefault();
        decreaseFontSize();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [originalJson, modifiedJson, activeTab, isMac, toast]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
    toast({
      title: `Font Size: ${fontSize + 2}px`,
      description: `Using keyboard shortcut ${isMac ? '⌘' : 'Ctrl'}+Plus`,
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
    toast({
      title: `Font Size: ${fontSize - 2}px`,
      description: `Using keyboard shortcut ${isMac ? '⌘' : 'Ctrl'}+Minus`,
    });
  };

  const openInNewTab = () => {
    openExpandedDiffView(originalJson, modifiedJson, toast);
  };

  const options = {
    renderSideBySide: activeTab === 'split',
    fontSize: fontSize,
    folding: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    lineNumbers: 'on',
    glyphMargin: true,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      alwaysConsumeMouseWheel: false
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>JSON Diff Viewer</span>
            <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">
              {formatSummaryText(summary)}
            </span>
          </div>
          <DiffViewerControls 
            originalJson={originalJson}
            modifiedJson={modifiedJson}
            increaseFontSize={increaseFontSize}
            decreaseFontSize={decreaseFontSize}
            openInNewTab={openInNewTab}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diff">Inline Diff</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <div className="relative">
              <MonacoDiffEditor 
                originalJson={originalJson} 
                modifiedJson={modifiedJson} 
                options={options}
                activeTab={activeTab}
              />
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">{isMac ? '⌘' : 'Ctrl'}+D</kbd>
                <span>Toggle between Inline/Split view</span>
                <span className="mx-2">•</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">{isMac ? '⌘' : 'Ctrl'}+E</kbd>
                <span>Toggle edit mode</span>
                <span className="mx-2">•</span>
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">{isMac ? '⌘' : 'Ctrl'}+Plus/Minus</kbd>
                <span>Change font size</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MonacoDiffViewer;


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
  
  useEffect(() => {
    // Calculate diff summary
    setSummary(calculateDiffSummary(originalJson, modifiedJson));
  }, [originalJson, modifiedJson]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const openInNewTab = () => {
    openExpandedDiffView(originalJson, modifiedJson, toast);
  };

  const options = {
    renderSideBySide: activeTab === 'split',
    fontSize: fontSize,
    readOnly: true,
    formatOnPaste: true,
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
              {activeTab === 'split' && (
                <div className="mt-2 text-xs text-gray-500">
                  Note: For better split view experience, you can use the "Open in new tab" button in the top right.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MonacoDiffViewer;

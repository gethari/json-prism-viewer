
import React, { useEffect, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZoomIn, ZoomOut, Expand, Copy, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    try {
      const original = JSON.parse(originalJson || '{}');
      const modified = JSON.parse(modifiedJson || '{}');
      
      // Count additions, deletions and changes
      const originalKeys = new Set(Object.keys(original));
      const modifiedKeys = new Set(Object.keys(modified));
      
      let additions = 0;
      let deletions = 0;
      let changes = 0;
      
      // Count additions
      for (const key of modifiedKeys) {
        if (!originalKeys.has(key)) {
          additions++;
        }
      }
      
      // Count deletions
      for (const key of originalKeys) {
        if (!modifiedKeys.has(key)) {
          deletions++;
        }
      }
      
      // Count changes
      for (const key of originalKeys) {
        if (modifiedKeys.has(key) && JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
          changes++;
        }
      }
      
      setSummary({ additions, deletions, changes });
    } catch (error) {
      console.error("Error calculating diff summary:", error);
    }
  }, [originalJson, modifiedJson]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `The ${type} JSON has been copied to your clipboard`,
      });
    });
  };

  const openInNewTab = () => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      toast({
        variant: "destructive",
        title: "Popup Blocked",
        description: "Please allow popups for this site to open the viewer in a new tab.",
      });
      return;
    }
    
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>JSON Diff - Expanded View</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          #container { width: 100vw; height: 100vh; }
          .header {
            padding: 10px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .header h1 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 500;
          }
          .btn {
            padding: 8px 12px;
            background: #e9ecef;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .btn:hover {
            background: #dee2e6;
          }
          .info {
            font-size: 0.9rem;
            color: #666;
          }
        </style>
        <link rel="stylesheet" data-name="vs/editor/editor.main" 
              href="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.css">
      </head>
      <body>
        <div class="header">
          <div>
            <h1>JSON Diff - Expanded View</h1>
            <span class="info">Close this tab and return to the main application to modify JSON content</span>
          </div>
          <button class="btn" onclick="window.close()">Close</button>
        </div>
        <div id="container"></div>
        <script>var require = { paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } };</script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/loader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.nls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/editor/editor.main.js"></script>
        <script>
          require(['vs/editor/editor.main'], function() {
            monaco.editor.createDiffEditor(document.getElementById('container'), {
              automaticLayout: true,
              theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
              readOnly: true,
              renderSideBySide: true
            }).setModel({
              original: monaco.editor.createModel(${JSON.stringify(originalJson)}, 'json'),
              modified: monaco.editor.createModel(${JSON.stringify(modifiedJson)}, 'json')
            });
          });
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  const formatSummaryText = () => {
    const parts = [];
    if (summary.additions > 0) parts.push(`${summary.additions} addition${summary.additions !== 1 ? 's' : ''}`);
    if (summary.deletions > 0) parts.push(`${summary.deletions} deletion${summary.deletions !== 1 ? 's' : ''}`);
    if (summary.changes > 0) parts.push(`${summary.changes} change${summary.changes !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'No changes detected';
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
              {formatSummaryText()}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseFontSize}
              title="Decrease font size"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseFontSize}
              title="Increase font size"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={openInNewTab}
              title="Open in new tab for better viewing"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
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
              <div className="absolute top-4 right-4 z-10 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(originalJson, 'original')}
                  className="h-8 w-8 bg-white/90 dark:bg-gray-800/90"
                  title="Copy original JSON"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(modifiedJson, 'modified')}
                  className="h-8 w-8 bg-white/90 dark:bg-gray-800/90"
                  title="Copy modified JSON"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>
              <div 
                style={{ height: activeTab === 'split' ? '600px' : '500px', border: '1px solid var(--border)' }} 
                className="rounded-md overflow-hidden"
              >
                <DiffEditor
                  height={activeTab === 'split' ? "600px" : "500px"}
                  language="json"
                  original={originalJson}
                  modified={modifiedJson}
                  options={options}
                  theme="vs-dark"
                />
              </div>
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

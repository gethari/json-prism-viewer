
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Expand, ZoomIn, ZoomOut } from 'lucide-react';
import { 
  formatJson, 
  unescapeJson, 
  parseJson, 
  findChanges 
} from '@/utils/jsonDiffUtils';
import SplitView from './diff/SplitView';
import UnifiedView from './diff/UnifiedView';

interface JsonDiffViewerProps {
  originalJson: string;
  modifiedJson: string;
}

const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ originalJson, modifiedJson }) => {
  const { toast } = useToast();
  const [formattedOriginal, setFormattedOriginal] = useState('');
  const [formattedModified, setFormattedModified] = useState('');
  const [changes, setChanges] = useState({
    added: [] as string[],
    removed: [] as string[],
    changed: [] as string[],
    valueMap: {} as Record<string, { original: any; modified: any }>
  });
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState('split');
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  useEffect(() => {
    try {
      if (originalJson.trim() && modifiedJson.trim()) {
        const unescapedOriginal = unescapeJson(originalJson);
        const unescapedModified = unescapeJson(modifiedJson);
        
        setFormattedOriginal(formatJson(unescapedOriginal));
        setFormattedModified(formatJson(unescapedModified));
        
        const originalObj = parseJson(unescapedOriginal);
        const modifiedObj = parseJson(unescapedModified);
        
        // Find changes between objects
        setChanges(findChanges(originalObj, modifiedObj));
      } else {
        if (originalJson.trim()) {
          setFormattedOriginal(formatJson(unescapeJson(originalJson)));
        } else {
          setFormattedOriginal('');
        }
        
        if (modifiedJson.trim()) {
          setFormattedModified(formatJson(unescapeJson(modifiedJson)));
        } else {
          setFormattedModified('');
        }
        
        setChanges({ added: [], removed: [], changed: [], valueMap: {} });
      }
    } catch (error) {
      console.error('Error processing JSON:', error);
      toast({
        variant: "destructive",
        title: "Error processing JSON",
        description: "There was an error processing the JSON data. Please check the format.",
      });
    }
  }, [originalJson, modifiedJson, toast]);

  const toggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
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
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>JSON Diff Viewer</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
          .container { display: flex; width: 100%; }
          .json-panel { width: 50%; padding: 10px; }
          pre { white-space: pre-wrap; font-family: monospace; font-size: 14px; }
          .added { background-color: rgb(230, 255, 237); color: #22863a; }
          .removed { background-color: rgb(255, 235, 233); color: #cb2431; }
          .changed { background-color: rgb(255, 250, 205); color: #735c0f; }
          .line { display: flex; }
          .line-number { min-width: 40px; text-align: right; color: #6e7781; padding-right: 8px; user-select: none; }
          .line-content { width: 100%; }
          .line-added { background-color: rgba(46, 160, 67, 0.15); }
          .line-removed { background-color: rgba(248, 81, 73, 0.15); }
          .line-changed { background-color: rgba(210, 153, 34, 0.15); }
          @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a; color: #e0e0e0; }
            .added { background-color: rgba(46, 160, 67, 0.15); color: #56d364; }
            .removed { background-color: rgba(248, 81, 73, 0.15); color: #f85149; }
            .changed { background-color: rgba(210, 153, 34, 0.15); color: #e3b341; }
            .line-number { color: #8b949e; }
          }
        </style>
      </head>
      <body>
        <h1>JSON Diff Viewer</h1>
        <div class="container">
          <div class="json-panel">
            <h2>Original</h2>
            <pre>${renderHtmlWithLineNumbers(formattedOriginal, true)}</pre>
          </div>
          <div class="json-panel">
            <h2>Modified</h2>
            <pre>${renderHtmlWithLineNumbers(formattedModified, false)}</pre>
          </div>
        </div>
      </body>
      </html>
    `;
    
    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `The ${type} JSON has been copied to your clipboard`,
      });
    });
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  // Render HTML with line numbers for the standalone view
  function renderHtmlWithLineNumbers(jsonString: string, isOriginal: boolean): string {
    if (!jsonString) return '';
    
    const lines = jsonString.split('\n');
    let result = '';
    
    lines.forEach((line, index) => {
      const status = getLineStatusForHTML(line, index, isOriginal);
      const statusClass = status ? `line-${status}` : '';
      
      // For HTML output (popup window)
      result += `<div class="line ${statusClass}">`;
      result += `<span class="line-number">${index + 1}</span>`;
      result += `<span class="line-content">${line}</span>`;
      result += `</div>`;
    });
    
    return result;
  }

  // Helper function for HTML rendering
  function getLineStatusForHTML(line: string, lineIndex: number, isOriginal: boolean): string | null {
    // This is a simplified version for HTML export
    if (!line.trim() || line.trim() === '{' || line.trim() === '}' || 
        line.trim() === '[' || line.trim() === ']' || line.trim() === ',') {
      return null;
    }
    
    // Simple heuristic for HTML export
    // In a real implementation, you'd use similar logic to getLineStatus
    if (line.includes('"added":')) return isOriginal ? null : 'added';
    if (line.includes('"removed":')) return isOriginal ? 'removed' : null;
    if (line.includes('"changed":')) return 'changed';
    
    return null;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>JSON Diff Viewer</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLineNumbers}
              title={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
            >
              <span className="text-xs font-mono">#</span>
            </Button>
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
              title="Open in new tab"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="unified">Unified View</TabsTrigger>
          </TabsList>
          <TabsContent value="split" className="mt-4">
            <SplitView
              formattedOriginal={formattedOriginal}
              formattedModified={formattedModified}
              changes={changes}
              fontSize={fontSize}
              showLineNumbers={showLineNumbers}
              copyToClipboard={copyToClipboard}
            />
          </TabsContent>
          <TabsContent value="unified" className="mt-4">
            <UnifiedView changes={changes} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JsonDiffViewer;

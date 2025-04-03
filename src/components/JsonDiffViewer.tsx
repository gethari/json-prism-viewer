
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Expand, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import * as jsondiffpatch from 'jsondiffpatch';

interface JsonDiffViewerProps {
  originalJson: string;
  modifiedJson: string;
}

const diffpatcher = jsondiffpatch.create({
  arrays: {
    detectMove: true
  },
  propertyFilter: (name: string) => name.charAt(0) !== '$'
});

function unescapeJson(json: string): string {
  if (!json.trim()) return '';
  
  try {
    // Try parsing directly first
    JSON.parse(json);
    return json;
  } catch (e) {
    try {
      // If direct parsing fails, try unescaping
      return JSON.stringify(JSON.parse(`"${json.replace(/"/g, '\\"')}"`));
    } catch (e) {
      return json; // Return original if all parsing fails
    }
  }
}

function formatJson(json: string): string {
  if (!json.trim()) return '';
  
  try {
    const obj = JSON.parse(json);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    try {
      const unescaped = JSON.parse(`"${json.replace(/"/g, '\\"')}"`);
      const obj = JSON.parse(unescaped);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return json;
    }
  }
}

function parseJson(json: string): any {
  if (!json.trim()) return {};
  
  try {
    return JSON.parse(json);
  } catch (e) {
    try {
      const unescaped = JSON.parse(`"${json.replace(/"/g, '\\"')}"`);
      return JSON.parse(unescaped);
    } catch (e) {
      return {};
    }
  }
}

const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ originalJson, modifiedJson }) => {
  const { toast } = useToast();
  const [formattedOriginal, setFormattedOriginal] = useState('');
  const [formattedModified, setFormattedModified] = useState('');
  const [delta, setDelta] = useState<any>(null);
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState('split');

  useEffect(() => {
    try {
      if (originalJson.trim() && modifiedJson.trim()) {
        const unescapedOriginal = unescapeJson(originalJson);
        const unescapedModified = unescapeJson(modifiedJson);
        
        setFormattedOriginal(formatJson(unescapedOriginal));
        setFormattedModified(formatJson(unescapedModified));
        
        const originalObj = parseJson(unescapedOriginal);
        const modifiedObj = parseJson(unescapedModified);
        
        const diff = diffpatcher.diff(originalObj, modifiedObj);
        setDelta(diff);
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
        
        setDelta(null);
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
          .added { background-color: rgb(230, 255, 237); }
          .removed { background-color: rgb(255, 235, 233); }
          @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a; color: #e0e0e0; }
            .added { background-color: rgba(87, 171, 90, 0.3); }
            .removed { background-color: rgba(229, 83, 75, 0.3); }
          }
        </style>
      </head>
      <body>
        <h1>JSON Diff Viewer</h1>
        <div class="container">
          <div class="json-panel">
            <h2>Original</h2>
            <pre>${formattedOriginal.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
          <div class="json-panel">
            <h2>Modified</h2>
            <pre>${formattedModified.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
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

  const highlightDiff = (text: string, isOriginal: boolean) => {
    if (!delta || !text) return <pre style={{ fontSize: `${fontSize}px` }}>{text}</pre>;
    
    // This is a simplified highlighting, a full implementation would require
    // advanced diff visualization that maps back to the formatted JSON
    const lines = text.split('\n');
    
    return (
      <pre style={{ fontSize: `${fontSize}px` }}>
        {lines.map((line, i) => {
          // This is a very naive way of highlighting changes
          // A real implementation would parse the delta and match it to the lines
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('"') && trimmedLine.includes('":')) {
            const propertyName = trimmedLine.split('":')[0].replace(/"/g, '');
            if (delta[propertyName]) {
              return (
                <div 
                  key={i} 
                  className={isOriginal ? 'bg-diff-removed dark:bg-diff-removedDark' : 'bg-diff-added dark:bg-diff-addedDark'}
                >
                  {line}
                </div>
              );
            }
          }
          return <div key={i}>{line}</div>;
        })}
      </pre>
    );
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>JSON Diff Viewer</span>
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
                    {highlightDiff(formattedOriginal, true)}
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
                    {highlightDiff(formattedModified, false)}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="unified" className="mt-4">
            <div className="relative">
              <ScrollArea className="h-[500px] rounded-md border">
                <div className="p-4">
                  {delta ? (
                    <pre style={{ fontSize: `${fontSize}px` }}>
                      {/* A simplified unified view - a real implementation would show changes inline */}
                      {`Changes detected but unified view requires the full jsondiffpatch HTML formatter.`}
                    </pre>
                  ) : (
                    <pre style={{ fontSize: `${fontSize}px` }}>
                      No differences found or insufficient data provided.
                    </pre>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JsonDiffViewer;

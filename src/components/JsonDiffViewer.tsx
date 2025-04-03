
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Expand, ZoomIn, ZoomOut } from 'lucide-react';
import { create } from 'jsondiffpatch';

interface JsonDiffViewerProps {
  originalJson: string;
  modifiedJson: string;
}

// Configure jsondiffpatch
const diffpatcher = create({
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

// Helper to identify changes
function findChanges(original: any, modified: any): Record<string, string[]> {
  const changes: Record<string, string[]> = {
    added: [],
    removed: [],
    changed: []
  };
  
  // Simple flat object comparison for demo
  // For a real implementation, use a recursive approach for nested objects
  const allKeys = new Set([...Object.keys(original || {}), ...Object.keys(modified || {})]);
  
  allKeys.forEach(key => {
    if (!(key in original)) {
      changes.added.push(key);
    } else if (!(key in modified)) {
      changes.removed.push(key);
    } else if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
      changes.changed.push(key);
    }
  });
  
  return changes;
}

const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ originalJson, modifiedJson }) => {
  const { toast } = useToast();
  const [formattedOriginal, setFormattedOriginal] = useState('');
  const [formattedModified, setFormattedModified] = useState('');
  const [changes, setChanges] = useState<Record<string, string[]>>({ added: [], removed: [], changed: [] });
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
        
        setChanges({ added: [], removed: [], changed: [] });
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
          .changed { background-color: rgb(255, 250, 205); }
          @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a; color: #e0e0e0; }
            .added { background-color: rgba(87, 171, 90, 0.3); }
            .removed { background-color: rgba(229, 83, 75, 0.3); }
            .changed { background-color: rgba(229, 229, 83, 0.3); }
          }
        </style>
      </head>
      <body>
        <h1>JSON Diff Viewer</h1>
        <div class="container">
          <div class="json-panel">
            <h2>Original</h2>
            <pre>${highlightJsonString(formattedOriginal, 'original')}</pre>
          </div>
          <div class="json-panel">
            <h2>Modified</h2>
            <pre>${highlightJsonString(formattedModified, 'modified')}</pre>
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

  // Helper function to highlight changes in a JSON string
  function highlightJsonString(jsonString: string, type: 'original' | 'modified'): string {
    if (!jsonString) return '';
    
    let html = jsonString;
    
    // Apply syntax highlighting with regex
    html = html
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
            
            // Extract property name for highlighting
            const propName = match.replace(/"/g, '').replace(/:$/, '');
            
            if (changes.added.includes(propName) && type === 'modified') {
              return `<span class="key added">${match}</span>`;
            } else if (changes.removed.includes(propName) && type === 'original') {
              return `<span class="key removed">${match}</span>`;
            } else if (changes.changed.includes(propName)) {
              return `<span class="key changed">${match}</span>`;
            }
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      });
    
    return html;
  }

  // For jsx rendering in React component
  const highlightDiff = (text: string, isOriginal: boolean) => {
    if (!text) return <pre style={{ fontSize: `${fontSize}px` }}>{text}</pre>;
    
    // Create highlighting for JSX
    const lines = text.split('\n');
    
    return (
      <pre style={{ fontSize: `${fontSize}px` }}>
        {lines.map((line, i) => {
          // Look for property keys in the line
          const keyMatch = line.match(/"([^"]+)":/);
          
          if (keyMatch && keyMatch[1]) {
            const propName = keyMatch[1];
            
            if (changes.added.includes(propName) && !isOriginal) {
              return <div key={i} className="bg-diff-added dark:bg-diff-addedDark">{line}</div>;
            } else if (changes.removed.includes(propName) && isOriginal) {
              return <div key={i} className="bg-diff-removed dark:bg-diff-removedDark">{line}</div>;
            } else if (changes.changed.includes(propName)) {
              return <div key={i} className="bg-yellow-100 dark:bg-yellow-900/30">{line}</div>;
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
                  <pre style={{ fontSize: `${fontSize}px` }}>
                    {changes.added.length || changes.removed.length || changes.changed.length ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Changes Summary:</h3>
                          {changes.added.length > 0 && (
                            <div className="mt-2">
                              <h4 className="font-medium text-green-600 dark:text-green-400">Added Properties:</h4>
                              <ul className="list-disc pl-5">
                                {changes.added.map((prop) => (
                                  <li key={prop}>{prop}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {changes.removed.length > 0 && (
                            <div className="mt-2">
                              <h4 className="font-medium text-red-600 dark:text-red-400">Removed Properties:</h4>
                              <ul className="list-disc pl-5">
                                {changes.removed.map((prop) => (
                                  <li key={prop}>{prop}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {changes.changed.length > 0 && (
                            <div className="mt-2">
                              <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Modified Properties:</h4>
                              <ul className="list-disc pl-5">
                                {changes.changed.map((prop) => (
                                  <li key={prop}>{prop}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      "No differences found or insufficient data provided."
                    )}
                  </pre>
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

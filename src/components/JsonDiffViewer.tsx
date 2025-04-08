
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Copy, Expand, ZoomIn, ZoomOut, Plus, Minus, Edit } from 'lucide-react';

interface JsonDiffViewerProps {
  originalJson: string;
  modifiedJson: string;
}

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

// Enhanced version of findChanges to track specific values changes
function findChanges(original: any, modified: any, path = ''): Record<string, any> {
  const changes: Record<string, any> = {
    added: [],
    removed: [],
    changed: [],
    valueMap: {} // For tracking specific values that changed
  };
  
  // Handle different types
  if (typeof original !== typeof modified) {
    if (path) changes.changed.push(path);
    changes.valueMap[path] = { 
      original: original, 
      modified: modified 
    };
    return changes;
  }
  
  // Handle arrays
  if (Array.isArray(original) && Array.isArray(modified)) {
    // Find common elements and differences
    const maxLength = Math.max(original.length, modified.length);
    
    for (let i = 0; i < maxLength; i++) {
      const currentPath = path ? `${path}[${i}]` : `[${i}]`;
      
      if (i >= original.length) {
        changes.added.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: undefined, 
          modified: modified[i] 
        };
      } else if (i >= modified.length) {
        changes.removed.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: original[i], 
          modified: undefined 
        };
      } else if (typeof original[i] === 'object' && original[i] !== null && 
                typeof modified[i] === 'object' && modified[i] !== null) {
        // Recursively compare objects
        const subChanges = findChanges(original[i], modified[i], currentPath);
        changes.added = [...changes.added, ...subChanges.added];
        changes.removed = [...changes.removed, ...subChanges.removed];
        changes.changed = [...changes.changed, ...subChanges.changed];
        Object.assign(changes.valueMap, subChanges.valueMap);
      } else if (JSON.stringify(original[i]) !== JSON.stringify(modified[i])) {
        changes.changed.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: original[i], 
          modified: modified[i] 
        };
      }
    }
    
    return changes;
  }
  
  // Handle objects
  if (typeof original === 'object' && original !== null && 
      typeof modified === 'object' && modified !== null) {
    
    // Get all keys
    const allKeys = new Set([
      ...Object.keys(original || {}), 
      ...Object.keys(modified || {})
    ]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in original)) {
        changes.added.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: undefined, 
          modified: modified[key] 
        };
      } else if (!(key in modified)) {
        changes.removed.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: original[key], 
          modified: undefined 
        };
      } else if (typeof original[key] === 'object' && original[key] !== null && 
                typeof modified[key] === 'object' && modified[key] !== null) {
        // Recursively compare objects
        const subChanges = findChanges(original[key], modified[key], currentPath);
        changes.added = [...changes.added, ...subChanges.added];
        changes.removed = [...changes.removed, ...subChanges.removed];
        changes.changed = [...changes.changed, ...subChanges.changed];
        Object.assign(changes.valueMap, subChanges.valueMap);
      } else if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
        changes.changed.push(currentPath);
        changes.valueMap[currentPath] = { 
          original: original[key], 
          modified: modified[key] 
        };
      }
    }
    
    return changes;
  }
  
  // For primitive values
  if (original !== modified) {
    if (path) changes.changed.push(path);
    changes.valueMap[path] = { 
      original: original, 
      modified: modified 
    };
  }
  
  return changes;
}

// Helper to find the path to a property from a json string line
function findPropertyPathFromLine(line: string, jsonObj: any): string | null {
  const keyMatch = line.match(/"([^"]+)":/);
  if (!keyMatch || !keyMatch[1]) return null;
  
  const propName = keyMatch[1];
  const indentation = line.match(/^\s*/)?.[0].length || 0;
  
  // Simple path finding for single-level objects
  if (propName in jsonObj) {
    return propName;
  }
  
  // For more complex nested objects, we would need a more sophisticated algorithm
  // This is a simplified approach
  return propName;
}

const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ originalJson, modifiedJson }) => {
  const { toast } = useToast();
  const [formattedOriginal, setFormattedOriginal] = useState('');
  const [formattedModified, setFormattedModified] = useState('');
  const [changes, setChanges] = useState<Record<string, any>>({ 
    added: [], removed: [], changed: [], valueMap: {} 
  });
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
        
        // Find changes between objects with enhanced function
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
          .line-added { background-color: rgba(46, 160, 67, 0.15); }
          .line-removed { background-color: rgba(248, 81, 73, 0.15); }
          .line-changed { background-color: rgba(210, 153, 34, 0.15); }
          @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a; color: #e0e0e0; }
            .added { background-color: rgba(46, 160, 67, 0.15); color: #56d364; }
            .removed { background-color: rgba(248, 81, 73, 0.15); color: #f85149; }
            .changed { background-color: rgba(210, 153, 34, 0.15); color: #e3b341; }
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
    
    // Process line by line for better highlighting
    const lines = jsonString.split('\n');
    const originalObj = parseJson(formattedOriginal);
    const modifiedObj = parseJson(formattedModified);
    
    const highlightedLines = lines.map((line, index) => {
      // Extract property path from the line
      const path = findPropertyPathFromLine(line, type === 'original' ? originalObj : modifiedObj);
      
      // Check if the key is in one of our change categories
      if (path) {
        if (changes.added.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
          return type === 'modified' 
            ? `<div class="line-added">${line}</div>` 
            : line;
        } 
        
        if (changes.removed.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
          return type === 'original' 
            ? `<div class="line-removed">${line}</div>` 
            : line;
        }
        
        if (changes.changed.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
          return `<div class="line-changed">${line}</div>`;
        }
      }
      
      // Value highlighting inside the lines
      const keyMatch = line.match(/"([^"]+)":/);
      if (keyMatch && keyMatch[1]) {
        const propName = keyMatch[1];
        
        // Check for exact property match or property in path
        const exactPath = path === propName ? propName : null;
        
        if (exactPath) {
          if (changes.added.includes(exactPath) && type === 'modified') {
            return line.replace(/"([^"]+)":/, '<span class="added">"$1":</span>');
          } else if (changes.removed.includes(exactPath) && type === 'original') {
            return line.replace(/"([^"]+)":/, '<span class="removed">"$1":</span>');
          } else if (changes.changed.includes(exactPath)) {
            return line.replace(/"([^"]+)":/, '<span class="changed">"$1":</span>');
          }
        }
      }
      
      return line;
    });
    
    return highlightedLines.join('\n');
  }

  // For jsx rendering in React component
  const highlightDiff = (text: string, isOriginal: boolean) => {
    if (!text) return <pre style={{ fontSize: `${fontSize}px` }}>{text}</pre>;
    
    // Process all lines
    const lines = text.split('\n');
    const originalObj = parseJson(formattedOriginal);
    const modifiedObj = parseJson(formattedModified);
    
    return (
      <pre style={{ fontSize: `${fontSize}px` }}>
        {lines.map((line, i) => {
          // Extract property path from the line
          const path = findPropertyPathFromLine(line, isOriginal ? originalObj : modifiedObj);
          
          // Check if the line contains any properties in our change lists
          if (path) {
            // Added properties (green background)
            if (changes.added.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
              return !isOriginal ? (
                <div key={i} className="bg-green-100 dark:bg-green-900/30 flex items-center">
                  <Plus className="h-3 w-3 inline mr-1 text-green-600 dark:text-green-400" />
                  {line}
                </div>
              ) : <div key={i}>{line}</div>;
            }
            
            // Removed properties (red background)
            if (changes.removed.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
              return isOriginal ? (
                <div key={i} className="bg-red-100 dark:bg-red-900/30 flex items-center">
                  <Minus className="h-3 w-3 inline mr-1 text-red-600 dark:text-red-400" />
                  {line}
                </div>
              ) : <div key={i}>{line}</div>;
            }
            
            // Changed properties (yellow background)
            if (changes.changed.some(p => p === path || p.startsWith(`${path}.`) || p.startsWith(`${path}[`))) {
              return (
                <div key={i} className="bg-yellow-100 dark:bg-yellow-900/30 flex items-center">
                  <Edit className="h-3 w-3 inline mr-1 text-yellow-600 dark:text-yellow-400" />
                  {line}
                </div>
              );
            }
          }
          
          // Highlight specific key changes
          const keyMatch = line.match(/"([^"]+)":/);
          if (keyMatch && keyMatch[1]) {
            const propName = keyMatch[1];
            
            // Get exact path for the property if it exists
            if (path === propName) {
              if (changes.added.includes(path) && !isOriginal) {
                return (
                  <div key={i} className="flex items-center">
                    <Plus className="h-3 w-3 inline mr-1 text-green-600 dark:text-green-400" />
                    {line.replace(new RegExp(`"${propName}":`, 'g'), 
                      `<span class="text-green-600 dark:text-green-400">"${propName}":</span>`)}
                  </div>
                );
              }
              
              if (changes.removed.includes(path) && isOriginal) {
                return (
                  <div key={i} className="flex items-center">
                    <Minus className="h-3 w-3 inline mr-1 text-red-600 dark:text-red-400" />
                    {line.replace(new RegExp(`"${propName}":`, 'g'), 
                      `<span class="text-red-600 dark:text-red-400">"${propName}":</span>`)}
                  </div>
                );
              }
              
              if (changes.changed.includes(path)) {
                return (
                  <div key={i} className="flex items-center">
                    <Edit className="h-3 w-3 inline mr-1 text-yellow-600 dark:text-yellow-400" />
                    {line.replace(new RegExp(`"${propName}":`, 'g'), 
                      `<span class="text-yellow-600 dark:text-yellow-400">"${propName}":</span>`)}
                  </div>
                );
              }
            }
          }
          
          return <div key={i}>{line}</div>;
        })}
      </pre>
    );
  };

  // Enhanced unified view with better change visualization
  const renderUnifiedView = () => {
    return (
      <div className="space-y-4 px-4">
        <div>
          <h3 className="text-lg font-medium">Changes Summary:</h3>
          
          {changes.added.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
              <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Added Properties:
              </h4>
              <ul className="list-disc pl-5 mt-1">
                {changes.added.map((prop) => (
                  <li key={prop} className="text-sm">
                    <span className="font-mono">{prop}</span>
                    {changes.valueMap[prop] && (
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                        Value: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {JSON.stringify(changes.valueMap[prop].modified)}
                        </code>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {changes.removed.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
              <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center">
                <Minus className="h-4 w-4 mr-1" />
                Removed Properties:
              </h4>
              <ul className="list-disc pl-5 mt-1">
                {changes.removed.map((prop) => (
                  <li key={prop} className="text-sm">
                    <span className="font-mono">{prop}</span>
                    {changes.valueMap[prop] && (
                      <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                        Was: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {JSON.stringify(changes.valueMap[prop].original)}
                        </code>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {changes.changed.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <h4 className="font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Modified Properties:
              </h4>
              <ul className="list-disc pl-5 mt-1">
                {changes.changed.map((prop) => (
                  <li key={prop} className="text-sm">
                    <span className="font-mono">{prop}</span>
                    {changes.valueMap[prop] && (
                      <div className="text-xs ml-2 mt-1 text-gray-500 dark:text-gray-400">
                        <div>
                          From: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                            {JSON.stringify(changes.valueMap[prop].original)}
                          </code>
                        </div>
                        <div className="mt-0.5">
                          To: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                            {JSON.stringify(changes.valueMap[prop].modified)}
                          </code>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {changes.added.length === 0 && changes.removed.length === 0 && changes.changed.length === 0 && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400">
              No differences found or insufficient data provided.
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Legend:</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-green-100 dark:bg-green-900/30 mr-2"></span>
              <span className="text-green-600 dark:text-green-400 text-sm">Added</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-red-100 dark:bg-red-900/30 mr-2"></span>
              <span className="text-red-600 dark:text-red-400 text-sm">Removed</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 mr-2"></span>
              <span className="text-yellow-600 dark:text-yellow-400 text-sm">Modified</span>
            </div>
          </div>
        </div>
      </div>
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
                  {renderUnifiedView()}
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

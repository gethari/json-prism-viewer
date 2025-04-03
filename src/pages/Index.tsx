
import React, { useState, useEffect } from 'react';
import JsonInput from '@/components/JsonInput';
import JsonDiffViewer from '@/components/JsonDiffViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDiff, Github, FileJson, Sun, Moon, Clipboard, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Show a welcome toast with info about the auto-escaping feature
    toast({
      title: "Welcome to JSON Prism",
      description: "JSON is automatically processed for comparison. You can paste escaped or unescaped JSON.",
      duration: 5000,
    });
  }, []);

  const handleCompare = () => {
    if (originalJson.trim() && modifiedJson.trim()) {
      setShowDiff(true);
    }
  };

  const handleSampleData = () => {
    const originalSample = JSON.stringify({
      name: "Product",
      price: 123.45,
      inStock: true,
      colors: ["red", "blue", "green"],
      details: {
        weight: "2kg",
        dimensions: "10x20x30"
      }
    });
    
    const modifiedSample = JSON.stringify({
      name: "Product Updated",
      price: 149.99,
      inStock: false,
      colors: ["red", "blue", "yellow"],
      details: {
        weight: "2.5kg",
        dimensions: "10x20x30",
        material: "plastic"
      }
    });
    
    setOriginalJson(originalSample);
    setModifiedJson(modifiedSample);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isValidJsonString = (str: string): boolean => {
    if (!str.trim()) return false;
    
    // Approach 1: Direct parsing (for valid JSON)
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      // Continue to other approaches
    }
    
    // Approach 2: For escaped JSON strings with escaped quotes like {\"key\":\"value\"}
    try {
      const fixedJson = str.replace(/\\"/g, '"');
      JSON.parse(fixedJson);
      return true;
    } catch (e) {
      // Continue to other approaches
    }
    
    // Approach 3: For JSON strings that need to be unescaped first
    try {
      // Try to parse as a JSON string (with outer quotes)
      const unescaped = JSON.parse(`"${str.replace(/"/g, '\\"')}"`);
      try {
        JSON.parse(unescaped);
        return true;
      } catch (e) {
        // The unescaped string is not valid JSON
      }
    } catch (e) {
      // Not a valid JSON string that can be unescaped
    }
    
    return false;
  };

  const pasteFromClipboard = async (target: 'original' | 'modified') => {
    try {
      const text = await navigator.clipboard.readText();
      
      if (isValidJsonString(text)) {
        if (target === 'original') {
          setOriginalJson(text);
        } else {
          setModifiedJson(text);
        }
        toast({
          title: "Imported from clipboard",
          description: "Valid JSON detected and pasted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid JSON",
          description: "The clipboard content is not a valid JSON",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Failed to read from clipboard. Make sure you've granted permission.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileDiff className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">JSON Prism Viewer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Github className="mr-1 h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-md">
                <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  JSON content is automatically processed for easy comparison. You can paste either escaped or unescaped JSON, and the tool will handle it for you.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <JsonInput 
                    title="Original JSON (Before)" 
                    value={originalJson} 
                    onChange={setOriginalJson}
                    placeholder="Paste your original JSON here..."
                  />
                </div>
                <div className="space-y-2">
                  <JsonInput 
                    title="Modified JSON (After)" 
                    value={modifiedJson} 
                    onChange={setModifiedJson}
                    placeholder="Paste your modified JSON here..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-4">
                <Button 
                  onClick={handleCompare}
                  disabled={!originalJson.trim() || !modifiedJson.trim()}
                  className="w-32"
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Compare
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSampleData}
                  className="w-32"
                >
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {showDiff && (
            <JsonDiffViewer originalJson={originalJson} modifiedJson={modifiedJson} />
          )}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            JSON Prism Viewer - A tool for visualizing JSON differences
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

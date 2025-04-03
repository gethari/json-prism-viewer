
import React, { useState, useEffect } from 'react';
import JsonInput from '@/components/JsonInput';
import JsonDiffViewer from '@/components/JsonDiffViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDiff, Github, FileJson, Sun, Moon, Clipboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

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
    
    try {
      // Try parsing directly first
      JSON.parse(str);
      return true;
    } catch (e) {
      try {
        // If direct parsing fails, try unescaping
        JSON.parse(JSON.parse(`"${str.replace(/"/g, '\\"')}"`));
        return true;
      } catch (e) {
        return false;
      }
    }
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
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => pasteFromClipboard('original')}
                      className="mb-2"
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Import from Clipboard
                    </Button>
                  </div>
                  <JsonInput 
                    title="Original JSON (Before)" 
                    value={originalJson} 
                    onChange={setOriginalJson}
                    placeholder="Paste your original JSON here..."
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => pasteFromClipboard('modified')}
                      className="mb-2"
                    >
                      <Clipboard className="mr-2 h-4 w-4" />
                      Import from Clipboard
                    </Button>
                  </div>
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

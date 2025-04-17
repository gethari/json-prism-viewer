import React, { useState, useEffect } from 'react';
import JsonInput from '@/components/JsonInput';
import JsonDiffViewer from '@/components/JsonDiffViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDiff, Github, FileJson, Sun, Moon, Clipboard, Info, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { faker } from '@faker-js/faker';
import { fetchGitHubArtifact } from '@/utils/githubArtifact';

const Index = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [artifactUrl, setArtifactUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const generateRandomProduct = () => {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      inStock: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
      colors: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.color.human()),
      categories: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.commerce.department()),
      details: {
        weight: `${faker.number.float({ min: 0.1, max: 10, precision: 0.1 })}kg`,
        dimensions: `${faker.number.int({ min: 5, max: 30 })}x${faker.number.int({ min: 5, max: 30 })}x${faker.number.int({ min: 5, max: 30 })}`,
        material: faker.commerce.productMaterial(),
        manufacturer: faker.company.name(),
        countryOfOrigin: faker.location.country(),
      },
      ratings: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => ({
        userId: faker.string.uuid(),
        score: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      })),
    };
  };

  const generateModifiedProduct = (original: any) => {
    const modified = { ...original };
    
    // Make random modifications
    modified.name = faker.commerce.productName();
    modified.price = parseFloat(faker.commerce.price());
    modified.inStock = !original.inStock;
    
    // Modify some colors (remove one, add one)
    if (modified.colors.length > 0) {
      modified.colors = [...modified.colors];
      modified.colors.pop();
      modified.colors.push(faker.color.human());
    }
    
    // Add a new field
    modified.popularity = faker.number.float({ min: 0, max: 1, precision: 0.01 });
    
    // Modify details
    modified.details = {
      ...modified.details,
      weight: `${faker.number.float({ min: 0.1, max: 10, precision: 0.1 })}kg`,
      shipping: {
        service: faker.company.name(),
        estimatedDays: faker.number.int({ min: 1, max: 10 }),
      }
    };
    
    // Remove a key
    if (modified.ratings) {
      delete modified.ratings;
    }
    
    return modified;
  };

  const handleSampleData = () => {
    const originalProduct = generateRandomProduct();
    const modifiedProduct = generateModifiedProduct(originalProduct);
    
    setOriginalJson(JSON.stringify(originalProduct, null, 2));
    setModifiedJson(JSON.stringify(modifiedProduct, null, 2));
    
    toast({
      title: "Random Data Generated",
      description: "Sample JSON data created with random differences",
    });
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

  const handleFetchArtifact = async () => {
    if (!artifactUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a GitHub artifact URL",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const artifactData = await fetchGitHubArtifact(artifactUrl);
      
      if (!artifactData) {
        toast({
          variant: "destructive",
          title: "Failed to fetch artifact",
          description: "Could not retrieve or parse the GitHub artifact",
        });
        return;
      }
      
      // Set the "before" JSON to the original input
      setOriginalJson(JSON.stringify(artifactData.before, null, 2));
      
      // Set the "after" JSON to the modified input
      setModifiedJson(JSON.stringify(artifactData.after, null, 2));
      
      // Show the diff view automatically
      setShowDiff(true);
      
      toast({
        title: "Artifact Loaded",
        description: `Successfully loaded artifact from ${artifactData.file || 'GitHub'}`,
      });
      
      // If there's metadata, log it to console for debugging purposes
      if (artifactData.meta) {
        console.log("Artifact metadata:", artifactData.meta);
      }
    } catch (error) {
      console.error("Error loading artifact:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the GitHub artifact. Check the console for details.",
      });
    } finally {
      setIsLoading(false);
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
              
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Github className="h-5 w-5 mr-2" />
                  Load from GitHub Artifact
                </h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter GitHub artifact URL"
                    value={artifactUrl}
                    onChange={(e) => setArtifactUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleFetchArtifact}
                    disabled={isLoading || !artifactUrl.trim()}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading
                      </span>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Fetch
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Provide the URL to a GitHub artifact JSON file with "before" and "after" properties.
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

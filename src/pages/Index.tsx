
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonInputsContainer from '@/components/JsonInputsContainer';
import { parseUrlParams } from '@/utils/githubArtifact';
import MonacoDiffViewer from '@/components/MonacoDiffViewer';

const Index = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for URL parameters on mount
    const urlData = parseUrlParams();
    
    if (urlData.before || urlData.after) {
      // We have data from URL params
      if (urlData.before) {
        setOriginalJson(JSON.stringify(urlData.before, null, 2));
      }
      
      if (urlData.after) {
        setModifiedJson(JSON.stringify(urlData.after, null, 2));
      }
      
      // If we have both before and after, automatically show the diff
      if (urlData.before && urlData.after) {
        setShowDiff(true);
        toast({
          title: "Data loaded from URL",
          description: "JSON data has been automatically loaded from URL parameters",
        });
      }
    } else {
      // Show the welcome toast only if we don't have URL params
      toast({
        title: "Welcome to JSON Prism",
        description: "JSON is automatically processed for comparison. You can paste escaped or unescaped JSON.",
        duration: 5000,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container py-8">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <JsonInputsContainer
                originalJson={originalJson}
                modifiedJson={modifiedJson}
                setOriginalJson={setOriginalJson}
                setModifiedJson={setModifiedJson}
                setShowDiff={setShowDiff}
              />
            </CardContent>
          </Card>
          
          {showDiff && (
            <MonacoDiffViewer originalJson={originalJson} modifiedJson={modifiedJson} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

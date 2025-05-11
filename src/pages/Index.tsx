
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonInputsContainer from '@/components/JsonInputsContainer';
import MonacoDiffViewer from '@/components/MonacoDiffViewer';
import { parseJson, safeStringify } from '@/utils/jsonUtils';

const Index = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Parse URL parameters using React Router's useSearchParams
    const beforeParam = searchParams.get('before');
    const afterParam = searchParams.get('after');
    
    let hasData = false;
    
    if (beforeParam) {
      try {
        // Try to decode and parse the 'before' parameter
        const decoded = decodeURIComponent(beforeParam);
        const parsed = parseJson(decoded);
        if (parsed) {
          setOriginalJson(safeStringify(parsed));
          hasData = true;
        }
      } catch (e) {
        console.error("Error parsing 'before' parameter:", e);
      }
    }
    
    if (afterParam) {
      try {
        // Try to decode and parse the 'after' parameter
        const decoded = decodeURIComponent(afterParam);
        const parsed = parseJson(decoded);
        if (parsed) {
          setModifiedJson(safeStringify(parsed));
          hasData = true;
        }
      } catch (e) {
        console.error("Error parsing 'after' parameter:", e);
      }
    }
    
    // If we have both before and after, automatically show the diff
    if (beforeParam && afterParam) {
      setShowDiff(true);
      toast({
        title: "Data loaded from URL",
        description: "JSON data has been automatically loaded from URL parameters",
      });
    } else if (hasData) {
      toast({
        title: "Partial data loaded from URL",
        description: "Some JSON data has been loaded from URL parameters",
      });
    } else {
      // Show the welcome toast only if we don't have URL params
      toast({
        title: "Welcome to JSON Prism",
        description: "JSON is automatically processed for comparison. You can paste escaped or unescaped JSON.",
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

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

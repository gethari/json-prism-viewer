import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import JsonInputsContainer from '@/components/JsonInputsContainer';
import MonacoDiffViewer from '@/components/MonacoDiffViewer';
import { parseJson, safeStringify } from '@/utils/jsonUtils';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';

const JsonCompareContent = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { autoCompare, autoScroll } = useSettings();
  const diffSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse URL parameters using React Router's useSearchParams
    const beforeParam = searchParams.get('before');
    const afterParam = searchParams.get('after');

    let hasData = false;

    if (beforeParam) {
      try {
        // First decode URI component
        const decoded = decodeURIComponent(beforeParam);

        // Check if it's base64 encoded
        let jsonData = null;
        try {
          // Try base64 decoding first
          const decodedBase64 = atob(decoded);
          jsonData = parseJson(decodedBase64);
        } catch (base64Error) {
          // If base64 decoding fails, try parsing directly
          jsonData = parseJson(decoded);
        }

        if (jsonData) {
          setOriginalJson(safeStringify(jsonData));
          hasData = true;
        }
      } catch (e) {
        console.error("Error parsing 'before' parameter:", e);
      }
    }

    if (afterParam) {
      try {
        // First decode URI component
        const decoded = decodeURIComponent(afterParam);

        // Check if it's base64 encoded
        let jsonData = null;
        try {
          // Try base64 decoding first
          const decodedBase64 = atob(decoded);
          jsonData = parseJson(decodedBase64);
        } catch (base64Error) {
          // If base64 decoding fails, try parsing directly
          jsonData = parseJson(decoded);
        }

        if (jsonData) {
          setModifiedJson(safeStringify(jsonData));
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
        title: 'Data loaded from URL',
        description: 'JSON data has been automatically loaded from URL parameters',
      });
    } else if (hasData) {
      toast({
        title: 'Partial data loaded from URL',
        description: 'Some JSON data has been loaded from URL parameters',
      });
    } else {
      // Show the welcome toast only if we don't have URL params
      toast({
        title: 'Welcome to JSON Toolkit',
        description:
          'JSON is automatically processed for comparison. You can paste escaped or unescaped JSON.',
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  // Effect for auto-compare functionality
  useEffect(() => {
    if (autoCompare && originalJson && modifiedJson) {
      setShowDiff(true);

      // Auto-scroll to diff section if enabled
      if (autoScroll && diffSectionRef.current) {
        setTimeout(() => {
          diffSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300); // Small delay to ensure component is rendered
      }
    }
  }, [originalJson, modifiedJson, autoCompare, autoScroll]);

  // Handle when JSON content is loaded or pasted
  const handleJsonChange = (type: 'original' | 'modified', value: string) => {
    if (type === 'original') {
      setOriginalJson(value);
    } else {
      setModifiedJson(value);
    }

    if (value && ((type === 'original' && modifiedJson) || (type === 'modified' && originalJson))) {
      toast({
        title: 'JSON content updated',
        description: autoCompare
          ? 'Comparison will happen automatically'
          : "Click 'Compare' to view differences",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />

        <main className="px-4 py-6 flex-1 overflow-y-auto">
          <div className="w-full">
            <h1 className="text-3xl font-bold tracking-tight mb-6">JSON Compare Tool</h1>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <JsonInputsContainer
                  originalJson={originalJson}
                  modifiedJson={modifiedJson}
                  setOriginalJson={json => handleJsonChange('original', json)}
                  setModifiedJson={json => handleJsonChange('modified', json)}
                  setShowDiff={setShowDiff}
                />
              </CardContent>
            </Card>

            <div ref={diffSectionRef}>
              {showDiff && (
                <MonacoDiffViewer originalJson={originalJson} modifiedJson={modifiedJson} />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const JsonCompare = () => {
  return (
    <SettingsProvider>
      <JsonCompareContent />
    </SettingsProvider>
  );
};

export default JsonCompare;

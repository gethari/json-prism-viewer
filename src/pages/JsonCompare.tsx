
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import JsonInputsContainer from '@/components/JsonInputsContainer';
import MonacoDiffViewer from '@/components/MonacoDiffViewer';
import EscapedJsonView from '@/components/EscapedJsonView';
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
    // Get params either from React Router's useSearchParams or from the full URL
    const getUrlParameter = (paramName: string): string | null => {
      // First try React Router's searchParams
      const routerParam = searchParams.get(paramName);
      if (routerParam) return routerParam;
      
      // If not found, try getting from the full URL (fallback)
      const url = new URL(window.location.href);
      return url.searchParams.get(paramName);
    };

    const beforeParam = getUrlParameter('before');
    const afterParam = getUrlParameter('after');

    let hasData = false;

    if (beforeParam) {
      try {
        // First decode URI component
        const decoded = decodeURIComponent(beforeParam);
        
        try {
          // Try base64 decoding
          const decodedBase64 = atob(decoded);
          try {
            // Try parsing as JSON directly
            const jsonData = parseJson(decodedBase64);
            setOriginalJson(safeStringify(jsonData));
            hasData = true;
          } catch (parseError) {
            // If parsing fails, just use the decoded string as is
            setOriginalJson(decodedBase64);
            hasData = true;
          }
        } catch (base64Error) {
          // If base64 decoding fails, try parsing directly
          try {
            const jsonData = parseJson(decoded);
            setOriginalJson(safeStringify(jsonData));
            hasData = true;
          } catch (parseError) {
            // Use as-is if all parsing fails
            setOriginalJson(decoded);
            hasData = true;
          }
        }
      } catch (e) {
        console.error("Error processing 'before' parameter:", e);
        toast({
          title: "Error processing URL parameter",
          description: "Could not process the 'before' parameter from the URL.",
          variant: "destructive",
        });
      }
    }

    if (afterParam) {
      try {
        // First decode URI component
        const decoded = decodeURIComponent(afterParam);
        
        try {
          // Try base64 decoding
          const decodedBase64 = atob(decoded);
          try {
            // Try parsing as JSON directly
            const jsonData = parseJson(decodedBase64);
            setModifiedJson(safeStringify(jsonData));
            hasData = true;
          } catch (parseError) {
            // If parsing fails, just use the decoded string as is
            setModifiedJson(decodedBase64);
            hasData = true;
          }
        } catch (base64Error) {
          // If base64 decoding fails, try parsing directly
          try {
            const jsonData = parseJson(decoded);
            setModifiedJson(safeStringify(jsonData));
            hasData = true;
          } catch (parseError) {
            // Use as-is if all parsing fails
            setModifiedJson(decoded);
            hasData = true;
          }
        }
      } catch (e) {
        console.error("Error processing 'after' parameter:", e);
        toast({
          title: "Error processing URL parameter",
          description: "Could not process the 'after' parameter from the URL.",
          variant: "destructive",
        });
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
                <>
                  <MonacoDiffViewer originalJson={originalJson} modifiedJson={modifiedJson} />
                  <EscapedJsonView originalJson={originalJson} modifiedJson={modifiedJson} />
                </>
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

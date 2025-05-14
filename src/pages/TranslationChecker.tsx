
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { SettingsProvider } from '@/contexts/SettingsContext';
import TranslationInputsContainer from '@/components/TranslationInputsContainer';
import TranslationResults from '@/components/TranslationResults';
import { parseJson } from '@/utils/jsonUtils';
import { findMissingTranslations, updateConfigWithTranslationKeys } from '@/utils/translationUtils';

const TranslationCheckerContent = () => {
  const [configJson, setConfigJson] = useState('');
  const [translationJson, setTranslationJson] = useState('');
  const [missingTranslations, setMissingTranslations] = useState<{key: string, value: string}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [updatedConfigJson, setUpdatedConfigJson] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Effect to check translations when both inputs are available
  useEffect(() => {
    if (configJson && translationJson && !isProcessing) {
      setIsProcessing(true);
      
      try {
        const configData = typeof configJson === 'string' ? parseJson(configJson) : configJson;
        const translationData = typeof translationJson === 'string' ? parseJson(translationJson) : translationJson;
        
        if (configData && translationData) {
          const missing = findMissingTranslations(configData, translationData);
          setMissingTranslations(missing);
          
          // Generate updated config with translation keys
          const updatedConfig = updateConfigWithTranslationKeys(configData, missing);
          setUpdatedConfigJson(updatedConfig);
          
          setShowResults(true);
          
          // Scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      } catch (error) {
        console.error("Error processing translation data:", error);
        toast({
          title: "Error",
          description: "Failed to process translation data",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [configJson, translationJson, toast, isProcessing]);

  const handleRevalidate = () => {
    if (updatedConfigJson && !isProcessing) {
      setIsProcessing(true);
      
      try {
        // Set the updated config back to the input
        setConfigJson(JSON.stringify(updatedConfigJson, null, 2));
        
        // Add missing translations to the translation JSON
        const translationData = parseJson(translationJson) || {};
        const updatedTranslations = { ...translationData };
        
        // Only add missing translations that don't already exist
        missingTranslations.forEach(({ key, value }) => {
          if (!updatedTranslations[key]) {
            updatedTranslations[key] = value;
          }
        });
        
        setTranslationJson(JSON.stringify(updatedTranslations, null, 2));
        
        toast({
          title: "Revalidation Started",
          description: "Updated configuration and translations have been set for revalidation",
        });
        
        // Scroll to top
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error("Error updating translation data:", error);
        toast({
          title: "Error",
          description: "Failed to update translation data for revalidation",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        
        <main className="container py-8 flex-1">
          <div ref={topRef} className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Translation Keys Checker</h1>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <TranslationInputsContainer
                  configJson={configJson}
                  translationJson={translationJson}
                  setConfigJson={setConfigJson}
                  setTranslationJson={setTranslationJson}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
            
            <div ref={resultsRef}>
              {showResults && (
                <TranslationResults 
                  missingTranslations={missingTranslations}
                  translationData={parseJson(translationJson) || {}}
                  updatedConfigJson={updatedConfigJson}
                  onRevalidate={handleRevalidate}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

const TranslationChecker = () => {
  return (
    <SettingsProvider>
      <TranslationCheckerContent />
    </SettingsProvider>
  );
};

export default TranslationChecker;

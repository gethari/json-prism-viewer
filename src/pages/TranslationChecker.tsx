
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SettingsProvider } from '@/contexts/SettingsContext';
import TranslationInputsContainer from '@/components/TranslationInputsContainer';
import TranslationResults from '@/components/TranslationResults';
import { parseJson } from '@/utils/jsonUtils';
import { findMissingTranslations } from '@/utils/translationUtils';

const TranslationCheckerContent = () => {
  const [configJson, setConfigJson] = useState('');
  const [translationJson, setTranslationJson] = useState('');
  const [missingTranslations, setMissingTranslations] = useState<{key: string, value: string}[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Effect to check translations when both inputs are available
  useEffect(() => {
    if (configJson && translationJson) {
      try {
        const configData = typeof configJson === 'string' ? parseJson(configJson) : configJson;
        const translationData = typeof translationJson === 'string' ? parseJson(translationJson) : translationJson;
        
        if (configData && translationData) {
          const missing = findMissingTranslations(configData, translationData);
          setMissingTranslations(missing);
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
      }
    }
  }, [configJson, translationJson, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Translation Keys Checker</h1>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <TranslationInputsContainer
                configJson={configJson}
                translationJson={translationJson}
                setConfigJson={setConfigJson}
                setTranslationJson={setTranslationJson}
              />
            </CardContent>
          </Card>
          
          <div ref={resultsRef}>
            {showResults && (
              <TranslationResults 
                missingTranslations={missingTranslations}
                translationData={parseJson(translationJson) || {}}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
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

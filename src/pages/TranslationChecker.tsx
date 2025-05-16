
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { SettingsProvider } from '@/contexts/SettingsContext';
import TranslationInputsContainer from '@/components/TranslationInputsContainer';
import { UnicodeEscapeSettings } from '@/components/UnicodeEscapeSettings';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { parseJson } from '@/utils/jsonUtils';
import { findMissingTranslations, updateConfigWithTranslationKeys } from '@/utils/translationUtils';
import TranslationResults from '@/components/TranslationResults';

// Add keyboard shortcut handler with Alt key instead of Ctrl/Cmd
const useKeyboardShortcuts = (shortcuts: { key: string; altKey?: boolean; callback: () => void }[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!shortcut.altKey || e.altKey)
        ) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

const TranslationCheckerContent = () => {
  const [configJson, setConfigJson] = useState('');
  const [translationJson, setTranslationJson] = useState('');
  const [missingTranslations, setMissingTranslations] = useState<
    { key: string; value: string; existsInTranslations: boolean }[]
  >([]);
  const [ignoredFields, setIgnoredFields] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [updatedConfigJson, setUpdatedConfigJson] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPotentialTypos, setShowPotentialTypos] = useState(false);
  const [showFullTranslations, setShowFullTranslations] = useState(false);
  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // OS detection for keyboard shortcuts
  const isMac = useMemo(() => {
    if (typeof window !== 'undefined') {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    return false;
  }, []);

  const modifierKeyDisplay = isMac ? 'Option' : 'Alt';

  // Register keyboard shortcuts using Alt/Option key instead of Ctrl/Cmd
  useKeyboardShortcuts([
    {
      key: 'r',
      altKey: true,
      callback: () => {
        if (updatedConfigJson && !isProcessing) {
          handleRevalidate();
          toast({
            title: 'Revalidation Triggered',
            description: `Using keyboard shortcut ${modifierKeyDisplay}+R`,
          });
        }
      },
    },
    {
      key: 't',
      altKey: true,
      callback: () => {
        setShowPotentialTypos(prev => !prev);
        toast({
          title: `Potential Typos ${showPotentialTypos ? 'Hidden' : 'Shown'}`,
          description: `Using keyboard shortcut ${modifierKeyDisplay}+T`,
        });
      },
    },
    {
      key: 'f',
      altKey: true,
      callback: () => {
        setShowFullTranslations(prev => !prev);
        toast({
          title: `Full Translations ${showFullTranslations ? 'Hidden' : 'Shown'}`,
          description: `Using keyboard shortcut ${modifierKeyDisplay}+F`,
        });
      },
    },
  ]);

  // Effect to check translations when both inputs are available
  useEffect(() => {
    if (configJson && translationJson && !isProcessing) {
      setIsProcessing(true);

      // Show toast notification that processing has started
      toast({
        title: 'Processing Translation Keys',
        description: 'Analyzing your configuration and translation files...',
      });

      try {
        const configData = typeof configJson === 'string' ? parseJson(configJson) : configJson;
        const translationData =
          typeof translationJson === 'string' ? parseJson(translationJson) : translationJson;

        if (configData && translationData) {
          const result = findMissingTranslations(configData, translationData);
          setMissingTranslations(result.items);
          setIgnoredFields(result.ignoredFields || []);

          // Generate updated config with translation keys
          const updatedConfig = updateConfigWithTranslationKeys(configData, result.items);
          setUpdatedConfigJson(updatedConfig);

          setShowResults(true);

          // Scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 300);
        }
      } catch (error) {
        console.error('Error processing translation data:', error);
        toast({
          title: 'Error',
          description: 'Failed to process translation data',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
        // Show toast notification that processing is complete
        if (!showResults) {
          toast({
            title: 'Processing Complete',
            description: 'Translation key analysis is now complete',
          });
        }
      }
    }
  }, [configJson, translationJson, toast, isProcessing, showResults]);

  const handleRevalidate = () => {
    if (updatedConfigJson && !isProcessing) {
      setIsProcessing(true);

      // Reset the results first to provide visual feedback
      setShowResults(false);

      try {
        // Set the updated config back to the input
        setConfigJson(JSON.stringify(updatedConfigJson, null, 2));

        // Add missing translations to the translation JSON
        const translationData = parseJson(translationJson) || {};
        const updatedTranslations = { ...translationData };

        // Only add missing translations that don't already exist
        for (const { key, value, existsInTranslations } of missingTranslations) {
          if (!existsInTranslations && !updatedTranslations[key]) {
            updatedTranslations[key] = value;
          }
        }

        setTranslationJson(JSON.stringify(updatedTranslations, null, 2));

        toast({
          title: 'Updates Applied',
          description: 'Configuration updated with translation keys and missing translations added',
        });

        // Scroll to top
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error updating translation data:', error);
        toast({
          title: 'Error',
          description: 'Failed to update translation data for revalidation',
          variant: 'destructive',
        });
      } finally {
        // Add a small delay before showing results again, for a more noticeable refresh effect
        setTimeout(() => {
          setIsProcessing(false);
          setShowResults(true); // Show the results again
        }, 800);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />

        <main className="px-4 py-8 flex-1 w-full">
          <div ref={topRef} className="w-full">
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

            {/* Unicode Escaping Settings in an Accordion */}
            <div className="mb-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="unicode-escaping">
                  <AccordionTrigger>Unicode Quote Escaping Settings</AccordionTrigger>
                  <AccordionContent>
                    <UnicodeEscapeSettings />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div ref={resultsRef} className={showResults ? 'animate-fade-in' : ''}>
              {showResults && (
                <TranslationResults
                  missingTranslations={missingTranslations}
                  ignoredFields={ignoredFields}
                  translationData={parseJson(translationJson) || {}}
                  updatedConfigJson={updatedConfigJson}
                  onRevalidate={handleRevalidate}
                  isProcessing={isProcessing}
                  showPotentialTypos={showPotentialTypos}
                  setShowPotentialTypos={setShowPotentialTypos}
                  showFullTranslations={showFullTranslations}
                  setShowFullTranslations={setShowFullTranslations}
                  isMac={isMac}
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

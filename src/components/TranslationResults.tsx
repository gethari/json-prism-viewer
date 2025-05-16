
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { safeStringify, stringifyWithUnicodeQuotes } from '@/utils/jsonUtils';
import { findPotentialTypos } from '@/utils/translationUtils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Copy, FileJson, Loader, RefreshCw, Eye, EyeOff, Keyboard } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';

// Import refactored components
import TranslationSummary from './translation/TranslationSummary';
import MissingTranslationsPanel from './translation/MissingTranslationsPanel';
import NeedKeysPanel from './translation/NeedKeysPanel';
import IgnoredFieldsPanel from './translation/IgnoredFieldsPanel';
import PotentialTyposPanel from './translation/PotentialTyposPanel';
import FullTranslationsPanel from './translation/FullTranslationsPanel';
import UpdatedConfigPanel from './translation/UpdatedConfigPanel';
import KeyboardShortcutsInfo from './translation/KeyboardShortcutsInfo';

interface TranslationResultsProps {
  missingTranslations: { key: string; value: string; existsInTranslations: boolean }[];
  ignoredFields?: string[];
  translationData: Record<string, string>;
  updatedConfigJson?: any;
  onRevalidate?: () => void;
  isProcessing?: boolean;
  showPotentialTypos?: boolean;
  setShowPotentialTypos?: (show: boolean) => void;
  showFullTranslations?: boolean;
  setShowFullTranslations?: (show: boolean) => void;
  isMac?: boolean;
}

const TranslationResults: React.FC<TranslationResultsProps> = ({
  missingTranslations,
  ignoredFields = [],
  translationData,
  updatedConfigJson,
  onRevalidate,
  isProcessing = false,
  showPotentialTypos = false,
  setShowPotentialTypos = () => {},
  showFullTranslations = false,
  setShowFullTranslations = () => {},
  isMac = false,
}) => {
  const { toast } = useToast();
  const modifierKeyDisplay = isMac ? 'Option' : 'Alt';

  // Generate the full updated translation object
  const updatedTranslations = { ...translationData };
  // Only add translations that don't already exist
  for (const { key, value, existsInTranslations } of missingTranslations) {
    if (!existsInTranslations) {
      // Add new translations with key
      updatedTranslations[key] = value;
    }
  }

  // Split missing translations into actually missing vs. needing keys
  const actuallyMissing = missingTranslations.filter(item => !item.existsInTranslations);
  const needKeyOnly = missingTranslations.filter(item => item.existsInTranslations);

  // Find potential typos between config and translations
  const [potentialTypos, setPotentialTypos] = useState<
    Array<{ configLabel: string; translationText: string; similarity: number }>
  >([]);

  // Use effect to find potential typos when component mounts or dependencies change
  useEffect(() => {
    if (updatedConfigJson && translationData) {
      const typos = findPotentialTypos(updatedConfigJson, translationData);
      setPotentialTypos(typos);
    }
  }, [updatedConfigJson, translationData]);

  // Register Alt key shortcuts instead of Ctrl/Cmd
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if Alt key is pressed
      if (e.altKey) {
        // Alt+R - Revalidate
        if (e.key.toLowerCase() === 'r' && onRevalidate && !isProcessing) {
          e.preventDefault();
          onRevalidate();
          toast({
            title: 'Revalidation Triggered',
            description: `Using keyboard shortcut ${modifierKeyDisplay}+R`,
          });
        }
        
        // Alt+T - Toggle potential typos
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          setShowPotentialTypos(!showPotentialTypos);
          toast({
            title: `Potential Typos ${showPotentialTypos ? 'Hidden' : 'Shown'}`,
            description: `Using keyboard shortcut ${modifierKeyDisplay}+T`,
          });
        }
        
        // Alt+F - Toggle full translations
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setShowFullTranslations(!showFullTranslations);
          toast({
            title: `Full Translations ${showFullTranslations ? 'Hidden' : 'Shown'}`,
            description: `Using keyboard shortcut ${modifierKeyDisplay}+F`,
          });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPotentialTypos, showFullTranslations, onRevalidate, isProcessing, setShowPotentialTypos, setShowFullTranslations, modifierKeyDisplay, toast]);

  // Get unicode escaping settings
  const { unicodeQuoteEscaping, escapeKeysInJson } = useSettings();

  // Generate JSON strings for both formats
  const missingTranslationsJson = safeStringify(
    actuallyMissing.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>),
    2
  );

  // Use Unicode quotes only for newly added translations while preserving existing ones
  const fullTranslationsJson = stringifyWithUnicodeQuotes(updatedTranslations, 2, {
    escapeMode: unicodeQuoteEscaping,
    escapeKeys: escapeKeysInJson,
    preserveExistingValues: true,
    originalValues: translationData,
  });
  const updatedConfigJsonString = updatedConfigJson ? safeStringify(updatedConfigJson, 2) : '';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard',
        description: `The ${type} has been copied to your clipboard`,
      });
    });
  };

  return (
    <Card className="mb-8" id="translation-results">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <FileJson className="mr-2 h-5 w-5" />
            Translation Results
            {missingTranslations.length > 0 && (
              <span className="ml-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium py-1 px-2 rounded-full">
                {missingTranslations.length} items to process
              </span>
            )}
            {missingTranslations.length === 0 && (
              <span className="ml-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                <Check className="h-3 w-3 mr-1" /> All keys present
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs">
              <Keyboard className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              <span className="text-gray-500">{modifierKeyDisplay}+R revalidate</span>
            </div>
            
            {missingTranslations.length > 0 && onRevalidate && (
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={onRevalidate}
                disabled={isProcessing}
                title="Update configuration with translation keys and add missing entries to translation file"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Apply Updates & Revalidate
                  </>
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-3 justify-end">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-typos"
                checked={showPotentialTypos}
                onCheckedChange={setShowPotentialTypos}
              />
              <label htmlFor="show-typos" className="text-sm flex items-center cursor-pointer">
                {showPotentialTypos ? (
                  <Eye className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                )}
                Show Potential Typos
                <span className="text-xs ml-2 text-gray-500">({modifierKeyDisplay}+T)</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-full-translations"
                checked={showFullTranslations}
                onCheckedChange={setShowFullTranslations}
              />
              <label htmlFor="show-full-translations" className="text-sm flex items-center cursor-pointer">
                {showFullTranslations ? (
                  <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                )}
                Show Full Translations
                <span className="text-xs ml-2 text-gray-500">({modifierKeyDisplay}+F)</span>
              </label>
            </div>
          </div>
        </div>
        
        {missingTranslations.length === 0 && ignoredFields.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-green-600 dark:text-green-400 font-medium">
              Great! All translation keys are present.
            </p>
            <p className="text-muted-foreground mt-2">
              There are no missing translation keys in your en-US.json file.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="summary">
            <TabsList className="mb-4 flex flex-wrap gap-1 overflow-auto pb-1 px-0.5 -mx-1">
              <TabsTrigger value="summary" className="text-xs sm:text-sm">
                Summary
              </TabsTrigger>
              <TabsTrigger value="missing" className="text-xs sm:text-sm">
                Missing Translations
              </TabsTrigger>
              <TabsTrigger value="needKeys" className="text-xs sm:text-sm">
                Need Keys in Config
              </TabsTrigger>
              {ignoredFields.length > 0 && (
                <TabsTrigger value="ignoredFields" className="flex items-center text-xs sm:text-sm">
                  <FileJson className="h-3 w-3 mr-1 text-blue-500" />
                  Ignored Fields
                </TabsTrigger>
              )}
              {potentialTypos.length > 0 && showPotentialTypos && (
                <TabsTrigger value="typos" className="flex items-center text-xs sm:text-sm">
                  <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                  Potential Typos
                </TabsTrigger>
              )}
              {showFullTranslations && (
                <TabsTrigger value="full" className="text-xs sm:text-sm">
                  Full Updated Translations
                </TabsTrigger>
              )}
              <TabsTrigger value="config" className="text-xs sm:text-sm">
                Updated Configuration JSON
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <TranslationSummary 
                actuallyMissing={actuallyMissing}
                needKeyOnly={needKeyOnly}
                ignoredFields={ignoredFields}
                potentialTypos={potentialTypos}
              />
            </TabsContent>

            <TabsContent value="missing">
              <MissingTranslationsPanel
                actuallyMissing={actuallyMissing}
                missingTranslationsJson={missingTranslationsJson}
                handleCopy={handleCopy}
                isProcessing={isProcessing}
              />
            </TabsContent>

            <TabsContent value="needKeys">
              <NeedKeysPanel needKeyOnly={needKeyOnly} />
            </TabsContent>

            {ignoredFields.length > 0 && (
              <TabsContent value="ignoredFields">
                <IgnoredFieldsPanel ignoredFields={ignoredFields} />
              </TabsContent>
            )}

            {potentialTypos.length > 0 && showPotentialTypos && (
              <TabsContent value="typos">
                <PotentialTyposPanel potentialTypos={potentialTypos} />
              </TabsContent>
            )}

            {showFullTranslations && (
              <TabsContent value="full">
                <FullTranslationsPanel
                  fullTranslationsJson={fullTranslationsJson}
                  handleCopy={handleCopy}
                  isProcessing={isProcessing}
                />
              </TabsContent>
            )}

            <TabsContent value="config">
              <UpdatedConfigPanel
                updatedConfigJsonString={updatedConfigJsonString}
                handleCopy={handleCopy}
                isProcessing={isProcessing}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <KeyboardShortcutsInfo 
        modifierKeyDisplay={modifierKeyDisplay} 
        missingTranslationsExist={missingTranslations.length > 0} 
      />
    </Card>
  );
};

export default TranslationResults;

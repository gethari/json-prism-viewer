import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { safeStringify, stringifyWithUnicodeQuotes } from '@/utils/jsonUtils';
import { findPotentialTypos } from '@/utils/translationUtils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Copy, FileJson, Loader, RefreshCw } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import EscapedJsonView from '@/components/EscapedJsonView';

interface TranslationResultsProps {
  missingTranslations: { key: string; value: string; existsInTranslations: boolean }[];
  ignoredFields?: string[]; // New prop for ignored fields
  translationData: Record<string, string>;
  updatedConfigJson?: any;
  onRevalidate?: () => void;
  isProcessing?: boolean;
}

const TranslationResults: React.FC<TranslationResultsProps> = ({
  missingTranslations,
  ignoredFields = [], // Default to empty array
  translationData,
  updatedConfigJson,
  onRevalidate,
  isProcessing = false,
}) => {
  const { toast } = useToast();

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
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              {potentialTypos.length > 0 && (
                <TabsTrigger value="typos" className="flex items-center text-xs sm:text-sm">
                  <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                  Potential Typos
                </TabsTrigger>
              )}
              <TabsTrigger value="full" className="text-xs sm:text-sm">
                Full Updated Translations
              </TabsTrigger>
              <TabsTrigger value="config" className="text-xs sm:text-sm">
                Updated Configuration JSON
              </TabsTrigger>
              <TabsTrigger value="formats" className="text-xs sm:text-sm">
                Export Formats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Translation Status Summary</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      Total items to process:{' '}
                      <span className="font-semibold">{missingTranslations.length}</span>
                    </li>
                    <li>
                      Missing translations:{' '}
                      <span className="font-semibold text-red-500">{actuallyMissing.length}</span>
                      {actuallyMissing.length > 0 && (
                        <span className="ml-2 text-gray-500">
                          (need to be added to translation file)
                        </span>
                      )}
                    </li>
                    <li>
                      Existing translations without keys:{' '}
                      <span className="font-semibold text-amber-500">{needKeyOnly.length}</span>
                      {needKeyOnly.length > 0 && (
                        <span className="ml-2 text-gray-500">(need to add keys to config)</span>
                      )}
                    </li>
                    {ignoredFields.length > 0 && (
                      <li>
                        Fields ignored (with fieldName property):{' '}
                        <span className="font-semibold text-blue-500">
                          {ignoredFields.length}
                        </span>
                        <span className="ml-2 text-gray-500">
                          (these fields are skipped for translation)
                        </span>
                      </li>
                    )}
                    {potentialTypos.length > 0 && (
                      <li>
                        Potential typos or inconsistencies:{' '}
                        <span className="font-semibold text-amber-500">
                          {potentialTypos.length}
                        </span>
                        <span className="ml-2 text-gray-500">
                          (similar but not identical strings)
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="missing">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <h3 className="text-sm font-medium">
                      Missing Translations ({actuallyMissing.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(missingTranslationsJson, 'missing translations')}
                      disabled={isProcessing || actuallyMissing.length === 0}
                      className="whitespace-nowrap"
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy JSON
                    </Button>
                  </div>
                  {actuallyMissing.length === 0 ? (
                    <p className="text-sm text-green-600">No missing translations.</p>
                  ) : (
                    <pre className="text-xs overflow-auto max-h-96 p-2 rounded bg-gray-100 dark:bg-gray-800">
                      {missingTranslationsJson}
                    </pre>
                  )}
                </div>

                {actuallyMissing.length > 0 && (
                  <div className="border rounded-md p-4 space-y-2">
                    <h3 className="text-sm font-medium">Missing Keys List</h3>
                    <ul className="space-y-1">
                      {actuallyMissing.map(({ key, value }) => (
                        <li
                          key={`actual-missing-${key}`}
                          className="text-xs border-b pb-1 last:border-b-0 last:pb-0 flex justify-between"
                        >
                          <span className="font-mono">{key}</span>
                          <span className="text-muted-foreground">"{value}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="needKeys">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">
                      Translations That Need Keys in Config ({needKeyOnly.length})
                    </h3>
                  </div>
                  {needKeyOnly.length === 0 ? (
                    <p className="text-sm text-green-600">
                      All labels have translation keys in the config.
                    </p>
                  ) : (
                    <div className="overflow-auto max-h-96 text-sm">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Label
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Translation Key
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {needKeyOnly.map(item => (
                            <tr key={`needkey-${item.key}`}>
                              <td className="px-4 py-2 whitespace-nowrap text-xs">{item.value}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-xs font-mono">
                                {item.key}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {ignoredFields.length > 0 && (
              <TabsContent value="ignoredFields">
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <FileJson className="h-4 w-4 mr-2 text-blue-500" />
                        Fields Ignored for Translation ({ignoredFields.length})
                      </h3>
                    </div>
                    <p className="text-sm mb-3 text-gray-500">
                      These fields contain a <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">fieldName</code> property and were skipped for translation processing as requested.
                    </p>
                    <div className="overflow-auto max-h-96 text-sm">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Field Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {ignoredFields.map(fieldName => (
                            <tr key={`ignored-${fieldName}`}>
                              <td className="px-4 py-2 whitespace-nowrap text-xs font-mono">
                                {fieldName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {potentialTypos.length > 0 && (
              <TabsContent value="typos">
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        Potential Typos or Inconsistencies ({potentialTypos.length})
                      </h3>
                    </div>
                    <p className="text-sm mb-3 text-gray-500">
                      These are labels and translations with high similarity but slight differences.
                      They might indicate typos or intentional variations.
                    </p>
                    <div className="overflow-auto max-h-96 text-sm">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Label in Config
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Similar Translation
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Match %
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                          {potentialTypos.map(typo => (
                            <tr
                              key={`typo-${typo.configLabel}-${typo.translationText}`}
                              className={
                                typo.similarity > 95 ? 'bg-amber-50 dark:bg-amber-900/20' : ''
                              }
                            >
                              <td className="px-4 py-2 whitespace-nowrap text-xs">
                                {typo.configLabel}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-xs">
                                {typo.translationText}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-xs font-mono">
                                {typo.similarity}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            <TabsContent value="full">
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <h3 className="text-sm font-medium">Full Updated Translation File</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(fullTranslationsJson, 'full translation file')}
                    disabled={isProcessing}
                    className="whitespace-nowrap"
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy JSON
                  </Button>
                </div>
                <pre className="overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs h-[500px] max-w-full break-words whitespace-pre-wrap">
                  {fullTranslationsJson}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="config">
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <h3 className="text-sm font-medium">
                    Updated Configuration JSON (with translation keys)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(updatedConfigJsonString, 'updated configuration')}
                    disabled={isProcessing}
                    className="whitespace-nowrap"
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy JSON
                  </Button>
                </div>
                <pre className="overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs h-[400px]">
                  {updatedConfigJsonString}
                </pre>
                
                {/* Add JSON Output formats for config JSON */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Export Format Options</h4>
                  <EscapedJsonView 
                    originalJson=""
                    modifiedJson={updatedConfigJsonString}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="formats">
              <div className="space-y-4">
                <div className="border rounded-md p-4 mb-4">
                  <h3 className="text-sm font-medium mb-4">JSON Output Formats</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the output format you need. The compact format removes all whitespace while the escaped format prepares the JSON for inclusion in string literals.
                  </p>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-xs font-medium mb-2">Full Translation Output</h4>
                    <EscapedJsonView originalJson={""} modifiedJson={fullTranslationsJson} />
                  </div>
                  
                  {missingTranslationsJson && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-xs font-medium mb-2">Missing Translations Output</h4>
                      <EscapedJsonView originalJson={""} modifiedJson={missingTranslationsJson} />
                    </div>
                  )}
                  
                  {updatedConfigJsonString && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-xs font-medium mb-2">Updated Config Output</h4>
                      <EscapedJsonView originalJson={""} modifiedJson={updatedConfigJsonString} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      {missingTranslations.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-3 text-sm text-blue-700 dark:text-blue-300">
            <p>
              <strong>Revalidate Button:</strong> Clicking "Apply Updates & Revalidate" will:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Update your configuration input with all missing translation keys</li>
              <li>Add the missing translations to your translation file</li>
              <li>Auto-scroll to the top of the page</li>
              <li>Re-process the data to verify all keys are now present</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TranslationResults;

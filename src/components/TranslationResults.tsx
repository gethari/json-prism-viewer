
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { safeStringify } from '@/utils/jsonUtils';
import { Button } from '@/components/ui/button';
import { Check, Copy, FileJson } from 'lucide-react';

interface TranslationResultsProps {
  missingTranslations: { key: string; value: string }[];
  translationData: Record<string, string>;
}

const TranslationResults: React.FC<TranslationResultsProps> = ({ missingTranslations, translationData }) => {
  const { toast } = useToast();
  
  // Generate the full updated translation object
  const updatedTranslations = { ...translationData };
  missingTranslations.forEach(({ key, value }) => {
    updatedTranslations[key] = value;
  });
  
  // Generate JSON strings for both formats
  const missingTranslationsJson = safeStringify(
    missingTranslations.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>),
    2
  );
  
  const fullTranslationsJson = safeStringify(updatedTranslations, 2);
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `The ${type} has been copied to your clipboard`,
      });
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileJson className="mr-2 h-5 w-5" />
          Translation Results
          {missingTranslations.length > 0 && (
            <span className="ml-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium py-1 px-2 rounded-full">
              {missingTranslations.length} missing keys
            </span>
          )}
          {missingTranslations.length === 0 && (
            <span className="ml-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <Check className="h-3 w-3 mr-1" /> All keys present
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {missingTranslations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-green-600 dark:text-green-400 font-medium">Great! All translation keys are present.</p>
            <p className="text-muted-foreground mt-2">There are no missing translation keys in your en-US.json file.</p>
          </div>
        ) : (
          <Tabs defaultValue="missing">
            <TabsList className="mb-4">
              <TabsTrigger value="missing">Missing Keys Only</TabsTrigger>
              <TabsTrigger value="full">Full Updated Translations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="missing">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Missing Keys to Add ({missingTranslations.length})</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(missingTranslationsJson, "missing keys")}
                    >
                      <Copy className="h-4 w-4 mr-1" /> Copy JSON
                    </Button>
                  </div>
                  <pre className="overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs h-[400px]">
                    {missingTranslationsJson}
                  </pre>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <h3 className="text-sm font-medium">Missing Keys List</h3>
                  <ul className="space-y-1">
                    {missingTranslations.map(({ key, value }, index) => (
                      <li key={index} className="text-xs border-b pb-1 last:border-b-0 last:pb-0 flex justify-between">
                        <span className="font-mono">{key}</span>
                        <span className="text-muted-foreground">"{value}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="full">
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Full Updated Translation File</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(fullTranslationsJson, "full translation file")}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy JSON
                  </Button>
                </div>
                <pre className="overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs h-[400px]">
                  {fullTranslationsJson}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslationResults;

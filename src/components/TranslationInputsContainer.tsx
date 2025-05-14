
import React from 'react';
import JsonInput from '@/components/JsonInput';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseJson } from '@/utils/jsonUtils';

interface TranslationInputsContainerProps {
  configJson: string;
  translationJson: string;
  setConfigJson: (json: string) => void;
  setTranslationJson: (json: string) => void;
  isProcessing?: boolean;
}

const TranslationInputsContainer: React.FC<TranslationInputsContainerProps> = ({
  configJson,
  translationJson,
  setConfigJson,
  setTranslationJson,
  isProcessing = false,
}) => {
  const handleConfigJsonPaste = (json: string) => {
    // Automatically escape the config JSON if needed
    try {
      const parsed = typeof json === 'string' ? parseJson(json) : json;
      if (parsed) {
        setConfigJson(JSON.stringify(parsed, null, 2));
      } else {
        setConfigJson(json);
      }
    } catch (e) {
      setConfigJson(json);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-md">
        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <p className="text-sm">
            This tool finds missing translation keys in your localization files. Paste your configuration JSON and translation JSON to get started.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <JsonInput 
            title="Configuration JSON" 
            value={configJson} 
            onChange={handleConfigJsonPaste}
            placeholder="Paste your configuration JSON here..."
            disabled={isProcessing}
          />
        </div>
        <div className="space-y-2">
          <JsonInput 
            title="Translation JSON (en-US.json)" 
            value={translationJson} 
            onChange={setTranslationJson}
            placeholder="Paste your translation JSON here..."
            disabled={isProcessing}
          />
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          size="lg" 
          disabled={!configJson || !translationJson || isProcessing}
          onClick={() => {
            // This functionality is handled automatically by the useEffect in parent component
          }}
        >
          {isProcessing ? 'Processing...' : 'Check Translation Keys'}
        </Button>
      </div>
    </>
  );
};

export default TranslationInputsContainer;

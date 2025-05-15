
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

  // Function to manually trigger the "Check Translation Keys" button onClick
  const handleButtonClick = () => {
    // The parent component will handle processing through useEffect
    // This is just for visual feedback that the button was clicked
    if (!configJson || !translationJson || isProcessing) return;

    // Find the results section and add a temporary highlight effect
    const resultsElement = document.getElementById('translation-results');
    if (resultsElement) {
      // Clear existing classes first
      resultsElement.classList.remove('animate-pulse');

      // Force a reflow so the animation can be reapplied
      void resultsElement.offsetWidth;

      // Add the pulse animation class
      resultsElement.classList.add('animate-pulse');

      // Remove after animation completes
      setTimeout(() => {
        resultsElement.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-md">
        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <p className="text-sm">
            This tool finds missing translation keys in your localization files. Paste your
            configuration JSON and translation JSON to get started.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 h-full">
          <JsonInput
            title="Configuration JSON"
            value={configJson}
            onChange={handleConfigJsonPaste}
            placeholder="Paste your configuration JSON here..."
            disabled={isProcessing}
            className="h-full"
          />
        </div>
        <div className="space-y-2 h-full">
          <JsonInput
            title="Translation JSON (en-US.json)"
            value={translationJson}
            onChange={setTranslationJson}
            placeholder="Paste your translation JSON here..."
            disabled={isProcessing}
            className="h-full"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          size="lg"
          disabled={!configJson || !translationJson || isProcessing}
          onClick={() => {
            // Call our handler to add visual effects
            handleButtonClick();
            // The main functionality is handled automatically by the useEffect in parent component
            // The scrollIntoView will be handled after processing
          }}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Check Translation Keys'
          )}
        </Button>
      </div>
    </>
  );
};

export default TranslationInputsContainer;

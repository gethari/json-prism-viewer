
import React from 'react';
import JsonInput from '@/components/JsonInput';
import { Info } from 'lucide-react';
import JsonCompareToolbar from '@/components/JsonCompareToolbar';

interface JsonInputsContainerProps {
  originalJson: string;
  modifiedJson: string;
  setOriginalJson: (json: string) => void;
  setModifiedJson: (json: string) => void;
  setShowDiff: (show: boolean) => void;
}

const JsonInputsContainer: React.FC<JsonInputsContainerProps> = ({
  originalJson,
  modifiedJson,
  setOriginalJson,
  setModifiedJson,
  setShowDiff,
}) => {
  return (
    <>
      <div className="flex items-center mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-md">
        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm">
          JSON content is automatically processed for easy comparison. You can paste either escaped or unescaped JSON, and the tool will handle it for you.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <JsonInput 
            title="Original JSON (Before)" 
            value={originalJson} 
            onChange={setOriginalJson}
            placeholder="Paste your original JSON here..."
          />
        </div>
        <div className="space-y-2">
          <JsonInput 
            title="Modified JSON (After)" 
            value={modifiedJson} 
            onChange={setModifiedJson}
            placeholder="Paste your modified JSON here..."
          />
        </div>
      </div>
      
      <JsonCompareToolbar
        originalJson={originalJson}
        modifiedJson={modifiedJson}
        setOriginalJson={setOriginalJson}
        setModifiedJson={setModifiedJson}
        setShowDiff={setShowDiff}
      />
    </>
  );
};

export default JsonInputsContainer;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import EscapedJsonView from '@/components/EscapedJsonView';

interface FullTranslationsPanelProps {
  fullTranslationsJson: string;
  handleCopy: (text: string, type: string) => void;
  isProcessing: boolean;
}

const FullTranslationsPanel: React.FC<FullTranslationsPanelProps> = ({
  fullTranslationsJson,
  handleCopy,
  isProcessing,
}) => {
  return (
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
      
      {/* JSON Output formats */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">JSON Output Formats</h4>
        <EscapedJsonView 
          originalJson=""
          modifiedJson={fullTranslationsJson}
        />
      </div>
    </div>
  );
};

export default FullTranslationsPanel;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import EscapedJsonView from '@/components/EscapedJsonView';

interface MissingTranslationsPanelProps {
  actuallyMissing: Array<{ key: string; value: string; existsInTranslations: boolean }>;
  missingTranslationsJson: string;
  handleCopy: (text: string, type: string) => void;
  isProcessing: boolean;
}

const MissingTranslationsPanel: React.FC<MissingTranslationsPanelProps> = ({
  actuallyMissing,
  missingTranslationsJson,
  handleCopy,
  isProcessing,
}) => {
  return (
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

      {actuallyMissing.length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">JSON Output Formats</h4>
          <EscapedJsonView 
            originalJson=""
            modifiedJson={missingTranslationsJson}
          />
        </div>
      )}
    </div>
  );
};

export default MissingTranslationsPanel;

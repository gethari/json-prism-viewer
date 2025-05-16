
import React from 'react';

interface TranslationSummaryProps {
  actuallyMissing: Array<{ key: string; value: string; existsInTranslations: boolean }>;
  needKeyOnly: Array<{ key: string; value: string; existsInTranslations: boolean }>;
  ignoredFields: string[];
  potentialTypos: Array<{ configLabel: string; translationText: string; similarity: number }>;
}

const TranslationSummary: React.FC<TranslationSummaryProps> = ({
  actuallyMissing,
  needKeyOnly,
  ignoredFields,
  potentialTypos,
}) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Translation Status Summary</h3>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            Total items to process:{' '}
            <span className="font-semibold">{actuallyMissing.length + needKeyOnly.length}</span>
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
  );
};

export default TranslationSummary;

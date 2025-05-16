
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PotentialTyposPanelProps {
  potentialTypos: Array<{ configLabel: string; translationText: string; similarity: number }>;
}

const PotentialTyposPanel: React.FC<PotentialTyposPanelProps> = ({ potentialTypos }) => {
  if (potentialTypos.length === 0) return null;
  
  return (
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
  );
};

export default PotentialTyposPanel;

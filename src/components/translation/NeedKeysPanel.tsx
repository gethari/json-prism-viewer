
import React from 'react';

interface NeedKeysPanelProps {
  needKeyOnly: Array<{ key: string; value: string; existsInTranslations: boolean }>;
}

const NeedKeysPanel: React.FC<NeedKeysPanelProps> = ({ needKeyOnly }) => {
  return (
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
  );
};

export default NeedKeysPanel;

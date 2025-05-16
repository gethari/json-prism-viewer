
import React from 'react';
import { FileJson } from 'lucide-react';

interface IgnoredFieldsPanelProps {
  ignoredFields: string[];
}

const IgnoredFieldsPanel: React.FC<IgnoredFieldsPanelProps> = ({ ignoredFields }) => {
  if (ignoredFields.length === 0) return null;
  
  return (
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
  );
};

export default IgnoredFieldsPanel;

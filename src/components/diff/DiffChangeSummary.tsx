
import React from 'react';
import { Plus, Minus, Edit } from 'lucide-react';

interface DiffChangesType {
  added: string[];
  removed: string[];
  changed: string[];
  valueMap: Record<string, { original: any; modified: any }>;
}

interface DiffChangeSummaryProps {
  changes: DiffChangesType;
}

const DiffChangeSummary: React.FC<DiffChangeSummaryProps> = ({ changes }) => {
  return (
    <div className="space-y-4 px-4">
      <div>
        <h3 className="text-lg font-medium">Changes Summary:</h3>
        
        {changes.added.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
            <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Added Properties ({changes.added.length}):
            </h4>
            <ul className="list-disc pl-5 mt-1">
              {changes.added.map((prop) => (
                <li key={prop} className="text-sm">
                  <span className="font-mono">{prop}</span>
                  {changes.valueMap[prop] && (
                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                      Value: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                        {JSON.stringify(changes.valueMap[prop].modified)}
                      </code>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {changes.removed.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
            <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center">
              <Minus className="h-4 w-4 mr-1" />
              Removed Properties ({changes.removed.length}):
            </h4>
            <ul className="list-disc pl-5 mt-1">
              {changes.removed.map((prop) => (
                <li key={prop} className="text-sm">
                  <span className="font-mono">{prop}</span>
                  {changes.valueMap[prop] && (
                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                      Was: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                        {JSON.stringify(changes.valueMap[prop].original)}
                      </code>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {changes.changed.length > 0 && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
            <h4 className="font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
              <Edit className="h-4 w-4 mr-1" />
              Modified Properties ({changes.changed.length}):
            </h4>
            <ul className="list-disc pl-5 mt-1">
              {changes.changed.map((prop) => (
                <li key={prop} className="text-sm">
                  <span className="font-mono">{prop}</span>
                  {changes.valueMap[prop] && (
                    <div className="text-xs ml-2 mt-1 text-gray-500 dark:text-gray-400">
                      <div>
                        From: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {JSON.stringify(changes.valueMap[prop].original)}
                        </code>
                      </div>
                      <div className="mt-0.5">
                        To: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                          {JSON.stringify(changes.valueMap[prop].modified)}
                        </code>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {changes.added.length === 0 && changes.removed.length === 0 && changes.changed.length === 0 && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400">
            No differences found or insufficient data provided.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiffChangeSummary;

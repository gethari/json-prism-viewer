
import React from 'react';

const DiffLegend: React.FC = () => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Legend:</h3>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-green-100 dark:bg-green-900/30 mr-2"></span>
          <span className="text-green-600 dark:text-green-400 text-sm">Added</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-red-100 dark:bg-red-900/30 mr-2"></span>
          <span className="text-red-600 dark:text-red-400 text-sm">Removed</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 mr-2"></span>
          <span className="text-yellow-600 dark:text-yellow-400 text-sm">Modified</span>
        </div>
      </div>
    </div>
  );
};

export default DiffLegend;

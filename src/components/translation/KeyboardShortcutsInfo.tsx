
import React from 'react';

interface KeyboardShortcutsInfoProps {
  modifierKeyDisplay: string;
  missingTranslationsExist: boolean;
}

const KeyboardShortcutsInfo: React.FC<KeyboardShortcutsInfoProps> = ({
  modifierKeyDisplay,
  missingTranslationsExist
}) => {
  if (!missingTranslationsExist) return null;
  
  return (
    <div className="px-6 pb-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-3 text-sm text-blue-700 dark:text-blue-300">
        <p>
          <strong>Keyboard Shortcuts:</strong>
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Alt+R</kbd> - Apply Updates & Revalidate</li>
          <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Alt+T</kbd> - Toggle Potential Typos Display</li>
          <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Alt+F</kbd> - Toggle Full Translations Display</li>
          <li><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs">Alt+E</kbd> - Toggle Editor Read/Edit Mode</li>
        </ul>
        <p className="mt-2">
          <strong>Revalidate Button:</strong> Clicking "Apply Updates & Revalidate" will:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Update your configuration input with all missing translation keys</li>
          <li>Add the missing translations to your translation file</li>
          <li>Auto-scroll to the top of the page</li>
          <li>Re-process the data to verify all keys are now present</li>
        </ul>
      </div>
    </div>
  );
};

export default KeyboardShortcutsInfo;

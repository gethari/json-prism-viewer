
import React, { useState, useEffect } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Toggle } from '@/components/ui/toggle';
import { Keyboard, Lock, Unlock } from 'lucide-react';

interface MonacoDiffEditorProps {
  originalJson: string;
  modifiedJson: string;
  options: Record<string, any>;
  activeTab: string;
}

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({ originalJson, modifiedJson, options, activeTab }) => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  
  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
  };

  // Apply the readOnly option to the Monaco editor
  const editorOptions = {
    ...options,
    readOnly: isReadOnly,
  };

  // Detect OS for keyboard shortcuts display
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const altKey = isMac ? 'Option' : 'Alt';

  // Add keyboard shortcut handler for Alt+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+E to toggle edit mode
      if (e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        toggleReadOnly();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div 
        style={{ height: activeTab === 'split' ? '600px' : '500px', border: '1px solid var(--border)' }} 
        className="rounded-md overflow-hidden"
      >
        <DiffEditor
          height={activeTab === 'split' ? "600px" : "500px"}
          language="json"
          original={originalJson}
          modified={modifiedJson}
          options={editorOptions}
          theme="vs-dark"
        />
      </div>
      
      <div className="absolute top-2 right-3 flex items-center gap-2 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md z-10">
        <div className="flex items-center mr-2">
          <Keyboard className="h-3.5 w-3.5 mr-1 text-gray-400" />
          <span className="text-xs text-gray-300">{altKey}+E toggle edit</span>
        </div>
        <Toggle
          pressed={!isReadOnly}
          onPressedChange={toggleReadOnly}
          aria-label="Toggle edit mode"
          className="data-[state=on]:bg-green-600 data-[state=off]:bg-gray-500"
        >
          {isReadOnly ? (
            <Lock className="h-3.5 w-3.5 mr-1" />
          ) : (
            <Unlock className="h-3.5 w-3.5 mr-1" />
          )}
          <span className="text-xs">{isReadOnly ? 'Read' : 'Edit'}</span>
        </Toggle>
      </div>
    </div>
  );
};

export default MonacoDiffEditor;

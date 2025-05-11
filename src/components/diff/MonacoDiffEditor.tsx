
import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface MonacoDiffEditorProps {
  originalJson: string;
  modifiedJson: string;
  options: Record<string, any>;
  activeTab: string;
}

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({ originalJson, modifiedJson, options, activeTab }) => {
  return (
    <div 
      style={{ height: activeTab === 'split' ? '600px' : '500px', border: '1px solid var(--border)' }} 
      className="rounded-md overflow-hidden"
    >
      <DiffEditor
        height={activeTab === 'split' ? "600px" : "500px"}
        language="json"
        original={originalJson}
        modified={modifiedJson}
        options={options}
        theme="vs-dark"
      />
    </div>
  );
};

export default MonacoDiffEditor;

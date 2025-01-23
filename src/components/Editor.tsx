import React from 'react';
import Editor from '@monaco-editor/react';
import type { CodeFile } from '../types';

interface CodeEditorProps {
  file: CodeFile;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ file, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full bg-gray-900">
      <Editor
        height="100%"
        defaultLanguage={file.language}
        value={file.content}
        theme="vs-dark"
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
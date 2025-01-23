import React from 'react';
import { FileCode, Settings, Plus, Download, FolderDown } from 'lucide-react';
import type { CodeFile } from '../types';
import { downloadFile, downloadProject } from '../utils/files';

interface SidebarProps {
  files: CodeFile[];
  selectedFile: number;
  onFileSelect: (index: number) => void;
  onAddFile: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ files, selectedFile, onFileSelect, onAddFile, onOpenSettings }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold">Files</h2>
        <div className="flex gap-2">
          <button
            onClick={onAddFile}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Add new file"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => downloadProject(files)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Download all files"
          >
            <FolderDown size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.map((file, index) => (
          <div
            key={index}
            className={`group flex items-center justify-between hover:bg-gray-800 transition-colors ${
              selectedFile === index ? 'bg-gray-800' : ''
            }`}
          >
            <button
              className="flex-1 p-3 flex items-center gap-2 text-left"
              onClick={() => onFileSelect(index)}
            >
              <FileCode size={18} />
              <span className="text-sm">{file.name}</span>
            </button>
            <button
              onClick={() => downloadFile(file)}
              className="p-3 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Download file"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onOpenSettings}
          className="w-full p-2 flex items-center gap-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
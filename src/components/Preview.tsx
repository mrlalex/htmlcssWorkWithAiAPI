import React from 'react';
import { Maximize2 } from 'lucide-react';
import type { CodeFile } from '../types';

interface PreviewProps {
  files: CodeFile[];
}

export function Preview({ files }: PreviewProps) {
  const htmlFile = files.find(f => f.name === 'index.html')?.content || '';
  const cssFile = files.find(f => f.name === 'styles.css')?.content || '';
  const jsFile = files.find(f => f.name === 'script.js')?.content || '';

  const combinedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
      ${cssFile}
      /* Add default image styles */
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1rem 0;
      }
    </style>
</head>
<body>
    ${htmlFile}
    <script>
      ${jsFile}
      // Add image error handling
      document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
          this.style.display = 'none';
          console.error('Failed to load image:', this.src);
        };
      });
    </script>
</body>
</html>`;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Preview</h3>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Maximize2 size={16} />
        </button>
      </div>
      <div className="flex-1">
        <iframe
          srcDoc={combinedCode}
          title="preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
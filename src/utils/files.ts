import type { CodeFile } from '../types';

export function downloadFile(file: CodeFile) {
  const blob = new Blob([file.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadProject(files: CodeFile[]) {
  // For now, just download each file individually
  files.forEach(downloadFile);
}
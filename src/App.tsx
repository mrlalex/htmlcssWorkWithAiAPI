import React, { useState } from 'react';
import Split from 'react-split';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/Editor';
import { Preview } from './components/Preview';
import { AIPrompt } from './components/AIPrompt';
import { Settings } from './components/Settings';
import { Info, Github, Zap } from 'lucide-react';
import { getAIResponse } from './utils/ai';
import type { ProjectState, CodeFile, AIProvider } from './types';

const initialFiles: CodeFile[] = [
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MALXapp</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
    </style>
</head>
<body>
    <h1>Welcome to MALXapp</h1>
    <p>Start editing to see some magic happen!</p>
</body>
</html>`
  }
];

const initialProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    enabled: true,
    models: [
      { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
      { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', provider: 'openai' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' }
    ],
    selectedModel: 'gpt-3.5-turbo'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    apiKey: '',
    baseUrl: 'https://api.anthropic.com/v1',
    enabled: false,
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
      { id: 'claude-2.1', name: 'Claude 2.1', provider: 'anthropic' }
    ],
    selectedModel: 'claude-2.1'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    apiKey: '',
    baseUrl: 'https://generativelanguage.googleapis.com',
    enabled: false,
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini' },
      { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'gemini' }
    ],
    selectedModel: 'gemini-pro'
  }
];

function App() {
  const [state, setState] = useState<ProjectState>({
    files: initialFiles,
    selectedFile: 0,
    aiProviders: initialProviders,
    showSettings: false,
    prompt: '',
  });
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleFileChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    
    setState(prev => ({
      ...prev,
      files: prev.files.map((file, index) =>
        index === prev.selectedFile ? { ...file, content: newContent } : file
      ),
    }));
  };

  const handleFileSelect = (index: number) => {
    setState(prev => ({ ...prev, selectedFile: index }));
  };

  const handleAddFile = () => {
    const name = prompt('Enter file name:');
    if (!name) return;

    const extension = name.split('.').pop() || '';
    const language = extension === 'html' ? 'html' :
                    extension === 'css' ? 'css' :
                    extension === 'js' ? 'javascript' :
                    extension === 'ts' ? 'typescript' :
                    extension === 'json' ? 'json' :
                    extension === 'md' ? 'markdown' :
                    'plaintext';

    const newFile: CodeFile = {
      name,
      language,
      content: '',
    };
    setState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      selectedFile: prev.files.length,
    }));
  };

  const handleUpdateProvider = (provider: AIProvider) => {
    setState(prev => ({
      ...prev,
      aiProviders: prev.aiProviders.map(p => 
        p.id === provider.id ? provider : p
      ),
    }));
  };

  const handleAIPrompt = async (prompt: string) => {
    const enabledProviders = state.aiProviders.filter(p => p.enabled && p.apiKey);
    if (enabledProviders.length === 0) return;

    setLoading(true);
    try {
      const provider = enabledProviders[0];
      const response = await getAIResponse(provider, prompt);
      
      if (response.error) {
        alert(`Error: ${response.error}`);
        return;
      }

      handleFileChange(response.content);
    } catch (error) {
      alert('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0F1117]">
      {/* Header */}
      <header className="bg-[#1A1D27] border-b border-[#2A2E3C] text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MALXapp
            </h1>
          </div>
          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#2A2E3C] rounded-lg transition-colors"
          >
            <Info size={16} />
            About
          </button>
          <a
            href="https://github.com/mrlalex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:bg-[#2A2E3C] rounded-lg transition-colors"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Sidebar
          files={state.files}
          selectedFile={state.selectedFile}
          onFileSelect={handleFileSelect}
          onAddFile={handleAddFile}
          onOpenSettings={() => setState(prev => ({ ...prev, showSettings: true }))}
        />
        <div className="flex-1 flex flex-col">
          <Split
            className="flex-1 flex"
            sizes={[60, 40]}
            minSize={100}
            expandToMin={false}
            gutterSize={4}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
          >
            <CodeEditor
              file={state.files[state.selectedFile]}
              onChange={handleFileChange}
            />
            <Preview files={state.files} />
          </Split>
          <AIPrompt
            providers={state.aiProviders}
            onSubmit={handleAIPrompt}
            onGenerateAll={handleAIPrompt}
            onOpenSettings={() => setState(prev => ({ ...prev, showSettings: true }))}
            loading={loading}
          />
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1D27] text-gray-200 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto border border-[#2A2E3C]">
            <div className="p-4 border-b border-[#2A2E3C] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">About MALXapp</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="p-2 hover:bg-[#2A2E3C] rounded-full transition-colors text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                    <Zap size={20} />
                    Project Overview
                  </h3>
                  <p className="mt-2 text-gray-300">
                    MALXapp is an innovative web development environment that combines code editing with AI assistance.
                    Currently in its early stages, this project aims to revolutionize how developers write and test code.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400">✨ Key Features</h3>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Real-time code editing with syntax highlighting
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Live preview of your HTML, CSS, and JavaScript
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      AI-powered code assistance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Multiple file support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Split-view layout
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400">🛠️ Getting Started</h3>
                  <ol className="mt-2 space-y-2 text-gray-300 list-decimal list-inside">
                    <li>Configure your AI provider in Settings</li>
                    <li>Create or edit files using the sidebar</li>
                    <li>Write code in the editor</li>
                    <li>See live results in the preview panel</li>
                    <li>Use AI assistance for code generation and improvements</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400">🔮 Future Plans</h3>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Enhanced AI capabilities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Project templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Code sharing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      Collaborative editing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#2A2E3C] flex justify-end">
              <button
                onClick={() => setShowAbout(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {state.showSettings && (
        <Settings
          providers={state.aiProviders}
          onClose={() => setState(prev => ({ ...prev, showSettings: false }))}
          onUpdateProvider={handleUpdateProvider}
        />
      )}
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Send, Settings, Loader2, Wand2 } from 'lucide-react';
import type { AIProvider } from '../types';

interface AIPromptProps {
  providers: AIProvider[];
  onSubmit: (prompt: string) => void;
  onGenerateAll: (prompt: string) => void;
  onOpenSettings: () => void;
  loading?: boolean;
}

export function AIPrompt({ providers, onSubmit, onGenerateAll, onOpenSettings, loading }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleGenerateAll = () => {
    if (prompt.trim()) {
      onGenerateAll(prompt);
      setPrompt('');
    }
  };

  const enabledProviders = providers.filter(p => p.enabled && p.apiKey);
  const canSubmit = enabledProviders.length > 0 && prompt.trim() && !loading;
  const activeProvider = enabledProviders[0];

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="mb-3 flex items-center gap-2">
        <div className="text-sm text-gray-600">
          {activeProvider ? (
            <span className="flex items-center gap-2">
              Using <span className="font-medium">{activeProvider.name}</span>
              <span className="text-gray-400">|</span>
              <span className="font-medium">{activeProvider.models.find(m => m.id === activeProvider.selectedModel)?.name}</span>
            </span>
          ) : (
            <span className="text-orange-500">No AI provider configured</span>
          )}
        </div>
        <button
          onClick={onOpenSettings}
          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          Configure
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={enabledProviders.length === 0 ? "Configure AI providers in settings..." : "Ask AI to help you code..."}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={enabledProviders.length === 0 || loading}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          <span>Update Current</span>
        </button>
        <button
          type="button"
          onClick={handleGenerateAll}
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Wand2 size={20} />
          <span>Generate All</span>
        </button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { AIProvider } from '../types';

interface SettingsProps {
  providers: AIProvider[];
  onClose: () => void;
  onUpdateProvider: (provider: AIProvider) => void;
}

export function Settings({ providers, onClose, onUpdateProvider }: SettingsProps) {
  const [localProviders, setLocalProviders] = useState<AIProvider[]>(providers);
  const [activeProvider, setActiveProvider] = useState<string>(providers[0]?.id || 'openai');

  const handleSave = (provider: AIProvider) => {
    onUpdateProvider(provider);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold">AI Provider Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex">
          {/* Provider Tabs */}
          <div className="w-1/4 border-r">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setActiveProvider(provider.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  activeProvider === provider.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <span>{provider.name}</span>
                {localProviders.find(p => p.id === provider.id)?.enabled && (
                  <Check size={16} className="text-green-500" />
                )}
              </button>
            ))}
          </div>

          {/* Provider Settings */}
          <div className="w-3/4 p-6">
            {providers.map((provider) => {
              const savedProvider = localProviders.find(p => p.id === provider.id) || provider;
              return activeProvider === provider.id ? (
                <div key={provider.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{provider.name} Settings</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={savedProvider.enabled}
                        onChange={(e) => {
                          const updated = { ...savedProvider, enabled: e.target.checked };
                          setLocalProviders(prev => 
                            prev.map(p => p.id === provider.id ? updated : p)
                          );
                          handleSave(updated);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Key</label>
                      <input
                        type="password"
                        value={savedProvider.apiKey}
                        onChange={(e) => {
                          const updated = { ...savedProvider, apiKey: e.target.value };
                          setLocalProviders(prev => 
                            prev.map(p => p.id === provider.id ? updated : p)
                          );
                          handleSave(updated);
                        }}
                        placeholder={`Enter your ${provider.name} API key`}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Model</label>
                      <select
                        value={savedProvider.selectedModel}
                        onChange={(e) => {
                          const updated = { ...savedProvider, selectedModel: e.target.value };
                          setLocalProviders(prev => 
                            prev.map(p => p.id === provider.id ? updated : p)
                          );
                          handleSave(updated);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      >
                        {provider.models.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
                      <input
                        type="text"
                        value={savedProvider.baseUrl}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm p-2 border"
                      />
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
export interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
}

export interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  enabled: boolean;
  models: AIModel[];
  selectedModel: string;
}

export interface ProjectState {
  files: CodeFile[];
  selectedFile: number;
  aiProviders: AIProvider[];
  showSettings: boolean;
  prompt: string;
}
import type { AIProvider } from '../types';

export async function getAIResponse(provider: AIProvider, prompt: string): Promise<{ content?: string; error?: string }> {
  try {
    const systemPrompt = `You are a web development expert. You will be shown the current code and a request to modify it. 
    IMPORTANT:
    1. Always build upon the existing code - do not generate completely new code
    2. Preserve the current functionality while adding new features
    3. Keep the same style and approach as the existing code
    4. Only modify what's necessary to fulfill the request
    5. Include comments explaining your changes`;
    
    let response;
    
    switch (provider.id) {
      case 'openai':
        response = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.apiKey}`
          },
          body: JSON.stringify({
            model: provider.selectedModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Current code:\n\n${getCurrentCode()}\n\nRequest: ${prompt}` }
            ],
            temperature: 0.7
          })
        });
        break;

      case 'anthropic':
        response = await fetch(`${provider.baseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': provider.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: provider.selectedModel,
            max_tokens: 4000,
            messages: [
              { role: 'user', content: `${systemPrompt}\n\nCurrent code:\n\n${getCurrentCode()}\n\nRequest: ${prompt}` }
            ]
          })
        });
        break;

      case 'gemini':
        response = await fetch(`${provider.baseUrl}/v1beta/models/${provider.selectedModel}:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': provider.apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nCurrent code:\n\n${getCurrentCode()}\n\nRequest: ${prompt}`
              }]
            }]
          })
        });
        break;

      default:
        return { error: 'Unsupported AI provider' };
    }

    if (!response.ok) {
      const error = await response.text();
      return { error: `API error: ${error}` };
    }

    const data = await response.json();
    let content = '';

    // Extract content based on provider
    if (provider.id === 'openai') {
      content = data.choices[0].message.content;
    } else if (provider.id === 'anthropic') {
      content = data.content[0].text;
    } else if (provider.id === 'gemini') {
      content = data.candidates[0].content.parts[0].text;
    }

    // Clean up the response
    content = content
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .trim();

    return { content };
  } catch (error) {
    console.error('AI API error:', error);
    return { error: 'Failed to get AI response' };
  }
}

// Helper function to get current code from the editor
function getCurrentCode(): string {
  const editorElement = document.querySelector('iframe');
  if (!editorElement) return '';
  
  try {
    return editorElement.getAttribute('srcDoc') || '';
  } catch (error) {
    console.error('Error getting current code:', error);
    return '';
  }
}
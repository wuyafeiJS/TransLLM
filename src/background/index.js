// TransLLM Background Service Worker (Manifest V3)
// 100% Client-direct, Zero-telemetry, Pure Local/BYOK Architecture

const DEFAULT_CONFIG = {
  provider: 'deepseek',
  baseUrl: 'https://api.deepseek.com/v1',
  apiKey: '',
  model: 'deepseek-chat',
  targetLanguage: 'zh-CN',
  promptTemplate: 'You are a professional, accurate translator. Translate the given text into {{target_lang}}. Preserve all markdown formatting, code blocks, technical terms, and punctuation. Output ONLY the translated text without explanations or quotation marks.',
  enableSelection: true
};

// Initialize default configuration
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get('config');
  if (!data.config) {
    await chrome.storage.local.set({ config: DEFAULT_CONFIG });
  }
});

// Message router
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEST_CONNECTION') {
    testConnection(message.payload).then(sendResponse);
    return true; // Keep message channel open for async response
  }

  if (message.type === 'TRANSLATE_STREAM') {
    handleStreamTranslation(message.payload, sender.tab?.id);
    return false;
  }

  if (message.type === 'TRANSLATE_BATCH') {
    handleBatchTranslation(message.payload).then(sendResponse);
    return true;
  }
});

// Test connection to LLM API
async function testConnection({ baseUrl, apiKey, model, provider }) {
  try {
    const cleanUrl = baseUrl.replace(/\/+$/, '');
    const url = `${cleanUrl}/chat/completions`;

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model || (provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini'),
        messages: [{ role: 'user', content: 'Say "OK"' }],
        max_tokens: 5
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, message: `HTTP ${res.status}: ${errorText.slice(0, 150)}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Handle streaming translation for selection bubble
async function handleStreamTranslation({ text, targetLang }, tabId) {
  if (!tabId) return;

  const { config } = await chrome.storage.local.get('config');
  const activeConfig = config || DEFAULT_CONFIG;

  if (!activeConfig.apiKey && activeConfig.provider !== 'ollama') {
    chrome.tabs.sendMessage(tabId, {
      type: 'TRANSLATION_ERROR',
      error: 'Please enter your API Key in TransLLM extension popup.'
    });
    return;
  }

  const cleanUrl = activeConfig.baseUrl.replace(/\/+$/, '');
  const url = `${cleanUrl}/chat/completions`;
  const lang = targetLang || activeConfig.targetLanguage || 'zh-CN';
  const systemPrompt = activeConfig.promptTemplate.replace('{{target_lang}}', lang);

  const headers = { 'Content-Type': 'application/json' };
  if (activeConfig.apiKey) {
    headers['Authorization'] = `Bearer ${activeConfig.apiKey}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: activeConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const err = await response.text();
      chrome.tabs.sendMessage(tabId, {
        type: 'TRANSLATION_ERROR',
        error: `API ${response.status}: ${err.slice(0, 150)}`
      });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const chunk = json.choices?.[0]?.delta?.content || '';
            if (chunk) {
              chrome.tabs.sendMessage(tabId, {
                type: 'TRANSLATION_CHUNK',
                chunk
              });
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    chrome.tabs.sendMessage(tabId, { type: 'TRANSLATION_DONE' });
  } catch (error) {
    chrome.tabs.sendMessage(tabId, {
      type: 'TRANSLATION_ERROR',
      error: error.message
    });
  }
}

// Handle batch translation for full-page immersive translation
async function handleBatchTranslation({ paragraphs, targetLang }) {
  const { config } = await chrome.storage.local.get('config');
  const activeConfig = config || DEFAULT_CONFIG;

  const cleanUrl = activeConfig.baseUrl.replace(/\/+$/, '');
  const url = `${cleanUrl}/chat/completions`;
  const lang = targetLang || activeConfig.targetLanguage || 'zh-CN';

  const systemPrompt = `You are a professional website translator. Translate the JSON array of strings into ${lang}. Maintain identical order and array length. Return ONLY a valid JSON array of translated strings without any markdown or conversational wrapping.`;

  const headers = { 'Content-Type': 'application/json' };
  if (activeConfig.apiKey) {
    headers['Authorization'] = `Bearer ${activeConfig.apiKey}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: activeConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(paragraphs) }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content?.trim() || '[]';
    // Clean potential markdown blocks
    const cleanJson = content.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    const translations = JSON.parse(cleanJson);

    return { success: true, translations };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// TransLLM Popup Controller
const PRESETS = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat'
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini'
  },
  ollama: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3:latest'
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const { config } = await chrome.storage.local.get('config');

  if (config) {
    document.getElementById('preset').value = config.provider || 'deepseek';
    document.getElementById('baseUrl').value = config.baseUrl || 'https://api.deepseek.com/v1';
    document.getElementById('apiKey').value = config.apiKey || '';
    document.getElementById('model').value = config.model || 'deepseek-chat';
    document.getElementById('targetLanguage').value = config.targetLanguage || 'zh-CN';
  }

  // Handle preset switching
  document.getElementById('preset').addEventListener('change', (e) => {
    const val = e.target.value;
    if (PRESETS[val]) {
      document.getElementById('baseUrl').value = PRESETS[val].baseUrl;
      document.getElementById('model').value = PRESETS[val].model;
    }
  });

  // Save configuration and test connection
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    statusEl.className = 'status';
    statusEl.innerText = 'Testing connection...';

    const newConfig = {
      ...(config || {}),
      provider: document.getElementById('preset').value,
      baseUrl: document.getElementById('baseUrl').value.trim(),
      apiKey: document.getElementById('apiKey').value.trim(),
      model: document.getElementById('model').value.trim(),
      targetLanguage: document.getElementById('targetLanguage').value
    };

    await chrome.storage.local.set({ config: newConfig });

    chrome.runtime.sendMessage(
      { type: 'TEST_CONNECTION', payload: newConfig },
      (res) => {
        if (res && res.success) {
          statusEl.className = 'status success';
          statusEl.innerText = '✓ Connected & Saved Successfully!';
        } else {
          statusEl.className = 'status error';
          statusEl.innerText = `✗ Failed: ${res ? res.message : 'Unknown'}`;
        }
      }
    );
  });

  // Trigger full-page bilingual translation
  document.getElementById('pageTranslateBtn').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: 'TRANSLATE_PAGE_COMMAND' });
      statusEl.className = 'status success';
      statusEl.innerText = 'Translation started on current tab!';
    }
  });
});

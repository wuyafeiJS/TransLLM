// TransLLM Content Script (Shadow DOM Isolated)
// Handles selection translation bubble and full-page bilingual injection

let shadowRoot = null;
let bubbleContainer = null;
let isTranslating = false;

// 1. Initialize isolated Shadow DOM container to prevent host site CSS interference
function initShadowContainer() {
  if (shadowRoot) return;
  const host = document.createElement('div');
  host.id = 'transllm-host-root';
  document.documentElement.appendChild(host);
  shadowRoot = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    .transllm-btn {
      position: absolute;
      z-index: 2147483647;
      background: #0284c7;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      user-select: none;
      transition: all 0.15s ease-in-out;
    }
    .transllm-btn:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .transllm-bubble {
      position: absolute;
      z-index: 2147483647;
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px 14px;
      width: 360px;
      max-width: 90vw;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .transllm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 6px;
    }
    .transllm-close {
      cursor: pointer;
      color: #94a3b8;
      font-size: 14px;
    }
    .transllm-close:hover {
      color: #f1f5f9;
    }
    .transllm-body {
      white-space: pre-wrap;
      word-break: break-word;
      color: #e2e8f0;
      max-height: 280px;
      overflow-y: auto;
    }
  `;
  shadowRoot.appendChild(style);

  bubbleContainer = document.createElement('div');
  shadowRoot.appendChild(bubbleContainer);
}

// 2. Selection mouseup listener
document.addEventListener('mouseup', (e) => {
  if (e.target && e.target.id === 'transllm-host-root') return;

  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : '';

  if (!selectedText || selectedText.length < 2) {
    if (bubbleContainer && !isTranslating) bubbleContainer.innerHTML = '';
    return;
  }

  initShadowContainer();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  bubbleContainer.innerHTML = `
    <div class="transllm-btn" style="top: ${window.scrollY + rect.bottom + 6}px; left: ${window.scrollX + rect.right}px;">
      ✨ TransLLM
    </div>
  `;

  const btn = bubbleContainer.querySelector('.transllm-btn');
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    renderTranslationBubble(selectedText, rect);
  });
});

// 3. Render streaming bubble
function renderTranslationBubble(text, rect) {
  isTranslating = true;
  bubbleContainer.innerHTML = `
    <div class="transllm-bubble" style="top: ${window.scrollY + rect.bottom + 8}px; left: ${Math.max(12, window.scrollX + rect.left)}px;">
      <div class="transllm-header">
        <span>TransLLM (BYOK)</span>
        <span class="transllm-close" id="tl-close">✕</span>
      </div>
      <div class="transllm-body" id="tl-content">Translating with LLM...</div>
    </div>
  `;

  const contentEl = bubbleContainer.querySelector('#tl-content');
  bubbleContainer.querySelector('#tl-close').addEventListener('click', () => {
    bubbleContainer.innerHTML = '';
    isTranslating = false;
  });

  const messageHandler = (msg) => {
    if (msg.type === 'TRANSLATION_CHUNK') {
      if (contentEl.innerText === 'Translating with LLM...') contentEl.innerText = '';
      contentEl.innerText += msg.chunk;
    } else if (msg.type === 'TRANSLATION_DONE' || msg.type === 'TRANSLATION_ERROR') {
      if (msg.type === 'TRANSLATION_ERROR') {
        contentEl.innerText = `Error: ${msg.error}`;
      }
      isTranslating = false;
      chrome.runtime.onMessage.removeListener(messageHandler);
    }
  };

  // Register listener before sending message to prevent race conditions
  chrome.runtime.onMessage.addListener(messageHandler);

  // Request background to start streaming translation
  chrome.runtime.sendMessage({
    type: 'TRANSLATE_STREAM',
    payload: { text }
  });
}

// 4. Listen for full-page bilingual translation command from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TRANSLATE_PAGE_COMMAND') {
    translateWholePage();
  }
});

async function translateWholePage() {
  const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, article span')).filter(el => {
    const text = el.innerText.trim();
    return text.length > 25 && !el.dataset.transllmDone;
  });

  const batchSize = 6;
  for (let i = 0; i < elements.length; i += batchSize) {
    const chunkEls = elements.slice(i, i + batchSize);
    const paragraphs = chunkEls.map(el => el.innerText.trim());

    chrome.runtime.sendMessage({
      type: 'TRANSLATE_BATCH',
      payload: { paragraphs }
    }, (res) => {
      if (res && res.success && Array.isArray(res.translations)) {
        res.translations.forEach((transText, idx) => {
          const targetEl = chunkEls[idx];
          if (!targetEl) return;
          targetEl.dataset.transllmDone = 'true';

          const transDiv = document.createElement('div');
          transDiv.style.cssText = 'color: #0284c7; font-size: 0.95em; margin-top: 4px; margin-bottom: 8px; line-height: 1.5; font-style: normal;';
          transDiv.innerText = transText;
          targetEl.insertAdjacentElement('afterend', transDiv);
        });
      }
    });
  }
}

# 🌐 TransLLM

> **100% Client-Direct, Zero-Tracking, Bring-Your-Own-Key (BYOK) AI Web Translator.**  
> Powered by DeepSeek, OpenAI, Local Ollama, and any OpenAI-compatible LLM.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-green.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

---

### 🔥 Why TransLLM?

Most commercial AI translation extensions have moved to closed-source models with recurring subscriptions, while routing all your browsing activity and sensitive web pages through their centralized proxy servers.

**TransLLM changes this completely:**
- **🛡️ 100% Privacy & Zero-Telemetry:** No backend servers, no tracking, and no telemetry. All API requests go directly from your browser to your specified LLM provider or local offline Ollama node.
- **🔑 Bring Your Own Key (BYOK):** Use your own DeepSeek (dirt cheap!), OpenAI, Groq, or self-hosted models. Pay only fractions of a cent per million tokens.
- **⚡ Dual Mode Translation:**
  - **Selection Bubble:** Select any text to display an isolated floating bubble with streaming response.
  - **Full-Page Bilingual Injection:** Automatically insert translated sentences directly beneath original paragraphs without breaking the layout.
- **🪶 Ultra Lightweight:** Pure modern JavaScript, under 200KB, zero external runtime bloat.

---

### 📊 Feature & Privacy Comparison

| Feature | TransLLM (Open Source) | Commercial Extensions |
| :--- | :---: | :---: |
| **Open Source** | ✅ 100% MIT | ❌ Closed Source |
| **Data Privacy** | 🛡️ Direct Browser-to-API | ⚠️ Routed through proprietary servers |
| **Cost** | 🆓 Free (Pay only for tokens) | 💰 $10~$30 / Month |
| **Offline / Local Models** | ✅ Ollama / LM Studio supported | ❌ Not Supported |
| **Custom Models** | ✅ Any OpenAI-compatible endpoint | ❌ Restricted |

---

### 🚀 Quick Start (Installation)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/TransLLM.git
   ```
2. Open Chrome or Edge and navigate to `chrome://extensions/` or `edge://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the `TransLLM` folder.
5. Click the TransLLM icon in the browser toolbar, input your **DeepSeek API Key** or **Ollama Base URL**, and click **Save & Test Connection**.

---

### 🛠️ Architecture

- **Manifest V3**: Built on the latest browser extension standards.
- **Shadow DOM Isolation**: The floating translation bubble uses an open Shadow DOM to completely isolate its CSS from the host page.
- **Streaming Response**: Real-time server-sent events (SSE) decoding in the background service worker for instantaneous translation display.
- **Local Storage**: API keys and endpoint settings are stored exclusively inside `chrome.storage.local`.

---

### 📄 License

This project is licensed under the [MIT License](LICENSE).

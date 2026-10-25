<div align="center">

# 🌐 TransLLM

**100% Client-Direct, Zero-Tracking, Bring-Your-Own-Key (BYOK) AI Web Translator.**  
*Powered by DeepSeek, OpenAI, Local Ollama, and any OpenAI-compatible LLM.*

<p align="center">
  <a href="README.md"><b>English</b></a> |
  <a href="README_zh.md"><b>简体中文</b></a>
</p>

[![English](https://img.shields.io/badge/Language-English-blue.svg)](README.md)
[![简体中文](https://img.shields.io/badge/语言-简体中文-red.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-green.svg)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wuyafeiJS/TransLLM/pulls)

</div>

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
   git clone https://github.com/wuyafeiJS/TransLLM.git
   ```
2. Open Chrome or Edge and navigate to `chrome://extensions/` or `edge://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click **"Load unpacked"** and select the `TransLLM` directory.
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

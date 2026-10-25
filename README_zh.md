<div align="center">

# 🌐 TransLLM

**100% 客户端直连、零数据收集、自带 Key (BYOK) 的浏览器 AI 沉浸式网页翻译扩展。**  
*由 DeepSeek、OpenAI、本地 Ollama 以及任何兼容 OpenAI 协议的大模型驱动。*

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

### 🔥 为什么选择 TransLLM？

目前市面上的主流 AI 翻译扩展大多转向了**闭源 + 高昂按月订阅制**，同时还会把你浏览的网页数据、敏感内容全部经过他们的中心化代理服务器进行中转，存在巨大的隐私与安全隐患。

**TransLLM 彻底改变了这一切：**
- **🛡️ 100% 隐私安全 & 零跟踪：** 没有自建后端服务器，没有任何埋点与数据收集。所有翻译 API 请求均由浏览器直接向您配置的模型服务商或本地离线 Ollama 发送。
- **🔑 自带 Key（BYOK - Bring Your Own Key）：** 使用你自己的 DeepSeek（极其实惠！）、OpenAI、Groq 或本地模型。每一百万 Token 仅需几分钱到几毛钱，彻底告别每月几十美金的订阅费。
- **⚡ 双模式极速翻译：**
  - **划词悬浮气泡：** 鼠标选中文本即可弹出悬浮卡片，支持打字机式流式实时输出。
  - **整页双语对照：** 智能分析段落，直接在原文下方无缝插入译文，不破坏原始网页排版。
- **🪶 极致轻量：** 纯原生现代 JavaScript 构建，整体体积不足 200KB，无多余第三方运行时膨胀。

---

### 📊 功能与隐私对比

| 功能特性 | TransLLM (本开源项目) | 商业化闭源翻译扩展 |
| :--- | :---: | :---: |
| **开源状态** | ✅ 100% MIT 宽松开源协议 | ❌ 闭源 |
| **数据隐私** | 🛡️ 浏览器直连 API，绝无中间商 | ⚠️ 强制走第三方自建服务器中转 |
| **使用成本** | 🆓 完全免费（仅按模型厂商实际 token 付费） | 💰 每月 $10 ~ $30 美元高额订阅 |
| **本地 / 离线大模型** | ✅ 完美支持 Ollama / LM Studio 等 | ❌ 不支持 |
| **自定义模型** | ✅ 兼容任意 OpenAI 标准接口 | ❌ 受限且不可控 |

---

### 🚀 快速安装与使用

1. 克隆或下载本仓库代码到本地：
   ```bash
   git clone https://github.com/wuyafeiJS/TransLLM.git
   ```
2. 打开 Chrome 或 Edge 浏览器，访问扩展管理页面：
   - Chrome 输入：`chrome://extensions/`
   - Edge 输入：`edge://extensions/`
3. 打开右上角的 **“开发者模式”** 开关。
4. 点击左上角的 **“加载已解压的扩展程序”**，选择刚刚克隆的 `TransLLM` 文件夹。
5. 点击浏览器右上角工具栏的 TransLLM 图标，填入您的 **DeepSeek API Key** 或 **本地 Ollama 地址**，点击 **保存并测试连接** 即可开始使用。

---

### 🛠️ 技术架构

- **Manifest V3**：遵循 Google Chrome 最新的扩展规范标准开发。
- **Shadow DOM 样式隔离**：划词翻译气泡采用 Open Shadow DOM 封装，确保翻译面板的样式与宿主网页 CSS 100% 物理隔离，绝不串样。
- **SSE 流式传输（Streaming）**：在 Background Service Worker 中使用 Server-Sent Events 流式解码，实现毫秒级打字机逐字响应。
- **本地安全存储**：API Key 和端点配置仅保存在浏览器的 `chrome.storage.local` 中，安全可靠。

---

### 📄 开源许可证

本项目基于 [MIT 许可证](LICENSE) 开源。欢迎 Star、提交 Issue 或 PR 共同完善！

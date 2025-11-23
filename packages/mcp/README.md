# 🐎⚡ The Buraq Suite (البراق)

**The World's First Arabic Model Context Protocol (MCP) Servers**
**أول خوادم بروتوكول سياق النموذج (MCP) عربية في العالم**

![Buraq Banner](https://img.shields.io/badge/Status-Live-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Language](https://img.shields.io/badge/Language-TypeScript-blue)

## 🌍 The Mission (الرسالة)

Artificial Intelligence models (LLMs) often struggle with Arabic cultural context. They hallucinate Quranic verses and fail to understand the Hijri calendar.
**The Buraq Suite** builds the **"Cultural Infrastructure"** for AI, providing deterministic, API-grounded truth for:

1. **Islamic Time (الزمن الإسلامي)**: Hijri dates, Ramadan, and Eids.
2. **Divine Knowledge (المعرفة الإلهية)**: Verified Quranic verses and search.

## 📦 The Suite (الحزمة)

| Package | Name | Description | Tools |
| :--- | :--- | :--- | :--- |
| **Hijri** | `@axiom-mcp/hijri` | **Temporal Awareness**<br>Converts dates & tracks Islamic events. | `convert_to_hijri`<br>`get_islamic_holidays` |
| **Quran** | `@axiom-mcp/quran` | **Verified Knowledge**<br>Semantic search & verse retrieval. | `search_quran`<br>`get_ayah` |

## 🚀 Quick Start (Claude Desktop)

To give your local Claude "Arabic Superpowers", add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "buraq-hijri": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/axiom-stack/packages/mcp/hijri/build/index.js"]
    },
    "buraq-quran": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/axiom-stack/packages/mcp/quran/build/index.js"]
    }
  }
}
```

## 💡 Usage Examples (أمثلة الاستخدام)

Once connected, you can ask Claude:

> **User**: "متى يبدأ رمضان القادم؟"
> **Claude (using Buraq)**: "بناءً على التقويم الهجري لعام 1446، سيبدأ رمضان في 2025-03-01."

> **User**: "أعطني آية تتحدث عن 'بر الوالدين'."
> **Claude (using Buraq)**: "قال تعالى: (وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا...) [الإسراء: 23]"

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build all servers
npm run build
```

## 📜 License

MIT © Axiom ID

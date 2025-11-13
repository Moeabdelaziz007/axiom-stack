# Axiom Assist Bot

🤖 The official AI Developer Advocate for the Axiom ID open-source project.

## 🚀 Overview

Axiom Assist is an intelligent Discord bot that helps developers understand, install, use, and contribute to Axiom ID. Built with Google Gemini, LangChain.js, and Pinecone, it provides instant, accurate answers to technical questions about the project.

## 🧠 Dual-Brain Architecture

Axiom Assist uses a "Dual-Brain Strategy":

1. **Dynamic Brain (RAG)**: Real-time information from project documentation and code
2. **Static Brain (Persona)**: Predefined information about the founder and project leadership

## 📁 Project Structure

```
axiom-assist-bot/
├── ingest.mjs             # Knowledge base ingestion script
├── discord-bot.mjs        # Discord bot implementation
├── discord-bot-pinecone.mjs # Pinecone-powered Discord bot
├── web-api.mjs           # Web API for website integration
├── system-prompt.txt      # Bot persona and behavior guidelines
├── setup.mjs             # Automated setup script
├── package.json           # Project dependencies and scripts
├── .env.example          # Environment variables template
├── README.md             # This file
└── IMPLEMENTATION_SUMMARY.md  # Implementation details
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Google Gemini API key
- Pinecone API key
- Discord bot token (for Discord integration)

### 2. Installation

```bash
cd axiom-assist-bot
npm install
```

### 3. Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   DISCORD_BOT_TOKEN=your_discord_bot_token
   ```

### 4. Knowledge Base Ingestion

Before running the bot, you need to ingest the project documentation:

```bash
npm run ingest
```

This will:
- Scan the Axiom ID project files
- Process documentation and code
- Store embeddings in Pinecone

### 5. Running the Bot

#### Run the Pinecone-powered Discord bot:
```bash
npm run bot-pinecone
```

#### Run the Web API:
```bash
npm run web-api
```

## 🤖 Discord Bot Usage

Once the bot is running and invited to your Discord server, users can interact with it in several ways:

1. **Mention the bot**: `@AxiomAssist how do I create an agent identity?`
2. **Direct messages**: Send a DM directly to the bot

## 🔧 Development

### Project Dependencies

- `@langchain/google-genai` - Google Gemini integration
- `@pinecone-database/pinecone` - Vector database for RAG
- `discord.js` - Discord bot framework
- `fast-glob` - File pattern matching
- `dotenv` - Environment variable management

### Adding New Documentation

To update the knowledge base with new documentation:

1. Add your files to the Axiom ID project directory
2. Run the ingestion script: `npm run ingest`

## 🎯 Features

- **Instant Answers**: Get answers to technical questions in seconds
- **Code Explanation**: Line-by-line code walkthroughs
- **Context-Aware**: Responses based on actual project documentation
- **Founder Information**: Static knowledge about project leadership
- **Discord Integration**: Seamless support in your development community
- **Privacy Respecting**: No private information sharing

## 🤝 Contributing

We welcome contributions to improve Axiom Assist! Please see the main Axiom ID contributing guidelines.

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file in the main Axiom ID repository for details.

## 👤 Founder Information

**Founder**: Mohamed H. Abdelaziz
**Role**: Futuristic Systems Architect and lead visionary for Axiom ID

For official communication:
1. Open an Issue on the GitHub repository
2. Join our Discord and ask in the `#support` channel
3. Follow updates on LinkedIn
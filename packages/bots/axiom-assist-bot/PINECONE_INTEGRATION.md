# Pinecone Integration for Axiom ID

This document explains how Pinecone has been integrated into the Axiom ID project to create a cloud-based knowledge base that can be accessed by both GitHub Actions (for updates) and Render (for reading).

## 🏗️ Architecture Overview

```
GitHub Actions (update-brain.yml) ───┐
                                     ├──► Pinecone Cloud DB ◄── Discord Bot (Render)
Strategist Engine (strategist.mjs) ──┘
```

## 📁 Files Modified

1. **[ingest.mjs](ingest.mjs)** - Modified to upsert data to Pinecone instead of ChromaDB
2. **[index.mjs](index.mjs)** - Modified to query Pinecone with fallback to ChromaDB
3. **[strategist.mjs](strategist.mjs)** - Modified to use Pinecone for context retrieval
4. **[pinecone-client.mjs](pinecone-client.mjs)** - New file with Pinecone client implementation
5. **[discord-bot-pinecone.mjs](discord-bot-pinecone.mjs)** - New Discord bot that uses Pinecone
6. **[package.json](package.json)** - Added Pinecone dependency and new script

## 🔧 How It Works

### 1. Data Ingestion (ingest.mjs)
- Reads all project documentation and source files
- Splits content into chunks using RecursiveCharacterTextSplitter
- Generates embeddings using Google Gemini Embeddings API
- Upserts vectors to Pinecone with metadata

### 2. Knowledge Base Querying (index.mjs)
- Generates embeddings for user questions
- Queries Pinecone for similar vectors
- Extracts relevant context from metadata
- Falls back to ChromaDB if Pinecone is unavailable

### 3. Strategic Context Retrieval (strategist.mjs)
- Uses strategic queries to retrieve relevant context from Pinecone
- Provides better context for strategic thinking
- Falls back to file-based context if Pinecone is unavailable

## 🚀 New Commands

```bash
# Ingest data to Pinecone
npm run ingest

# Run Discord bot that uses Pinecone
npm run bot-pinecone
```

## ⚙️ Environment Variables

Add these to your `.env` file:

```env
PINECONE_API_KEY=your_pinecone_api_key_here
```

## 🛡️ Features

1. **Cloud-Based Storage**: Knowledge base stored in Pinecone cloud database
2. **Fallback Mechanism**: Falls back to ChromaDB if Pinecone is unavailable
3. **Batch Processing**: Efficiently upserts data in batches
4. **Namespace Support**: Organizes data with namespaces
5. **Error Handling**: Graceful error handling and logging

## 🎯 Benefits

1. **Shared Knowledge Base**: Both GitHub Actions and Render can access the same cloud database
2. **Scalability**: Pinecone can handle large amounts of data
3. **Performance**: Fast vector similarity search
4. **Reliability**: Fallback mechanism ensures availability
5. **Cost-Effective**: Uses Pinecone's free tier for small projects

This integration completes the $0 Stack by providing a cloud-based knowledge base that can be updated by GitHub Actions and read by services deployed on Render.# Pinecone Integration for Axiom ID

This document explains how Pinecone has been integrated into the Axiom ID project to create a cloud-based knowledge base that can be accessed by both GitHub Actions (for updates) and Render (for reading).

## 🏗️ Architecture Overview

```
GitHub Actions (update-brain.yml) ───┐
                                     ├──► Pinecone Cloud DB ◄── Discord Bot (Render)
Strategist Engine (strategist.mjs) ──┘
```

## 📁 Files Modified

1. **[ingest.mjs](ingest.mjs)** - Modified to upsert data to Pinecone instead of ChromaDB
2. **[index.mjs](index.mjs)** - Modified to query Pinecone with fallback to ChromaDB
3. **[strategist.mjs](strategist.mjs)** - Modified to use Pinecone for context retrieval
4. **[pinecone-client.mjs](pinecone-client.mjs)** - New file with Pinecone client implementation
5. **[discord-bot-pinecone.mjs](discord-bot-pinecone.mjs)** - New Discord bot that uses Pinecone
6. **[package.json](package.json)** - Added Pinecone dependency and new script

## 🔧 How It Works

### 1. Data Ingestion (ingest.mjs)
- Reads all project documentation and source files
- Splits content into chunks using RecursiveCharacterTextSplitter
- Generates embeddings using Google Gemini Embeddings API
- Upserts vectors to Pinecone with metadata

### 2. Knowledge Base Querying (index.mjs)
- Generates embeddings for user questions
- Queries Pinecone for similar vectors
- Extracts relevant context from metadata
- Falls back to ChromaDB if Pinecone is unavailable

### 3. Strategic Context Retrieval (strategist.mjs)
- Uses strategic queries to retrieve relevant context from Pinecone
- Provides better context for strategic thinking
- Falls back to file-based context if Pinecone is unavailable

## 🚀 New Commands

```bash
# Ingest data to Pinecone
npm run ingest

# Run Discord bot that uses Pinecone
npm run bot-pinecone
```

## ⚙️ Environment Variables

Add these to your `.env` file:

```env
PINECONE_API_KEY=your_pinecone_api_key_here
```

## 🛡️ Features

1. **Cloud-Based Storage**: Knowledge base stored in Pinecone cloud database
2. **Fallback Mechanism**: Falls back to ChromaDB if Pinecone is unavailable
3. **Batch Processing**: Efficiently upserts data in batches
4. **Namespace Support**: Organizes data with namespaces
5. **Error Handling**: Graceful error handling and logging

## 🎯 Benefits

1. **Shared Knowledge Base**: Both GitHub Actions and Render can access the same cloud database
2. **Scalability**: Pinecone can handle large amounts of data
3. **Performance**: Fast vector similarity search
4. **Reliability**: Fallback mechanism ensures availability
5. **Cost-Effective**: Uses Pinecone's free tier for small projects

This integration completes the $0 Stack by providing a cloud-based knowledge base that can be updated by GitHub Actions and read by services deployed on Render.
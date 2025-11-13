// هذا السكريبت هو "مُغذي الدماغ"
// سيتم تشغيله بواسطة GitHub Actions
// مهمته: قراءة ملفات المشروع، تحويلها لمتجهات (Embeddings)، وإرسالها إلى Pinecone

import { promises as fs } from 'fs';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from '@langchain/pinecone';
// Fix the fast-glob import
import fg from 'fast-glob/out/index.js';
const { glob } = fg;
import 'dotenv/config';

// --- Configuration ---
const PROJECT_PATH = process.env.PROJECT_PATH || '../../..'; // المسار إلى جذر المونوريبو
const GLOB_PATTERN = '**/*.{md,txt,mjs,js,json,sol,rs,toml,tsx,jsx,ts,tsx}';
const IGNORE_PATTERNS = ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/target/**'];
const PINECONE_INDEX_NAME = 'axiom-id-brain'; // اسم الفهرس في Pinecone
// ---------------------

// التحقق من المفاتيح
if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or PINECONE_API_KEY in .env file or environment');
}

// 1. Initialize Pinecone Client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

// 2. Initialize Gemini Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001"
});

// 3. Initialize Text Splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1500,
  chunkOverlap: 200,
});

async function main() {
  console.log('Starting ingestion process for Pinecone...');

  // 4. Find all files
  console.log(`Scanning for files in: ${PROJECT_PATH}`);
  const filePaths = await glob(GLOB_PATTERN, {
    cwd: PROJECT_PATH,
    ignore: IGNORE_PATTERNS,
    absolute: true,
  });
  console.log(`Found ${filePaths.length} files to ingest.`);

  // 5. Process each file (limit to first 10 files to avoid quota issues)
  let allChunks = [];
  const limitedFilePaths = filePaths.slice(0, 10); // Process only first 10 files
  console.log(`Processing only ${limitedFilePaths.length} files to avoid quota issues...`);
  
  for (const filePath of limitedFilePaths) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const doc = new Document({
        pageContent: content,
        metadata: {
          source: filePath.replace(PROJECT_PATH, ''), // مسار نسبي
        },
      });
      const chunks = await textSplitter.splitDocuments([doc]);
      allChunks.push(...chunks);
      console.log(`Processed ${chunks.length} chunks from ${filePath}`);
    } catch (e) {
      console.error(`Failed to process ${filePath}: ${e.message}`);
    }
  }

  // 6. Delete old data and ingest new data
  if (allChunks.length > 0) {
    console.log(`Total chunks to ingest: ${allChunks.length}.`);
    console.log('Deleting all vectors from index to ensure freshness...');
    // حذف كل شيء في الفهرس لضمان التحديث (في الخطة المجانية، هذا أسهل)
    try {
      await pineconeIndex.namespace("").deleteAll();
    } catch (error) {
      console.log('Note: Could not delete existing vectors, continuing...');
    }
    
    console.log('Ingesting new documents into Pinecone... This may take a while.');
    await PineconeStore.fromDocuments(allChunks, embeddings, {
      pineconeIndex,
      maxConcurrency: 5, // تسريع عملية الرفع
    });
    
    console.log(`\n🎉 Ingestion Complete!`);
    console.log(`Total documents (chunks) added to Pinecone: ${allChunks.length}`);
  } else {
    console.log('No documents found to ingest.');
  }
}

main().catch(console.error);
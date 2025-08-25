import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // AI Configuration
  geminiApiKey: process.env.GEMINI_API_KEY,
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeIndexName: process.env.PINECONE_INDEX_NAME,
  
  // RAG Settings (keeping free tier friendly)
  embedding: {
    model: 'text-embedding-004', // Keeping current model for consistency
    batchSize: 50 // Reduced for free tier
  },
  
  chunking: {
    chunkSize: 1000,
    chunkOverlap: 200
  },
  
  retrieval: {
    topK: 10,
    maxConcurrency: 5
  },
  
  // Upload settings
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf']
  }
};
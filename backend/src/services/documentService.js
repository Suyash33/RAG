import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PineconeStore } from '@langchain/pinecone';
import { getPineconeIndex } from '../config/database.js';
import { config } from '../config/environment.js';
import embeddingService from './embeddingService.js';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class DocumentService {
  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunking.chunkSize,
      chunkOverlap: config.chunking.chunkOverlap
    });
  }

  async processDocument(filePath, originalName) {
    try {
      console.log(`Processing document: ${originalName}`);
      
      // Load PDF
      const loader = new PDFLoader(filePath);
      const rawDocs = await loader.load();
      
      if (!rawDocs || rawDocs.length === 0) {
        throw new Error('No content found in the document');
      }

      // Add metadata to documents
      const documentId = uuidv4();
      rawDocs.forEach((doc, index) => {
        doc.metadata = {
          ...doc.metadata,
          documentId,
          fileName: originalName,
          chunkIndex: index,
          uploadTime: new Date().toISOString()
        };
      });

      // Split documents
      const chunkedDocs = await this.textSplitter.splitDocuments(rawDocs);
      console.log(`Document chunked into ${chunkedDocs.length} pieces`);

      // Store in Pinecone
      const pineconeIndex = getPineconeIndex();
      await PineconeStore.fromDocuments(
        chunkedDocs, 
        embeddingService.embeddings, 
        {
          pineconeIndex,
          maxConcurrency: config.retrieval.maxConcurrency,
        }
      );

      // Clean up uploaded file
      await fs.unlink(filePath);

      return {
        documentId,
        fileName: originalName,
        chunkCount: chunkedDocs.length,
        uploadTime: new Date().toISOString()
      };

    } catch (error) {
      console.error('Document processing failed:', error);
      // Clean up file even if processing failed
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to clean up file:', unlinkError);
      }
      throw error;
    }
  }

  async searchDocuments(query, topK = 10) {
    try {
      const queryVector = await embeddingService.embedQuery(query);
      const pineconeIndex = getPineconeIndex();

      const searchResults = await pineconeIndex.query({
        topK,
        vector: queryVector,
        includeMetadata: true
      });

      return searchResults.matches.map(match => ({
        content: match.metadata?.text || '',
        fileName: match.metadata?.fileName || 'Unknown',
        score: match.score,
        metadata: match.metadata
      }));

    } catch (error) {
      console.error('Document search failed:', error);
      throw new Error('Failed to search documents');
    }
  }
}

export default new DocumentService();
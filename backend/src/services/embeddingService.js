import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { config } from '../config/environment.js';

class EmbeddingService {
  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: config.geminiApiKey,
      model: config.embedding.model
    });
  }

  async embedQuery(query) {
    try {
      return await this.embeddings.embedQuery(query);
    } catch (error) {
      console.error('Embedding query failed:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  async embedDocuments(documents) {
    try {
      return await this.embeddings.embedDocuments(documents);
    } catch (error) {
      console.error('Embedding documents failed:', error);
      throw new Error('Failed to generate document embeddings');
    }
  }
}

export default new EmbeddingService();
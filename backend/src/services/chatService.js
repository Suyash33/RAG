import { GoogleGenAI } from "@google/genai";
import { config } from '../config/environment.js';
import documentService from './documentService.js';
import { v4 as uuidv4 } from 'uuid'; // Add this missing import

class ChatService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: config.geminiApiKey
    });
    this.conversations = new Map(); // Simple in-memory storage for demo
  }

  async transformQuery(question, sessionId) {
    try {
      const history = this.conversations.get(sessionId) || [];
      
      if (history.length === 0) {
        return question; // First question, no need to transform
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          ...history.slice(-6), // Last 3 exchanges for context
          {
            role: 'user',
            parts: [{ text: question }]
          }
        ],
        config: {
          systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history. Only output the rewritten question and nothing else.`
        }
      });

      return response.text || question;
    } catch (error) {
      console.error('Query transformation failed:', error);
      return question; // Fallback to original question
    }
  }

  async generateResponse(question, sessionId) {
    try {
      // Transform query for better retrieval
      const transformedQuery = await this.transformQuery(question, sessionId);
      
      // Search for relevant documents
      const relevantDocs = await documentService.searchDocuments(transformedQuery, 10);
      
      // Create context from retrieved documents
      const context = relevantDocs
        .map(doc => `${doc.content}\n[Source: ${doc.fileName}]`)
        .join('\n\n---\n\n');

      // Get conversation history
      const history = this.conversations.get(sessionId) || [];

      // Add current question to history
      const updatedHistory = [
        ...history,
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ];

      // Generate response
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: updatedHistory,
        config: {
          systemInstruction: `You are a Data Structure and Algorithm Expert assistant.
            
You will be given a context of relevant information and a user question.
Your task is to answer the user's question based ONLY on the provided context.

Rules:
- If the answer is not in the context, say "I couldn't find that information in the uploaded documents."
- Keep answers clear, concise, and educational
- Always cite which document you're referencing when possible
- Use markdown formatting for better readability

Context:
${context}`
        }
      });

      // Update conversation history
      const finalHistory = [
        ...updatedHistory,
        {
          role: 'model',
          parts: [{ text: response.text }]
        }
      ];

      // Keep only last 10 exchanges to manage memory
      this.conversations.set(sessionId, finalHistory.slice(-20));

      return {
        response: response.text,
        sources: relevantDocs.slice(0, 3), // Return top 3 sources
        transformedQuery
      };

    } catch (error) {
      console.error('Response generation failed:', error);
      throw new Error('Failed to generate response');
    }
  }

  createSession() {
    const sessionId = uuidv4();
    this.conversations.set(sessionId, []);
    return sessionId;
  }

  clearSession(sessionId) {
    this.conversations.delete(sessionId);
  }
}

export default new ChatService();
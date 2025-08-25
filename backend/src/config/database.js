import { Pinecone } from '@pinecone-database/pinecone';
import { config } from './environment.js';

let pineconeClient = null;

export const getPineconeClient = () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: config.pineconeApiKey
    });
  }
  return pineconeClient;
};

export const getPineconeIndex = () => {
  const client = getPineconeClient();
  return client.Index(config.pineconeIndexName);
};
import { create } from 'zustand';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Array<{
    fileName: string;
    content: string;
    score: number;
  }>;
}

interface AppState {
  // Chat state
  messages: ChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  
  // Document state
  uploadedDocuments: Array<{
    id: string;
    fileName: string;
    uploadTime: string;
    chunkCount: number;
  }>;
  isUploading: boolean;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (sessionId: string) => void;
  addDocument: (document: any) => void;
  setUploading: (uploading: boolean) => void;
  clearMessages: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  uploadedDocuments: [],
  isUploading: false,

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set({ messages: [...get().messages, newMessage] });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setSessionId: (sessionId) => set({ sessionId }),
  
  addDocument: (document) => {
    set({ 
      uploadedDocuments: [...get().uploadedDocuments, document] 
    });
  },
  
  setUploading: (uploading) => set({ isUploading: uploading }),
  
  clearMessages: () => set({ messages: [] }),
}));
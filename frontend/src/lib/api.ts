const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async createSession(): Promise<{ sessionId: string }> {
    try {
      const response = await fetch(`${this.baseURL}/chat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create session`);
      }

      return response.json();
    } catch (error) {
      console.error('Session creation error:', error);
      throw new Error('Failed to connect to backend. Make sure the server is running on port 8000.');
    }
  }

  async sendMessage(message: string, sessionId: string) {
    try {
      const response = await fetch(`${this.baseURL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to send message`);
      }

      return response.json();
    } catch (error) {
      console.error('Message sending error:', error);
      throw error;
    }
  }

  async uploadDocument(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
import axios from 'axios';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';

interface EmbeddingResponse {
  embedding: number[];
}

interface ChatResponse {
  response: string;
}

export class AIService {
  // Generate embeddings for user traits
  static async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await axios.post<EmbeddingResponse>(`${OLLAMA_API_URL}/embeddings`, {
        model: 'llama2',
        prompt: text
      });
      return response.data.embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  // Generate chat suggestions
  static async generateChatSuggestion(context: string): Promise<string> {
    try {
      const response = await axios.post<ChatResponse>(`${OLLAMA_API_URL}/generate`, {
        model: 'llama2',
        prompt: `Given this dating context: "${context}", generate a friendly, engaging first message that shows interest and asks an open-ended question. Keep it casual and natural.`,
        stream: false
      });
      return response.data.response;
    } catch (error) {
      console.error('Error generating chat suggestion:', error);
      throw new Error('Failed to generate chat suggestion');
    }
  }

  // Analyze message sentiment
  static async analyzeSentiment(text: string): Promise<number> {
    try {
      const response = await axios.post<ChatResponse>(`${OLLAMA_API_URL}/generate`, {
        model: 'llama2',
        prompt: `Analyze the sentiment of this message on a scale from -1 (very negative) to 1 (very positive): "${text}". Respond with only a number.`,
        stream: false
      });
      return parseFloat(response.data.response);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  // Check message toxicity
  static async checkToxicity(text: string): Promise<number> {
    try {
      const response = await axios.post<ChatResponse>(`${OLLAMA_API_URL}/generate`, {
        model: 'llama2',
        prompt: `Rate the toxicity of this message on a scale from 0 (not toxic) to 1 (very toxic): "${text}". Respond with only a number.`,
        stream: false
      });
      return parseFloat(response.data.response);
    } catch (error) {
      console.error('Error checking toxicity:', error);
      throw new Error('Failed to check toxicity');
    }
  }
} 
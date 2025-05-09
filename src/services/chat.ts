import axios from 'axios';
import { Message } from '../store/matchStore';

const OLLAMA_API_URL = 'http://localhost:11434/api';

interface ChatAnalysis {
  sentiment: number; // -1 to 1 (negative to positive)
  toxicity: number; // 0 to 1 (safe to toxic)
  suggestions: string[];
}

export class ChatService {
  private async analyzeMessage(text: string): Promise<ChatAnalysis> {
    const prompt = `Analyze this message for sentiment (-1 to 1) and toxicity (0 to 1):
    "${text}"
    Return a JSON object with sentiment, toxicity, and suggestions for improvement if needed.`;

    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: 'llama2:13b',
      prompt,
      stream: false,
    });

    try {
      return JSON.parse(response.data.response);
    } catch (error) {
      console.error('Error parsing chat analysis:', error);
      return {
        sentiment: 0,
        toxicity: 0,
        suggestions: [],
      };
    }
  }

  private async generateSuggestion(
    context: Message[],
    userProfile: string,
    matchProfile: string
  ): Promise<string> {
    const prompt = `Given this chat context and user profiles, suggest a friendly, engaging message:
    User Profile: ${userProfile}
    Match Profile: ${matchProfile}
    Recent Messages:
    ${context
      .slice(-3)
      .map((msg) => `${msg.senderId === 'me' ? 'You' : 'Match'}: ${msg.text}`)
      .join('\n')}
    Suggest a natural, contextually appropriate message that shows interest and personality.`;

    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: 'llama2:13b',
      prompt,
      stream: false,
    });

    return response.data.response.trim();
  }

  async processMessage(
    text: string,
    context: Message[],
    userProfile: string,
    matchProfile: string
  ): Promise<{
    message: string;
    analysis: ChatAnalysis;
    suggestion?: string;
  }> {
    try {
      // Analyze the message
      const analysis = await this.analyzeMessage(text);

      // If message is too toxic, return early with suggestions
      if (analysis.toxicity > 0.7) {
        return {
          message: text,
          analysis,
          suggestion: 'Consider rephrasing your message to be more respectful.',
        };
      }

      // Generate a suggestion for the next message
      const suggestion = await this.generateSuggestion(
        context,
        userProfile,
        matchProfile
      );

      return {
        message: text,
        analysis,
        suggestion,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error('Failed to process message');
    }
  }

  async getSuggestions(
    context: Message[],
    userProfile: string,
    matchProfile: string,
    count: number = 3
  ): Promise<string[]> {
    try {
      const suggestions = await Promise.all(
        Array(count)
          .fill(null)
          .map(() => this.generateSuggestion(context, userProfile, matchProfile))
      );

      return suggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions');
    }
  }
}

export const chatService = new ChatService(); 
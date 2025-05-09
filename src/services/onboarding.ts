import axios from 'axios';
import { User } from '../store/matchStore';

const OLLAMA_API_URL = 'http://localhost:11434/api';

interface OnboardingResponse {
  bio: string;
  traits: string[];
  embedding: number[];
}

export class OnboardingService {
  private async generateBio(answers: Record<string, string>): Promise<string> {
    const prompt = `Based on these answers about a person, write a concise, engaging dating profile bio (max 200 characters):
    ${Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n')}`;

    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: 'llama2:13b',
      prompt,
      stream: false,
    });

    return response.data.response.trim();
  }

  private async generateTraits(answers: Record<string, string>): Promise<string[]> {
    const prompt = `Based on these answers, identify 5-7 key personality traits that best describe this person. Return only a comma-separated list of traits:
    ${Object.entries(answers)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n')}`;

    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model: 'llama2:13b',
      prompt,
      stream: false,
    });

    return response.data.response
      .trim()
      .split(',')
      .map((trait: string) => trait.trim())
      .filter(Boolean);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(`${OLLAMA_API_URL}/embeddings`, {
      model: 'llama2:13b',
      prompt: text,
    });

    return response.data.embedding;
  }

  async processOnboarding(answers: Record<string, string>): Promise<OnboardingResponse> {
    try {
      // Generate bio and traits in parallel
      const [bio, traits] = await Promise.all([
        this.generateBio(answers),
        this.generateTraits(answers),
      ]);

      // Generate embedding from combined bio and traits
      const embeddingText = `${bio} ${traits.join(' ')}`;
      const embedding = await this.generateEmbedding(embeddingText);

      return {
        bio,
        traits,
        embedding,
      };
    } catch (error) {
      console.error('Error in onboarding process:', error);
      throw new Error('Failed to process onboarding');
    }
  }
}

export const onboardingService = new OnboardingService(); 
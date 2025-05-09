import { WordTokenizer, TfIdf, PorterStemmer } from 'natural';
import { ToxicityAnalyzer } from './toxicity';
import { wordToVec } from './word2vec';

// Using Ollama for local LLM
const OLLAMA_API = 'http://localhost:11434/api';

export class AIService {
  private tokenizer: WordTokenizer;
  private toxicityAnalyzer: ToxicityAnalyzer;

  constructor() {
    this.tokenizer = new WordTokenizer();
    this.toxicityAnalyzer = new ToxicityAnalyzer();
  }

  async generateBioAndTraits(responses: string[]): Promise<{ bio: string; traits: { name: string; score: number }[] }> {
    try {
      const prompt = `Based on these responses, create a dating profile bio and identify key personality traits:
      ${responses.join('\n')}
      
      Format the response as JSON:
      {
        "bio": "engaging 2-3 sentence bio",
        "traits": [{"name": "trait name", "score": 0.x}]
      }`;

      const response = await fetch(`${OLLAMA_API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt,
          format: 'json'
        })
      });

      const data = await response.json();
      return JSON.parse(data.response);
    } catch (error) {
      console.error('Error generating bio and traits:', error);
      return {
        bio: "I'm excited to meet new people and see where things go!",
        traits: [
          { name: "friendly", score: 0.8 },
          { name: "outgoing", score: 0.7 }
        ]
      };
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use word2vec for generating embeddings
      return await wordToVec.textToVector(text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      return new Array(768).fill(0); // Return zero vector as fallback
    }
  }

  async analyzeSentiment(text: string): Promise<number> {
    try {
      const words = this.tokenizer.tokenize(text) || [];
      const stemmedWords = words.map(word => PorterStemmer.stem(word.toLowerCase()));
      
      // Simple sentiment analysis using word polarity
      let score = 0;
      const positiveWords = ['love', 'happy', 'great', 'awesome', 'amazing', 'good', 'nice', 'fun'];
      const negativeWords = ['hate', 'bad', 'awful', 'terrible', 'horrible', 'wrong', 'sad'];
      
      stemmedWords.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
      });
      
      // Normalize to range [-1, 1]
      return Math.max(-1, Math.min(1, score / Math.max(words.length, 1)));
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 0;
    }
  }

  async analyzeToxicity(text: string): Promise<number> {
    try {
      return await this.toxicityAnalyzer.analyze(text);
    } catch (error) {
      console.error('Error analyzing toxicity:', error);
      return 0;
    }
  }
} 
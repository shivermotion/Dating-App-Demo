import axios from 'axios';
import { User } from '../store/matchStore';

const OLLAMA_API_URL = 'http://localhost:11434/api';

interface MatchScore {
  user: User;
  score: number;
  diversityPenalty: number;
  finalScore: number;
}

export class MatchingService {
  private async getEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(`${OLLAMA_API_URL}/embeddings`, {
      model: 'llama2:13b',
      prompt: text,
    });

    return response.data.embedding;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }

  private calculateDiversityPenalty(
    user: User,
    recentMatches: User[],
    penaltyWeight: number = 0.3
  ): number {
    if (recentMatches.length === 0) return 0;

    const userTraits = new Set(user.traits);
    let totalOverlap = 0;

    recentMatches.forEach((match) => {
      const matchTraits = new Set(match.traits);
      const overlap = [...userTraits].filter((trait) => matchTraits.has(trait)).length;
      totalOverlap += overlap / userTraits.size;
    });

    return (totalOverlap / recentMatches.length) * penaltyWeight;
  }

  async findTopMatches(
    currentUser: User,
    potentialMatches: User[],
    recentMatches: User[] = [],
    topK: number = 3
  ): Promise<User[]> {
    try {
      // Get current user's embedding
      const userEmbedding = await this.getEmbedding(
        `${currentUser.bio} ${currentUser.traits.join(' ')}`
      );

      // Calculate match scores with diversity penalty
      const matchScores: MatchScore[] = await Promise.all(
        potentialMatches.map(async (user) => {
          const matchEmbedding = await this.getEmbedding(
            `${user.bio} ${user.traits.join(' ')}`
          );
          const similarityScore = this.cosineSimilarity(userEmbedding, matchEmbedding);
          const diversityPenalty = this.calculateDiversityPenalty(user, recentMatches);
          const finalScore = similarityScore * (1 - diversityPenalty);

          return {
            user,
            score: similarityScore,
            diversityPenalty,
            finalScore,
          };
        })
      );

      // Sort by final score and return top K matches
      return matchScores
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, topK)
        .map((match) => match.user);
    } catch (error) {
      console.error('Error finding matches:', error);
      throw new Error('Failed to find matches');
    }
  }
}

export const matchingService = new MatchingService(); 
import { prisma } from '../server';
import { AIService } from './ai';

interface UserWithEmbedding {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string | null;
  profileImage: string | null;
  traitEmbedding: number[] | null;
}

interface MatchScore {
  user: UserWithEmbedding;
  score: number;
}

export class MatchingService {
  // Calculate cosine similarity between two vectors
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Get top matches for a user
  static async getTopMatches(userId: string, limit: number = 3): Promise<any[]> {
    try {
      // Get user's trait embedding
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { traitEmbedding: true }
      });

      if (!user?.traitEmbedding) {
        throw new Error('User has no trait embedding');
      }

      // Get all other users with embeddings
      const otherUsers = await prisma.user.findMany({
        where: {
          id: { not: userId },
          traitEmbedding: { not: null }
        },
        select: {
          id: true,
          name: true,
          age: true,
          gender: true,
          bio: true,
          profileImage: true,
          traitEmbedding: true
        }
      });

      // Calculate similarity scores
      const scores: MatchScore[] = otherUsers.map((otherUser: UserWithEmbedding) => ({
        user: otherUser,
        score: this.cosineSimilarity(
          user.traitEmbedding as number[],
          otherUser.traitEmbedding as number[]
        )
      }));

      // Sort by score and apply diversity penalty
      const sortedScores = scores
        .sort((a: MatchScore, b: MatchScore) => b.score - a.score)
        .slice(0, limit * 2); // Get more candidates for diversity

      // Apply diversity penalty (simple implementation)
      const diverseMatches = sortedScores
        .map((match: MatchScore, index: number) => ({
          ...match,
          score: match.score * (1 - index * 0.1) // Reduce score by 10% for each position
        }))
        .sort((a: MatchScore, b: MatchScore) => b.score - a.score)
        .slice(0, limit);

      // Create or update matches in database
      const matches = await Promise.all(
        diverseMatches.map(async ({ user, score }: { user: UserWithEmbedding; score: number }) => {
          return prisma.match.upsert({
            where: {
              userId_matchedUserId: {
                userId,
                matchedUserId: user.id
              }
            },
            update: {
              score
            },
            create: {
              userId,
              matchedUserId: user.id,
              score
            }
          });
        })
      );

      return matches;
    } catch (error) {
      console.error('Error getting matches:', error);
      throw new Error('Failed to get matches');
    }
  }

  // Update user's trait embedding
  static async updateTraitEmbedding(userId: string, traits: string): Promise<void> {
    try {
      const embedding = await AIService.generateEmbeddings(traits);
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          traitEmbedding: embedding
        }
      });
    } catch (error) {
      console.error('Error updating trait embedding:', error);
      throw new Error('Failed to update trait embedding');
    }
  }
} 
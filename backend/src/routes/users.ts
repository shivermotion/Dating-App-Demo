import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { MatchingService } from '../services/matching';
import { AIService } from '../services/ai';

const router = Router();

// Get user profile
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        profileImage: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, age, gender, bio, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        age,
        gender,
        bio,
        profileImage
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        profileImage: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Update user traits and generate embedding
router.post('/:userId/traits', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { traits } = req.body;

    // Generate embedding from traits
    await MatchingService.updateTraitEmbedding(userId, traits);

    // Get updated user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        profileImage: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user traits:', error);
    res.status(500).json({ error: 'Failed to update user traits' });
  }
});

// Get user's matches
router.get('/:userId/matches', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const matches = await prisma.match.findMany({
      where: { userId },
      include: {
        matchedUser: {
          select: {
            id: true,
            name: true,
            age: true,
            gender: true,
            bio: true,
            profileImage: true
          }
        }
      },
      orderBy: { score: 'desc' }
    });

    res.json(matches);
  } catch (error) {
    console.error('Error getting user matches:', error);
    res.status(500).json({ error: 'Failed to get user matches' });
  }
});

export default router; 
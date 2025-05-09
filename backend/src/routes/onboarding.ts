import express from 'express';
import { prisma } from '../server';
import { AIService } from '../services/ai';

const router = express.Router();
const aiService = new AIService();

router.post('/chat', async (req, res) => {
  try {
    const { userId, responses, photo, voice } = req.body;

    if (!userId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Generate bio and traits using AI
    const { bio, traits } = await aiService.generateBioAndTraits(responses);

    // Generate embeddings for bio and traits
    const bioEmbedding = await aiService.generateEmbedding(bio);
    const traitsText = traits.map(t => `${t.name}:${t.score}`).join(' ');
    const traitEmbedding = await aiService.generateEmbedding(traitsText);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        bio,
        traits: traits,
        embedding: bioEmbedding,
        traitEmbedding: traitEmbedding,
        profileImage: photo,
        voiceIntro: voice,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      profile: {
        bio: user.bio,
        traits: user.traits,
        profileImage: user.profileImage,
        voiceIntro: user.voiceIntro,
      },
    });
  } catch (error) {
    console.error('Error in onboarding:', error);
    res.status(500).json({ error: 'Failed to process onboarding data' });
  }
});

export default router; 
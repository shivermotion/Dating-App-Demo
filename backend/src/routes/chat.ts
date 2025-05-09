import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { AIService } from '../services/ai';

const router = Router();

// Get messages for a match
router.get('/:matchId', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const messages = await prisma.message.findMany({
      where: { matchId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/:matchId', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const { content, senderId } = req.body;

    // Check toxicity
    const toxicityScore = await AIService.checkToxicity(content);
    if (toxicityScore > 0.7) {
      return res.status(400).json({ error: 'Message contains inappropriate content' });
    }

    // Analyze sentiment
    const sentimentScore = await AIService.analyzeSentiment(content);

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        matchId,
        sentiment: sentimentScore,
        toxicity: toxicityScore
      },
      include: {
        sender: true
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get AI chat suggestion
router.get('/:matchId/suggest', async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    
    // Get match context
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user: true,
        matchedUser: true
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Create context for AI
    const context = `${match.user.name} (${match.user.age}) and ${match.matchedUser.name} (${match.matchedUser.age}) matched with a compatibility score of ${match.score}. ${match.user.bio || ''} ${match.matchedUser.bio || ''}`;

    // Generate suggestion
    const suggestion = await AIService.generateChatSuggestion(context);
    res.json({ suggestion });
  } catch (error) {
    console.error('Error getting chat suggestion:', error);
    res.status(500).json({ error: 'Failed to get chat suggestion' });
  }
});

export default router; 
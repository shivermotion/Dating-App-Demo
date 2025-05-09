import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import onboardingRoutes from './routes/onboarding';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 encoded files

// Routes
app.use('/api/onboarding', onboardingRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_chat', (matchId: string) => {
    socket.join(`match_${matchId}`);
  });

  socket.on('send_message', async (data: { matchId: string; content: string; senderId: string }) => {
    try {
      // Create message in database
      const message = await prisma.message.create({
        data: {
          content: data.content,
          senderId: data.senderId,
          matchId: data.matchId,
        },
        include: {
          sender: true,
        },
      });

      // Broadcast message to all clients in the match room
      io.to(`match_${data.matchId}`).emit('new_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
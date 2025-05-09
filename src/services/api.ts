import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Match, Message, ChatRoom, OnboardingResponse, AISuggestion } from '../types';

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Love hiking and trying new restaurants.',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    traits: ['Adventurous', 'Foodie', 'Outdoorsy'],
    isOnline: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 31,
    bio: 'Tech entrepreneur by day, amateur chef by night. Looking for someone to share culinary adventures with.',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    traits: ['Ambitious', 'Creative', 'Foodie'],
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 26,
    bio: 'Artist and yoga instructor. Passionate about mindfulness and creative expression.',
    profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    traits: ['Creative', 'Spiritual', 'Active'],
    isOnline: true,
  },
];

const mockMatches: Match[] = [
  {
    id: '1',
    user: mockUsers[0],
    score: 0.85,
    status: 'pending',
  },
  {
    id: '2',
    user: mockUsers[1],
    score: 0.92,
    status: 'pending',
  },
  {
    id: '3',
    user: mockUsers[2],
    score: 0.78,
    status: 'pending',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! I noticed we both love hiking. What\'s your favorite trail?',
    senderId: '1',
    timestamp: new Date().toISOString(),
    isFromUser: false,
    sender: mockUsers[0],
  },
  {
    id: '2',
    text: 'Hi! I love the Pacific Crest Trail. Have you hiked it?',
    senderId: 'current-user',
    timestamp: new Date().toISOString(),
    isFromUser: true,
  },
];

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    matchId: '1',
    participants: [mockUsers[0]],
    lastMessage: mockMessages[1],
    createdAt: new Date().toISOString(),
  },
];

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiService {
  users = {
    getCurrent: async (): Promise<User> => {
      return mockUsers[0];
    },
    update: async (data: Partial<User>): Promise<User> => {
      return { ...mockUsers[0], ...data };
    },
    getSuggestion: async (): Promise<AISuggestion> => {
      return {
        type: 'conversation',
        text: 'What\'s your favorite travel destination?',
        confidence: 0.9,
      };
    },
  };

  matches = {
    getToday: async (): Promise<Match[]> => {
      return mockMatches;
    },
    getById: async (id: string): Promise<Match> => {
      const match = mockMatches.find(m => m.id === id);
      if (!match) throw new Error('Match not found');
      return match;
    },
    like: async (id: string): Promise<void> => {
      const match = mockMatches.find(m => m.id === id);
      if (match) match.status = 'liked';
    },
    pass: async (id: string): Promise<void> => {
      const match = mockMatches.find(m => m.id === id);
      if (match) match.status = 'passed';
    },
  };

  messages = {
    getByMatchId: async (matchId: string): Promise<Message[]> => {
      return mockMessages;
    },
    send: async (matchId: string, text: string): Promise<Message> => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        senderId: 'current-user',
        timestamp: new Date().toISOString(),
        isFromUser: true,
      };
      mockMessages.push(newMessage);
      return newMessage;
    },
  };

  chat = {
    getRooms: async (): Promise<ChatRoom[]> => {
      return mockChatRooms;
    },
    getRoomById: async (id: string): Promise<ChatRoom> => {
      const room = mockChatRooms.find(r => r.id === id);
      if (!room) throw new Error('Chat room not found');
      return room;
    },
  };

  onboarding = {
    submit: async (data: any): Promise<OnboardingResponse> => {
      return {
        bio: 'Adventure seeker and coffee enthusiast',
        traits: ['Adventurous', 'Foodie', 'Outdoorsy'],
        interests: ['Hiking', 'Cooking', 'Travel'],
      };
    },
  };
}

export const apiService = new ApiService();

export default api; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Love hiking and trying new restaurants.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    traits: ['Adventurous', 'Foodie', 'Outdoorsy'],
    isOnline: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 31,
    bio: 'Tech entrepreneur by day, amateur chef by night. Looking for someone to share culinary adventures with.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    traits: ['Ambitious', 'Creative', 'Foodie'],
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 26,
    bio: 'Artist and yoga instructor. Passionate about mindfulness and creative expression.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    traits: ['Creative', 'Spiritual', 'Active'],
    isOnline: true,
  },
];

const mockMatches = mockUsers.map(user => ({
  id: `match-${user.id}`,
  user,
  isNew: Math.random() > 0.5,
  score: Math.random(),
}));

const mockMessages = [
  {
    id: '1',
    text: 'Hey! I noticed we both love hiking. Any favorite trails?',
    senderId: '1',
    timestamp: new Date().toISOString(),
    isFromUser: false,
  },
  {
    id: '2',
    text: 'Hi! Yes, I love the trails at Mount Tam. Have you been there?',
    senderId: 'me',
    timestamp: new Date().toISOString(),
    isFromUser: true,
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

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: string;
  bio?: string;
  profileImage?: string;
  traits: string[];
  createdAt: string;
  updatedAt: string;
  isOnline?: boolean;
}

export interface Match {
  id: string;
  score: number;
  matchedUser: User;
  createdAt: string;
  isNew?: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  matchId: string;
  createdAt: string;
  sentiment?: number;
  toxicity?: number;
  sender: User;
  isFromUser?: boolean;
  text?: string;
  timestamp?: string;
}

export const auth = {
  register: async (data: { email: string; password: string; name: string; age: number; gender: string }) => {
    // Mock successful registration
    return { token: 'mock-token', user: { ...data, id: '1' } };
  },

  login: async (data: { email: string; password: string }) => {
    // Mock successful login
    return { token: 'mock-token', user: mockUsers[0] };
  },
};

export const users = {
  getProfile: async (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  },

  updateProfile: async (userId: string, data: any) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user, ...data };
  },

  updateTraits: async (userId: string, traits: string[]) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user, traits };
  },

  getCurrentUser: async () => {
    return mockUsers[0];
  },

  getPotentialMatches: async () => {
    return mockUsers.slice(1);
  },

  getMatches: async (userId: string) => {
    return mockMatches;
  },

  getMessages: async (matchId: string) => {
    return mockMessages;
  },

  sendMessage: async (matchId: string, text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      senderId: 'me',
      timestamp: new Date().toISOString(),
      isFromUser: true,
    };
    mockMessages.push(newMessage);
    return newMessage;
  },

  getSuggestion: async (matchId: string) => {
    return {
      suggestion: "How about asking about their favorite travel destination?",
    };
  },
};

export const chat = {
  getSuggestion: async (matchId: string) => {
    return {
      suggestion: "How about asking about their favorite travel destination?",
    };
  },
};

export default api; 
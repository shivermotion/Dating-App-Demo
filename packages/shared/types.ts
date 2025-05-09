export interface User {
  id: number;
  email: string;
  name: string;
  bio: string;
  traits: Trait[];
  interests: string[];
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Trait {
  name: string;
  score: number;
}

export interface Match {
  id: number;
  userA: number;
  userB: number;
  date: Date;
  score: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
  id: number;
  roomId: number;
  senderId: number;
  text: string;
  timestamp: Date;
  sentiment?: number;
  toxicity?: number;
}

export interface OnboardingResponse {
  bio: string;
  traits: Trait[];
  interests: string[];
}

export interface ChatRoom {
  id: number;
  matchId: number;
  participants: number[];
  lastMessage?: Message;
  createdAt: Date;
}

export interface SentimentResponse {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

export interface ToxicityResponse {
  toxic: boolean;
  score: number;
  categories: {
    [key: string]: number;
  };
}

export interface AISuggestion {
  type: 'intro' | 'response';
  text: string;
  confidence: number;
} 
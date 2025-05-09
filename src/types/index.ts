export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profileImage: string;
  traits: string[];
  isOnline: boolean;
}

export interface Match {
  id: string;
  user: User;
  score: number;
  status: 'pending' | 'liked' | 'passed';
  lastMessage?: Message;
  lastMessageTime?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isFromUser: boolean;
  sender?: User;
}

export interface ChatRoom {
  id: string;
  matchId: string;
  participants: User[];
  lastMessage?: Message;
  createdAt: string;
}

export interface OnboardingResponse {
  bio: string;
  traits: string[];
  interests: string[];
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
  type: 'conversation' | 'date' | 'icebreaker';
  text: string;
  confidence: number;
} 
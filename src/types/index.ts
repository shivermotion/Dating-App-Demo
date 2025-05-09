export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  photos: string[];
  personalityTraits: string[];
  location: {
    city: string;
    country: string;
  };
  isOnboarded?: boolean;
}

export interface Match {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  compatibility: number;
  interests: string[];
  personalityTraits: string[];
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "match";
  timestamp: Date;
}

export interface ChatSuggestion {
  id: string;
  text: string;
} 
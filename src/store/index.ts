import { makeAutoObservable } from 'mobx';

export type User = {
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
};

export type Match = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  compatibility: number;
  interests: string[];
  personalityTraits: string[];
};

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'match';
  timestamp: Date;
};

export type ChatSuggestion = {
  id: string;
  text: string;
};

class DatingAppStore {
  user: User | null = null;
  matches: Match[] = [];
  messages: Record<string, Message[]> = {}; // matchId -> messages
  suggestions: Record<string, ChatSuggestion[]> = {}; // matchId -> suggestions
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // User actions
  setUser(user: User) {
    this.user = user;
  }

  updateUserProfile(updates: Partial<User>) {
    if (this.user) {
      this.user = { ...this.user, ...updates };
    }
  }

  // Match actions
  setMatches(matches: Match[]) {
    this.matches = matches;
  }

  addMatch(match: Match) {
    this.matches.push(match);
  }

  // Message actions
  addMessage(matchId: string, message: Message) {
    if (!this.messages[matchId]) {
      this.messages[matchId] = [];
    }
    this.messages[matchId].push(message);
  }

  // Suggestion actions
  setSuggestions(matchId: string, suggestions: ChatSuggestion[]) {
    this.suggestions[matchId] = suggestions;
  }

  // Loading state
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }
}

export const store = new DatingAppStore(); 
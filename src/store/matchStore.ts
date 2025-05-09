import { makeAutoObservable, action } from 'mobx';
import { matchingService } from '../services/matching';
import { chatService } from '../services/chat';
import { users } from '../services/api';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profileImage: string;
  traits: string[];
  isOnline?: boolean;
}

export interface Match {
  id: string;
  user: User;
  isNew: boolean;
  score: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isFromUser: boolean;
  sentiment?: number;
  toxicity?: number;
}

export class MatchStore {
  matches: Match[] = [];
  selectedMatch: Match | null = null;
  messages: Message[] = [];
  isLoading = false;
  error: string | null = null;
  recentMatches: User[] = [];
  chatSuggestions: string[] = [];

  constructor() {
    makeAutoObservable(this, {
      setLoading: action,
      setError: action,
      setMatches: action,
      setMessages: action,
      setSelectedMatch: action,
      setChatSuggestions: action,
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setMatches(matches: Match[]) {
    this.matches = matches;
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setSelectedMatch(match: Match | null) {
    this.selectedMatch = match;
  }

  setChatSuggestions(suggestions: string[]) {
    this.chatSuggestions = suggestions;
  }

  async loadMatches() {
    this.setLoading(true);
    this.setError(null);

    try {
      const matches = await users.getMatches('current-user');
      this.setMatches(matches);
      return matches;
    } catch (error: any) {
      this.setError(error.message || 'Failed to load matches');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  selectMatch(matchId: string) {
    const match = this.matches.find((m) => m.id === matchId);
    if (match) {
      this.setSelectedMatch(match);
      match.isNew = false;
      this.loadMessages(matchId);
      this.loadSuggestions(matchId);
    }
  }

  async loadMessages(matchId: string) {
    this.setLoading(true);
    this.setError(null);

    try {
      const messages = await users.getMessages(matchId);
      this.setMessages(messages);
      return messages;
    } catch (error: any) {
      this.setError(error.message || 'Failed to load messages');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async sendMessage(matchId: string, text: string) {
    try {
      const message = await users.sendMessage(matchId, text);
      this.setMessages([...this.messages, message]);
      
      // Update last message in matches list
      const match = this.matches.find((m) => m.id === matchId);
      if (match) {
        match.lastMessage = text;
        match.lastMessageTime = message.timestamp;
      }

      return message;
    } catch (error: any) {
      this.setError(error.message || 'Failed to send message');
      throw error;
    }
  }

  async loadSuggestions(matchId: string) {
    try {
      const { suggestion } = await users.getSuggestion(matchId);
      this.setChatSuggestions([suggestion]);
      return suggestion;
    } catch (error) {
      console.error('Error loading suggestions:', error);
      this.setChatSuggestions([]);
    }
  }

  reset() {
    this.setMatches([]);
    this.setSelectedMatch(null);
    this.setMessages([]);
    this.setLoading(false);
    this.setError(null);
    this.setChatSuggestions([]);
  }
}

export const matchStore = new MatchStore(); 
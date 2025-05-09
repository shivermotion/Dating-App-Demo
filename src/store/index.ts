import { makeAutoObservable } from 'mobx';
import { authStore } from './authStore';
import { matchStore } from './matchStore';
import { profileStore } from './profileStore';

export type User = {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio?: string;
  profileImage?: string;
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
  users: User[] = [];
  currentUser: User | null = null;
  matches: Match[] = [];
  messages: Record<string, Message[]> = {}; // matchId -> messages
  suggestions: Record<string, ChatSuggestion[]> = {}; // matchId -> suggestions
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUsers(users: User[]) {
    this.users = users;
  }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  // User actions
  setUser(user: User) {
    this.currentUser = user;
  }

  updateUserProfile(updates: Partial<User>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
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

class RootStore {
  auth = authStore;
  match = matchStore;
  profile = profileStore;
  datingApp = new DatingAppStore();

  constructor() {
    // Initialize stores if needed
  }

  async initialize() {
    // Load initial data if user is authenticated
    if (this.auth.isAuthenticated) {
      await Promise.all([
        this.profile.loadProfile(),
        this.match.loadMatches(),
      ]);
    }
  }

  async logout() {
    await this.auth.logout();
    this.profile.clearProfile();
    this.match.clearCurrentMatch();
  }
}

export const rootStore = new RootStore(); 
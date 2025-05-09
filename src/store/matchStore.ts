import { makeAutoObservable, action } from "mobx";
import { apiService } from "../services/api";
import type { Match, Message } from "../types";

class MatchStore {
  matches: Match[] = [];
  selectedMatch: Match | null = null;
  messages: Message[] = [];
  isLoading = false;
  error: string | null = null;
  chatSuggestions: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setLoading = action((loading: boolean) => {
    this.isLoading = loading;
  });

  setError = action((error: string | null) => {
    this.error = error;
  });

  setMatches = action((matches: Match[]) => {
    this.matches = matches;
  });

  setSelectedMatch = action((match: Match | null) => {
    this.selectedMatch = match;
  });

  setMessages = action((messages: Message[]) => {
    this.messages = messages;
  });

  setChatSuggestions = action((suggestions: string[]) => {
    this.chatSuggestions = suggestions;
  });

  loadTodayMatches = action(async () => {
    try {
      this.setLoading(true);
      this.setError(null);
      const matches = await apiService.matches.getToday();
      this.setMatches(matches);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to load matches");
    } finally {
      this.setLoading(false);
    }
  });

  passMatch = action(async (matchId: string) => {
    try {
      this.setLoading(true);
      this.setError(null);
      await apiService.matches.pass(matchId);
      this.setMatches(this.matches.filter(match => match.id !== matchId));
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to pass match");
    } finally {
      this.setLoading(false);
    }
  });

  likeMatch = action(async (matchId: string) => {
    try {
      this.setLoading(true);
      this.setError(null);
      await apiService.matches.like(matchId);
      const updatedMatch = await apiService.matches.getById(matchId);
      this.setMatches(this.matches.map(match => 
        match.id === matchId ? updatedMatch : match
      ));
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to like match");
    } finally {
      this.setLoading(false);
    }
  });

  loadMessages = action(async (matchId: string) => {
    try {
      this.setLoading(true);
      this.setError(null);
      const messages = await apiService.messages.getByMatchId(matchId);
      this.setMessages(messages);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to load messages");
    } finally {
      this.setLoading(false);
    }
  });

  sendMessage = action(async (matchId: string, text: string) => {
    try {
      this.setLoading(true);
      this.setError(null);
      const message = await apiService.messages.send(matchId, text);
      this.setMessages([...this.messages, message]);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      this.setLoading(false);
    }
  });
}

export const matchStore = new MatchStore(); 
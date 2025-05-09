import { makeAutoObservable, action } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, User, users } from '../services/api';

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadStoredAuth();
  }

  private async loadStoredAuth() {
    try {
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
      ]);

      if (token && userStr) {
        this.setAuth(token, JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  }

  @action
  private setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  @action
  private setError(error: string | null) {
    this.error = error;
  }

  @action
  private setAuth(token: string, user: User) {
    this.token = token;
    this.user = user;
  }

  async register(data: { email: string; password: string; name: string; age: number; gender: string }) {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await auth.register(data);
      await this.setAuth(response.token, response.user);
      await Promise.all([
        AsyncStorage.setItem('token', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
      ]);
    } catch (error: any) {
      this.setError(error.response?.data?.error || 'Registration failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async login(data: { email: string; password: string }) {
    this.setLoading(true);
    this.setError(null);

    try {
      const response = await auth.login(data);
      await this.setAuth(response.token, response.user);
      await Promise.all([
        AsyncStorage.setItem('token', response.token),
        AsyncStorage.setItem('user', JSON.stringify(response.user)),
      ]);
    } catch (error: any) {
      this.setError(error.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async updateUser(data: Partial<User>) {
    this.setLoading(true);
    this.setError(null);

    try {
      if (!this.user) throw new Error('No user logged in');
      const updatedUser = await users.updateProfile(this.user.id, data);
      this.setAuth(this.token!, { ...this.user, ...updatedUser });
      await AsyncStorage.setItem('user', JSON.stringify(this.user));
    } catch (error: any) {
      this.setError(error.response?.data?.error || 'Profile update failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  @action
  async logout() {
    this.token = null;
    this.user = null;
    await Promise.all([
      AsyncStorage.removeItem('token'),
      AsyncStorage.removeItem('user'),
    ]);
  }

  get isAuthenticated() {
    return !!this.token && !!this.user;
  }
}

export const authStore = new AuthStore(); 
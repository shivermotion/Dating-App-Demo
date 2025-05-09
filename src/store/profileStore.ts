import { makeAutoObservable } from 'mobx';
import { User, users } from '../services/api';
import { authStore } from './authStore';

class ProfileStore {
  profile: User | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadProfile() {
    if (!authStore.user?.id) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.profile = await users.getProfile(authStore.user.id);
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Failed to load profile';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(data: Partial<User>) {
    if (!authStore.user?.id) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.profile = await users.updateProfile(authStore.user.id, data);
      // Update auth store user data
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...data };
      }
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Failed to update profile';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async updateTraits(traits: string) {
    if (!authStore.user?.id) return;

    this.isLoading = true;
    this.error = null;

    try {
      this.profile = await users.updateTraits(authStore.user.id, traits);
      // Update auth store user data
      if (authStore.user) {
        authStore.user = { ...authStore.user, traits: traits.split(',') };
      }
    } catch (error: any) {
      this.error = error.response?.data?.error || 'Failed to update traits';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  clearProfile() {
    this.profile = null;
  }
}

export const profileStore = new ProfileStore(); 
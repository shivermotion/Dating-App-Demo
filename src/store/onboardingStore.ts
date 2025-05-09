import { makeAutoObservable } from 'mobx';
import { onboardingService } from '../services/onboarding';
import { authStore } from './authStore';
import { users } from '../services/api';

export interface OnboardingQuestion {
  id: string;
  question: string;
  placeholder: string;
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'interests',
    question: 'What are your main interests and hobbies?',
    placeholder: 'e.g., hiking, photography, cooking...',
  },
  {
    id: 'personality',
    question: 'How would you describe your personality?',
    placeholder: 'e.g., outgoing, creative, thoughtful...',
  },
  {
    id: 'values',
    question: 'What values are most important to you?',
    placeholder: 'e.g., honesty, ambition, family...',
  },
  {
    id: 'goals',
    question: 'What are you looking for in a relationship?',
    placeholder: 'e.g., long-term commitment, friendship...',
  },
  {
    id: 'lifestyle',
    question: 'Describe your ideal lifestyle',
    placeholder: 'e.g., active, balanced, adventurous...',
  },
];

export class OnboardingStore {
  currentStep = 0;
  answers: Record<string, string> = {};
  isLoading = false;
  error: string | null = null;
  generatedBio: string | null = null;
  generatedTraits: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get currentQuestion() {
    return ONBOARDING_QUESTIONS[this.currentStep];
  }

  get isLastStep() {
    return this.currentStep === ONBOARDING_QUESTIONS.length - 1;
  }

  get progress() {
    return (this.currentStep / ONBOARDING_QUESTIONS.length) * 100;
  }

  setAnswer(questionId: string, answer: string) {
    this.answers[questionId] = answer;
  }

  nextStep() {
    if (this.currentStep < ONBOARDING_QUESTIONS.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async generateProfile() {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await onboardingService.processOnboarding(this.answers);
      this.generatedBio = result.bio;
      this.generatedTraits = result.traits;

      // Update user profile with generated content
      if (authStore.user?.id) {
        await users.updateProfile(authStore.user.id, {
          bio: result.bio,
          traits: result.traits,
        });
      }

      return result;
    } catch (error: any) {
      this.error = error.message || 'Failed to generate profile';
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  reset() {
    this.currentStep = 0;
    this.answers = {};
    this.isLoading = false;
    this.error = null;
    this.generatedBio = null;
    this.generatedTraits = [];
  }
}

export const onboardingStore = new OnboardingStore(); 
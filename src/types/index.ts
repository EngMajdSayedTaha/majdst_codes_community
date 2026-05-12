// Type definitions for majdst.codes application

export interface DevCard {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningTime: string;
  icon: string;
  topics: string[];
  link?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  featured?: boolean;
  week?: number;
  date?: string;
  status?: 'upcoming' | 'active' | 'completed';
  link?: string;
}

export interface MemeCard {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  likes?: number;
}

export interface Stat {
  label: string;
  value: string | number;
  icon?: string;
}

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  preferences?: string[];
}

export interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean; // Always true
  timestamp: number;
  version: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type SectionId = 
  | 'home' 
  | 'dev-cards' 
  | 'challenges' 
  | 'meme-lab' 
  | 'about' 
  | 'newsletter';
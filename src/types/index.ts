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
  funFact?: string;
  tagKey?: string;
  savesCount?: number;
  isPublished?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
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
  tags?: string[];
  language?: string;
  /** Buggy / starter code the participant must fix or extend */
  codeSnippet?: string;
  winnerHandle?: string;
  startDate?: string;
  endDate?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemeCard {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  likes?: number;
  likeCount?: number;
  isPublished?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  githubUsername?: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
  skills: string[];
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  handle: string;
  solution: string;
  language: string;
  status: 'pending' | 'reviewed' | 'winner';
  adminNotes?: string;
  submittedAt: string;
}

export interface SiteStat {
  id: string;
  label: string;
  value: string;
  icon?: string;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface AboutProfile {
  id: string;
  name: string;
  bio: string;
  bioExtended?: string;
  yearsExperience: string;
  projectsBuilt: string;
  mentoredDevs: string;
  avatarUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  updatedAt: string;
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
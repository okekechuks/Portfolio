export type Proficiency = "Beginner" | "Intermediate" | "Advanced";

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Tools";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  enabled: boolean;
  learning: boolean;
  proficiency: Proficiency;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
  featured: boolean;
  enabled: boolean;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies: string[];
  enabled: boolean;
  order: number;
}

export type SocialPlatform =
  | "email"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "twitter"
  | "website";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  name: string;
  title: string;
  introduction: string;
  profileImage: string;
  resumeUrl: string;
  accentColor: string;
  darkMode: boolean;
}

export interface AdminSettings extends SiteSettings {
  adminPassword: string;
  adminPhone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: number | null;
}

export type StorageKey =
  | "portfolio_skills"
  | "portfolio_projects"
  | "portfolio_experience"
  | "portfolio_socials"
  | "portfolio_settings"
  | "portfolio_session";

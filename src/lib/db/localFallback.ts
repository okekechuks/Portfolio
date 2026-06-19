import { isSupabaseConfigured } from "@/lib/supabase/server";
import {
  defaultExperience,
  defaultProjects,
  defaultSettings,
  defaultSocials,
  getDefaultSkills,
} from "@/data/defaults";
import type { Experience, Project, SiteSettings, Skill, SocialLink } from "@/types";
import { getFromStorage, setInStorage } from "@/lib/storage";

const KEYS = {
  skills: "portfolio_skills" as const,
  projects: "portfolio_projects" as const,
  experience: "portfolio_experience" as const,
  socials: "portfolio_socials" as const,
  settings: "portfolio_settings" as const,
};

export function useApiBackend(): boolean {
  return isSupabaseConfigured();
}

export function localGetSkills(): Skill[] {
  return getFromStorage(KEYS.skills, getDefaultSkills());
}

export function localSetSkills(skills: Skill[]): void {
  setInStorage(KEYS.skills, skills);
}

export function localGetProjects(): Project[] {
  return getFromStorage(KEYS.projects, defaultProjects);
}

export function localSetProjects(projects: Project[]): void {
  setInStorage(KEYS.projects, projects);
}

export function localGetExperience(): Experience[] {
  return getFromStorage(KEYS.experience, defaultExperience);
}

export function localSetExperience(items: Experience[]): void {
  setInStorage(KEYS.experience, items);
}

export function localGetSocials(): SocialLink[] {
  return getFromStorage(KEYS.socials, defaultSocials);
}

export function localSetSocials(socials: SocialLink[]): void {
  setInStorage(KEYS.socials, socials);
}

export function localGetSettings(): SiteSettings {
  const settings = getFromStorage(KEYS.settings, defaultSettings);
  if (settings.adminPassword === "admin123") {
    return { ...settings, adminPassword: defaultSettings.adminPassword };
  }
  return settings;
}

export function localSetSettings(settings: SiteSettings): void {
  setInStorage(KEYS.settings, settings);
}

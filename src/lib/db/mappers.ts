import type {
  AdminSettings,
  Experience,
  Project,
  SiteSettings,
  Skill,
  SocialLink,
} from "@/types";

export function mapSkill(row: Record<string, unknown>): Skill {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Skill["category"],
    enabled: row.enabled as boolean,
    learning: row.learning as boolean,
    proficiency: row.proficiency as Skill["proficiency"],
  };
}

export function mapProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    image: row.image as string,
    githubUrl: row.github_url as string,
    liveUrl: row.live_url as string,
    techStack: (row.tech_stack as string[]) ?? [],
    featured: row.featured as boolean,
    enabled: row.enabled as boolean,
    order: row.sort_order as number,
  };
}

export function mapExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    company: row.company as string,
    role: row.role as string,
    duration: row.duration as string,
    description: row.description as string,
    technologies: (row.technologies as string[]) ?? [],
    enabled: row.enabled as boolean,
    order: row.sort_order as number,
  };
}

export function mapSocial(row: Record<string, unknown>): SocialLink {
  return {
    id: row.id as string,
    platform: row.platform as SocialLink["platform"],
    label: row.label as string,
    url: row.url as string,
    enabled: row.enabled as boolean,
  };
}

export function mapSettings(row: Record<string, unknown>): AdminSettings {
  return {
    name: row.name as string,
    title: row.title as string,
    introduction: row.introduction as string,
    profileImage: row.profile_image as string,
    resumeUrl: row.resume_url as string,
    accentColor: row.accent_color as string,
    darkMode: row.dark_mode as boolean,
    adminPassword: row.admin_password as string,
    adminPhone: row.admin_phone as string,
  };
}

export function stripSensitiveSettings(settings: AdminSettings): SiteSettings {
  const publicSettings = { ...settings } as Partial<AdminSettings>;
  delete publicSettings.adminPassword;
  delete publicSettings.adminPhone;
  return publicSettings as SiteSettings;
}

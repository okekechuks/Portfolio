import { getDefaultSkills } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { Skill } from "@/types";

const STORAGE_KEY = "portfolio_skills" as const;

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    return getFromStorage<Skill[]>(STORAGE_KEY, getDefaultSkills());
  },

  async getEnabled(): Promise<Skill[]> {
    const skills = await this.getAll();
    return skills.filter((skill) => skill.enabled);
  },

  async getByCategory(category: string): Promise<Skill[]> {
    const skills = await this.getEnabled();
    return skills.filter((skill) => skill.category === category);
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
    const skills = await this.getAll();
    const index = skills.findIndex((s) => s.id === id);

    if (index === -1) return null;

    skills[index] = { ...skills[index], ...updates };
    setInStorage(STORAGE_KEY, skills);
    return skills[index];
  },

  async updateSkills(updatedSkills: Skill[]): Promise<Skill[]> {
    setInStorage(STORAGE_KEY, updatedSkills);
    return updatedSkills;
  },

  async toggleEnabled(id: string): Promise<Skill | null> {
    const skills = await this.getAll();
    const skill = skills.find((s) => s.id === id);
    if (!skill) return null;
    return this.updateSkill(id, { enabled: !skill.enabled });
  },
};

import { defaultExperience } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { Experience } from "@/types";
import { generateId } from "@/utils/generateId";

const STORAGE_KEY = "portfolio_experience" as const;

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    const items = getFromStorage<Experience[]>(STORAGE_KEY, defaultExperience);
    return [...items].sort((a, b) => a.order - b.order);
  },

  async getEnabled(): Promise<Experience[]> {
    const items = await this.getAll();
    return items.filter((e) => e.enabled);
  },

  async getById(id: string): Promise<Experience | null> {
    const items = await this.getAll();
    return items.find((e) => e.id === id) ?? null;
  },

  async create(data: Omit<Experience, "id">): Promise<Experience> {
    const items = await this.getAll();
    const experience: Experience = { ...data, id: generateId("exp") };
    items.push(experience);
    setInStorage(STORAGE_KEY, items);
    return experience;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience | null> {
    const items = await this.getAll();
    const index = items.findIndex((e) => e.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    setInStorage(STORAGE_KEY, items);
    return items[index];
  },

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const filtered = items.filter((e) => e.id !== id);
    if (filtered.length === items.length) return false;
    setInStorage(STORAGE_KEY, filtered);
    return true;
  },

  async toggleEnabled(id: string): Promise<Experience | null> {
    const item = await this.getById(id);
    if (!item) return null;
    return this.update(id, { enabled: !item.enabled });
  },
};

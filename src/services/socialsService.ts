import { defaultSocials } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { SocialLink } from "@/types";

const STORAGE_KEY = "portfolio_socials" as const;

export const socialsService = {
  async getAll(): Promise<SocialLink[]> {
    return getFromStorage<SocialLink[]>(STORAGE_KEY, defaultSocials);
  },

  async getEnabled(): Promise<SocialLink[]> {
    const socials = await this.getAll();
    return socials.filter((s) => s.enabled);
  },

  async update(id: string, updates: Partial<SocialLink>): Promise<SocialLink | null> {
    const socials = await this.getAll();
    const index = socials.findIndex((s) => s.id === id);
    if (index === -1) return null;

    socials[index] = { ...socials[index], ...updates };
    setInStorage(STORAGE_KEY, socials);
    return socials[index];
  },

  async updateAll(updatedSocials: SocialLink[]): Promise<SocialLink[]> {
    setInStorage(STORAGE_KEY, updatedSocials);
    return updatedSocials;
  },

  async toggleEnabled(id: string): Promise<SocialLink | null> {
    const social = (await this.getAll()).find((s) => s.id === id);
    if (!social) return null;
    return this.update(id, { enabled: !social.enabled });
  },
};

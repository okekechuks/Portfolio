import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { localGetSocials, localSetSocials } from "@/lib/db/localFallback";
import type { SocialLink } from "@/types";

export const socialsService = {
  async getAll(): Promise<SocialLink[]> {
    if (!isRemoteStorageEnabled()) return localGetSocials();
    return apiFetch<SocialLink[]>("/api/socials?all=true", { auth: true });
  },

  async getEnabled(): Promise<SocialLink[]> {
    if (!isRemoteStorageEnabled()) {
      return localGetSocials().filter((s) => s.enabled);
    }
    return apiFetch<SocialLink[]>("/api/socials");
  },

  async update(id: string, updates: Partial<SocialLink>): Promise<SocialLink | null> {
    const socials = await this.getAll();
    const index = socials.findIndex((s) => s.id === id);
    if (index === -1) return null;
    socials[index] = { ...socials[index], ...updates };
    const updated = await this.updateAll(socials);
    return updated.find((s) => s.id === id) ?? null;
  },

  async updateAll(updatedSocials: SocialLink[]): Promise<SocialLink[]> {
    if (!isRemoteStorageEnabled()) {
      localSetSocials(updatedSocials);
      return updatedSocials;
    }
    return apiFetch<SocialLink[]>("/api/socials", {
      method: "PUT",
      body: updatedSocials,
      auth: true,
    });
  },

  async toggleEnabled(id: string): Promise<SocialLink | null> {
    const social = (await this.getAll()).find((s) => s.id === id);
    if (!social) return null;
    return this.update(id, { enabled: !social.enabled });
  },
};

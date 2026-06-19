import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { localGetExperience, localSetExperience } from "@/lib/db/localFallback";
import { generateId } from "@/utils/generateId";
import type { Experience } from "@/types";

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    if (!isRemoteStorageEnabled()) {
      return [...localGetExperience()].sort((a, b) => a.order - b.order);
    }
    return apiFetch<Experience[]>("/api/experience?all=true", { auth: true });
  },

  async getEnabled(): Promise<Experience[]> {
    if (!isRemoteStorageEnabled()) {
      return localGetExperience().filter((e) => e.enabled).sort((a, b) => a.order - b.order);
    }
    return apiFetch<Experience[]>("/api/experience");
  },

  async getById(id: string): Promise<Experience | null> {
    const items = await this.getAll();
    return items.find((e) => e.id === id) ?? null;
  },

  async create(data: Omit<Experience, "id">): Promise<Experience> {
    if (!isRemoteStorageEnabled()) {
      const items = localGetExperience();
      const experience: Experience = { ...data, id: generateId("exp") };
      items.push(experience);
      localSetExperience(items);
      return experience;
    }
    return apiFetch<Experience>("/api/experience", {
      method: "POST",
      body: data,
      auth: true,
    });
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience | null> {
    if (!isRemoteStorageEnabled()) {
      const items = localGetExperience();
      const index = items.findIndex((e) => e.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...updates };
      localSetExperience(items);
      return items[index];
    }

    try {
      return await apiFetch<Experience>(`/api/experience/${id}`, {
        method: "PATCH",
        body: updates,
        auth: true,
      });
    } catch {
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    if (!isRemoteStorageEnabled()) {
      const items = localGetExperience();
      const filtered = items.filter((e) => e.id !== id);
      if (filtered.length === items.length) return false;
      localSetExperience(filtered);
      return true;
    }

    try {
      await apiFetch(`/api/experience/${id}`, { method: "DELETE", auth: true });
      return true;
    } catch {
      return false;
    }
  },

  async toggleEnabled(id: string): Promise<Experience | null> {
    const item = await this.getById(id);
    if (!item) return null;
    return this.update(id, { enabled: !item.enabled });
  },
};

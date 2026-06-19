import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { localGetSkills, localSetSkills } from "@/lib/db/localFallback";
import type { Skill } from "@/types";

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    if (!isRemoteStorageEnabled()) return localGetSkills();
    return apiFetch<Skill[]>("/api/skills?all=true", { auth: true });
  },

  async getEnabled(): Promise<Skill[]> {
    if (!isRemoteStorageEnabled()) {
      return localGetSkills().filter((s) => s.enabled);
    }
    return apiFetch<Skill[]>("/api/skills");
  },

  async getByCategory(category: string): Promise<Skill[]> {
    const skills = await this.getEnabled();
    return skills.filter((skill) => skill.category === category);
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
    if (!isRemoteStorageEnabled()) {
      const skills = localGetSkills();
      const index = skills.findIndex((s) => s.id === id);
      if (index === -1) return null;
      skills[index] = { ...skills[index], ...updates };
      localSetSkills(skills);
      return skills[index];
    }

    try {
      return await apiFetch<Skill>(`/api/skills/${id}`, {
        method: "PATCH",
        body: updates,
        auth: true,
      });
    } catch {
      return null;
    }
  },

  async updateSkills(updatedSkills: Skill[]): Promise<Skill[]> {
    if (!isRemoteStorageEnabled()) {
      localSetSkills(updatedSkills);
      return updatedSkills;
    }
    return apiFetch<Skill[]>("/api/skills", {
      method: "PUT",
      body: updatedSkills,
      auth: true,
    });
  },

  async toggleEnabled(id: string): Promise<Skill | null> {
    const skills = await this.getAll();
    const skill = skills.find((s) => s.id === id);
    if (!skill) return null;
    return this.updateSkill(id, { enabled: !skill.enabled });
  },
};

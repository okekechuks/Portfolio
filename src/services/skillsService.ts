import { ApiError, apiFetch } from "@/lib/api/client";
import { localGetSkills, localSetSkills } from "@/lib/db/localFallback";
import type { Skill } from "@/types";

export const skillsService = {
  async getAll(): Promise<Skill[]> {
    try {
      return await apiFetch<Skill[]>("/api/skills?all=true", { auth: true });
    } catch {
      return localGetSkills();
    }
  },

  async getEnabled(): Promise<Skill[]> {
    try {
      return await apiFetch<Skill[]>("/api/skills");
    } catch {
      return localGetSkills().filter((s) => s.enabled);
    }
  },

  async getByCategory(category: string): Promise<Skill[]> {
    const skills = await this.getEnabled();
    return skills.filter((skill) => skill.category === category);
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill | null> {
    try {
      return await apiFetch<Skill>(`/api/skills/${id}`, {
        method: "PATCH",
        body: updates,
        auth: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status !== 503) {
        return null;
      }

      const skills = localGetSkills();
      const index = skills.findIndex((s) => s.id === id);
      if (index === -1) return null;
      skills[index] = { ...skills[index], ...updates };
      localSetSkills(skills);
      return skills[index];
    }
  },

  async updateSkills(updatedSkills: Skill[]): Promise<Skill[]> {
    try {
      return await apiFetch<Skill[]>("/api/skills", {
        method: "PUT",
        body: updatedSkills,
        auth: true,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status !== 503) {
        throw error;
      }

      localSetSkills(updatedSkills);
      return updatedSkills;
    }
  },

  async toggleEnabled(id: string): Promise<Skill | null> {
    const skills = await skillsService.getAll();
    const skill = skills.find((s) => s.id === id);
    if (!skill) return null;
    return skillsService.updateSkill(id, { enabled: !skill.enabled });
  },
};

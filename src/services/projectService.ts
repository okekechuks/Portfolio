import { apiFetch } from "@/lib/api/client";
import { isRemoteStorageEnabled } from "@/lib/config";
import { localGetProjects, localSetProjects } from "@/lib/db/localFallback";
import { generateId } from "@/utils/generateId";
import type { Project } from "@/types";

export const projectService = {
  async getAll(): Promise<Project[]> {
    if (!isRemoteStorageEnabled()) {
      return [...localGetProjects()].sort((a, b) => a.order - b.order);
    }
    return apiFetch<Project[]>("/api/projects?all=true", { auth: true });
  },

  async getEnabled(): Promise<Project[]> {
    if (!isRemoteStorageEnabled()) {
      return localGetProjects().filter((p) => p.enabled).sort((a, b) => a.order - b.order);
    }
    return apiFetch<Project[]>("/api/projects");
  },

  async getFeatured(): Promise<Project[]> {
    const projects = await this.getEnabled();
    return projects.filter((p) => p.featured);
  },

  async getById(id: string): Promise<Project | null> {
    const projects = await projectService.getAll();
    return projects.find((p) => p.id === id) ?? null;
  },

  async create(data: Omit<Project, "id">): Promise<Project> {
    if (!isRemoteStorageEnabled()) {
      const projects = localGetProjects();
      const project: Project = { ...data, id: generateId("proj") };
      projects.push(project);
      localSetProjects(projects);
      return project;
    }
    return apiFetch<Project>("/api/projects", {
      method: "POST",
      body: data,
      auth: true,
    });
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (!isRemoteStorageEnabled()) {
      const projects = localGetProjects();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return null;
      projects[index] = { ...projects[index], ...updates };
      localSetProjects(projects);
      return projects[index];
    }

    try {
      return await apiFetch<Project>(`/api/projects/${id}`, {
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
      const projects = localGetProjects();
      const filtered = projects.filter((p) => p.id !== id);
      if (filtered.length === projects.length) return false;
      localSetProjects(filtered);
      return true;
    }

    try {
      await apiFetch(`/api/projects/${id}`, { method: "DELETE", auth: true });
      return true;
    } catch {
      return false;
    }
  },

  async toggleEnabled(id: string): Promise<Project | null> {
    const project = await projectService.getById(id);
    if (!project) return null;
    return projectService.update(id, { enabled: !project.enabled });
  },
};

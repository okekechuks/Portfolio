import { defaultProjects } from "@/data/defaults";
import { getFromStorage, setInStorage } from "@/lib/storage";
import type { Project } from "@/types";
import { generateId } from "@/utils/generateId";

const STORAGE_KEY = "portfolio_projects" as const;

export const projectService = {
  async getAll(): Promise<Project[]> {
    const projects = getFromStorage<Project[]>(STORAGE_KEY, defaultProjects);
    return [...projects].sort((a, b) => a.order - b.order);
  },

  async getEnabled(): Promise<Project[]> {
    const projects = await this.getAll();
    return projects.filter((p) => p.enabled);
  },

  async getFeatured(): Promise<Project[]> {
    const projects = await this.getEnabled();
    return projects.filter((p) => p.featured);
  },

  async getById(id: string): Promise<Project | null> {
    const projects = await this.getAll();
    return projects.find((p) => p.id === id) ?? null;
  },

  async create(data: Omit<Project, "id">): Promise<Project> {
    const projects = await this.getAll();
    const project: Project = { ...data, id: generateId("proj") };
    projects.push(project);
    setInStorage(STORAGE_KEY, projects);
    return project;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const projects = await this.getAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    setInStorage(STORAGE_KEY, projects);
    return projects[index];
  },

  async delete(id: string): Promise<boolean> {
    const projects = await this.getAll();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;
    setInStorage(STORAGE_KEY, filtered);
    return true;
  },

  async toggleEnabled(id: string): Promise<Project | null> {
    const project = await this.getById(id);
    if (!project) return null;
    return this.update(id, { enabled: !project.enabled });
  },
};

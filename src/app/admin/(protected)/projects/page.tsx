"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: "/images/project-placeholder.svg",
  githubUrl: "",
  liveUrl: "",
  techStack: [],
  featured: false,
  enabled: true,
  order: 0,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [techInput, setTechInput] = useState("");

  const loadProjects = async () => {
    setProjects(await projectService.getAll());
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreate = () => {
    setEditingProject(null);
    setForm({ ...emptyProject, order: projects.length + 1 });
    setTechInput("");
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      techStack: project.techStack,
      featured: project.featured,
      enabled: project.enabled,
      order: project.order,
    });
    setTechInput(project.techStack.join(", "));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const techStack = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = { ...form, techStack };

    if (editingProject) {
      await projectService.update(editingProject.id, data);
    } else {
      await projectService.create(data);
    }

    setIsModalOpen(false);
    await loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this project?")) {
      await projectService.delete(id);
      await loadProjects();
    }
  };

  const toggleEnabled = async (id: string) => {
    await projectService.toggleEnabled(id);
    await loadProjects();
  };

  return (
    <>
      <AdminNavbar title="Projects Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate}>
            <Plus size={18} />
            Add Project
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium text-zinc-100">
                  {project.title}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline">+{project.techStack.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {project.featured ? (
                    <Badge variant="accent">Yes</Badge>
                  ) : (
                    <span className="text-zinc-500">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <button onClick={() => toggleEnabled(project.id)}>
                    {project.enabled ? (
                      <Eye size={18} className="text-green-400" />
                    ) : (
                      <EyeOff size={18} className="text-zinc-500" />
                    )}
                  </button>
                </TableCell>
                <TableCell>{project.order}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(project)}
                      className="text-zinc-400 hover:text-[var(--accent)]"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? "Edit Project" : "Create Project"}
          className="max-w-2xl"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <ImageUploadField
              label="Project Image"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
              folder="projects"
              previewAlt={form.title || "Project image"}
              fallbackSrc="/images/project-placeholder.svg"
              helperText="Upload a project thumbnail. We’ll store it in Supabase and keep the URL for the card."
            />
            <Input
              label="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
            <Input
              label="Live URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            />
            <Input
              label="Tech Stack (comma-separated)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Next.js"
            />
            <Input
              label="Display Order"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: parseInt(e.target.value) || 0 })
              }
            />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-zinc-600"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  className="rounded border-zinc-600"
                />
                Enabled
              </label>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

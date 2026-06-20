"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { experienceService } from "@/services/experienceService";
import type { Experience } from "@/types";

const emptyExperience: Omit<Experience, "id"> = {
  company: "",
  role: "",
  duration: "",
  description: "",
  technologies: [],
  enabled: true,
  order: 0,
};

export default function ExperienceAdminPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(emptyExperience);
  const [techInput, setTechInput] = useState("");

  const load = async () => {
    setItems(await experienceService.getAll());
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyExperience, order: items.length + 1 });
    setTechInput("");
    setIsModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      company: item.company,
      role: item.role,
      duration: item.duration,
      description: item.description,
      technologies: item.technologies,
      enabled: item.enabled,
      order: item.order,
    });
    setTechInput(item.technologies.join(", "));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = { ...form, technologies };

    if (editing) {
      await experienceService.update(editing.id, data);
    } else {
      await experienceService.create(data);
    }

    setIsModalOpen(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this experience entry?")) {
      await experienceService.delete(id);
      await load();
    }
  };

  return (
    <>
      <AdminNavbar title="Experience Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate}>
            <Plus size={18} />
            Add Experience
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-zinc-100">
                  {item.role}
                </TableCell>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>
                  <button onClick={async () => { await experienceService.toggleEnabled(item.id); await load(); }}>
                    {item.enabled ? (
                      <Eye size={18} className="text-green-400" />
                    ) : (
                      <EyeOff size={18} className="text-zinc-500" />
                    )}
                  </button>
                </TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-zinc-400 hover:text-[var(--accent)]">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-zinc-400 hover:text-red-400">
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
          title={editing ? "Edit Experience" : "Add Experience"}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <Input label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="YYYY - YYYY/present" />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="Technologies (comma-separated)" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
            <Input label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="rounded border-zinc-600" />
              Enabled
            </label>
            <Button onClick={handleSave} className="w-full">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

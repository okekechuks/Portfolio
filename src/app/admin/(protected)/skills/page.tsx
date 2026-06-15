"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Badge } from "@/components/ui/Badge";
import { skillsService } from "@/services/skillsService";
import type { Skill, SkillCategory, Proficiency } from "@/types";
import { cn } from "@/utils/cn";

const CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Tools",
];

const PROFICIENCIES: Proficiency[] = ["Beginner", "Intermediate", "Advanced"];

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSkills = async () => {
    const data = await skillsService.getAll();
    setSkills(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    await skillsService.updateSkill(id, updates);
    await loadSkills();
  };

  const grouped = CATEGORIES.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  }));

  if (isLoading) {
    return (
      <>
        <AdminNavbar title="Skills Management" />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar title="Skills Management" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {grouped.map(({ category, skills: categorySkills }) => (
          <div key={category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              {category}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    skill.enabled
                      ? "border-[var(--accent)]/30 bg-[var(--accent)]/5"
                      : "border-zinc-800 bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-100">{skill.name}</span>
                    {skill.learning && <Badge variant="learning">Learning</Badge>}
                  </div>

                  <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={skill.enabled}
                        onChange={() =>
                          updateSkill(skill.id, { enabled: !skill.enabled })
                        }
                        className="rounded border-zinc-600 bg-zinc-800 text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Enabled
                    </label>

                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={skill.learning}
                        onChange={() =>
                          updateSkill(skill.id, { learning: !skill.learning })
                        }
                        className="rounded border-zinc-600 bg-zinc-800 text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Learning
                    </label>

                    <select
                      value={skill.proficiency}
                      onChange={(e) =>
                        updateSkill(skill.id, {
                          proficiency: e.target.value as Proficiency,
                        })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 focus:border-[var(--accent)] focus:outline-none"
                    >
                      {PROFICIENCIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

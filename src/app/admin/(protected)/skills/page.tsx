"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Badge } from "@/components/ui/Badge";
import { skillsService } from "@/services/skillsService";
import { getDefaultSkills } from "@/data/defaults";
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
  const [savedSkills, setSavedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      const data = await skillsService.getAll();
      const resolvedSkills = data.length > 0 ? data : getDefaultSkills();

      setSkills(resolvedSkills);
      setSavedSkills(resolvedSkills);

      if (data.length === 0) {
        await skillsService.updateSkills(resolvedSkills);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSaveMessage(null);
    setSkills((currentSkills) =>
      currentSkills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      )
    );
  };

  const hasChanges = skills.some((skill, index) => {
    const original = savedSkills[index];
    return (
      !original ||
      original.enabled !== skill.enabled ||
      original.learning !== skill.learning ||
      original.proficiency !== skill.proficiency
    );
  }) || skills.length !== savedSkills.length;

  const applyChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      await skillsService.updateSkills(skills);
      await loadSkills();
      setSaveMessage("Changes applied.");
    } catch {
      setSkills(savedSkills);
      setSaveError("Unable to save changes. Please check your session and try again.");
    } finally {
      setIsSaving(false);
    }
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
                        onChange={() => updateSkill(skill.id, { enabled: !skill.enabled })}
                        className="rounded border-zinc-600 bg-zinc-800 text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Enabled
                    </label>

                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={skill.learning}
                        onChange={() => updateSkill(skill.id, { learning: !skill.learning })}
                        className="rounded border-zinc-600 bg-zinc-800 text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Learning
                    </label>

                    <select
                      value={skill.proficiency}
                      onChange={(e) => updateSkill(skill.id, { proficiency: e.target.value as Proficiency })}
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

        <div className="sticky bottom-0 mt-6 border-t border-zinc-800 bg-zinc-950/95 pt-4">
          <button
            type="button"
            onClick={applyChanges}
            disabled={!hasChanges || isSaving}
            className={cn(
              "w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              hasChanges && !isSaving
                ? "bg-[var(--accent)] text-white hover:opacity-90"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            )}
          >
            {isSaving ? "Applying..." : "Apply Changes"}
          </button>
          {saveMessage && (
            <p className="mt-2 text-sm text-green-400">{saveMessage}</p>
          )}
          {saveError && <p className="mt-2 text-sm text-red-400">{saveError}</p>}
        </div>
      </div>
    </>
  );
}

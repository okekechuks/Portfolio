"use client";

import { useEffect, useState } from "react";
import { Code2, FolderKanban, Briefcase, Eye } from "lucide-react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminCard } from "@/components/admin/AdminCard";
import { skillsService } from "@/services/skillsService";
import { projectService } from "@/services/projectService";
import { experienceService } from "@/services/experienceService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    enabledSkills: 0,
    totalSkills: 0,
    enabledProjects: 0,
    totalProjects: 0,
    enabledExperience: 0,
    totalExperience: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const [allSkills, allProjects, allExperience] = await Promise.all([
        skillsService.getAll(),
        projectService.getAll(),
        experienceService.getAll(),
      ]);

      setStats({
        enabledSkills: allSkills.filter((s) => s.enabled).length,
        totalSkills: allSkills.length,
        enabledProjects: allProjects.filter((p) => p.enabled).length,
        totalProjects: allProjects.length,
        enabledExperience: allExperience.filter((e) => e.enabled).length,
        totalExperience: allExperience.length,
      });
    };

    loadStats();
  }, []);

  return (
    <>
      <AdminNavbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AdminCard
            title="Skills"
            value={stats.enabledSkills}
            description={`${stats.totalSkills} total in master list`}
            icon={<Code2 size={20} />}
          />
          <AdminCard
            title="Projects"
            value={stats.enabledProjects}
            description={`${stats.totalProjects} total projects`}
            icon={<FolderKanban size={20} />}
          />
          <AdminCard
            title="Experience"
            value={stats.enabledExperience}
            description={`${stats.totalExperience} total entries`}
            icon={<Briefcase size={20} />}
          />
          <AdminCard
            title="Portfolio"
            value="Live"
            description="Changes sync automatically"
            icon={<Eye size={20} />}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-zinc-100">Quick Start</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Use the sidebar to manage your portfolio content. Enable skills, add projects,
            update experience, and configure social links. All changes are saved locally
            and reflected on the public site instantly.
          </p>
        </div>
      </div>
    </>
  );
}

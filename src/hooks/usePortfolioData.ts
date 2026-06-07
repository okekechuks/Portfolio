"use client";

import { useEffect, useState } from "react";
import { skillsService } from "@/services/skillsService";
import { projectService } from "@/services/projectService";
import { experienceService } from "@/services/experienceService";
import { socialsService } from "@/services/socialsService";
import { settingsService } from "@/services/settingsService";
import { subscribeToStorage } from "@/lib/storage";
import type { Experience, Project, Skill, SocialLink, SiteSettings } from "@/types";

export function usePortfolioData() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    const [skillsData, projectsData, experienceData, socialsData, settingsData] =
      await Promise.all([
        skillsService.getEnabled(),
        projectService.getEnabled(),
        experienceService.getEnabled(),
        socialsService.getEnabled(),
        settingsService.getSettings(),
      ]);

    setSkills(skillsData);
    setProjects(projectsData);
    setExperience(experienceData);
    setSocials(socialsData);
    setSettings(settingsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    const unsubscribers = [
      subscribeToStorage<Skill[]>("portfolio_skills", async () => {
        setSkills(await skillsService.getEnabled());
      }),
      subscribeToStorage<Project[]>("portfolio_projects", async () => {
        setProjects(await projectService.getEnabled());
      }),
      subscribeToStorage<Experience[]>("portfolio_experience", async () => {
        setExperience(await experienceService.getEnabled());
      }),
      subscribeToStorage<SocialLink[]>("portfolio_socials", async () => {
        setSocials(await socialsService.getEnabled());
      }),
      subscribeToStorage<SiteSettings>("portfolio_settings", async (data) => {
        setSettings(data);
      }),
    ];

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  return { skills, projects, experience, socials, settings, isLoading, refresh: loadData };
}

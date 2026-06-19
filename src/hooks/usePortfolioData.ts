"use client";

import { useEffect, useState } from "react";
import { skillsService } from "@/services/skillsService";
import { projectService } from "@/services/projectService";
import { experienceService } from "@/services/experienceService";
import { socialsService } from "@/services/socialsService";
import { settingsService } from "@/services/settingsService";
import type { Experience, Project, Skill, SocialLink, SiteSettings } from "@/types";

export function usePortfolioData() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { skills, projects, experience, socials, settings, isLoading, refresh: loadData };
}

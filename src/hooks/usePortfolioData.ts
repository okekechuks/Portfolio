"use client";

import { useCallback, useEffect, useState } from "react";
import { skillsService } from "@/services/skillsService";
import { projectService } from "@/services/projectService";
import { experienceService } from "@/services/experienceService";
import { socialsService } from "@/services/socialsService";
import { settingsService } from "@/services/settingsService";
import { useThemeStore } from "@/store/themeStore";
import type { Experience, Project, Skill, SocialLink, SiteSettings } from "@/types";

export function usePortfolioData() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const applyTheme = useThemeStore((state) => state.applyTheme);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [skillsData, projectsData, experienceData, socialsData, settingsData] =
        await Promise.allSettled([
          skillsService.getEnabled(),
          projectService.getEnabled(),
          experienceService.getEnabled(),
          socialsService.getEnabled(),
          settingsService.getSettings(),
        ]);

      setSkills(skillsData.status === "fulfilled" ? skillsData.value : []);
      setProjects(projectsData.status === "fulfilled" ? projectsData.value : []);
      setExperience(
        experienceData.status === "fulfilled" ? experienceData.value : []
      );
      setSocials(socialsData.status === "fulfilled" ? socialsData.value : []);
      if (settingsData.status === "fulfilled") {
        setSettings(settingsData.value);
        applyTheme(settingsData.value);
      } else {
        setSettings(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  useEffect(() => {
    void loadData();

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void loadData();
      }
    };

    window.addEventListener("focus", loadData);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", loadData);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loadData]);

  return { skills, projects, experience, socials, settings, isLoading, refresh: loadData };
}

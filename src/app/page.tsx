"use client";

import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { SocialLinks } from "@/components/SocialLinks";
import { SectionHeading } from "@/components/SectionHeading";
import { ContrastToggle } from "@/components/ContrastToggle";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { defaultSettings } from "@/data/defaults";

export default function HomePage() {
  const { skills, projects, experience, socials, settings, isLoading } =
    usePortfolioData();

  const siteSettings = settings ?? defaultSettings;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="bg-background">
      <ContrastToggle />
      <HeroSection settings={siteSettings} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experience={experience} />

      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/50">
        <div className="mx-auto max-w-6xl text-center">
          <SectionHeading
            title="Contact"
            subtitle="Let's connect and build something great"
            align="center"
          />
          <SocialLinks socials={socials} className="justify-center" iconSize={22} />
        </div>
      </section>

      <Footer socials={socials} name={siteSettings.name} />
    </main>
  );
}

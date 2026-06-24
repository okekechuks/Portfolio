"use client";

/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import type { SiteSettings } from "@/types";
import { Button } from "@/components/ui/Button";
import { slideInLeft, slideInRight } from "@/animations/variants";

interface HeroSectionProps {
  settings: SiteSettings;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const profileFallback = "/images/profile-placeholder.svg";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-20 scroll-mt-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-10" />

      <div className="relative mx-auto max-w-6xl w-full grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <p className="text-[var(--accent)] font-mono text-sm mb-4">
            Hi, I&apos;m
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            {settings.name}
          </h1>
          <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-muted">
            {settings.title}
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-lg">
            {settings.introduction}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {settings.resumeUrl && (
              <a href={settings.resumeUrl} download>
                <Button variant="primary" size="lg">
                  <Download size={18} />
                  Download Resume
                </Button>
              </a>
            )}
            <Button variant="outline" size="lg" onClick={scrollToContact}>
              <Mail size={18} />
              Contact Me
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-full overflow-hidden border-4 border-border shadow-2xl">
              <img
                src={settings.profileImage || profileFallback}
                alt={settings.name}
                className="h-full w-full object-cover"
                loading="eager"
                onError={(event) => {
                  if (event.currentTarget.src.endsWith(profileFallback)) return;
                  event.currentTarget.src = profileFallback;
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

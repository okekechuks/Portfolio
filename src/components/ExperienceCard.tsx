"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { fadeInUp } from "@/animations/variants";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-border"
    >
      <div className="absolute left-0 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--accent)] bg-background" />

      <Card hover>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {experience.role}
            </h3>
            <p className="text-[var(--accent)] font-medium">{experience.company}</p>
          </div>
          <span className="text-sm text-muted">{experience.duration}</span>
        </div>

        <p className="mt-3 text-sm text-muted leading-relaxed">
          {experience.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {experience.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

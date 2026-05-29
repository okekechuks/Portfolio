"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { staggerContainer, fadeInUp } from "@/animations/variants";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface/50">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Things I've built and contributed to"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={fadeInUp}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

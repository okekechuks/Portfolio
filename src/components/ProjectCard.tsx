"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cardHover } from "@/animations/variants";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div initial="rest" whileHover="hover" variants={cardHover}>
      <Card hover className="h-full flex flex-col overflow-hidden p-0">
        <div className="relative h-48 w-full overflow-hidden bg-muted-bg">
          <Image
            src={project.image || "/images/project-placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {project.featured && (
            <span className="absolute top-3 right-3 rounded-lg bg-[var(--accent)] px-2 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-[var(--accent)]"
              >
                <Code2 size={16} />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-[var(--accent)]"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

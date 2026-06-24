"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/types";
import { ExperienceCard } from "@/components/ExperienceCard";
import { SectionHeading } from "@/components/SectionHeading";
import { staggerContainer } from "@/animations/variants";

interface ExperienceSectionProps {
  experience: Experience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) {
    return (
      <section
        id="experience"
        className="scroll-mt-28 py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            title="Experience"
            subtitle="Where I've worked and what I've done"
          />
          <p className="text-sm text-muted">No experience entries have been enabled yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="scroll-mt-28 py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Experience"
          subtitle="Where I've worked and what I've done"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-8"
        >
          {experience.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

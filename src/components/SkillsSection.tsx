"use client";

import { motion } from "framer-motion";
import type { Skill, SkillCategory } from "@/types";
import { SkillBadge } from "@/components/SkillBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { staggerContainer, fadeInUp } from "@/animations/variants";

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Tools",
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const grouped = CATEGORIES.reduce(
    (acc, category) => {
      const categorySkills = skills.filter((s) => s.category === category);
      if (categorySkills.length > 0) {
        acc[category] = categorySkills;
      }
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Skills"
            subtitle="Technologies and tools I work with"
          />
          <p className="text-sm text-muted">No skills have been enabled yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-10"
        >
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <motion.div key={category} variants={fadeInUp}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SkillBadge skill={skill} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

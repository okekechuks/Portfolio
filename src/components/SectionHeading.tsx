"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
        <span className="ml-2 text-[var(--accent)]">.</span>
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted text-lg">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 rounded-full bg-[var(--accent)]",
          align === "center" && "mx-auto"
        )}
      />
    </motion.div>
  );
}

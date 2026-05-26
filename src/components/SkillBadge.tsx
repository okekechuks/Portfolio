import type { Skill } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface SkillBadgeProps {
  skill: Skill;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  const label = skill.learning ? `${skill.name} (Learning)` : skill.name;

  return (
    <Badge variant={skill.learning ? "learning" : "accent"}>
      {label}
    </Badge>
  );
}

"use client";

import Link from "next/link";
import {
  Code2,
  Link2,
  Mail,
  MessageCircle,
  AtSign,
  Globe,
} from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/types";
import { cn } from "@/utils/cn";

interface SocialLinksProps {
  socials: SocialLink[];
  className?: string;
  iconSize?: number;
}

const iconMap: Record<SocialPlatform, React.ElementType> = {
  email: Mail,
  github: Code2,
  linkedin: Link2,
  whatsapp: MessageCircle,
  twitter: AtSign,
  website: Globe,
};

export function SocialLinks({ socials, className, iconSize = 20 }: SocialLinksProps) {
  if (socials.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {socials.map((social) => {
        const Icon = iconMap[social.platform];
        return (
          <a
            key={social.id}
            href={social.url}
            target={social.platform === "email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label={social.label}
          >
            <Icon size={iconSize} />
            <span className="hidden sm:inline">{social.label}</span>
          </a>
        );
      })}
    </div>
  );
}

export function AdminLink() {
  return (
    <Link
      href="/admin/login"
      className="text-xs text-muted transition-colors hover:text-foreground"
    >
      Admin
    </Link>
  );
}

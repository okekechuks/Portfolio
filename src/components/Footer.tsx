"use client";

import type { SocialLink } from "@/types";
import { SocialLinks, AdminLink } from "@/components/SocialLinks";

interface FooterProps {
  socials: SocialLink[];
  name: string;
}

export function Footer({ socials, name }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <SocialLinks socials={socials} />
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="text-sm text-muted">
              &copy; {year} {name}. All rights reserved.
            </p>
            <AdminLink />
          </div>
        </div>
      </div>
    </footer>
  );
}

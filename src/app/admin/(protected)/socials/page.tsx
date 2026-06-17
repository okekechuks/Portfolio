"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { socialsService } from "@/services/socialsService";
import type { SocialLink } from "@/types";

export default function SocialsAdminPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setSocials(await socialsService.getAll());
  };

  useEffect(() => {
    load();
  }, []);

  const updateSocial = (id: string, updates: Partial<SocialLink>) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    await socialsService.updateAll(socials);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <AdminNavbar title="Social Links" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {socials.map((social) => (
            <Card key={social.id}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-100">{social.label}</h3>
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={social.enabled}
                    onChange={() =>
                      updateSocial(social.id, { enabled: !social.enabled })
                    }
                    className="rounded border-zinc-600"
                  />
                  Visible
                </label>
              </div>
              <Input
                label="URL"
                value={social.url}
                onChange={(e) =>
                  updateSocial(social.id, { url: e.target.value })
                }
                placeholder={
                  social.platform === "email"
                    ? "mailto:you@example.com"
                    : "https://..."
                }
              />
            </Card>
          ))}

          <Button onClick={handleSave} className="w-full">
            Save Social Links
          </Button>

          {saved && (
            <p className="text-center text-sm text-green-400">
              Social links saved successfully!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { DocumentUploadField } from "@/components/admin/DocumentUploadField";
import { settingsService } from "@/services/settingsService";
import { useThemeStore } from "@/store/themeStore";
import type { AdminSettings } from "@/types";
import { defaultAdminSettings } from "@/data/defaults";

const ACCENT_COLORS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Green", value: "#22c55e" },
  { label: "Orange", value: "#f97316" },
  { label: "Pink", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
];

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultAdminSettings);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { setDarkMode, setAccentColor } = useThemeStore();

  useEffect(() => {
    settingsService.getAdminSettings().then(setSettings);
  }, []);

  const update = (updates: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setSaved(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    try {
      const savedSettings = await settingsService.updateSettings(settings);
      setSettings(savedSettings);
      await setDarkMode(savedSettings.darkMode);
      await setAccentColor(savedSettings.accentColor);
      setSaved(true);
      setSaveError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(false);
      setSaveError("Unable to save settings to the database. Check the Vercel Supabase environment variables.");
    }
  };

  return (
    <>
      <AdminNavbar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <h3 className="mb-4 font-semibold text-zinc-100">Profile</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={settings.name}
                onChange={(e) => update({ name: e.target.value })}
              />
              <Input
                label="Hero Title"
                value={settings.title}
                onChange={(e) => update({ title: e.target.value })}
              />
              <Textarea
                label="Introduction"
                value={settings.introduction}
                onChange={(e) => update({ introduction: e.target.value })}
              />
              <ImageUploadField
                label="Profile Image"
                value={settings.profileImage}
                onChange={(profileImage) => update({ profileImage })}
                folder="profile"
                previewAlt={`${settings.name} profile photo`}
                fallbackSrc="/images/profile-placeholder.svg"
                helperText="Upload a square portrait image. We'll store it in Supabase and save the public URL for you."
              />
              <DocumentUploadField
                label="Resume PDF"
                value={settings.resumeUrl}
                onChange={(resumeUrl) => update({ resumeUrl })}
                folder="resumes"
                helperText="Upload your resume as a PDF. The public site will use a download link from the same domain."
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold text-zinc-100">Theme</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Dark Mode</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => update({ darkMode: e.target.checked })}
                      className="rounded border-zinc-600"
                    />
                    Enabled
                  </label>
                  <ThemeToggle />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-zinc-400">Accent Color</p>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => update({ accentColor: color.value })}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                      style={{
                        borderColor:
                          settings.accentColor === color.value
                            ? color.value
                            : undefined,
                        backgroundColor:
                          settings.accentColor === color.value
                            ? `${color.value}20`
                            : undefined,
                      }}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold text-zinc-100">Security</h3>
            <div className="space-y-4">
              <Input
                label="Admin Password"
                type="password"
                value={settings.adminPassword}
                onChange={(e) => update({ adminPassword: e.target.value })}
              />
              <p className="text-sm text-zinc-400 leading-relaxed">
                Self-service password reset is disabled in production. If you lose access,
                rotate the admin password from your deployment or database directly.
              </p>
            </div>
          </Card>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>

          {saved && (
            <p className="text-center text-sm text-green-400">
              Settings saved successfully!
            </p>
          )}
          {saveError && (
            <p className="text-center text-sm text-red-400">{saveError}</p>
          )}
        </div>
      </div>
    </>
  );
}

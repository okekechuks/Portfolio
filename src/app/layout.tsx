import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { defaultSiteSettings } from "@/data/defaults";
import { mapSettings } from "@/lib/db/mappers";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chuka Okeke | Software Developer",
  description:
    "Portfolio of Chuka Okeke — Software Developer building modern applications with C#, .NET, TypeScript, React, and Next.js.",
  keywords: ["portfolio", "software developer", "C#", ".NET", "TypeScript", "React", "Next.js"],
};

async function getThemeSettings() {
  if (!isSupabaseConfigured()) {
    return defaultSiteSettings;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "site")
      .single();

    return data ? mapSettings(data) : defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeSettings = await getThemeSettings();
  const themeInitScript = `
    try {
      var dark = ${JSON.stringify(themeSettings.darkMode)};
      var accent = ${JSON.stringify(themeSettings.accentColor)};
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.setProperty('--accent', accent);
    } catch (e) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--accent', '#3b82f6');
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

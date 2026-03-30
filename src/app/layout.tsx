import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
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

const themeInitScript = `
  try {
    var stored = localStorage.getItem('portfolio_settings');
    var dark = stored ? JSON.parse(stored).darkMode : true;
    document.documentElement.classList.toggle('dark', dark !== false);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

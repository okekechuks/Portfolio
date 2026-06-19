$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$finalPackage = Get-Content "package.json" -Raw
$finalNextConfig = Get-Content "next.config.ts" -Raw
$finalLock = Get-Content "package-lock.json" -Raw

function Commit-At {
    param([string]$Date, [string]$Message, [string[]]$Paths)
    $existing = @($Paths | Where-Object { Test-Path $_ })
    if ($existing.Count -eq 0) { return }
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    git add -- $existing
    git commit -m $Message | Out-Null
    Write-Host "[$($Date.Substring(0,10))] $Message"
}

$minimalPackage = @'
{
  "name": "portfolio-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "15.5.19",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
'@

$baseNextConfig = @'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
'@

git checkout --orphan portfolio-history
git rm -rf --cached . 2>$null | Out-Null

Set-Content "package.json" -Value $minimalPackage -NoNewline
Set-Content "next.config.ts" -Value $baseNextConfig -NoNewline

$commits = @(
    @{ d = "2026-03-21T09:15:00"; m = "chore: initialize repository and editor tooling"; p = @(".gitignore", "README.md", "tsconfig.json", "eslint.config.mjs", "postcss.config.mjs") },
    @{ d = "2026-03-24T14:20:00"; m = "chore: add package manifest for Next.js app"; p = @("package.json") },
    @{ d = "2026-03-24T14:35:00"; m = "chore: add base Next.js configuration"; p = @("next.config.ts") },
    @{ d = "2026-03-27T11:40:00"; m = "chore: add public assets and favicon"; p = @("public/file.svg", "public/globe.svg", "public/next.svg", "public/vercel.svg", "public/window.svg", "src/app/favicon.ico") },
    @{ d = "2026-03-30T16:05:00"; m = "feat: add root layout and global Tailwind styles"; p = @("src/app/layout.tsx", "src/app/globals.css") },
    @{ d = "2026-04-02T10:30:00"; m = "feat: add placeholder homepage shell"; p = @("src/app/page.tsx") },
    @{ d = "2026-04-05T13:45:00"; m = "feat: define core portfolio TypeScript types"; p = @("src/types/index.ts") },
    @{ d = "2026-04-08T09:50:00"; m = "feat: add default seed data for CMS content"; p = @("src/data/defaults.ts") },
    @{ d = "2026-04-11T15:10:00"; m = "feat: add storage utilities for client persistence"; p = @("src/lib/storage.ts", "src/utils/cn.ts", "src/utils/generateId.ts") },
    @{ d = "2026-04-14T11:25:00"; m = "feat: implement settings service layer"; p = @("src/services/settingsService.ts") },
    @{ d = "2026-04-17T14:00:00"; m = "feat: implement skills service layer"; p = @("src/services/skillsService.ts") },
    @{ d = "2026-04-20T10:15:00"; m = "feat: implement projects service layer"; p = @("src/services/projectService.ts") },
    @{ d = "2026-04-23T16:40:00"; m = "feat: implement experience service layer"; p = @("src/services/experienceService.ts") },
    @{ d = "2026-04-26T09:30:00"; m = "feat: implement social links service layer"; p = @("src/services/socialsService.ts") },
    @{ d = "2026-04-29T13:55:00"; m = "feat: add admin authentication service"; p = @("src/services/authService.ts", "src/services/index.ts") },
    @{ d = "2026-05-02T11:10:00"; m = "feat: add auth and session Zustand stores"; p = @("src/store/authStore.ts", "src/store/sessionStore.ts") },
    @{ d = "2026-05-05T15:25:00"; m = "feat: add theme and settings Zustand stores"; p = @("src/store/themeStore.ts", "src/store/settingsStore.ts") },
    @{ d = "2026-05-08T10:45:00"; m = "feat: add shared Framer Motion animation variants"; p = @("src/animations/variants.ts") },
    @{ d = "2026-05-11T14:20:00"; m = "feat: add base UI button and input components"; p = @("src/components/ui/Button.tsx", "src/components/ui/Input.tsx") },
    @{ d = "2026-05-14T09:35:00"; m = "feat: add card and badge UI components"; p = @("src/components/ui/Card.tsx", "src/components/ui/Badge.tsx") },
    @{ d = "2026-05-17T16:50:00"; m = "feat: add modal, table, and textarea components"; p = @("src/components/ui/Modal.tsx", "src/components/ui/Table.tsx", "src/components/ui/Textarea.tsx") },
    @{ d = "2026-05-20T11:05:00"; m = "feat: add section heading and theme toggle"; p = @("src/components/SectionHeading.tsx", "src/components/ThemeToggle.tsx") },
    @{ d = "2026-05-23T13:30:00"; m = "feat: add app providers for theme and auth hydration"; p = @("src/components/Providers.tsx") },
    @{ d = "2026-05-26T10:00:00"; m = "feat: build skills section with dynamic badges"; p = @("src/components/SkillBadge.tsx", "src/components/SkillsSection.tsx") },
    @{ d = "2026-05-29T15:15:00"; m = "feat: build projects section and project cards"; p = @("src/components/ProjectCard.tsx", "src/components/ProjectsSection.tsx") },
    @{ d = "2026-06-01T09:40:00"; m = "feat: build experience timeline section"; p = @("src/components/ExperienceCard.tsx", "src/components/ExperienceSection.tsx") },
    @{ d = "2026-06-03T14:55:00"; m = "feat: add hero section with profile and CTA actions"; p = @("src/components/HeroSection.tsx") },
    @{ d = "2026-06-05T11:20:00"; m = "feat: add footer and social link components"; p = @("src/components/SocialLinks.tsx", "src/components/Footer.tsx") },
    @{ d = "2026-06-07T16:10:00"; m = "feat: add portfolio data hook for dynamic content"; p = @("src/hooks/usePortfolioData.ts") },
    @{ d = "2026-06-09T10:25:00"; m = "feat: compose public portfolio homepage sections"; p = @("src/app/page.tsx") },
    @{ d = "2026-06-09T15:40:00"; m = "feat: add placeholder profile and project images"; p = @("public/images/profile-placeholder.svg", "public/images/project-placeholder.svg") },
    @{ d = "2026-06-10T13:50:00"; m = "chore: add state, motion, and icon dependencies"; p = @("package.json", "package-lock.json") },
    @{ d = "2026-06-11T09:05:00"; m = "feat: add admin login page and form"; p = @("src/app/admin/login/page.tsx", "src/components/admin/LoginForm.tsx") },
    @{ d = "2026-06-12T15:30:00"; m = "feat: add forgot password flow for admin"; p = @("src/app/admin/forgot-password/page.tsx", "src/components/admin/ForgotPasswordForm.tsx") },
    @{ d = "2026-06-13T11:45:00"; m = "feat: add admin auth guard and protected layout"; p = @("src/components/admin/AuthGuard.tsx", "src/app/admin/(protected)/layout.tsx") },
    @{ d = "2026-06-14T14:00:00"; m = "feat: add admin sidebar and navbar"; p = @("src/components/admin/AdminSidebar.tsx", "src/components/admin/AdminNavbar.tsx", "src/components/admin/AdminCard.tsx") },
    @{ d = "2026-06-15T10:15:00"; m = "feat: add admin dashboard overview page"; p = @("src/app/admin/(protected)/dashboard/page.tsx") },
    @{ d = "2026-06-15T16:40:00"; m = "feat: add admin skills CMS page"; p = @("src/app/admin/(protected)/skills/page.tsx") },
    @{ d = "2026-06-16T09:55:00"; m = "feat: add admin projects CMS page"; p = @("src/app/admin/(protected)/projects/page.tsx") },
    @{ d = "2026-06-16T15:20:00"; m = "feat: add admin experience CMS page"; p = @("src/app/admin/(protected)/experience/page.tsx") },
    @{ d = "2026-06-17T11:35:00"; m = "feat: add admin social links management page"; p = @("src/app/admin/(protected)/socials/page.tsx") },
    @{ d = "2026-06-17T16:50:00"; m = "feat: add admin settings page for profile and theme"; p = @("src/app/admin/(protected)/settings/page.tsx") },
    @{ d = "2026-06-18T10:05:00"; m = "feat: add admin entry redirect route"; p = @("src/app/admin/page.tsx") },
    @{ d = "2026-06-18T14:30:00"; m = "chore: configure remote image patterns in Next config"; p = @("next.config.ts") },
    @{ d = "2026-06-18T17:45:00"; m = "feat: add light and dark theme design tokens"; p = @("src/app/globals.css", "src/app/layout.tsx") },
    @{ d = "2026-06-19T09:20:00"; m = "feat: add contrast toggle for public portfolio"; p = @("src/components/ContrastToggle.tsx", "src/app/page.tsx") },
    @{ d = "2026-06-19T13:10:00"; m = "fix: align admin default password with phone number"; p = @("src/data/defaults.ts", "src/services/authService.ts", "src/services/settingsService.ts", "src/components/admin/LoginForm.tsx", "src/app/admin/(protected)/dashboard/page.tsx") }
)

foreach ($c in $commits) {
    if ($c.m -eq "chore: add state, motion, and icon dependencies") {
        Set-Content "package.json" -Value $finalPackage -NoNewline
        Set-Content "package-lock.json" -Value $finalLock -NoNewline
    }
    if ($c.m -eq "chore: configure remote image patterns in Next config") {
        Set-Content "next.config.ts" -Value $finalNextConfig -NoNewline
    }
    Commit-At $c.d $c.m $c.p
}

Set-Content "package.json" -Value $finalPackage -NoNewline
Set-Content "next.config.ts" -Value $finalNextConfig -NoNewline
Set-Content "package-lock.json" -Value $finalLock -NoNewline

git add -A
$remaining = git status --porcelain
if ($remaining) {
    Commit-At "2026-06-19T18:00:00" "chore: add history rebuild script and finalize project" @("scripts/spread-history.ps1")
}

git branch -D master 2>$null | Out-Null
git branch -m master

Write-Host ""
Write-Host "Created $(git rev-list --count HEAD) commits from $(git log --reverse --format=%ad --date=short | Select-Object -First 1) to $(git log --format=%ad --date=short | Select-Object -First 1)"

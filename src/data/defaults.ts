import type {
  Experience,
  Project,
  SiteSettings,
  Skill,
  SkillCategory,
  SocialLink,
} from "@/types";

const MASTER_SKILLS: Record<SkillCategory, string[]> = {
  Languages: [
    "C#",
    "TypeScript",
    "JavaScript",
    "Python",
    "SQL",
    "Java",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Kotlin",
    "Swift",
    "Dart",
    "C",
    "C++",
  ],
  Frontend: [
    "React",
    "Next.js",
    "Angular",
    "Vue",
    "Svelte",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "Bootstrap",
  ],
  Backend: [
    ".NET",
    "ASP.NET Core",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
  ],
  Databases: [
    "SQL Server",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "MongoDB",
    "Redis",
  ],
  Tools: [
    "Git",
    "GitHub",
    "Docker",
    "Postman",
    "Linux",
    "Bash",
    "Vite",
    "VS Code",
    "Azure",
    "AWS",
    "Firebase",
  ],
};

function createSkillId(category: string, name: string): string {
  return `${category.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getDefaultSkills(): Skill[] {
  const enabledByDefault = new Set([
    "C#",
    "TypeScript",
    "JavaScript",
    "Python",
    "SQL",
    "React",
    "Next.js",
    "Angular",
    "Tailwind CSS",
    ".NET",
    "ASP.NET Core",
    "Node.js",
    "SQL Server",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "GitHub",
    "Docker",
    "VS Code",
    "Azure",
  ]);

  const learningByDefault = new Set(["Angular"]);

  const skills: Skill[] = [];

  (Object.entries(MASTER_SKILLS) as [SkillCategory, string[]][]).forEach(
    ([category, names]) => {
      names.forEach((name) => {
        skills.push({
          id: createSkillId(category, name),
          name,
          category,
          enabled: enabledByDefault.has(name),
          learning: learningByDefault.has(name),
          proficiency: learningByDefault.has(name) ? "Beginner" : "Advanced",
        });
      });
    }
  );

  return skills;
}

export const defaultProjects: Project[] = [
  {
    id: "proj-1",
    title: "Portfolio CMS",
    description:
      "A modern developer portfolio with an integrated admin dashboard for content management.",
    image: "/images/project-placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
    featured: true,
    enabled: true,
    order: 1,
  },
  {
    id: "proj-2",
    title: "Task Manager API",
    description:
      "RESTful API built with ASP.NET Core featuring JWT authentication and clean architecture.",
    image: "/images/project-placeholder.svg",
    githubUrl: "https://github.com",
    liveUrl: "",
    techStack: ["C#", ".NET", "PostgreSQL", "Docker"],
    featured: false,
    enabled: true,
    order: 2,
  },
];

export const defaultExperience: Experience[] = [
  {
    id: "exp-1",
    company: "Tech Company",
    role: "Software Developer",
    duration: "2022 — Present",
    description:
      "Building scalable web applications using C#, .NET, TypeScript, and React. Collaborating with cross-functional teams to deliver high-quality software.",
    technologies: ["C#", ".NET", "TypeScript", "React", "PostgreSQL"],
    enabled: true,
    order: 1,
  },
];

export const defaultSocials: SocialLink[] = [
  {
    id: "social-email",
    platform: "email",
    label: "Email",
    url: "mailto:chuka@example.com",
    enabled: true,
  },
  {
    id: "social-github",
    platform: "github",
    label: "GitHub",
    url: "https://github.com",
    enabled: true,
  },
  {
    id: "social-linkedin",
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com",
    enabled: true,
  },
  {
    id: "social-whatsapp",
    platform: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/08029315311",
    enabled: true,
  },
  {
    id: "social-twitter",
    platform: "twitter",
    label: "Twitter/X",
    url: "https://twitter.com",
    enabled: false,
  },
  {
    id: "social-website",
    platform: "website",
    label: "Website",
    url: "https://example.com",
    enabled: false,
  },
];

export const defaultSettings: SiteSettings = {
  name: "Chuka Okeke",
  title: "Software Developer",
  introduction:
    "I build modern applications using C#, .NET, TypeScript, React, and Next.js.",
  profileImage: "/images/profile-placeholder.svg",
  resumeUrl: "/resume.pdf",
  accentColor: "#3b82f6",
  darkMode: true,
  adminPassword: "08029315311",
  adminPhone: "08029315311",
};

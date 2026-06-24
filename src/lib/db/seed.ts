import {
  defaultExperience,
  defaultSiteSettings,
  defaultProjects,
  defaultSocials,
  getDefaultSkills,
} from "@/data/defaults";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function seedDatabaseIfEmpty(): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { count: skillsCount, error: skillsCountError } = await supabase
    .from("skills")
    .select("*", { count: "exact", head: true });
  if (skillsCountError) throw skillsCountError;

  if (skillsCount === 0) {
    const skills = getDefaultSkills().map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      enabled: s.enabled,
      learning: s.learning,
      proficiency: s.proficiency,
    }));
    const { error } = await supabase.from("skills").insert(skills);
    if (error) throw error;
  }

  const { count: projectsCount, error: projectsCountError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  if (projectsCountError) throw projectsCountError;

  if (projectsCount === 0) {
    const projects = defaultProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      github_url: p.githubUrl,
      live_url: p.liveUrl,
      tech_stack: p.techStack,
      featured: p.featured,
      enabled: p.enabled,
      sort_order: p.order,
    }));
    const { error } = await supabase.from("projects").insert(projects);
    if (error) throw error;
  }

  const { count: experienceCount, error: experienceCountError } = await supabase
    .from("experience")
    .select("*", { count: "exact", head: true });
  if (experienceCountError) throw experienceCountError;

  if (experienceCount === 0) {
    const items = defaultExperience.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      duration: e.duration,
      description: e.description,
      technologies: e.technologies,
      enabled: e.enabled,
      sort_order: e.order,
    }));
    const { error } = await supabase.from("experience").insert(items);
    if (error) throw error;
  }

  const { count: socialsCount, error: socialsCountError } = await supabase
    .from("socials")
    .select("*", { count: "exact", head: true });
  if (socialsCountError) throw socialsCountError;

  if (socialsCount === 0) {
    const socials = defaultSocials.map((s) => ({
      id: s.id,
      platform: s.platform,
      label: s.label,
      url: s.url,
      enabled: s.enabled,
    }));
    const { error } = await supabase.from("socials").insert(socials);
    if (error) throw error;
  }

  const { data: settingsRow, error: settingsError } = await supabase
    .from("site_settings")
    .select("id")
    .eq("id", "site")
    .maybeSingle();
  if (settingsError) throw settingsError;

  if (!settingsRow) {
    const { error } = await supabase.from("site_settings").insert({
      id: "site",
      name: defaultSiteSettings.name,
      title: defaultSiteSettings.title,
      introduction: defaultSiteSettings.introduction,
      profile_image: defaultSiteSettings.profileImage,
      resume_url: defaultSiteSettings.resumeUrl,
      accent_color: defaultSiteSettings.accentColor,
      dark_mode: defaultSiteSettings.darkMode,
      admin_password: process.env.ADMIN_PASSWORD ?? "",
      admin_phone: process.env.ADMIN_PHONE ?? "",
    });
    if (error) throw error;
  }
}

export async function getAdminPassword(): Promise<string> {
  const supabase = getSupabaseAdmin();
  await seedDatabaseIfEmpty();

  const { data } = await supabase
    .from("site_settings")
    .select("admin_password, admin_phone")
    .eq("id", "site")
    .single();

  return (
    process.env.ADMIN_PASSWORD?.trim() ||
    data?.admin_password ||
    ""
  );
}

export async function getAdminPhone(): Promise<string> {
  const supabase = getSupabaseAdmin();
  await seedDatabaseIfEmpty();

  const { data } = await supabase
    .from("site_settings")
    .select("admin_phone")
    .eq("id", "site")
    .single();

  return data?.admin_phone || process.env.ADMIN_PHONE || "";
}

import { Project, Article, Experience } from "../constants";
import { supabase } from "./supabase";

/**
 * Fetches all projects from Supabase, ordered by creation date.
 * Maps database fields to frontend Project type.
 */
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(p => ({
    ...p,
    longDescription: p.long_description,
    techStack: p.tech_stack ? (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack) : [],
    image: p.image_url,
    tags: p.tags || [],
    features: p.features ? (typeof p.features === 'string' ? p.features.split('\n') : p.features) : [],
  }));
};

/**
 * Fetches all articles from Supabase, ordered by creation date.
 */
export const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(a => ({
    ...a,
    readTime: a.read_time,
    tags: a.tags || []
  }));
};

/**
 * Fetches the latest 20 notifications.
 * Returns an empty array if the table doesn't exist or an error occurs.
 */
export const fetchNotifications = async () => {
  try {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) {
      console.warn("Notifications table might be missing:", error.message);
      return [];
    }
    return data;
  } catch (err) {
    return [];
  }
};

/**
 * Marks all unread notifications as read.
 */
export const markNotificationsRead = async () => {
  try {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    if (error) console.warn("Could not mark notifications as read:", error.message);
  } catch (err) {}
};

/**
 * Creates a new notification entry.
 */
export const createNotification = async (message: string) => {
  try {
    const { error } = await supabase.from('notifications').insert({ message, is_read: false });
    if (error) console.warn("Could not create notification:", error.message);
  } catch (err) {}
};

/**
 * Upserts a project record.
 */
export const saveProject = async (project: Project) => {
  const payload = {
    id: project.id,
    title: project.title,
    description: project.description,
    long_description: project.longDescription || "",
    image_url: project.image || "",
    tags: project.tags || [],
    link: project.link || "",
    features: Array.isArray(project.features) ? project.features.join('\n') : (project.features || ""),
    tech_stack: typeof project.techStack === 'object' ? JSON.stringify(project.techStack) : (project.techStack || "[]")
  };

  const { error } = await supabase.from('projects').upsert(payload);
  if (error) throw error;
};

/**
 * Deletes a project by ID.
 */
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

/**
 * Upserts an article record.
 */
export const saveArticle = async (article: Article) => {
  const { error } = await supabase.from('articles').upsert({
    id: article.id,
    title: article.title,
    description: article.description,
    content: article.content,
    date: article.date,
    author: article.author,
    read_time: article.readTime,
    tags: article.tags
  });
  if (error) throw error;
};

/**
 * Deletes an article by ID.
 */
export const deleteArticle = async (id: string) => {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
};

/**
 * Fetches a specific setting value by key (e.g., 'hero', 'about').
 */
export const fetchSettings = async (key: string) => {
  const { data, error } = await supabase.from('settings').select('value').eq('key', key).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data?.value;
};

/**
 * Upserts a setting value.
 */
export const saveSettings = async (key: string, value: any) => {
  const { error } = await supabase.from('settings').upsert({ key, value });
  if (error) throw error;
};

/**
 * Fetches all skills, ordered by creation date.
 */
export const fetchSkills = async () => {
  const { data, error } = await supabase.from('skills').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

/**
 * Upserts a skill record.
 */
export const saveSkill = async (skill: any) => {
  const { error } = await supabase.from('skills').upsert(skill);
  if (error) throw error;
};

/**
 * Deletes a skill by ID.
 */
export const deleteSkill = async (id: string) => {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
};

/**
 * Fetches all experience entries.
 */
export const fetchExperience = async (): Promise<Experience[]> => {
  const { data, error } = await supabase.from('experience').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Upserts an experience record.
 */
export const saveExperience = async (exp: any) => {
  const { error } = await supabase.from('experience').upsert(exp);
  if (error) throw error;
};

/**
 * Deletes an experience by ID.
 */
export const deleteExperience = async (id: string) => {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
};

/**
 * Fetches all social links.
 */
export const fetchSocials = async () => {
  const { data, error } = await supabase.from('socials').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

/**
 * Upserts a social link record.
 */
export const saveSocial = async (social: any) => {
  const { error } = await supabase.from('socials').upsert(social);
  if (error) throw error;
};

/**
 * Deletes a social link by ID.
 */
export const deleteSocial = async (id: string) => {
  const { error } = await supabase.from('socials').delete().eq('id', id);
  if (error) throw error;
};

// Common types for CRUD operations

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image?: string;
  video_file?: string;
  images: ProjectImage[];
  category?: ProjectCategory;
  category_id?: number;
  tech_stack: string[];
  links: ProjectLink[];
  summaries: ProjectSummary[];
  is_published: boolean;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  caption?: string;
  order: number;
}

export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectSummary {
  content: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category?: BlogCategory;
  category_id?: number;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  is_published: boolean;
  publish_at?: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  logo?: string;
  order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: string;
  logo?: string;
  attachments: string[];
  gallery: string[];
  order: number;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category?: SkillCategory;
  category_id?: number;
  icon?: string;
  order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  image?: string;
  category?: CertificateCategory;
  category_id?: number;
  order: number;
}

export interface CertificateCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  created_at: string;
}

export interface WATemplate {
  id: number;
  name: string;
  content: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface BlockEntry {
  id: number;
  type: 'ip' | 'domain';
  value: string;
  reason?: string;
  created_at: string;
}

export interface AIKey {
  id: number;
  provider: string;
  key_preview: string;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  seo_title: string;
  seo_description: string;
  cdn_url?: string;
  maintenance_mode: boolean;
  maintenance_end_time?: string;
  ai_provider?: string;
}

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  resume_url?: string;
}

export interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image?: string;
  cta_text?: string;
  cta_link?: string;
}

export interface AboutContent {
  title: string;
  content: string;
  image?: string;
}

export interface MediaItem {
  id: number;
  file: string;
  filename: string;
  file_type: string;
  size: number;
  created_at: string;
}

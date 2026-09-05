// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://porto.apprentice.cyou';

export const API_ENDPOINTS = {
  // Auth
  captcha: '/api/auth/captcha/',
  login: '/api/auth/login/',
  me: '/api/auth/me/',

  // Monitor
  monitorHtml: '/api/monitor/',
  monitorExport: '/api/monitor/export/',

  // Upload and Media
  upload: '/api/upload/',
  mediaList: '/api/media/list/',

  // Core Singletons
  profile: '/api/profile/',
  homeContent: '/api/home-content/',
  aboutContent: '/api/about-content/',
  siteSettings: '/api/settings/',

  // Social Links
  socialLinks: '/api/social-links/',

  // Skills
  skills: '/api/skills/',
  skillCategories: '/api/skill-categories/',

  // Experience & Education
  experience: '/api/experience/',
  education: '/api/education/',

  // Certificates
  certificates: '/api/certificates/',
  certificateCategories: '/api/certificate-categories/',

  // Projects
  projectCategories: '/api/project-categories/',
  projects: '/api/projects/',
  projectsReorder: '/api/projects/reorder/',
  projectDeleteImage: (id: number | string) => `/api/projects/${id}/delete_image/`,

  // Blog
  blogCategories: '/api/blog-categories/',
  blogPosts: '/api/blog-posts/',
  blogBySlug: '/api/blog-posts/by_slug/',

  // Communication
  messages: '/api/messages/',
  subscribers: '/api/subscribers/',
  waTemplates: '/api/wa-templates/',

  // Security
  blockEntries: '/api/block-entries/',

  // AI
  aiKeysList: '/api/ai/keys/',
  aiKeysAdd: '/api/ai/keys/add/',
  aiKeysDelete: (id: number | string) => `/api/ai/keys/${id}/`,
  aiKeysTest: (id: number | string) => `/api/ai/keys/${id}/test/`,
  aiKeysUpload: '/api/ai/upload-keys/',
  aiWrite: '/api/ai/write/',
  aiSeo: '/api/ai/seo/',
  aiAnalyzeMessage: '/api/ai/analyze-message/',
  aiChat: '/api/ai/chat/',
} as const;

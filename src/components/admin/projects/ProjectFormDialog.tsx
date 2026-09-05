import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader } from '@/components/admin/common';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useAIWrite, useAISeo } from '@/hooks/useAI';
import { X, Sparkles, Wand2, Save, Image as ImageIcon, Trash2 } from 'lucide-react';
import { ProjectCodeEditor } from './ProjectCodeEditor';
import type { Project, ProjectCategory } from '@/types/models';

interface ProjectFormDialogProps {
  project: Project | null;
  categories: ProjectCategory[];
  onClose: () => void;
}

export function ProjectFormDialog({ project, categories, onClose }: ProjectFormDialogProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const aiWrite = useAIWrite();
  const aiSeo = useAISeo();
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    content: project?.content || '',
    category_id: project?.category_id || '',
    tech_stack: project?.tech_stack?.join(', ') || '',
    links: JSON.stringify(project?.links || [], null, 2),
    is_published: project?.is_published || false,
    is_featured: project?.is_featured || false,
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleGenerateContent = async () => {
    if (!formData.title) return;
    try {
      const result = await aiWrite.mutateAsync({
        topic: `${formData.title} - ${formData.description}`,
        type: 'project',
        tone: 'professional',
      });
      setFormData(prev => ({ ...prev, content: result.content }));
    } catch (err) {
      console.error('AI generation failed:', err);
    }
  };

  const handleGenerateSEO = async () => {
    if (!formData.content) return;
    try {
      const result = await aiSeo.mutateAsync({
        content: formData.content,
        keyword: formData.title,
      });
      // Could update meta fields if we had them
      console.log('SEO suggestions:', result);
    } catch (err) {
      console.error('SEO analysis failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'));
      fd.append('description', formData.description);
      fd.append('content', formData.content);
      if (formData.category_id) fd.append('category_id', String(formData.category_id));
      fd.append('tech_stack', JSON.stringify(formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('links', formData.links);
      fd.append('is_published', String(formData.is_published));
      fd.append('is_featured', String(formData.is_featured));
      
      if (coverImage) fd.append('cover_image', coverImage);
      galleryImages.forEach(img => fd.append('uploaded_images', img));

      if (project) {
        await updateProject.mutateAsync({ id: project.id, formData: fd });
      } else {
        await createProject.mutateAsync(fd);
      }
      onClose();
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-background w-full max-w-4xl rounded-lg shadow-lg m-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="Tech Stack (comma-separated)"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="React, TypeScript, Tailwind"
            />
          </div>

          <div>
            <label className="admin-form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
              placeholder="Brief project description..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="admin-form-label">Content</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateContent}
                  disabled={aiWrite.isPending || !formData.title}
                  leftIcon={<Wand2 className="w-4 h-4" />}
                >
                  {aiWrite.isPending ? 'Generating...' : 'AI Generate'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSEO}
                  disabled={aiSeo.isPending || !formData.content}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {aiSeo.isPending ? 'Analyzing...' : 'SEO Check'}
                </Button>
              </div>
            </div>
            <ProjectCodeEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Links JSON */}
          <div>
            <label className="admin-form-label">Links (JSON)</label>
            <textarea
              name="links"
              value={formData.links}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm resize-none"
              placeholder='[{"label": "Live Demo", "url": "https://..."}]'
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-form-label">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {project?.cover_image && !coverImage && (
                <img src={project.cover_image} alt="Current cover" className="mt-2 h-20 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="admin-form-label">Gallery Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="rounded border-input"
              />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="rounded border-input"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

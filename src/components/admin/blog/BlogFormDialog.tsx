import React, { useState } from 'react';
import { Button, Input } from '@/components/admin/common';
import { useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlog';
import { useAIWrite, useAISeo } from '@/hooks/useAI';
import { X, Sparkles, Wand2, Save } from 'lucide-react';
import { ProjectCodeEditor } from '../projects/ProjectCodeEditor';
import type { BlogPost, BlogCategory } from '@/types/models';

interface BlogFormDialogProps {
  post: BlogPost | null;
  categories: BlogCategory[];
  onClose: () => void;
}

export function BlogFormDialog({ post, categories, onClose }: BlogFormDialogProps) {
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const aiWrite = useAIWrite();
  const aiSeo = useAISeo();
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category_id: post?.category_id || '',
    tags: post?.tags?.join(', ') || '',
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords?.join(', ') || '',
    is_published: post?.is_published || false,
    publish_at: post?.publish_at || '',
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
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
        topic: formData.title,
        type: 'blog',
        tone: 'informative',
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
      setFormData(prev => ({
        ...prev,
        seo_title: result.title,
        seo_description: result.description,
        seo_keywords: result.keywords.join(', '),
      }));
    } catch (err) {
      console.error('SEO generation failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('slug', formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'));
      fd.append('excerpt', formData.excerpt);
      fd.append('content', formData.content);
      if (formData.category_id) fd.append('category_id', String(formData.category_id));
      fd.append('tags', JSON.stringify(formData.tags.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('seo_title', formData.seo_title);
      fd.append('seo_description', formData.seo_description);
      fd.append('seo_keywords', JSON.stringify(formData.seo_keywords.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('is_published', String(formData.is_published));
      if (formData.publish_at) fd.append('publish_at', formData.publish_at);
      if (coverImage) fd.append('cover_image', coverImage);

      if (post) {
        await updatePost.mutateAsync({ id: post.id, formData: fd });
      } else {
        await createPost.mutateAsync(fd);
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
            {post ? 'Edit Post' : 'New Post'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
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
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, typescript, tutorial"
            />
          </div>

          <div>
            <label className="admin-form-label">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
              placeholder="Brief summary of the post..."
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
              </div>
            </div>
            <ProjectCodeEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* SEO Fields */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">SEO Settings</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateSEO}
                disabled={aiSeo.isPending || !formData.content}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {aiSeo.isPending ? 'Generating...' : 'Generate SEO'}
              </Button>
            </div>
            <Input
              label="SEO Title"
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              placeholder="SEO optimized title"
            />
            <div>
              <label className="admin-form-label">SEO Description</label>
              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                placeholder="Meta description for search engines..."
              />
            </div>
            <Input
              label="SEO Keywords (comma-separated)"
              name="seo_keywords"
              value={formData.seo_keywords}
              onChange={handleChange}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="admin-form-label">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            {post?.cover_image && !coverImage && (
              <img src={post.cover_image} alt="Current cover" className="mt-2 h-20 object-cover rounded" />
            )}
          </div>

          {/* Publish Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
            <Input
              label="Publish At"
              name="publish_at"
              type="datetime-local"
              value={formData.publish_at}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
              {post ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

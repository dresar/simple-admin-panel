import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, Button, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useBlogPosts, useBlogCategories, useDeleteBlogPost } from '@/hooks/useBlog';
import { Plus, FileText, Search, Edit2, Trash2, Eye, EyeOff, Tag } from 'lucide-react';
import { BlogFormDialog } from '@/components/admin/blog/BlogFormDialog';
import type { BlogPost } from '@/types/models';

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();
  const { data: categories } = useBlogCategories();
  const deletePost = useDeleteBlogPost();
  
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredPosts = posts?.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost.mutateAsync(id);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Blog"
        description="Manage your blog posts and categories"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
            New Post
          </Button>
        }
      />

      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
          />
        </div>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : filteredPosts.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No blog posts yet"
            description="Create your first blog post to share your knowledge"
            action={
              <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
                Create Post
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-start gap-4">
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-24 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {post.category && (
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">
                        {post.category.name}
                      </span>
                    )}
                    {post.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded flex items-center gap-1">
                        <Tag className="w-3 h-3" />{tag}
                      </span>
                    ))}
                    {post.is_published ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {post.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <BlogFormDialog
          post={editingPost}
          categories={categories || []}
          onClose={handleCloseForm}
        />
      )}
    </AdminLayout>
  );
}

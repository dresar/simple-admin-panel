import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader, Card, Button, Input, EmptyState } from '@/components/admin/common';
import { PageLoader } from '@/components/admin/common/LoadingSpinner';
import { useProjects, useProjectCategories, useDeleteProject } from '@/hooks/useProjects';
import { Plus, FolderKanban, Search, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { ProjectFormDialog } from '@/components/admin/projects/ProjectFormDialog';
import type { Project } from '@/types/models';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const { data: categories } = useProjectCategories();
  const deleteProject = useDeleteProject();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredProjects = projects?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(id);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
            Add Project
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : filteredProjects.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Start by adding your first project to showcase your work"
            action={
              <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
                Add Project
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <div className="flex items-start gap-4">
                {project.cover_image && (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-24 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{project.title}</h3>
                    {project.is_featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded">
                      {project.category?.name || 'Uncategorized'}
                    </span>
                    {project.is_published ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
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
        <ProjectFormDialog
          project={editingProject}
          categories={categories || []}
          onClose={handleCloseForm}
        />
      )}
    </AdminLayout>
  );
}

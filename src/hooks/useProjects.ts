import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import type { Project, ProjectCategory } from '@/types/models';

export function useProjects() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiFetch<Project[]>(API_ENDPOINTS.projects, { token }),
  });
}

export function useProject(id: number) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => apiFetch<Project>(`${API_ENDPOINTS.projects}${id}/`, { token }),
    enabled: !!id,
  });
}

export function useProjectCategories() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['project-categories'],
    queryFn: () => apiFetch<ProjectCategory[]>(API_ENDPOINTS.projectCategories, { token }),
  });
}

export function useCreateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) => 
      apiUpload<Project>(API_ENDPOINTS.projects, formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch<Project>(`${API_ENDPOINTS.projects}${id}/`, {
        method: 'PATCH',
        body: formData,
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.projects}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useReorderProjects() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (items: { id: number; order: number }[]) =>
      apiFetch(API_ENDPOINTS.projectsReorder, {
        method: 'POST',
        body: { items },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProjectImage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, imageId }: { projectId: number; imageId: number }) =>
      apiFetch(API_ENDPOINTS.projectDeleteImage(projectId), {
        method: 'POST',
        body: { image_id: imageId },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

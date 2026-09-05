import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import type { BlogPost, BlogCategory } from '@/types/models';

export function useBlogPosts() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => apiFetch<BlogPost[]>(API_ENDPOINTS.blogPosts, { token }),
  });
}

export function useBlogPost(id: number) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => apiFetch<BlogPost>(`${API_ENDPOINTS.blogPosts}${id}/`, { token }),
    enabled: !!id,
  });
}

export function useBlogCategories() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => apiFetch<BlogCategory[]>(API_ENDPOINTS.blogCategories, { token }),
  });
}

export function useCreateBlogPost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<BlogPost>(API_ENDPOINTS.blogPosts, formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch<BlogPost>(`${API_ENDPOINTS.blogPosts}${id}/`, {
        method: 'PATCH',
        body: formData,
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.blogPosts}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}

export function useCreateBlogCategory() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name: string; slug?: string }) =>
      apiFetch<BlogCategory>(API_ENDPOINTS.blogCategories, {
        method: 'POST',
        body: data,
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });
}

export function useDeleteBlogCategory() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.blogCategories}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
    },
  });
}

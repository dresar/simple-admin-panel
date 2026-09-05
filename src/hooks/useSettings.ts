import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import type { SiteSettings, Profile, HomeContent, AboutContent, BlockEntry, AIKey, MediaItem } from '@/types/models';

// Profile
export function useProfile() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiFetch<Profile>(API_ENDPOINTS.profile, { token }),
  });
}

export function useUpdateProfile() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<Profile>(API_ENDPOINTS.profile, { method: 'POST', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

// Home Content
export function useHomeContent() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['home-content'],
    queryFn: () => apiFetch<HomeContent>(API_ENDPOINTS.homeContent, { token }),
  });
}

export function useUpdateHomeContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<HomeContent>(API_ENDPOINTS.homeContent, { method: 'POST', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['home-content'] }),
  });
}

// About Content
export function useAboutContent() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['about-content'],
    queryFn: () => apiFetch<AboutContent>(API_ENDPOINTS.aboutContent, { token }),
  });
}

export function useUpdateAboutContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<AboutContent>(API_ENDPOINTS.aboutContent, { method: 'POST', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['about-content'] }),
  });
}

// Site Settings
export function useSiteSettings() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: () => apiFetch<SiteSettings>(API_ENDPOINTS.siteSettings, { token }),
  });
}

export function useUpdateSiteSettings() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) =>
      apiFetch<SiteSettings>(API_ENDPOINTS.siteSettings, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site-settings'] }),
  });
}

// Block Entries
export function useBlockEntries() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['block-entries'],
    queryFn: () => apiFetch<BlockEntry[]>(API_ENDPOINTS.blockEntries, { token }),
  });
}

export function useCreateBlockEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: 'ip' | 'domain'; value: string; reason?: string }) =>
      apiFetch<BlockEntry>(API_ENDPOINTS.blockEntries, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['block-entries'] }),
  });
}

export function useDeleteBlockEntry() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.blockEntries}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['block-entries'] }),
  });
}

// AI Keys
export function useAIKeys() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['ai-keys'],
    queryFn: () => apiFetch<AIKey[]>(API_ENDPOINTS.aiKeysList, { token }),
  });
}

export function useAddAIKey() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { provider: string; key: string }) =>
      apiFetch<AIKey>(API_ENDPOINTS.aiKeysAdd, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai-keys'] }),
  });
}

export function useDeleteAIKey() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(API_ENDPOINTS.aiKeysDelete(id), { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai-keys'] }),
  });
}

export function useTestAIKey() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ success: boolean; message?: string }>(API_ENDPOINTS.aiKeysTest(id), { method: 'POST', token }),
  });
}

export function useUploadAIKeys() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<{ imported: number }>(API_ENDPOINTS.aiKeysUpload, formData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai-keys'] }),
  });
}

// Media Library
export function useMediaList() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['media-list'],
    queryFn: () => apiFetch<MediaItem[]>(API_ENDPOINTS.mediaList, { token }),
  });
}

export function useUploadMedia() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<MediaItem>(API_ENDPOINTS.upload, formData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media-list'] }),
  });
}

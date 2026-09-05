import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import type { Message, Subscriber, WATemplate } from '@/types/models';

// Messages
export function useMessages() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => apiFetch<Message[]>(API_ENDPOINTS.messages, { token }),
  });
}

export function useMessage(id: number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => apiFetch<Message>(`${API_ENDPOINTS.messages}${id}/`, { token }),
    enabled: !!id,
  });
}

export function useMarkMessageRead() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.messages}${id}/`, { method: 'PATCH', body: { is_read: true }, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
}

export function useDeleteMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.messages}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });
}

// Subscribers
export function useSubscribers() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: () => apiFetch<Subscriber[]>(API_ENDPOINTS.subscribers, { token }),
  });
}

export function useCreateSubscriber() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; name?: string }) =>
      apiFetch<Subscriber>(API_ENDPOINTS.subscribers, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
  });
}

export function useUpdateSubscriber() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Subscriber> }) =>
      apiFetch<Subscriber>(`${API_ENDPOINTS.subscribers}${id}/`, { method: 'PATCH', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
  });
}

export function useDeleteSubscriber() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.subscribers}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscribers'] }),
  });
}

// WA Templates
export function useWATemplates() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['wa-templates'],
    queryFn: () => apiFetch<WATemplate[]>(API_ENDPOINTS.waTemplates, { token }),
  });
}

export function useCreateWATemplate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; content: string; variables?: string[] }) =>
      apiFetch<WATemplate>(API_ENDPOINTS.waTemplates, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wa-templates'] }),
  });
}

export function useUpdateWATemplate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WATemplate> }) =>
      apiFetch<WATemplate>(`${API_ENDPOINTS.waTemplates}${id}/`, { method: 'PATCH', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wa-templates'] }),
  });
}

export function useDeleteWATemplate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.waTemplates}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wa-templates'] }),
  });
}

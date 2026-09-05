import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiUpload } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';
import type { Experience, Education, Skill, SkillCategory, Certificate, CertificateCategory } from '@/types/models';

// Experience
export function useExperience() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['experience'],
    queryFn: () => apiFetch<Experience[]>(API_ENDPOINTS.experience, { token }),
  });
}

export function useCreateExperience() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<Experience>(API_ENDPOINTS.experience, formData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experience'] }),
  });
}

export function useUpdateExperience() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch<Experience>(`${API_ENDPOINTS.experience}${id}/`, { method: 'PATCH', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experience'] }),
  });
}

export function useDeleteExperience() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.experience}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experience'] }),
  });
}

// Education
export function useEducation() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['education'],
    queryFn: () => apiFetch<Education[]>(API_ENDPOINTS.education, { token }),
  });
}

export function useCreateEducation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<Education>(API_ENDPOINTS.education, formData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  });
}

export function useUpdateEducation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch<Education>(`${API_ENDPOINTS.education}${id}/`, { method: 'PATCH', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  });
}

export function useDeleteEducation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.education}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  });
}

// Skills
export function useSkills() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => apiFetch<Skill[]>(API_ENDPOINTS.skills, { token }),
  });
}

export function useSkillCategories() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['skill-categories'],
    queryFn: () => apiFetch<SkillCategory[]>(API_ENDPOINTS.skillCategories, { token }),
  });
}

export function useCreateSkill() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Skill>) =>
      apiFetch<Skill>(API_ENDPOINTS.skills, { method: 'POST', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  });
}

export function useUpdateSkill() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Skill> }) =>
      apiFetch<Skill>(`${API_ENDPOINTS.skills}${id}/`, { method: 'PATCH', body: data, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  });
}

export function useDeleteSkill() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.skills}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  });
}

// Certificates
export function useCertificates() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['certificates'],
    queryFn: () => apiFetch<Certificate[]>(API_ENDPOINTS.certificates, { token }),
  });
}

export function useCertificateCategories() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['certificate-categories'],
    queryFn: () => apiFetch<CertificateCategory[]>(API_ENDPOINTS.certificateCategories, { token }),
  });
}

export function useCreateCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiUpload<Certificate>(API_ENDPOINTS.certificates, formData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  });
}

export function useUpdateCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch<Certificate>(`${API_ENDPOINTS.certificates}${id}/`, { method: 'PATCH', body: formData, token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  });
}

export function useDeleteCertificate() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`${API_ENDPOINTS.certificates}${id}/`, { method: 'DELETE', token }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['certificates'] }),
  });
}

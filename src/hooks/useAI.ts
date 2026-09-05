import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

interface AIWriteRequest {
  topic: string;
  tone?: string;
  type?: 'project' | 'blog' | 'general';
}

interface AIWriteResponse {
  content: string;
}

interface AISeoRequest {
  content: string;
  keyword?: string;
}

interface AISeoResponse {
  title: string;
  description: string;
  keywords: string[];
  suggestions?: string[];
}

interface AIAnalyzeMessageRequest {
  message: string;
  sender?: string;
}

interface AIAnalyzeMessageResponse {
  sentiment: string;
  intent: string;
  summary: string;
  suggested_reply?: string;
}

interface AIChatRequest {
  message: string;
  context?: string;
}

interface AIChatResponse {
  reply: string;
}

export function useAIWrite() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: AIWriteRequest) =>
      apiFetch<AIWriteResponse>(API_ENDPOINTS.aiWrite, { method: 'POST', body: data, token }),
  });
}

export function useAISeo() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: AISeoRequest) =>
      apiFetch<AISeoResponse>(API_ENDPOINTS.aiSeo, { method: 'POST', body: data, token }),
  });
}

export function useAIAnalyzeMessage() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: AIAnalyzeMessageRequest) =>
      apiFetch<AIAnalyzeMessageResponse>(API_ENDPOINTS.aiAnalyzeMessage, { method: 'POST', body: data, token }),
  });
}

export function useAIChat() {
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: AIChatRequest) =>
      apiFetch<AIChatResponse>(API_ENDPOINTS.aiChat, { method: 'POST', body: data, token }),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import {
  CareerSession,
  CareerSessionStatus,
  CVDraft,
  ChatMessage,
  User,
  ProfessionalProfile,
} from '../types';

// Helper function to map backend CVDraft schema dictionary to frontend CVDraft structure
const mapBackendToFrontendCVDraft = (content: any, sessionId: string): CVDraft => {
  const info = content?.personal_info || {};
  return {
    session_id: sessionId,
    personal_info: {
      full_name: info.name?.value || '',
      email: info.email?.value || '',
      phone: info.phone?.value || '',
      location: info.location?.value || '',
      linkedin: info.linkedin_url?.value || info.linkedin?.value || '',
      github: info.github_url?.value || info.github?.value || '',
      website: info.personal_website?.value || info.website_url?.value || info.website?.value || '',
      confidence: (info.name?.confidence || 'LOW').toLowerCase() as any,
    },
    professional_headline: {
      text: content?.headline?.value || '',
      confidence: (content?.headline?.confidence || 'LOW').toLowerCase() as any,
    },
    summary: {
      text: content?.summary?.value || '',
      confidence: (content?.summary?.confidence || 'LOW').toLowerCase() as any,
    },
    experience: (content?.experience || []).map((exp: any, idx: number) => ({
      id: exp.id || `exp-${idx}`,
      company: exp.company?.value || '',
      role: exp.role?.value || '',
      start_date: exp.start_date?.value || '',
      end_date: exp.end_date?.value || '',
      current: !exp.end_date?.value || exp.end_date?.value === 'Present',
      description: exp.description?.value || '',
      bullet_points: exp.description?.value ? exp.description.value.split('\n').filter((l: string) => l.trim()) : [],
      confidence: (exp.company?.confidence || 'LOW').toLowerCase() as any,
    })),
    education: (content?.education || []).map((edu: any, idx: number) => ({
      id: edu.id || `edu-${idx}`,
      institution: edu.institution?.value || '',
      degree: edu.degree?.value || '',
      graduation_year: edu.graduation_year?.value || '',
      confidence: (edu.institution?.confidence || 'LOW').toLowerCase() as any,
    })),
    skills: (content?.skills || []).map((sk: any, idx: number) => ({
      id: sk.id || `sk-${idx}`,
      name: sk.name?.value || '',
      category: sk.type?.value || 'Technical',
      confidence: (sk.name?.confidence || 'LOW').toLowerCase() as any,
    })),
    projects: (content?.projects || []).map((p: any, idx: number) => ({
      id: p.id || `p-${idx}`,
      title: p.title?.value || '',
      description: p.description?.value || '',
      technologies: [],
      confidence: (p.title?.confidence || 'LOW').toLowerCase() as any,
    })),
    certifications: (content?.certifications || []).map((c: any, idx: number) => ({
      id: c.id || `c-${idx}`,
      title: c.name?.value || '',
      issuer: c.issuer?.value || '',
      issue_date: c.issue_date?.value || '',
      confidence: (c.name?.confidence || 'LOW').toLowerCase() as any,
    })),
    updated_at: new Date().toISOString(),
  };
};

// Helper function to map frontend CVDraft back to backend payload schema
const mapFrontendToBackendCVDraft = (draft: CVDraft): any => {
  return {
    personal_info: {
      name: { value: draft.personal_info.full_name, confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      email: { value: draft.personal_info.email, confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      phone: { value: draft.personal_info.phone, confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      location: { value: draft.personal_info.location, confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      linkedin_url: { value: draft.personal_info.linkedin || '', confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      github_url: { value: draft.personal_info.github || '', confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
      personal_website: { value: draft.personal_info.website || '', confidence: (draft.personal_info.confidence || 'LOW').toUpperCase() },
    },
    headline: { value: draft.professional_headline.text, confidence: (draft.professional_headline.confidence || 'LOW').toUpperCase() },
    summary: { value: draft.summary.text, confidence: (draft.summary.confidence || 'LOW').toUpperCase() },
    experience: draft.experience.map((exp) => ({
      company: { value: exp.company, confidence: (exp.confidence || 'LOW').toUpperCase() },
      role: { value: exp.title, confidence: (exp.confidence || 'LOW').toUpperCase() },
      start_date: { value: exp.start_date, confidence: (exp.confidence || 'LOW').toUpperCase() },
      end_date: { value: exp.end_date || '', confidence: (exp.confidence || 'LOW').toUpperCase() },
      description: { value: exp.description || exp.bullet_points.join('\n'), confidence: (exp.confidence || 'LOW').toUpperCase() },
    })),
    education: draft.education.map((edu) => ({
      institution: { value: edu.institution, confidence: (edu.confidence || 'LOW').toUpperCase() },
      degree: { value: edu.degree, confidence: (edu.confidence || 'LOW').toUpperCase() },
      graduation_year: { value: edu.graduation_year, confidence: (edu.confidence || 'LOW').toUpperCase() },
    })),
    skills: draft.skills.map((sk) => ({
      name: { value: sk.name, confidence: (sk.confidence || 'LOW').toUpperCase() },
      type: { value: sk.category || 'Technical', confidence: (sk.confidence || 'LOW').toUpperCase() },
    })),
    projects: draft.projects.map((p) => ({
      title: { value: p.title, confidence: (p.confidence || 'LOW').toUpperCase() },
      description: { value: p.description, confidence: (p.confidence || 'LOW').toUpperCase() },
    })),
    certifications: draft.certifications.map((c) => ({
      name: { value: c.title, confidence: (c.confidence || 'LOW').toUpperCase() },
      issuer: { value: c.issuer, confidence: (c.confidence || 'LOW').toUpperCase() },
      issue_date: { value: c.issue_date || '', confidence: (c.confidence || 'LOW').toUpperCase() },
    })),
  };
};

// Fetch all career sessions
export const useCareerSessions = () => {
  return useQuery<CareerSession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await apiClient.get('/career-sessions');
      // Adapt backend properties to the frontend expectations
      return data.map((item: any) => ({
        ...item,
        target_role: item.title || 'Untitled Role',
        career_goal: item.goal || 'IMPROVE_CV',
        document_uploaded: item.status !== 'CREATED',
        pending_review: item.status === 'AWAITING_REVIEW',
        draft_confirmed: item.status === 'COMPLETED' || item.status === 'IN_PROGRESS',
        current_stage: (item.status === 'CREATED' ? 'created' : 'completed') as any,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch status of a specific session
export const useCareerSessionStatus = (sessionId: string | undefined, refetchInterval: number | false = false) => {
  return useQuery<CareerSessionStatus>({
    queryKey: ['session-status', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/career-sessions/${sessionId}/status`);
      return data;
    },
    enabled: !!sessionId,
    refetchInterval,
    staleTime: 0,
  });
};

// Create new career session
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; target_role: string; career_goal?: string }) => {
      const { data } = await apiClient.post('/career-sessions', {
        goal: 'IMPROVE_CV',
        title: payload.title,
      });
      return {
        ...data,
        target_role: payload.target_role,
        career_goal: payload.career_goal || '',
        document_uploaded: false,
        pending_review: false,
        draft_confirmed: false,
        current_stage: 'created',
      } as CareerSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Delete career session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await apiClient.delete(`/career-sessions/${sessionId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Upload document
export const useUploadDocument = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file_name: string; file_text?: string; file_size?: number } | File | FormData) => {
      let body: FormData;
      if (payload instanceof FormData) {
        body = payload;
      } else if (payload instanceof File) {
        body = new FormData();
        body.append('file', payload);
      } else {
        body = new FormData();
        const blob = new Blob([payload.file_text || ''], { type: 'text/plain' });
        body.append('file', blob, payload.file_name);
      }
      
      const { data } = await apiClient.post(`/career-sessions/${sessionId}/documents/upload`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Return normalized response to visual Stepper containing the mapped draft
      return {
        status: 'pending_review',
        draft: mapBackendToFrontendCVDraft(data.draft, sessionId),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-status', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Confirm draft after human review
export const useConfirmDraft = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { cv_draft: CVDraft }) => {
      const mappedContent = mapFrontendToBackendCVDraft(payload.cv_draft);
      const { data } = await apiClient.post(`/career-sessions/${sessionId}/documents/confirm`, {
        document_type: 'cv',
        content: mappedContent,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-status', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['cv-draft', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

// Get CV Draft
export const useCVDraft = (sessionId: string | undefined) => {
  return useQuery<CVDraft>({
    queryKey: ['cv-draft', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/career-sessions/${sessionId}/cv-draft`);
      return mapBackendToFrontendCVDraft(data.content, sessionId!);
    },
    enabled: !!sessionId,
    staleTime: 10 * 60 * 1000,
  });
};

// Update CV Draft with Optimistic Updates
export const useUpdateCVDraft = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: CVDraft) => {
      const mappedContent = mapFrontendToBackendCVDraft(draft);
      const { data } = await apiClient.put(`/career-sessions/${sessionId}/cv-draft`, {
        content: mappedContent,
      });
      return mapBackendToFrontendCVDraft(data.content, sessionId);
    },
    onMutate: async (newDraft) => {
      await queryClient.cancelQueries({ queryKey: ['cv-draft', sessionId] });
      const previousDraft = queryClient.getQueryData<CVDraft>(['cv-draft', sessionId]);
      queryClient.setQueryData(['cv-draft', sessionId], newDraft);
      return { previousDraft };
    },
    onError: (_err, _newDraft, context) => {
      if (context?.previousDraft) {
        queryClient.setQueryData(['cv-draft', sessionId], context.previousDraft);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cv-draft', sessionId] });
    },
  });
};

// Fetch Conversation history
export const useConversation = (sessionId: string | undefined) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['conversation', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/career-sessions/${sessionId}/conversation`);
      const backendMessages = data.messages || [];
      return backendMessages.map((msg: any) => ({
        id: msg.id,
        session_id: sessionId!,
        sender: msg.role === 'AI' ? 'coach' : 'user',
        text: msg.content,
        created_at: msg.created_at,
      })) as ChatMessage[];
    },
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
};

// Send message to AI Coach
export const useSendMessage = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { text: string }) => {
      const { data } = await apiClient.post(`/career-sessions/${sessionId}/conversation/messages`, {
        content: payload.text,
        input_type: 'TEXT',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', sessionId] });
    },
  });
};

// Generate Export
export const useGenerateExport = (sessionId: string) => {
  return useMutation({
    mutationFn: async (payload: { template: string; file_type?: string }) => {
      const { data } = await apiClient.post(
        `/career-sessions/${sessionId}/exports/cv?file_type=${payload.file_type || 'PDF'}&template=${payload.template}`
      );
      return data;
    },
  });
};

// Fetch User Profile
export const useUserProfile = () => {
  return useQuery<ProfessionalProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/profile');
      return {
        ...data,
        target_career: data.headline || '',
        linkedin: data.linkedin_url || '',
        github: data.github_url || '',
        website: data.personal_website || '',
        bio: data.summary || '',
        last_synced_at: data.last_synced_from_cv_at || null,
      };
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Update User Profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProfessionalProfile>) => {
      // Map legacy fields back to backend parameters
      const mappedPayload: any = { ...payload };
      if (payload.linkedin !== undefined) mappedPayload.linkedin_url = payload.linkedin;
      if (payload.github !== undefined) mappedPayload.github_url = payload.github;
      if (payload.website !== undefined) mappedPayload.personal_website = payload.website;
      if (payload.bio !== undefined) mappedPayload.summary = payload.bio;

      const { data } = await apiClient.put('/profile', mappedPayload);
      return {
        ...data,
        target_career: data.headline || '',
        linkedin: data.linkedin_url || '',
        github: data.github_url || '',
        website: data.personal_website || '',
        bio: data.summary || '',
        last_synced_at: data.last_synced_from_cv_at || null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

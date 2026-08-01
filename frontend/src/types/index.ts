export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export type WorkflowStage =
  | 'created'
  | 'document_uploaded'
  | 'processing'
  | 'pending_review'
  | 'draft_confirmed'
  | 'cv_generated'
  | 'completed';

export interface CareerSession {
  id: string;
  user_id: string;
  title: string;
  target_role: string;
  career_goal: string;
  document_uploaded: boolean;
  pending_review: boolean;
  draft_confirmed: boolean;
  cv_generated?: boolean;
  cover_letter_generated?: boolean;
  current_stage: WorkflowStage;
  resume_score?: number;
  created_at: string;
  updated_at: string;
}

export interface CareerSessionStatus {
  document_uploaded: boolean;
  pending_review: boolean;
  draft_confirmed: boolean;
  cv_generated: boolean;
  cover_letter_generated: boolean;
  completion_percentage: number;
  file_name?: string;
  file_size?: number;
}

export interface DraftPersonal {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  confidence: ConfidenceLevel;
}

export interface DraftExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  bullet_points: string[];
  confidence: ConfidenceLevel;
}

export interface DraftEducation {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  graduation_year: string;
  gpa?: string;
  confidence: ConfidenceLevel;
}

export interface DraftSkill {
  id: string;
  category: string;
  name: string;
  confidence: ConfidenceLevel;
}

export interface DraftProject {
  id: string;
  title: string;
  description: string;
  link?: string;
  technologies: string[];
  confidence: ConfidenceLevel;
}

export interface DraftCertification {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  confidence: ConfidenceLevel;
}

export interface CVDraft {
  session_id: string;
  personal_info: DraftPersonal;
  professional_headline: { text: string; confidence: ConfidenceLevel };
  summary: { text: string; confidence: ConfidenceLevel };
  experience: DraftExperience[];
  education: DraftEducation[];
  skills: DraftSkill[];
  projects: DraftProject[];
  certifications: DraftCertification[];
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'coach';
  text: string;
  created_at: string;
  action_suggestions?: string[];
}

export type ExportTemplate = 'executive' | 'modern' | 'minimal' | 'corporate' | 'creative';

export interface ExportConfig {
  template: ExportTemplate;
  primary_color: string;
  file_type: 'PDF';
}

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  email?: string | null;
  headline?: string | null;
  summary?: string | null;
  years_of_experience?: number | null;
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  personal_website?: string | null;
  profile_photo_url?: string | null;
  last_synced_from_cv_at?: string | null;
  target_career?: string | null;
  
  // Legacy layout compatibility properties
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  bio?: string | null;
  last_synced_at?: string | null;
  synced_session_title?: string | null;
  created_at?: string | null;
}

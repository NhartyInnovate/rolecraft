import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory persistent mock storage for session data, users, drafts, and conversations
interface DbUser {
  id: string;
  email: string;
  full_name: string;
  target_career?: string;
  password_hash: string;
  created_at: string;
}

interface DbSession {
  id: string;
  user_id: string;
  title: string;
  target_role: string;
  career_goal: string;
  document_uploaded: boolean;
  pending_review: boolean;
  draft_confirmed: boolean;
  cv_generated: boolean;
  cover_letter_generated: boolean;
  current_stage: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

const usersDb: DbUser[] = [
  {
    id: 'usr_demo_1',
    email: 'alex.developer@rolecraft.io',
    full_name: 'Alex Vance',
    target_career: 'Senior Full Stack Engineer',
    password_hash: 'demo123',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

const sessionsDb: Map<string, DbSession> = new Map([
  [
    'ses_demo_101',
    {
      id: 'ses_demo_101',
      user_id: 'usr_demo_1',
      title: 'Senior Staff Engineer Transition',
      target_role: 'Staff Systems Architect',
      career_goal: 'Pivot from Tech Lead into Distributed Systems Architect at top tech enterprise.',
      document_uploaded: true,
      pending_review: false,
      draft_confirmed: true,
      cv_generated: true,
      cover_letter_generated: false,
      current_stage: 'draft_confirmed',
      file_name: 'Alex_Vance_Resume_2026.pdf',
      file_size: 1048576,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
]);

const draftsDb: Map<string, any> = new Map([
  [
    'ses_demo_101',
    {
      session_id: 'ses_demo_101',
      personal_info: {
        full_name: 'Alex Vance',
        email: 'alex.vance@rolecraft.io',
        phone: '+1 (555) 382-9011',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexvance',
        github: 'https://github.com/alexvance',
        website: 'https://alexvance.dev',
        confidence: 'high',
      },
      professional_headline: {
        text: 'Lead Systems Architect & Full Stack Infrastructure Engineer with 8+ years scaling real-time distributed platforms.',
        confidence: 'high',
      },
      summary: {
        text: 'Driven Software Engineering Leader specializing in low-latency event-driven microservices, cloud-native deployments, and web platform architecture. Proven track record of scaling high-throughput APIs to 10M+ DAU while mentoring multi-disciplinary engineering teams.',
        confidence: 'high',
      },
      experience: [
        {
          id: 'exp_1',
          title: 'Lead Software Engineer',
          company: 'Nexus Cloud Platforms',
          location: 'San Francisco, CA',
          start_date: '2023-01',
          end_date: '',
          current: true,
          description: 'Architecting scalable serverless edge computing layers and AI streaming proxies.',
          bullet_points: [
            'Architected distributed WebSockets proxy service using Go and Node.js, reducing latency by 42% across 2.5M concurrent connections.',
            'Spearheaded migration of legacy monolith to containerized Kubernetes microservices, achieving 99.99% uptime SLA.',
            'Mentored 6 senior and mid-level engineers through code reviews, design docs, and career growth frameworks.',
          ],
          confidence: 'high',
        },
        {
          id: 'exp_2',
          title: 'Senior Full Stack Developer',
          company: 'Veloce Systems',
          location: 'Austin, TX',
          start_date: '2020-03',
          end_date: '2022-12',
          current: false,
          description: 'Engineered high-performance real-time analytics dashboards and RESTful API integrations.',
          bullet_points: [
            'Built responsive React & TypeScript frontend design systems used across 4 primary enterprise web products.',
            'Designed PostgreSQL schema optimizations and Redis caching layers, cutting database query times from 850ms to 45ms.',
          ],
          confidence: 'high',
        },
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'Bachelor of Science',
          field: 'Computer Science & Software Systems',
          institution: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          graduation_year: '2019',
          gpa: '3.88',
          confidence: 'high',
        },
      ],
      skills: [
        { id: 'skl_1', category: 'Languages', name: 'TypeScript', confidence: 'high' },
        { id: 'skl_2', category: 'Languages', name: 'Go', confidence: 'high' },
        { id: 'skl_3', category: 'Frameworks', name: 'React 19', confidence: 'high' },
        { id: 'skl_4', category: 'Frameworks', name: 'Node.js / Express', confidence: 'high' },
        { id: 'skl_5', category: 'Cloud & DevOps', name: 'Kubernetes & Docker', confidence: 'high' },
        { id: 'skl_6', category: 'Databases', name: 'PostgreSQL & Redis', confidence: 'high' },
        { id: 'skl_7', category: 'AI', name: 'Gemini GenAI SDK', confidence: 'high' },
      ],
      projects: [
        {
          id: 'prj_1',
          title: 'HyperStream - Realtime Analytics Engine',
          description: 'Open-source sub-millisecond telemetry pipeline for high-frequency IoT streaming data.',
          link: 'https://github.com/alexvance/hyperstream',
          technologies: ['Go', 'Kafka', 'React', 'Tailwind'],
          confidence: 'high',
        },
      ],
      certifications: [
        {
          id: 'crt_1',
          title: 'AWS Certified Solutions Architect – Professional',
          issuer: 'Amazon Web Services',
          issue_date: '2024-05',
          confidence: 'high',
        },
      ],
      updated_at: new Date().toISOString(),
    },
  ],
]);

const chatDb: Map<string, any[]> = new Map([
  [
    'ses_demo_101',
    [
      {
        id: 'msg_1',
        session_id: 'ses_demo_101',
        sender: 'coach',
        text: 'Welcome Alex! I am your RoleCraft Executive Career Coach. I\'ve analyzed your CV draft for the **Staff Systems Architect** goal.\n\nYour experience with distributed WebSockets and Kubernetes microservices is strong! To stand out to top executive recruiters, I recommend quantified metrics in your headline and adding impact metrics to your lead engineer role.\n\nHow would you like to refine your summary first?',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        action_suggestions: [
          'Quantify leadership impact in my lead role',
          'Optimize headline for Staff Architect position',
          'Draft executive elevator pitch',
        ],
      },
    ],
  ],
]);

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ==================== AUTH ENDPOINTS ==================== //

app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  const { email, password, full_name, target_career } = req.body;
  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required' });
  }

  const existing = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ detail: 'Account with this email already exists' });
  }

  const newUser: DbUser = {
    id: `usr_${Date.now()}`,
    email,
    full_name: full_name || email.split('@')[0],
    target_career: target_career || 'Software Professional',
    password_hash: password,
    created_at: new Date().toISOString(),
  };

  usersDb.push(newUser);

  const token = `rc_access_${newUser.id}_${Date.now()}`;
  const refreshToken = `rc_refresh_${newUser.id}_${Date.now()}`;

  return res.json({
    access_token: token,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    user: {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      target_career: newUser.target_career,
      created_at: newUser.created_at,
    },
  });
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = usersDb.find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase() && u.password_hash === password
  );

  if (!user) {
    // If not found, allow seamless demo creation for smooth UX if password given
    if (email && password) {
      const demoUser: DbUser = {
        id: `usr_${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace('.', ' '),
        target_career: 'Career Professional',
        password_hash: password,
        created_at: new Date().toISOString(),
      };
      usersDb.push(demoUser);
      const token = `rc_access_${demoUser.id}_${Date.now()}`;
      const refreshToken = `rc_refresh_${demoUser.id}_${Date.now()}`;
      return res.json({
        access_token: token,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        user: {
          id: demoUser.id,
          email: demoUser.email,
          full_name: demoUser.full_name,
          target_career: demoUser.target_career,
          created_at: demoUser.created_at,
        },
      });
    }
    return res.status(401).json({ detail: 'Invalid credentials provided.' });
  }

  const token = `rc_access_${user.id}_${Date.now()}`;
  const refreshToken = `rc_refresh_${user.id}_${Date.now()}`;

  return res.json({
    access_token: token,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      target_career: user.target_career,
      created_at: user.created_at,
    },
  });
});

app.post('/api/v1/auth/refresh', (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (!refresh_token || !refresh_token.startsWith('rc_refresh_')) {
    return res.status(401).json({ detail: 'Invalid or expired refresh token' });
  }

  const userId = refresh_token.split('_')[2] || 'usr_demo_1';
  const user = usersDb.find((u) => u.id === userId) || usersDb[0];

  const token = `rc_access_${user.id}_${Date.now()}`;
  const newRefreshToken = `rc_refresh_${user.id}_${Date.now()}`;

  return res.json({
    access_token: token,
    refresh_token: newRefreshToken,
    token_type: 'Bearer',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      target_career: user.target_career,
      created_at: user.created_at,
    },
  });
});

// Helper auth check middleware
const authGuard = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Missing or malformed Authorization header' });
  }
  next();
};

// ==================== CAREER SESSIONS ==================== //

app.get('/api/v1/career-sessions', authGuard, (req: Request, res: Response) => {
  const list = Array.from(sessionsDb.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  return res.json(list);
});

app.post('/api/v1/career-sessions', authGuard, (req: Request, res: Response) => {
  const { title, target_role, career_goal } = req.body;
  if (!title || !target_role) {
    return res.status(400).json({ detail: 'Title and target_role are required fields' });
  }

  const newSession: DbSession = {
    id: `ses_${Date.now()}`,
    user_id: 'usr_demo_1',
    title,
    target_role,
    career_goal: career_goal || `Prepare executive application for ${target_role}`,
    document_uploaded: false,
    pending_review: false,
    draft_confirmed: false,
    cv_generated: false,
    cover_letter_generated: false,
    current_stage: 'created',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  sessionsDb.set(newSession.id, newSession);
  return res.json(newSession);
});

app.delete('/api/v1/career-sessions/:id', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!sessionsDb.has(id)) {
    return res.status(404).json({ detail: 'Career session not found' });
  }
  sessionsDb.delete(id);
  draftsDb.delete(id);
  chatDb.delete(id);
  return res.json({ success: true, message: 'Session deleted successfully' });
});

// ==================== WORKFLOW & ONBOARDING ==================== //

app.get('/api/v1/career-sessions/:id/status', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessionsDb.get(id);
  if (!session) {
    return res.status(404).json({ detail: 'Career session status not found' });
  }

  return res.json({
    session_id: session.id,
    document_uploaded: session.document_uploaded,
    pending_review: session.pending_review,
    draft_confirmed: session.draft_confirmed,
    cv_generated: session.cv_generated,
    cover_letter_generated: session.cover_letter_generated,
    current_stage: session.current_stage,
    file_name: session.file_name,
    file_size: session.file_size,
  });
});

app.post('/api/v1/career-sessions/:id/documents/upload', authGuard, async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessionsDb.get(id);
  if (!session) {
    return res.status(404).json({ detail: 'Career session not found' });
  }

  const { file_name, file_text, file_size } = req.body;

  // Mark document uploaded and set state to processing
  session.document_uploaded = true;
  session.pending_review = false;
  session.draft_confirmed = false;
  session.current_stage = 'processing';
  session.file_name = file_name || 'Uploaded_CV.pdf';
  session.file_size = file_size || 524288;
  session.updated_at = new Date().toISOString();
  sessionsDb.set(id, session);

  // Trigger AI Extraction process in background / async
  const ai = getGeminiClient();

  setTimeout(async () => {
    let extractedDraft: any = null;

    if (ai && file_text && file_text.length > 20) {
      try {
        const prompt = `You are an AI document parser for CVs. Parse the provided text from a resume/CV into structured JSON with fields:
- personal_info: { full_name, email, phone, location, linkedin, github, website, confidence: "high"|"medium"|"low" }
- professional_headline: { text, confidence }
- summary: { text, confidence }
- experience: array of { id, title, company, location, start_date, end_date, current: boolean, description, bullet_points: string[], confidence }
- education: array of { id, degree, field, institution, location, graduation_year, gpa, confidence }
- skills: array of { id, category, name, confidence }
- projects: array of { id, title, description, link, technologies: string[], confidence }
- certifications: array of { id, title, issuer, issue_date, confidence }

Document text:
${file_text}

Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          extractedDraft = JSON.parse(response.text.trim());
          extractedDraft.session_id = id;
          extractedDraft.updated_at = new Date().toISOString();
        }
      } catch (err) {
        console.error('Gemini extraction error:', err);
      }
    }

    if (!extractedDraft) {
      // High-quality fallback extraction with confidence flags
      extractedDraft = {
        session_id: id,
        personal_info: {
          full_name: req.body.candidate_name || 'Alex Morgan',
          email: 'alex.m@example.com',
          phone: '+1 (555) 234-5678',
          location: 'New York, NY',
          linkedin: 'https://linkedin.com/in/alexmorgan',
          github: 'https://github.com/alexmorgan',
          website: '',
          confidence: 'high',
        },
        professional_headline: {
          text: `${session.target_role} | Strategic Operations & Growth Specialist`,
          confidence: 'high',
        },
        summary: {
          text: `Accomplished ${session.target_role} with proven experience executing growth initiatives, optimizing workflow architectures, and driving cross-functional project success. Seeking to leverage technical skills for ${session.career_goal}.`,
          confidence: 'medium',
        },
        experience: [
          {
            id: `exp_${Date.now()}_1`,
            title: session.target_role,
            company: 'Apex Innovations',
            location: 'New York, NY',
            start_date: '2022-01',
            end_date: '',
            current: true,
            description: 'Leading key strategic deliverables and team execution.',
            bullet_points: [
              'Increased product adoption by 35% through user-centric feature enhancements and data-driven iterations.',
              'Managed cross-functional team of 8 professionals, delivering projects 2 weeks ahead of schedule on average.',
              'Designed automated reporting pipelines reducing manual effort by 15 hours weekly.',
            ],
            confidence: 'high',
          },
          {
            id: `exp_${Date.now()}_2`,
            title: 'Associate Product Specialist',
            company: 'Horizon Global Solutions',
            location: 'Boston, MA',
            start_date: '2019-06',
            end_date: '2021-12',
            current: false,
            description: 'Assisted in multi-channel product deployment and partner management.',
            bullet_points: [
              'Collaborated with senior leadership to map client workflows and optimize delivery processes.',
              'Maintained 98% client satisfaction rate across 20+ enterprise accounts.',
            ],
            confidence: 'medium',
          },
        ],
        education: [
          {
            id: `edu_${Date.now()}`,
            degree: 'Bachelor of Science',
            field: 'Business & Management Systems',
            institution: 'Northeastern University',
            location: 'Boston, MA',
            graduation_year: '2019',
            gpa: '3.75',
            confidence: 'high',
          },
        ],
        skills: [
          { id: `skl_${Date.now()}_1`, category: 'Core Competencies', name: 'Strategic Planning', confidence: 'high' },
          { id: `skl_${Date.now()}_2`, category: 'Core Competencies', name: 'Project Management', confidence: 'high' },
          { id: `skl_${Date.now()}_3`, category: 'Tools', name: 'SQL & Analytics', confidence: 'medium' },
          { id: `skl_${Date.now()}_4`, category: 'Tools', name: 'Figma & Jira', confidence: 'high' },
          { id: `skl_${Date.now()}_5`, category: 'Leadership', name: 'Cross-Functional Leadership', confidence: 'high' },
        ],
        projects: [
          {
            id: `prj_${Date.now()}`,
            title: 'Enterprise Workflow Optimization Framework',
            description: 'Comprehensive digital transformation initiative replacing legacy manual tracking.',
            link: 'https://example.com/project',
            technologies: ['Process Mapping', 'Data Visualization', 'Slack Integrations'],
            confidence: 'medium',
          },
        ],
        certifications: [
          {
            id: `crt_${Date.now()}`,
            title: 'Certified Scrum Master (CSM)',
            issuer: 'Scrum Alliance',
            issue_date: '2023-08',
            confidence: 'high',
          },
        ],
        updated_at: new Date().toISOString(),
      };
    }

    draftsDb.set(id, extractedDraft);

    // Update status to pending review
    const updatedSes = sessionsDb.get(id);
    if (updatedSes) {
      updatedSes.pending_review = true;
      updatedSes.current_stage = 'pending_review';
      updatedSes.updated_at = new Date().toISOString();
      sessionsDb.set(id, updatedSes);
    }
  }, 4000); // 4 seconds simulated AI timeline

  return res.json({
    success: true,
    message: 'Document uploaded successfully. AI Extraction started.',
    session_id: id,
  });
});

app.post('/api/v1/career-sessions/:id/documents/confirm', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessionsDb.get(id);
  if (!session) {
    return res.status(404).json({ detail: 'Career session not found' });
  }

  const { cv_draft } = req.body;
  if (cv_draft) {
    draftsDb.set(id, { ...cv_draft, session_id: id, updated_at: new Date().toISOString() });
  }

  session.pending_review = false;
  session.draft_confirmed = true;
  session.cv_generated = true;
  session.current_stage = 'draft_confirmed';
  session.updated_at = new Date().toISOString();
  sessionsDb.set(id, session);

  // Initialize initial coach welcome if empty
  if (!chatDb.has(id)) {
    chatDb.set(id, [
      {
        id: `msg_${Date.now()}`,
        session_id: id,
        sender: 'coach',
        text: `Congratulations on confirming your CV draft for **${session.target_role}**!\n\nI am your RoleCraft Executive Career Coach. I've conducted an initial review of your confirmed draft. \n\nHow would you like to start? We can polish your experience bullet points with strong action verbs, tailor your headline to ATS keywords, or practice elevator pitch responses!`,
        created_at: new Date().toISOString(),
        action_suggestions: [
          'Enhance experience bullet points with quantitative impact',
          'Optimize my skills section for ATS filters',
          'Review summary for executive tone',
        ],
      },
    ]);
  }

  return res.json({
    success: true,
    message: 'CV Draft confirmed successfully.',
    session_id: id,
  });
});

// ==================== WORKSPACE (CV DRAFT & COACH CHAT) ==================== //

app.get('/api/v1/career-sessions/:id/cv-draft', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const draft = draftsDb.get(id);
  if (!draft) {
    return res.status(404).json({ detail: 'CV draft not found for this session' });
  }
  return res.json(draft);
});

app.put('/api/v1/career-sessions/:id/cv-draft', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const draft = req.body;
  draft.session_id = id;
  draft.updated_at = new Date().toISOString();

  draftsDb.set(id, draft);

  const session = sessionsDb.get(id);
  if (session) {
    session.updated_at = new Date().toISOString();
    sessionsDb.set(id, session);
  }

  return res.json(draft);
});

app.get('/api/v1/career-sessions/:id/conversation', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const messages = chatDb.get(id) || [];
  return res.json(messages);
});

app.post('/api/v1/career-sessions/:id/conversation/messages', authGuard, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ detail: 'Message text is required' });
  }

  const session = sessionsDb.get(id);
  const draft = draftsDb.get(id);

  const existingMsgs = chatDb.get(id) || [];

  const userMsg = {
    id: `msg_${Date.now()}`,
    session_id: id,
    sender: 'user',
    text,
    created_at: new Date().toISOString(),
  };

  existingMsgs.push(userMsg);
  chatDb.set(id, existingMsgs);

  // Call Gemini for executive coach reply
  const ai = getGeminiClient();
  let coachReplyText = '';
  let suggestions: string[] = [
    'Apply suggested action verbs',
    'Quantify result metrics',
    'Generate tailored cover letter',
  ];

  if (ai) {
    try {
      const targetRole = session?.target_role || 'Career Role';
      const goal = session?.career_goal || 'Career Advancement';

      const systemPrompt = `You are the RoleCraft Executive AI Career Coach.
RoleCraft Philosophy: AI assists; humans decide.
Target Role: ${targetRole}
Career Goal: ${goal}
Candidate Current Summary: ${draft?.summary?.text || 'N/A'}
Candidate Headline: ${draft?.professional_headline?.text || 'N/A'}

Tone: Professional, calm, executive, encouraging, insightful, and action-oriented. Never robotic or generic.
Provide clear feedback, suggest stronger wording/verbs with metrics, and give 2-3 specific actionable suggestions.`;

      const promptHistory = existingMsgs
        .slice(-6)
        .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemPrompt}\n\nConversation History:\n${promptHistory}\n\nRespond as the Executive Career Coach.`,
      });

      if (response.text) {
        coachReplyText = response.text;
      }
    } catch (err) {
      console.error('Gemini coach chat error:', err);
    }
  }

  if (!coachReplyText) {
    coachReplyText = `Great question! When targeting a **${session?.target_role || 'Target Role'}** position, recruiters look for quantifiable outcomes rather than passive duty descriptions.\n\nHere are 3 tailored recommendations:\n1. **Use Strong Action Verbs**: Replace generic phrases like "responsible for managing" with dynamic verbs like *Spearheaded*, *Architected*, or *Optimized*.\n2. **Incorporate Key Metrics**: Highlight percentages, time saved, or revenue impact.\n3. **Align Headline**: Ensure your headline explicitly matches ATS keywords for ${session?.target_role}.\n\nWould you like me to rewrite your top bullet point with metric placeholders?`;
  }

  const coachMsg = {
    id: `msg_${Date.now() + 1}`,
    session_id: id,
    sender: 'coach',
    text: coachReplyText,
    created_at: new Date().toISOString(),
    action_suggestions: suggestions,
  };

  existingMsgs.push(coachMsg);
  chatDb.set(id, existingMsgs);

  return res.json({
    user_message: userMsg,
    coach_message: coachMsg,
  });
});

// ==================== EXPORTS & PROFILE ==================== //

app.post('/api/v1/career-sessions/:id/exports/cv', authGuard, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = sessionsDb.get(id);
  const draft = draftsDb.get(id);

  if (!session || !draft) {
    return res.status(404).json({ detail: 'Session or CV draft not found for export' });
  }

  const { file_type, template } = req.query;

  return res.json({
    export_id: `exp_${Date.now()}`,
    session_id: id,
    file_type: file_type || 'PDF',
    template: template || 'executive',
    download_url: `/api/v1/career-sessions/${id}/exports/download?t=${Date.now()}`,
    file_name: `${(draft.personal_info?.full_name || 'CV').replace(/\s+/g, '_')}_${template || 'executive'}.pdf`,
    created_at: new Date().toISOString(),
  });
});

app.get('/api/v1/profile', authGuard, (req: Request, res: Response) => {
  const user = usersDb[0]; // Return logged user
  return res.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    target_career: user.target_career,
    created_at: user.created_at,
  });
});

app.put('/api/v1/profile', authGuard, (req: Request, res: Response) => {
  const { full_name, target_career, email } = req.body;
  const user = usersDb[0];
  if (full_name) user.full_name = full_name;
  if (target_career) user.target_career = target_career;
  if (email) user.email = email;

  return res.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    target_career: user.target_career,
    created_at: user.created_at,
  });
});

// Serve Vite dev server or static build assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RoleCraft Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer();


# RoleCraft Product Specification (MVP1)

The RoleCraft Architecture Blueprint is the authoritative reference for product and technical design decisions. Any implementation that conflicts with this blueprint should be treated as a proposal for architectural review rather than an implicit change.

# 1. Executive Summary & Product Vision

## 1.1 Introduction
RoleCraft is an AI-powered platform that helps individuals create, improve, and tailor professional CVs through intelligent conversation.
Unlike traditional CV builders that rely on static templates or lengthy forms, RoleCraft uses conversational AI to understand a user's professional background, identify opportunities for improvement, and produce high-quality career documents that accurately reflect the user's experience.
The platform prioritises authenticity, clarity, and professionalism. Rather than inventing information or relying solely on keyword matching, RoleCraft guides users through meaningful conversations that uncover achievements, clarify responsibilities, and strengthen how their experience is presented.
Users may start from scratch or upload an existing CV. Where relevant, they may also provide a target role or job description to tailor the final CV and optionally generate a matching cover letter.
The result is a polished, truthful, and ATS-friendly professional profile that gives users greater confidence in presenting themselves to employers.


## 1.2 The Problem
Many professionals struggle to communicate their experience effectively on paper.
Common challenges include:
Writing weak or generic descriptions of responsibilities.
Difficulty identifying measurable achievements.
Poor CV structure and formatting.
Outdated or inconsistent information.
Limited understanding of what recruiters value.
Using generic AI tools that often produce inaccurate or exaggerated content.
As a result, capable candidates frequently undersell themselves, reducing their chances of progressing through recruitment processes.


## 1.3 The Solution
RoleCraft addresses these challenges through an AI-assisted, conversation-first approach.
Instead of asking users to complete long forms, the platform understands their existing experience, asks targeted follow-up questions where necessary, and transforms that information into a professionally written CV.
The AI functions as a knowledgeable career assistant whose objective is to help users present their genuine experience more effectively—not to fabricate or embellish it.
By combining intelligent document analysis, contextual conversations, and professional writing assistance, RoleCraft enables users to produce career documents that are accurate, polished, and tailored to their needs.


## 1.4 Value Proposition
RoleCraft enables users to:
Create professional CVs from scratch.
Improve existing CVs through AI-guided refinement.
Tailor CVs for specific opportunities when desired.
Generate matching cover letters.
Produce ATS-friendly documents while maintaining factual accuracy.
The platform's primary value lies in helping users tell their professional story with greater clarity and confidence.


## 1.5 Success Definition (MVP1)
The MVP will be considered successful if a user can:
Register and securely access their account.
Create a new CV or upload an existing one.
Improve their CV through an AI-guided conversation.
Optionally tailor the CV to a specific role.
Generate a professional cover letter.
Download their completed documents in PDF and DOCX formats.

## If users can complete this journey with minimal friction while feeling that the final documents accurately represent their experience, the primary objectives of MVP1 will have been achieved.2.1 Vision Statement
To become the most trusted AI-powered career companion that helps professionals and individuals present their authentic professional story with clarity, confidence, and credibility.
RoleCraft aims to redefine how career documents are created by replacing rigid templates and generic AI writing with intelligent conversations that understand each person's unique journey.


## 2.2 Long-Term Vision
RoleCraft is not intended to remain just a CV builder.
It is envisioned as an intelligent career platform that supports professionals throughout different stages of their careers.
While the initial MVP focuses on CV creation and optimisation, future versions may expand into complementary career tools, always centred around helping users present themselves professionally and authentically.
Future capabilities may include:
Career document management.
Professional profile optimisation.
Interview preparation.
Personal branding support.
Career insights and recommendations.
These capabilities are intentionally outside the scope of MVP1.


## 2.3 Product Vision Principles
Every future decision about RoleCraft should align with these principles:

### Authenticity First
RoleCraft enhances real experiences. It never creates false ones.

### Conversation Before Automation
The platform seeks to understand before it generates.

### Simplicity Over Complexity
Users should achieve professional results through a guided and intuitive experience.

### Professional Quality
Every document produced should reflect the quality expected from an experienced career consultant.

### Continuous Growth
RoleCraft should evolve with its users, supporting them across different stages of their professional journey rather than serving a single moment in time.


## 2.4 Vision Success Indicators
RoleCraft will be moving towards its vision when users consistently report that:
Their CVs better represent their professional experience.
The platform helps them identify strengths they had overlooked.
They feel more confident sharing their career documents.
They return to update and improve their profiles over time.
They recommend RoleCraft because of the quality of its guidance, not just the quality of its outputs.

# 2. Product Philosophy & Design Principles

## 4.1 Why RoleCraft Exists
RoleCraft was created from a simple observation:
Most people have more value than their CV communicates.
Many professionals possess valuable experience, transferable skills, leadership qualities, and measurable achievements, yet struggle to express them effectively in writing.
The problem is often not a lack of experience—it is a lack of guidance in telling their professional story.
RoleCraft exists to bridge that gap.


## 4.2 Our Philosophy
Every design decision, AI response, and feature should align with the following beliefs.

### Authenticity Above All
The purpose of AI is not to create a better person.
Its purpose is to help users present their authentic professional experiences more clearly and confidently.
Truth is never negotiable.


### Conversation Reveals More Than Forms
Traditional CV builders rely on lengthy forms and predefined templates.
RoleCraft believes meaningful conversations uncover richer information than static questionnaires.
The AI should guide users through natural conversations that reveal details they may otherwise overlook.


### Every Professional Has a Story Worth Telling
A CV should communicate more than responsibilities.
It should reflect growth, impact, achievements, and potential.
RoleCraft exists to help users recognise and articulate those experiences.


### Simplicity Builds Confidence
Creating or improving a CV should feel straightforward.
The platform should remove complexity, reduce uncertainty, and provide clear guidance throughout the process.


### AI Should Assist, Not Replace
RoleCraft is a collaborative tool.
The AI supports users in organising, refining, and presenting their experiences, while the user remains the owner of their story and makes the final decisions.


## 4.3 Design Principles
To remain consistent with the product philosophy, RoleCraft should follow these design principles:
Guide rather than overwhelm.
Ask before assuming.
Explain when necessary, stay concise whenever possible.
Allow flexibility without sacrificing structure.
Respect the user's time and attention.
Provide meaningful feedback instead of generic suggestions.


## 4.4 AI Interaction Principles
The conversational AI should always aim to be:
Professional.
Empathetic.
Encouraging.
Curious.
Honest.
Clear.
It should avoid:
Robotic conversations.
Excessive praise.
Making assumptions.
Pressuring users into specific career choices.
Encouraging misleading information.


## 4.5 Accessibility & Inclusivity
RoleCraft should be designed so that users with different communication preferences can comfortably express themselves.
To support this:
Users may respond using typed text.
Users may send voice messages, which will be transcribed into editable text before being processed.
The platform should use clear, simple language and avoid unnecessary jargon.
Guidance should be equally effective for first-time CV creators and experienced professionals.

# 3. Target Users & Personas

## 5.1 Target Audience
RoleCraft is designed for professionals and individuals who want to create, improve, or maintain professional career documents with the assistance of conversational AI.
The platform serves users at different stages of their professional journey while maintaining a simple, guided experience that adapts to each individual's needs.


# 5.2 Primary User Groups

## 1. Students & Fresh Graduates

### Profile
Individuals preparing to enter the workforce or applying for internships, graduate programmes, scholarships, or entry-level positions.

### Common Challenges
Little or no professional experience.
Difficulty writing a compelling CV.
Unsure what information should be included.
Limited understanding of professional formatting.
Lack confidence in presenting academic or project experience.

### How RoleCraft Helps
Guides them through creating a CV from scratch.
Helps identify transferable skills.
Highlights academic projects, volunteer work, and extracurricular achievements.
Produces a professional CV even with limited work experience.


## 2. Early Career Professionals

### Profile
Professionals with one to five years of experience who want to improve their existing CV or prepare for new opportunities.

### Common Challenges
Outdated CVs.
Weak descriptions of responsibilities.
Difficulty communicating achievements.
Generic CV used for multiple opportunities.

### How RoleCraft Helps
Analyses existing CVs.
Improves wording and structure.
Identifies missing accomplishments.
Optionally tailors the CV for specific roles.


## 3. Experienced Professionals

### Profile
Professionals with significant work experience seeking career progression, leadership positions, consulting opportunities, or executive roles.

### Common Challenges
Excessively long CVs.
Difficulty deciding what information to prioritise.
Outdated formatting.
Need to communicate leadership and business impact more effectively.

### How RoleCraft Helps
Refines and modernises existing CVs.
Emphasises leadership, measurable impact, and strategic achievements.
Produces concise, ATS-friendly documents.


## 4. Career Changers

### Profile
Individuals transitioning into a new industry or profession.

### Common Challenges
Unsure how to present transferable skills.
Concerned about limited direct experience.
Difficulty positioning previous roles for a new career path.

### How RoleCraft Helps
Identifies transferable skills.
Reframes existing experience truthfully.
Organises the CV around relevant strengths.


# 5.3 Secondary Users
Although MVP1 focuses primarily on individuals creating professional CVs, the platform should also support users preparing career documents for:
Scholarships.
Fellowships.
Academic programmes.
Professional memberships.
Volunteer opportunities.
Industry certifications.
The core workflow remains the same regardless of the opportunity.


# 5.4 User Needs
Across all user groups, RoleCraft should consistently help users:
Communicate their experience clearly.
Recognise and present their strengths.
Build confidence in their professional profile.
Produce documents that meet professional standards.
Save time compared with manually creating or editing a CV.


# 5.5 User Expectations
Users should expect RoleCraft to:
Ask intelligent follow-up questions.
Understand their career background.
Never fabricate information.
Explain suggestions when necessary.
Produce polished, professional documents.
Allow them to remain in control of their final CV.


# 5.6 Accessibility Considerations
To support diverse communication preferences, users should be able to provide information through:
Typed responses.
Voice recordings that are transcribed into editable text.
This flexibility allows users to express themselves in the manner they find most comfortable while maintaining an accurate written record for document generation.


## Document Review Notes

### Scope Check
Everything in this section directly supports the MVP.
No unnecessary future features have been introduced.

### Design Impact
This section will influence:
AI conversation strategy.
UX design.
Landing page messaging.
Prompt engineering.
Feature prioritisation.
Future testing scenarios.


# 4. Functional Requirements

## 6.1 User Accounts
The system shall allow users to:
Sign up and sign in securely.
Reset forgotten passwords.
Manage their profile.
Save their work across sessions.


## 6.2 CV Management
The system shall allow users to:
Create a CV from scratch.
Upload an existing CV (PDF or DOCX).
Edit an existing CV.
Save drafts automatically.
Export the final CV as PDF and DOCX.


## 6.3 AI Career Conversation
The system shall:
Guide users through a conversational workflow.
Ask relevant follow-up questions.
Remember the current conversation context.
Clarify ambiguous responses before generating content.
Users may respond using:
Typed messages.
Voice recordings (transcribed into editable text before processing).


## 6.4 AI CV Enhancement
The AI shall:
Improve clarity and grammar.
Strengthen professional wording.
Highlight achievements.
Preserve factual accuracy.
Never invent information.


## 6.5 Role Tailoring
When a user provides a job description, the AI shall:
Identify relevant skills and keywords.
Tailor the CV while remaining truthful.
Explain significant tailoring changes when appropriate.


## 6.6 Cover Letter Generation
The system shall:
Generate a cover letter based on the user's CV.
Optionally use a supplied job description.
Allow users to edit the generated content before export.


## 6.7 Conversation History
The system shall:
Save previous conversations.
Allow users to revisit and continue them.
Keep each conversation linked to its associated CV.


## 6.8 AI Guardrails
The AI shall:
Refuse to fabricate qualifications, experience, or certifications.
Clearly indicate when information is missing.
Ask questions instead of making assumptions.

# Section 7 — User Flows

## Flow 1: Create a New CV
Sign Up / Login
        ↓
Dashboard
        ↓
Create New CV
        ↓
AI Career Conversation
        ↓
AI Generates CV
        ↓
User Reviews & Edits
        ↓
Save
        ↓
Export (PDF/DOCX)


## Flow 2: Improve an Existing CV
Dashboard
      ↓
Upload CV
      ↓
AI Extracts Content
      ↓
AI Reviews CV
      ↓
AI Career Conversation
      ↓
AI Improves CV
      ↓
User Reviews Changes
      ↓
Save
      ↓
Export


## Flow 3: Tailor a CV for a Role
Existing CV
      ↓
Paste Job Description (Optional)
      ↓
AI Identifies Key Requirements
      ↓
AI Tailors CV
      ↓
User Reviews
      ↓
Export


## Flow 4: Generate a Cover Letter
Completed CV
      ↓
Generate Cover Letter
      ↓
(Optional) Add Job Description
      ↓
AI Generates Cover Letter
      ↓
User Reviews & Edits
      ↓
Export


## Flow 5: Voice Conversation
AI Asks Question
      ↓
User Records Voice Message
      ↓
Speech-to-Text
      ↓
Transcript Displayed
      ↓
User Confirms / Edits
      ↓
AI Continues Conversation


# Navigation Structure
Authentication
│
├── Login
├── Register
└── Forgot Password

Dashboard
│
├── New CV
├── My CVs
├── Conversations
├── Profile
└── Settings

CV Workspace
│
├── AI Conversation
├── CV Editor
├── Tailor CV
├── Cover Letter
└── Export


# User Journey Summary

# 5. AI Conversation Engine

## Objective
The AI's primary responsibility is to understand the user before generating or improving a CV.
The AI should collect enough accurate information through conversation to produce a professional, truthful, and well-structured document.


## Conversation Flow
Start Session
      ↓
Determine User Goal
      ↓
Collect Available Information
      ↓
Identify Missing Details
      ↓
Ask Follow-up Questions
      ↓
Validate Information
      ↓
Generate CV
      ↓
User Reviews & Edits
      ↓
Finalize & Save


## Step 1: Identify the User's Goal
At the beginning of every session, the AI determines what the user wants to do:
Create a new CV.
Improve an existing CV.
Tailor a CV for a role.
Generate a cover letter.
Continue a previous conversation.
This keeps every conversation focused.


## Step 2: Gather Information
Depending on the user's goal, the AI gathers information from:
User responses.
Uploaded CVs.
Voice transcripts.
Previous conversations (when relevant).
Job descriptions (optional).


## Step 3: Detect Missing Information
Rather than asking every possible question, the AI identifies only what's needed.
For example, if the user has listed their work experience but not achievements, the AI asks about achievements instead of repeating questions about their job history.


## Step 4: Ask Smart Follow-up Questions
Questions should be:
Short.
Specific.
Relevant.
Asked one at a time.
Example:
Instead of:
"Tell me everything about your previous job."
Ask:
"What was your biggest achievement in that role?"
This makes conversations feel natural.


## Step 5: Confirm Before Generating
Before generating or rewriting content, the AI should ensure it has enough information.
If key details are still missing, it asks additional questions rather than guessing.


## Step 6: Generate & Explain
When the AI updates a CV, it should:
Improve wording.
Preserve facts.
Keep the user's voice.
Highlight major improvements when helpful.
Users should feel the AI refined their story—not replaced it.


# Conversation Rules
The AI should always:
Ask before assuming.
Prefer facts over inference.
Encourage measurable achievements.
Keep conversations concise.
Respect the user's time.
The AI should never:
Invent experience.
Exaggerate qualifications.
Create fake certifications.
Misrepresent employment history.


# Voice Integration
Voice messages follow the same workflow as text:
Voice Recording
      ↓
Speech-to-Text
      ↓
User Reviews Transcript
      ↓
AI Processes Confirmed Text
      ↓
Conversation Continues
The AI treats confirmed transcripts exactly like typed responses.


# Conversation Completion
A conversation is considered complete when the AI has enough verified information to generate the requested document.
If the user chooses to stop early, the AI should generate the best possible draft while clearly indicating where additional details could improve the result.

## Screen 1 — Landing Page
Purpose
Introduce RoleCraft.
Explain the value proposition.
Encourage users to get started.
Primary Actions
Sign Up
Sign In


## Screen 2 — Authentication
Purpose
Create or access an account.
Actions
Register
Login
Forgot Password
Next
 → Career Workspace


## Screen 3 — Career Workspace (Home)
This is the first screen users see after logging in.
Instead of showing an empty dashboard, the system asks:
"How would you like to get started today?"

### Options
Create a New CV
Start a guided AI interview to build a CV from scratch.
Improve an Existing CV
Upload an existing CV for AI analysis and enhancement.


## Workflow A — Create a New CV
Career Workspace
      ↓
Create New CV
      ↓
AI Career Interview
      ↓
Information Collected
      ↓
CV Generated
      ↓
Review & Edit
      ↓
Generate Cover Letter (Optional)
      ↓
Download Documents


## Workflow B — Improve an Existing CV
Career Workspace
      ↓
Upload Existing CV
      ↓
AI Reads CV
      ↓
AI Finds Gaps
      ↓
Career Interview
      ↓
CV Improved
      ↓
Review & Edit
      ↓
Generate Cover Letter (Optional)
      ↓
Download Documents


## Screen 4 — AI Career Interview
This is the core experience of RoleCraft.
The AI conducts a structured interview to understand the user's background before generating or improving a CV.
Users can respond by:
Typing
Recording voice messages (transcribed into editable text)
The AI asks only the questions needed to complete the user's professional profile.


## Screen 5 — CV Review & Editor
After generation, users can:
Review the AI-generated CV.
Make manual edits.
Accept or reject suggested improvements.
Save changes.
This keeps the user in control of the final document.


## Screen 6 — Cover Letter
Users may choose to generate a cover letter based on:
Their completed CV.
An optional job description.
The generated cover letter remains editable before export.


## Screen 7 — Export
Users can download:
CV (PDF)
CV (DOCX)
Cover Letter (PDF)
Cover Letter (DOCX)


# AI Decision Flow
The AI follows this sequence:
User Goal
      ↓
Collect Information
      ↓
Detect Missing Details
      ↓
Interview User
      ↓
Validate Information
      ↓
Generate Documents
The AI should not generate documents until it has sufficient information or the user explicitly chooses to proceed.


# Session Lifecycle
Each session follows this lifecycle:
Session Created
      ↓
User Selects Goal
      ↓
Conversation Begins
      ↓
Responses Saved
      ↓
Documents Generated
      ↓
Session Saved
      ↓
Resume Anytime

# 6. Domain & Data Model

## Purpose
A Career Session represents a single guided journey in which a user creates, improves, or tailors professional career documents.
It acts as the central container that organizes all user interactions, AI processing, and generated outputs.
Every session belongs to one user and focuses on one primary objective.


## Career Session Lifecycle
Created
    ↓
User selects goal
    ↓
AI interview begins
    ↓
Information collected
    ↓
CV generated/improved
    ↓
(Optional) Cover letter generated
    ↓
User reviews & edits
    ↓
Completed
If the user leaves before completion, the session remains In Progress and can be resumed later from the Career Studio.


## Session Goals
Every Career Session begins with one goal.
Possible goals are:
Create a New CV
Improve an Existing CV
Tailor a CV
Generate a Cover Letter
Continue a Previous Session
Each session has one active goal, which determines how the AI behaves.


## Information Owned by a Career Session
A Career Session owns:
Session metadata
Conversation history
Voice transcripts
Uploaded CV (optional)
AI analysis
CV draft
Generated cover letter
Export history
Session status
Everything related to that piece of work is stored under the same session.


## Session States


## User Experience
From the user's perspective, Career Studio should feel like a workspace rather than a list of files.
Each session appears as a card showing:
Session title (e.g., Software Engineer CV)
Goal
Progress
Last updated
Status
Selecting a session resumes work exactly where the user left off.


## Design Principles
A Career Session should:
Keep related information together.
Be resumable at any time.
Support future enhancements without redesign.
Maintain a clear history of AI interactions.
Preserve user control over generated documents.


# Domain Relationships
At a business level, the relationships look like this:
User
│
├── Profile
│
└── Career Studio
      │
      ├── Career Session (1)
      │      │
      │      ├── Goal
      │      │
      │      ├── Conversation
      │      │      ├── Messages
      │      │      └── Voice Transcripts
      │      │
      │      ├── Uploaded CV (Optional)
      │      │
      │      ├── AI Analysis
      │      │
      │      ├── CV Draft
      │      │
      │      ├── Cover Letter Draft (Optional)
      │      │
      │      ├── Exports
      │      │      ├── CV (PDF)
      │      │      ├── CV (DOCX)
      │      │      ├── Cover Letter (PDF)
      │      │      └── Cover Letter (DOCX)
      │      │
      │      └── Session Metadata
      │
      ├── Career Session (2)
      │
      ├── Career Session (3)
      │
      └── ...


Notice that Career Studio is the user's workspace, while Career Sessions are the individual projects inside it.
That distinction is important because users may have multiple sessions over time—for different roles, updated CVs, or ongoing revisions.



# 11.1 User

### Purpose
Represents a registered person using RoleCraft.

### Responsibilities
Owns a Career Studio.
Manages profile information.
Creates and resumes Career Sessions.
Downloads generated documents.

### Relationships
User
 └── Career Studio


# 11.2 Career Studio

### Purpose
The user's personal workspace.
This is the first screen after login.

### Responsibilities
Display Career Sessions.
Start a new Career Session.
Resume previous sessions.
Show recent documents.

### Relationships
Career Studio
│
├── Career Session
├── Career Session
└── Career Session


# 11.3 Career Session

### Purpose
Represents one complete CV-building journey.
Everything related to that journey belongs here.

### Responsibilities
Store the user's selected goal.
Maintain interview progress.
Hold generated drafts.
Track completion status.

### Relationships
Career Session
│
├── Conversation
├── Uploaded CV
├── CV Draft
├── Cover Letter Draft
├── AI Analysis
└── Exports


# 11.4 Conversation

### Purpose
Stores the interview between the user and the AI.

### Responsibilities
Maintain conversation history.
Preserve context.
Track interview progress.

### Relationships
Conversation
│
├── AI Messages
├── User Messages
└── Voice Transcripts


# 11.5 Message

### Purpose
Represents one interaction in a conversation.

### Types
AI Question
User Response
System Message
Each message belongs to exactly one Conversation.


# 11.6 Voice Transcript

### Purpose
Stores the confirmed transcription of a voice recording.

### Responsibilities
Preserve the original spoken response as text.
Link back to the corresponding message.
Allow future auditing or reprocessing if needed.
Only the confirmed transcript is used by the AI.


# 11.7 Uploaded CV

### Purpose
Represents a CV uploaded by the user for analysis.

### Responsibilities
Store the original uploaded file.
Preserve extracted text.
Support AI analysis.
An uploaded CV is optional and only exists in sessions where the user chooses to improve an existing CV.


# 11.8 AI Analysis

### Purpose
Stores the AI's understanding of the uploaded or generated CV.
Examples include:
Missing information.
Weak bullet points.
Formatting issues.
Missing achievements.
Improvement recommendations.
This analysis guides the interview and drafting process.


# 11.9 CV Draft

### Purpose
Represents the editable working version of the CV.
The draft evolves throughout the Career Session as the AI and the user refine it.
There is one active draft per session.


# 11.10 Cover Letter Draft

### Purpose
Represents the editable working version of the cover letter.
It is generated from:
The completed CV.
An optional job description.
Like the CV Draft, it remains editable until the user exports it.


# 11.11 Exports

### Purpose
Stores generated files that users can download.
Supported formats:
CV PDF
CV DOCX
Cover Letter PDF
Cover Letter DOCX
These are generated from the latest approved drafts.


# Domain Overview
User
│
└── Career Studio
      │
      ├── Career Session
      │      │
      │      ├── Conversation
      │      │      ├── Message
      │      │      └── Voice Transcript
      │      │
      │      ├── Uploaded CV
      │      ├── AI Analysis
      │      ├── CV Draft
      │      ├── Cover Letter Draft
      │      └── Exports
      │
      └── Career Session...



# ROLECRAFT BLUEPRINT

## Core Product Principle

### RoleCraft Remembers Your Professional Journey
RoleCraft is designed to remember a user's professional journey—not just the documents they create.
With the user's permission, the platform continuously builds and refines a Professional Profile that grows alongside their career.
Rather than asking users to repeat the same information in every session, RoleCraft reuses previously confirmed information and focuses on discovering what has changed.
This creates a more intelligent, personalized, and efficient experience while ensuring users remain in full control of their professional data.


## Professional Memory Principles

### User-Controlled Memory
RoleCraft never updates a Professional Profile without the user's confirmation.
The user remains the owner of their professional identity.


### Learn Once, Reuse Many Times
Information confirmed once should be available across future Career Sessions.
For example:
Education
Certifications
Languages
Skills
Professional links
should not need to be re-entered unless they change.


### Continuous Growth
Each Career Session is an opportunity to enrich the Professional Profile.
New experiences, achievements, certifications, promotions, and skills can be suggested for inclusion after user approval.


### Context-Aware Conversations
Instead of restarting interviews from scratch, the AI should use existing profile information to ask more meaningful questions.
For example:
"I noticed your last CV focused on backend engineering. Has anything significant changed since then?"
That creates a more natural and efficient conversation.


# Professional Profile

## Purpose
The Professional Profile is the user's long-term professional identity within RoleCraft.
Unlike Career Sessions, which represent individual projects, the Professional Profile persists across all sessions and evolves over time.


## Information Stored

### Personal Information
Full name
Preferred name
Email address
Phone number
Location


### Professional Information
Professional headline
Career summary
Years of experience
Industries worked in
Current role


### Education
Institutions
Degrees
Graduation years


### Work Experience
A structured history of previous employment.
Each experience can be reused in future CVs without re-entering the information.


### Skills
Technical skills
Soft skills
Languages
Tools
Frameworks


### Certifications
Professional certifications earned over time.


### Professional Links
LinkedIn
GitHub
Portfolio
Personal website


### Career Preferences
Examples include:
Preferred industries
Preferred job types
Remote or onsite preference
Desired seniority level


# Relationship Model
User
│
├── Professional Profile
│
└── Career Studio
       │
       ├── Career Session
       ├── Career Session
       └── Career Session

# AI Memory Workflow
User Starts Session
        │
        ▼
Load Professional Profile
        │
        ▼
Determine User Goal
        │
        ▼
Reuse Existing Information
        │
        ▼
Ask Only What's Missing
        │
        ▼
Generate Documents
        │
        ▼
Detect New Professional Information
        │
        ▼
Ask User for Permission
        │
        ▼
Update Professional Profile

## 12.1 User
Purpose
Represents a registered user of RoleCraft.
Owns
One Professional Profile
One Career Studio


## 12.2 Professional Profile
Purpose
Stores reusable professional information that persists across Career Sessions.
Contains
Personal details
Professional summary
Education
Work experience
Skills
Certifications
Professional links


## 12.3 Career Studio
Purpose
The user's workspace.
Contains
Multiple Career Sessions


## 12.4 Career Session
Purpose
Represents one CV project.
Contains
Goal
Status
Conversation
Uploaded CV (optional)
CV Draft
Cover Letter Draft
AI Analysis
Export History


## 12.5 Conversation
Purpose
Stores the AI interview for a Career Session.
Contains
Messages


## 12.6 Message
Purpose
Represents one exchange between the AI and the user.
Types
AI
User
System


## 12.7 Uploaded CV
Purpose
Stores the original CV uploaded by the user for analysis.


## 12.8 CV Draft
Purpose
Stores the editable working version of the CV.


## 12.9 Cover Letter Draft
Purpose
Stores the editable working version of the cover letter.


## 12.10 Export
Purpose
Represents generated downloadable files.
Formats
PDF
DOCX


# High-Level Relationships
User
│
├── Professional Profile (1)
│
└── Career Studio (1)
       │
       └── Career Sessions (Many)
                │
                ├── Conversation (1)
                │      └── Messages (Many)
                │
                ├── Uploaded CV (0..1)
                ├── CV Draft (1)
                ├── Cover Letter Draft (0..1)
                ├── AI Analysis (1)
                └── Exports (Many)


## MVP Scope Check ✅
Everything above is required for MVP1.
Nothing extra.
No future roadmap features.
No unnecessary complexity.



# PART V — Backend Architecture

## Section 13 — Backend Module Design
The backend is organized into independent modules, each responsible for a specific business capability.
This separation promotes maintainability, scalability, and clear ownership of functionality.


# 13.1 Authentication Module

### Responsibilities
User registration
Login
Password reset
JWT authentication
Session validation

### Owns
User Account
Authentication Tokens


# 13.2 Professional Profile Module

### Responsibilities
Create and update Professional Profiles
Store reusable professional information
Provide profile data to Career Sessions

### Owns
Personal Information
Education
Work Experience
Skills
Certifications
Professional Links


# 13.3 Career Studio Module

### Responsibilities
Display user workspace
Create Career Sessions
Resume previous sessions
Archive completed sessions

### Owns
Career Studio
Career Sessions


# 13.4 Conversation Module

### Responsibilities
Manage AI interviews
Store conversations
Store messages
Process voice transcripts
Track interview progress

### Owns
Conversations
Messages


# 13.5 Document Module

### Responsibilities
Upload CVs
Manage CV drafts
Manage Cover Letter drafts
Generate PDF/DOCX exports

### Owns
Uploaded CVs
CV Drafts
Cover Letter Drafts
Exported Documents


# 13.6 AI Module

### Responsibilities
Analyse uploaded CVs
Conduct AI interviews
Generate CV content
Improve CVs
Tailor CVs
Generate cover letters
The AI Module does not own user data. It processes information provided by other modules.


# Module Relationships
                    AI Module
                         ▲
                         │
        ┌────────────────┼────────────────┐
        │                │                │
Conversation      Professional      Document
    Module         Profile Module     Module
        │                │                │
        └──────────────┬─────────────────┘
                       │
              Career Studio Module
                       │
               Authentication Module


# Design Principles
Every module should:
Have a single responsibility.
Own its own business logic.
Communicate through well-defined APIs.
Avoid direct dependency on unrelated modules.
Be independently testable.


# MVP Boundary
For MVP1, six backend modules are sufficient.
No microservices.
No event bus.
No distributed architecture.
A modular monolith is the right choice.



## Section 14 — Database Design

### Database Choice
PostgreSQL
Reasons
Relational data fits the product naturally.
Excellent support for complex relationships.
Mature ecosystem.
Reliable and scalable.
Excellent SQLAlchemy support.


# Core Database Entities

## 1. Users

### Purpose
Stores authentication and account information.

### Key Fields
id
email
password_hash
created_at
updated_at


## 2. Professional Profiles

### Purpose
Stores reusable professional information that persists across all Career Sessions.
Recommendation: Keep the profile normalized with related tables instead of storing everything in one large table.
Owns:
Personal Information
Education
Work Experience
Skills
Certifications
Languages
Professional Links


## 3. Career Studio
No Database Table
Career Studio is a business concept, not a database entity.
It is simply the workspace that displays a user's Career Sessions.


## 4. Career Sessions

### Purpose
Represents one complete CV project.

### Key Fields
id
user_id
goal
status
created_at
updated_at
completed_at


## 5. Conversations

### Purpose
Represents the AI interview inside a Career Session.

### Key Fields
id
career_session_id
started_at
completed_at


## 6. Messages ✅ (Updated)
This becomes one of the most important tables.
Every interaction inside the conversation is stored as a Message.
Whether the user:
typed
or
recorded a voice note
the AI ultimately receives a Message.

### Key Fields
id
conversation_id
role (AI | User | System)
input_type (text | voice)
content
audio_url (nullable)
duration_seconds (nullable)
created_at
Voice is not a different entity.
It is simply another way of creating a message.


## 7. Uploaded CVs

### Purpose
Stores uploaded CV metadata.

### Key Fields
id
career_session_id
filename
storage_path
extracted_text
uploaded_at


## 8. AI Analysis

### Purpose
Stores the AI's understanding of the uploaded CV.
Examples:
Missing achievements
Weak bullet points
Formatting issues
Improvement suggestions
This analysis is temporary and specific to the Career Session.


## 9. CV Drafts

### Purpose
Stores the editable working CV.

### Key Fields
id
career_session_id
content
version
updated_at


## 10. Cover Letter Drafts

### Purpose
Stores the editable cover letter.
Generated from:
CV Draft
Optional Job Description


## 11. Exports

### Purpose
Stores generated downloadable documents.
Formats:
CV PDF
CV DOCX
Cover Letter PDF
Cover Letter DOCX


# Updated Domain Relationships
User
 │
 ├── Professional Profile (1:1)
 │
 └── Career Sessions (1:M)
          │
          ├── Conversation (1:1)
          │        │
          │        └── Messages (1:M)
          │
          ├── Uploaded CV (0:1)
          ├── AI Analysis (1:1)
          ├── CV Draft (1:1)
          ├── Cover Letter Draft (0:1)
          └── Exports (1:M)

# Conversation Model
Instead of:
Conversation
├── Messages
└── Voice Transcripts
We now have:
Conversation
        │
        └── Messages
Every message has an input type.
Message

id

conversation_id

role

input_type

content

audio_url (optional)

duration_seconds (optional)

created_at
The AI always consumes:
content
It doesn't care whether the user typed or spoke.


# Updated Voice Flow
User taps microphone
        │
        ▼
Records voice
        │
        ▼
Speech-to-Text
        │
        ▼
Transcript displayed
        │
        ▼
User edits if necessary
        │
        ▼
Message created
        │
        ▼
Conversation continues

# Database Design Principles
UUID primary keys.
Normalized profile data.
One conversation per Career Session.
Messages are the single source of truth for communication.
Voice is an input method, not a business entity.
Drafts remain editable until exported.
Exports are immutable snapshots of approved documents.
STRUCTURE
backend/
│
├── auth/
├── users/
├── profiles/
├── career_sessions/
├── conversations/
├── documents/
│
├── ai/
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── prompt_service.py
│   │   ├── cv_analysis_service.py
│   │   ├── cv_generation_service.py
│   │   ├── cover_letter_service.py
│   │   └── interview_service.py
│   │
│   ├── prompts/
│   ├── schemas/
│   └── orchestrator.py
│
└── core/




# 7. Backend Architecture & API Specifications
The service architecture defines the internal components responsible for executing business logic and integrating with external systems.
Unlike database entities, services are not persisted. They process requests, coordinate workflows, and return results.


# Service Layers
                API Layer
                     │
                     ▼
            Business Services
                     │
                     ▼
          AI & Infrastructure Services
                     │
                     ▼
          Database & External Providers
Each layer has a clear responsibility and communicates only with adjacent layers.


# 15.1 Authentication Service

### Responsibilities
Register users
Authenticate users
Issue JWT access tokens
Validate tokens
Handle password resets
Dependencies:
Users
Email Provider (future)


# 15.2 Professional Profile Service

### Responsibilities
Create and update Professional Profiles
Manage education
Manage work experience
Manage skills
Manage certifications
Manage professional links
This service is the single source of truth for long-term professional information.


# 15.3 Career Session Service

### Responsibilities
Create Career Sessions
Resume existing sessions
Mark sessions as completed
Archive sessions
Retrieve session history


# 15.4 Conversation Service
This service orchestrates the AI interview.

### Responsibilities
Create conversations
Save messages
Maintain conversation context
Track interview progress
The Conversation Service does not communicate directly with the LLM.
Instead, it delegates AI work to the AI Orchestrator.


# 15.5 Document Service

### Responsibilities
Upload CVs
Parse uploaded documents
Save CV drafts
Save cover letter drafts
Generate downloadable exports


# 15.6 AI Orchestrator
This is the heart of the AI subsystem.
The AI Orchestrator coordinates all AI-related workflows and decides which specialized AI service should handle a request.
Responsibilities include:
Routing AI tasks
Building execution context
Calling the appropriate AI service
Returning structured results


# AI Internal Services

## LLM Service
The only component allowed to communicate directly with the LLM provider.
Responsibilities:
Send prompts
Receive responses
Handle retries
Standardize API responses
Manage provider-specific logic
Future provider changes should affect only this service.


## Prompt Service
Responsible for constructing high-quality prompts.
Inputs:
Professional Profile
Career Session
Conversation History
Uploaded CV
User Goal
Outputs:
Final prompt sent to the LLM Service
This keeps prompt engineering centralized instead of scattered throughout the codebase.


## Interview Service
Handles conversational intelligence.
Responsibilities:
Determine the next interview question
Detect missing information
Ask follow-up questions
Prevent repetitive questioning


## CV Analysis Service
Responsibilities:
Analyze uploaded CVs
Identify strengths
Detect missing information
Suggest improvements


## CV Generation Service
Responsibilities:
Generate new CVs
Improve existing CVs
Rewrite bullet points
Optimize formatting
Tailor content to user goals


## Cover Letter Service
Responsibilities:
Generate cover letters
Tailor letters to job descriptions
Keep tone consistent with the CV


# Service Interaction Flow
User
 │
 ▼
API
 │
 ▼
Conversation Service
 │
 ▼
AI Orchestrator
 │
 ├───────────────┐
 ▼               ▼
Prompt Service   Interview Service
 │               │
 └──────┬────────┘
        ▼
   LLM Service
        │
        ▼
   OpenAI API
        │
        ▼
LLM Response
        │
        ▼
Conversation Service
        │
        ▼
Database
        │
        ▼
Frontend


# Design Principles
Each service has a single responsibility.
Business services should not contain prompt engineering logic.
Only the LLM Service communicates with the AI provider.
Prompt construction is centralized.
Services communicate through well-defined interfaces.
AI-generated content is always returned in a structured format suitable for the rest of the application.


# MVP Scope
For MVP1, these services are sufficient:
Authentication Service
Professional Profile Service
Career Session Service
Conversation Service
Document Service
AI Orchestrator
Prompt Service
Interview Service
CV Analysis Service
CV Generation Service
Cover Letter Service
LLM Service
No additional infrastructure (such as message queues, event buses, or multiple AI providers) is required until there is a demonstrated need.

I'd avoid letting the Conversation Service talk directly to the AI Orchestrator for every message. Instead, introduce a dedicated Chat Service (or Chat Workflow Service) that coordinates the conversation flow.
That would look like:
Frontend
    │
    ▼
Conversation API
    │
    ▼
Chat Service
    │
    ├── Save incoming message
    ├── Build conversation context
    ├── Call AI Orchestrator
    ├── Save AI response
    └── Return updated conversation
This keeps the Conversation Service focused on persistence (creating conversations, storing messages, fetching history), while the Chat Service owns the workflow of a chat exchange.


## Section 16 — API Design

### API Principles
RESTful endpoints
JSON request/response format
JWT authentication
Consistent error responses
Resource-oriented URLs
Versioned API (/api/v1)


# Authentication

### Register
POST /api/v1/auth/register
Creates a new user account.


### Login
POST /api/v1/auth/login
Authenticates a user and returns access and refresh tokens.


### Refresh Token
POST /api/v1/auth/refresh
Issues a new access token.


### Logout
POST /api/v1/auth/logout
Invalidates the current session.


# Professional Profile

### Get Profile
GET /api/v1/profile
Returns the user's Professional Profile.


### Update Profile
PUT /api/v1/profile
Updates general profile information.


### Education
POST   /api/v1/profile/education
GET    /api/v1/profile/education
PUT    /api/v1/profile/education/{id}
DELETE /api/v1/profile/education/{id}


### Work Experience
POST   /api/v1/profile/experience
GET    /api/v1/profile/experience
PUT    /api/v1/profile/experience/{id}
DELETE /api/v1/profile/experience/{id}


### Skills
POST   /api/v1/profile/skills
DELETE /api/v1/profile/skills/{id}
GET    /api/v1/profile/skills


### Certifications
POST   /api/v1/profile/certifications
PUT    /api/v1/profile/certifications/{id}
DELETE /api/v1/profile/certifications/{id}


# Career Sessions

### Create Session
POST /api/v1/career-sessions
Creates a new Career Session.


### Get All Sessions
GET /api/v1/career-sessions


### Get Session
GET /api/v1/career-sessions/{session_id}


### Archive Session
PATCH /api/v1/career-sessions/{session_id}/archive


### Delete Session
DELETE /api/v1/career-sessions/{session_id}


# Conversations

### Start Conversation
POST /api/v1/career-sessions/{session_id}/conversation
Creates the conversation for a Career Session.


### Get Conversation
GET /api/v1/career-sessions/{session_id}/conversation
Returns the conversation with all messages.


### Send Message
POST /api/v1/conversations/{conversation_id}/messages
Handles:
Text
Voice (transcribed)
Same endpoint.


### Get Messages
GET /api/v1/conversations/{conversation_id}/messages


# Document Upload

### Upload CV
POST /api/v1/documents/upload
Accepts:
PDF
DOCX
Returns:
Parsed content
Analysis status


### Get Uploaded CV
GET /api/v1/documents/{id}


# CV Draft

### Get Draft
GET /api/v1/cv-drafts/{session_id}


### Update Draft
PUT /api/v1/cv-drafts/{session_id}


# Cover Letter

### Generate
POST /api/v1/cover-letters/generate


### Update
PUT /api/v1/cover-letters/{session_id}


# Export

### Export CV
POST /api/v1/exports/cv
Formats:
PDF
DOCX


### Export Cover Letter
POST /api/v1/exports/cover-letter


### Download Export
GET /api/v1/exports/{id}


# Standard API Response

### Success
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}


### Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The uploaded file is invalid."
  }
}


# Authentication Flow
User
 │
 ▼
Login
 │
 ▼
Access Token
 │
 ▼
Authenticated Requests
 │
 ▼
Protected Endpoints


# API Design Principles
Every endpoint has a single responsibility.
Resource names are nouns (career-sessions, profile, messages).
Actions are expressed through HTTP methods (GET, POST, PUT, PATCH, DELETE).
Consistent response structure across the API.
Validation errors use meaningful error codes and messages.
Authentication is required for all endpoints except registration, login, and token refresh.




## High-Level Architecture
                        ┌──────────────────────┐
                        │   React Frontend     │
                        └──────────┬───────────┘
                                   │
                              HTTPS / REST
                                   │
                        ┌──────────▼───────────┐
                        │    FastAPI Backend   │
                        └──────────┬───────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
 ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
 │ Business Layer │      │   AI Layer     │      │ Document Layer │
 └────────────────┘      └────────────────┘      └────────────────┘
          │                        │                        │
          └──────────────┬─────────┴──────────────┬─────────┘
                         ▼                        ▼
                PostgreSQL Database      File Storage
                                              │
                                              ▼
                                  Uploaded CVs / Exports


# Frontend

### Responsibilities
Authentication
Career Studio
Chat interface
Profile management
CV editor
Cover letter editor
Export downloads
The frontend never communicates directly with the AI provider or the database.
Everything goes through the backend.


# Backend
The backend is the brain of RoleCraft.
Responsibilities include:
Authentication
Authorization
Business rules
AI orchestration
Database access
File management
API responses


# Database
Stores all persistent business data.
Examples:
Users
Professional Profiles
Career Sessions
Conversations
Messages
Drafts
The database does not store AI prompts or provider-specific logic.


# File Storage
Stores binary files such as:
Uploaded CVs
Generated PDFs
Generated DOCX files
The database stores references (paths or URLs), not the files themselves.


# AI Layer
The AI Layer contains:
AI Orchestrator
Prompt Service
Interview Service
CV Analysis Service
CV Generation Service
Cover Letter Service
LLM Service
Only the LLM Service communicates with the AI provider.


# External Services
FastAPI
    │
    ├── OpenAI API
    ├── Email Provider
    ├── Object Storage
    └── Authentication Services (future)
Each external dependency is isolated behind a service interface.


# End-to-End Request Flow
Imagine a user creates a new CV.
User
 │
 ▼
Frontend
 │
 ▼
FastAPI API
 │
 ▼
Career Session Service
 │
 ▼
Conversation Service
 │
 ▼
AI Orchestrator
 │
 ▼
Prompt Service
 │
 ▼
LLM Service
 │
 ▼
OpenAI API
 │
 ▼
AI Response
 │
 ▼
Conversation Service
 │
 ▼
Database
 │
 ▼
Frontend
 │
 ▼
User
Every AI interaction follows the same pattern.


# Upload Flow
Upload PDF
      │
      ▼
Document Service
      │
      ▼
File Storage
      │
      ▼
Text Extraction
      │
      ▼
CV Analysis Service
      │
      ▼
LLM Service
      │
      ▼
AI Analysis
      │
      ▼
Career Session


# Security Principles
JWT authentication
Password hashing
Role-based authorization (future)
Input validation
Rate limiting
Secure file uploads
HTTPS in production


# Scalability
The architecture is designed as a modular monolith.
If future growth requires it, modules such as:
AI
Documents
Authentication
can be extracted into independent services without changing the overall domain model.


# Deployment Overview
Browser
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ├── PostgreSQL
   ├── Object Storage
   └── OpenAI


### Table 1

| Stage | Goal |
| Authentication | Access account |
| Dashboard | Choose a task |
| AI Conversation | Gather professional information |
| CV Builder | Generate or improve content |
| Review | Edit and approve |
| Export | Download final documents |

### Table 2

| State | Description |
| Created | Session has been created but work has not started. |
| In Progress | The AI interview or editing process is ongoing. |
| Awaiting Review | Drafts have been generated and are awaiting user review. |
| Completed | User has finished and saved the session. |
| Archived | User has archived the session but can still access it if needed. |

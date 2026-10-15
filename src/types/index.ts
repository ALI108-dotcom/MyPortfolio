export interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'tool' | 'domain';
  description: string;
  tags: string[];
  gradientClass?: string;
  iconName?: string;
  proficiency?: string; // 'Beginner' | 'Intermediate' | 'Advanced' | 'Practical'
  supportingProject?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  problemStatement: string;
  description: string;
  technologies: string[];
  category: 'Power BI' | 'Python & EDA' | 'Machine Learning' | 'AI Applications' | string;
  featured?: boolean;
  repoUrl?: string;
  demoUrl?: string;
  datasetOrSource?: string;
  completionDate?: string;
  stats?: { label: string; value: string }[];
  highlightBadge?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  status: string;
  summary: string;
  tasksCompleted: string[];
  skillsPracticed: string[];
  verificationUrl?: string;
  certificateNote?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationItem {
  degree: string;
  specialization: string;
  institution: string;
  location: string;
  batch: string;
  status: string;
  keyCoursework: string[];
}

export interface EducationMilestone {
  id: string;
  num?: string;
  title: string;
  subtitle: string;
  period: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearningEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyConcepts: string[];
  practicalApplication?: string;
  relatedTechnologies: string[];
  relatedProjectUrl?: string;
  notes?: string;
  dateLearned?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  description?: string;
  skills?: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  verificationUrl?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  published?: boolean;
}

export interface PersonalProfile {
  name: string;
  roleTitle: string;
  degreeShort: string;
  degreeFull: string;
  institution: string;
  location: string;
  graduationBatch: string;
  careerGoal: string;
  bioHeadline: string;
  bioSummary: string;
  githubUsername: string;
  githubUrl: string;
  emailConfigurable: string;
  linkedinConfigurable: string;
  targetRole?: string;
  aboutParagraph?: string;
  introVideoUrl?: string;
  introVideoTitle?: string;
  introVideoDuration?: string;
  photoUrl?: string;
}

export interface StatItem {
  id?: string;
  label: string;
  value: string;
  colorClass?: string;
}

export interface FocusTrack {
  id: string;
  trackLabel: string;
  title: string;
  description: string;
  iconName?: string;
  colorVariant?: 'azure' | 'verdant';
  published?: boolean;
}

export interface AboutPillar {
  id: string;
  num: string;
  title: string;
  desc: string;
  borderClass?: string;
  published?: boolean;
}

export interface PortfolioContent {
  profile: PersonalProfile;
  skills: SkillItem[];
  projects: ProjectItem[];
  learningJourney?: LearningEntry[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  educationMilestones?: EducationMilestone[];
  experience: ExperienceItem[];
  education: EducationItem;
  faq: FaqItem[];
  statsBar?: StatItem[];
  focusTracks?: FocusTrack[];
  aboutPillars?: AboutPillar[];
}

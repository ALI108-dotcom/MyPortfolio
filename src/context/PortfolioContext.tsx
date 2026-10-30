import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PortfolioContent, 
  PersonalProfile, 
  SkillItem, 
  ProjectItem, 
  ExperienceItem, 
  EducationItem,
  LearningEntry,
  CertificationItem,
  AchievementItem,
  EducationMilestone,
  StatItem,
  FocusTrack,
  AboutPillar
} from '../types';
import { defaultPortfolioContent, defaultStatsBar, defaultFocusTracks, defaultAboutPillars } from '../data/portfolioData';

interface PortfolioContextType {
  content: PortfolioContent;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  hasUnsavedChanges: boolean;
  authToken: string | null;
  isCloudSynced: boolean;
  getSyncUrl: () => string;
  forceSyncToLatestDefaults: () => void;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveChanges: (overrideContent?: PortfolioContent) => Promise<{ success: boolean; message?: string; error?: string }>;
  cancelChanges: () => void;
  resetToDefaults: () => Promise<{ success: boolean; message?: string }>;
  exportData: () => void;
  importData: (imported: PortfolioContent) => void;

  // Stats Bar CMS
  updateStatsBar: (stats: StatItem[]) => void;
  updateStatItem: (index: number, stat: Partial<StatItem>) => void;

  // Focus Tracks CMS
  updateFocusTrack: (track: FocusTrack) => void;
  addFocusTrack: (track: Omit<FocusTrack, 'id'> & { id?: string }) => void;
  deleteFocusTrack: (id: string) => void;

  // About Pillars CMS
  updateAboutPillar: (pillar: AboutPillar) => void;
  addAboutPillar: (pillar: Omit<AboutPillar, 'id'> & { id?: string }) => void;
  deleteAboutPillar: (id: string) => void;

  // Profile CMS
  updateProfile: (profile: Partial<PersonalProfile>) => void;

  // Skills CMS
  addSkill: (skill: Omit<SkillItem, 'id'> & { id?: string }) => void;
  updateSkill: (skill: SkillItem) => void;
  deleteSkill: (id: string) => void;
  toggleSkillPublish: (id: string) => void;

  // Projects CMS
  addProject: (project: Omit<ProjectItem, 'id'> & { id?: string }) => void;
  updateProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  toggleProjectPublish: (id: string) => void;

  // Learning Journey CMS
  addLearningEntry: (entry: Omit<LearningEntry, 'id'> & { id?: string }) => void;
  updateLearningEntry: (entry: LearningEntry) => void;
  deleteLearningEntry: (id: string) => void;
  toggleLearningPublish: (id: string) => void;

  // Certifications CMS
  addCertification: (cert: Omit<CertificationItem, 'id'> & { id?: string }) => void;
  updateCertification: (cert: CertificationItem) => void;
  deleteCertification: (id: string) => void;
  toggleCertPublish: (id: string) => void;

  // Achievements CMS
  addAchievement: (ach: Omit<AchievementItem, 'id'> & { id?: string }) => void;
  updateAchievement: (ach: AchievementItem) => void;
  deleteAchievement: (id: string) => void;
  toggleAchievementPublish: (id: string) => void;

  // Experience CMS
  addExperience: (exp: Omit<ExperienceItem, 'id'> & { id?: string }) => void;
  updateExperience: (exp: ExperienceItem) => void;
  deleteExperience: (id: string) => void;
  toggleExperiencePublish: (id: string) => void;

  // Education CMS
  updateEducation: (edu: EducationItem) => void;
  addEducationMilestone: (milestone: Omit<EducationMilestone, 'id'> & { id?: string }) => void;
  updateEducationMilestone: (milestone: EducationMilestone) => void;
  deleteEducationMilestone: (id: string) => void;
  toggleEducationMilestonePublish: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent);
  const [savedBaseline, setSavedBaseline] = useState<PortfolioContent>(defaultPortfolioContent);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const lastCloudUpdatedRef = React.useRef<string | null>(null);
  const hasUnsavedChangesRef = React.useRef<boolean>(false);
  hasUnsavedChangesRef.current = hasUnsavedChanges;
  const savedBaselineRef = React.useRef<PortfolioContent>(savedBaseline);
  savedBaselineRef.current = savedBaseline;

  // Helper to sanitize & migrate legacy cached values
  const sanitizeAndMerge = (source: Partial<PortfolioContent>): PortfolioContent => {
    const merged: PortfolioContent = {
      ...defaultPortfolioContent,
      ...source,
      profile: {
        ...defaultPortfolioContent.profile,
        ...(source.profile || {}),
      },
      skills: source.skills || defaultPortfolioContent.skills,
      projects: source.projects || defaultPortfolioContent.projects,
      experience: source.experience || defaultPortfolioContent.experience,
      education: source.education || defaultPortfolioContent.education,
      faq: source.faq || defaultPortfolioContent.faq,
      learningJourney: source.learningJourney || defaultPortfolioContent.learningJourney,
      certifications: source.certifications || defaultPortfolioContent.certifications,
      achievements: source.achievements || defaultPortfolioContent.achievements,
      educationMilestones: source.educationMilestones || defaultPortfolioContent.educationMilestones,
      statsBar: source.statsBar || defaultPortfolioContent.statsBar || defaultStatsBar,
      focusTracks: source.focusTracks || defaultPortfolioContent.focusTracks || defaultFocusTracks,
      aboutPillars: source.aboutPillars || defaultPortfolioContent.aboutPillars || defaultAboutPillars,
    };

    // Auto-migrate old legacy placeholder texts if present
    if (merged.profile.roleTitle === 'Aspiring Data Scientist') {
      merged.profile.roleTitle = defaultPortfolioContent.profile.roleTitle;
    }
    if (
      merged.profile.bioSummary &&
      merged.profile.bioSummary.includes('Artificial Intelligence and Data Science student passionate about turning data')
    ) {
      merged.profile.bioSummary = defaultPortfolioContent.profile.bioSummary;
      merged.profile.bioHeadline = defaultPortfolioContent.profile.bioHeadline;
      merged.profile.aboutParagraph = defaultPortfolioContent.profile.aboutParagraph;
    }

    return merged;
  };

  // Real-time synchronization function: pulls latest Supabase data
  const syncFromCloud = async () => {
    // If the user has unsaved edits in progress on THIS screen, don't overwrite their typing
    if (hasUnsavedChangesRef.current) return;

    try {
      const res = await fetch('/api/content?_t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.isCustom && data.content) {
            const incomingString = JSON.stringify(data.content);
            const baselineString = JSON.stringify(savedBaselineRef.current);

            // If the incoming cloud data differs from current baseline, update automatically!
            if (incomingString !== baselineString) {
              const merged = sanitizeAndMerge(data.content);
              setContent(merged);
              setSavedBaseline(merged);
              setIsCloudSynced(Boolean(data.isCloud));
              lastCloudUpdatedRef.current = data.updated_at || null;

              try {
                localStorage.setItem('shaik_portfolio_content', JSON.stringify(merged));
                localStorage.setItem('shaik_portfolio_content_v2', JSON.stringify(merged));
              } catch {}
            }
          }
        }
      }
    } catch {
      // Ignore background fetch network interruptions
    }
  };

  // Load cloud or local persisted content on mount, and listen for URL hash sync
  useEffect(() => {
    async function loadInitialData() {
      // 1. Check for URL sync hash (#sync=...)
      if (typeof window !== 'undefined' && window.location.hash.includes('sync=')) {
        try {
          const match = window.location.hash.match(/sync=([^&]+)/);
          if (match && match[1]) {
            const raw = decodeURIComponent(atob(decodeURIComponent(match[1])));
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              const synced = sanitizeAndMerge(parsed);
              setContent(synced);
              setSavedBaseline(synced);
              try {
                localStorage.setItem('shaik_portfolio_content', JSON.stringify(synced));
                localStorage.setItem('shaik_portfolio_content_v2', JSON.stringify(synced));
              } catch {}
              // Clean hash without reload
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              return;
            }
          }
        } catch (e) {
          console.warn('Could not decode URL sync hash', e);
        }
      }

      // 2. Fetch server / Supabase content (cache-busting for mobile & laptop)
      await syncFromCloud();

      // 3. Check localStorage fallback if cloud wasn't populated yet
      try {
        const local = localStorage.getItem('shaik_portfolio_content_v2') || localStorage.getItem('shaik_portfolio_content');
        if (local) {
          const parsed = JSON.parse(local);
          const merged = sanitizeAndMerge(parsed);
          setContent(merged);
          setSavedBaseline(merged);
        }
      } catch (e) {
        // Fallback silently
      }
    }

    loadInitialData();

    // 4. Background real-time polling every 5 seconds for 2-way auto sync between Mobile & Laptop
    const pollTimer = setInterval(() => {
      syncFromCloud();
    }, 5000);

    // 5. Immediate sync on window focus (e.g. switching tabs on Laptop or returning to browser on Mobile)
    const handleFocus = () => syncFromCloud();
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 6. Cross-tab instant communication via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('portfolio_sync_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CONTENT_UPDATED' && event.data?.content) {
            if (!hasUnsavedChangesRef.current) {
              const merged = sanitizeAndMerge(event.data.content);
              setContent(merged);
              setSavedBaseline(merged);
            }
          }
        };
      }
    } catch {}

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      channel?.close();
    };
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const isDifferent = JSON.stringify(content) !== JSON.stringify(savedBaseline);
    setHasUnsavedChanges(isDifferent);
  }, [content, savedBaseline]);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          return { success: false, error: data.error || 'Authentication failed' };
        }
        setAuthToken(data.token);
        setIsEditMode(true);
        return { success: true };
      }
    } catch {
      // Static fallback
    }

    // Static fallback for hosted environment (Vercel, GitHub Pages, etc.)
    if (password === 'shaik2028') {
      setIsEditMode(true);
      return { success: true };
    }
    return { success: false, error: 'Incorrect password. Access denied.' };
  };

  const logout = async () => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      await fetch('/api/auth/logout', { method: 'POST', headers });
    } catch {
      // Ignore
    }
    setAuthToken(null);
    setIsEditMode(false);
  };

  const saveChanges = async (overrideContent?: PortfolioContent): Promise<{ success: boolean; message?: string; error?: string }> => {
    const dataToSave = sanitizeAndMerge(overrideContent || content);
    let cloudSaved = false;
    let cloudMessage = '';
    let cloudError = '';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Send to /api/content
      const res = await fetch('/api/content', {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSave),
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success && data.isCloud) {
          cloudSaved = true;
          setIsCloudSynced(true);
          cloudMessage = data.message || 'Saved to Supabase! Mobile and Laptop are now in sync.';
          lastCloudUpdatedRef.current = data.updated_at || new Date().toISOString();

          // Immediately broadcast to other open tabs on this device
          try {
            if (typeof BroadcastChannel !== 'undefined') {
              const ch = new BroadcastChannel('portfolio_sync_channel');
              ch.postMessage({ type: 'CONTENT_UPDATED', content: dataToSave });
              ch.close();
            }
          } catch {}
        } else {
          cloudError = data.error || (data.message ? data.message : 'Database returned an error.');
        }
      } else {
        cloudError = `Server returned HTTP ${res.status}`;
      }
    } catch (err: any) {
      cloudError = err?.message || 'Network request failed';
    }

    // Always persist to localStorage for offline cache
    setSavedBaseline(dataToSave);
    setContent(dataToSave);
    setHasUnsavedChanges(false);

    try {
      localStorage.setItem('shaik_portfolio_content', JSON.stringify(dataToSave));
      localStorage.setItem('shaik_portfolio_content_v2', JSON.stringify(dataToSave));
    } catch {
      // Ignore
    }

    if (cloudSaved) {
      return { 
        success: true, 
        message: cloudMessage || 'Saved to Supabase Cloud! Auto-synced across Laptop and Mobile.' 
      };
    }

    // If cloud saving failed, let the user know clearly so they can check Vercel environment variables
    return { 
      success: false, 
      error: cloudError || 'Cloud database not connected in Vercel! Add SUPABASE_URL and SUPABASE_ANON_KEY to sync across devices.' 
    };
  };

  const cancelChanges = () => {
    setContent(savedBaseline);
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      await fetch('/api/content/reset', { method: 'POST', headers });
    } catch {
      // Ignore
    }
    setContent(defaultPortfolioContent);
    setSavedBaseline(defaultPortfolioContent);
    setHasUnsavedChanges(false);
    setIsCloudSynced(false);
    try {
      localStorage.removeItem('shaik_portfolio_content');
      localStorage.removeItem('shaik_portfolio_content_v2');
    } catch {
      // Ignore
    }
    return { success: true, message: 'Portfolio reset to default successfully.' };
  };

  const forceSyncToLatestDefaults = () => {
    try {
      localStorage.removeItem('shaik_portfolio_content');
      localStorage.removeItem('shaik_portfolio_content_v2');
    } catch {}
    setContent(defaultPortfolioContent);
    setSavedBaseline(defaultPortfolioContent);
    setHasUnsavedChanges(false);
  };

  const getSyncUrl = (): string => {
    try {
      const json = JSON.stringify(content);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
      const base = typeof window !== 'undefined' ? window.location.origin : 'https://my-portfolio-beta-nine-78.vercel.app';
      return `${base}/#sync=${encoded}`;
    } catch (e) {
      return typeof window !== 'undefined' ? window.location.href : 'https://my-portfolio-beta-nine-78.vercel.app';
    }
  };

  const exportData = () => {
    const jsonStr = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shaik-portfolio-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (imported: PortfolioContent) => {
    setContent(imported);
    setHasUnsavedChanges(true);
  };

  // Profile
  const updateProfile = (profileUpdate: Partial<PersonalProfile>) => {
    setContent((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate },
    }));
  };

  // Helper ID generator
  const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Skills CMS
  const addSkill = (newSkill: Omit<SkillItem, 'id'> & { id?: string }) => {
    const skill: SkillItem = {
      ...newSkill,
      id: newSkill.id || genId('skill'),
      published: newSkill.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const updateSkill = (updatedSkill: SkillItem) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === updatedSkill.id ? { ...updatedSkill, updatedAt: new Date().toISOString() } : s)),
    }));
  };

  const deleteSkill = (id: string) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const toggleSkillPublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, published: s.published === false } : s)),
    }));
  };

  // Projects CMS
  const addProject = (newProj: Omit<ProjectItem, 'id'> & { id?: string }) => {
    const project: ProjectItem = {
      ...newProj,
      id: newProj.id || genId('proj'),
      published: newProj.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const updateProject = (updatedProj: ProjectItem) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === updatedProj.id ? { ...updatedProj, updatedAt: new Date().toISOString() } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const toggleProjectPublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, published: p.published === false } : p)),
    }));
  };

  // Learning Journey CMS
  const addLearningEntry = (newEntry: Omit<LearningEntry, 'id'> & { id?: string }) => {
    const entry: LearningEntry = {
      ...newEntry,
      id: newEntry.id || genId('learn'),
      published: newEntry.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      learningJourney: [...(prev.learningJourney || []), entry],
    }));
  };

  const updateLearningEntry = (updatedEntry: LearningEntry) => {
    setContent((prev) => ({
      ...prev,
      learningJourney: (prev.learningJourney || []).map((l) => (l.id === updatedEntry.id ? { ...updatedEntry, updatedAt: new Date().toISOString() } : l)),
    }));
  };

  const deleteLearningEntry = (id: string) => {
    setContent((prev) => ({
      ...prev,
      learningJourney: (prev.learningJourney || []).filter((l) => l.id !== id),
    }));
  };

  const toggleLearningPublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      learningJourney: (prev.learningJourney || []).map((l) => (l.id === id ? { ...l, published: !l.published } : l)),
    }));
  };

  // Certifications CMS
  const addCertification = (newCert: Omit<CertificationItem, 'id'> & { id?: string }) => {
    const cert: CertificationItem = {
      ...newCert,
      id: newCert.id || genId('cert'),
      published: newCert.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), cert],
    }));
  };

  const updateCertification = (updatedCert: CertificationItem) => {
    setContent((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) => (c.id === updatedCert.id ? { ...updatedCert, updatedAt: new Date().toISOString() } : c)),
    }));
  };

  const deleteCertification = (id: string) => {
    setContent((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id),
    }));
  };

  const toggleCertPublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) => (c.id === id ? { ...c, published: !c.published } : c)),
    }));
  };

  // Achievements CMS
  const addAchievement = (newAch: Omit<AchievementItem, 'id'> & { id?: string }) => {
    const ach: AchievementItem = {
      ...newAch,
      id: newAch.id || genId('ach'),
      published: newAch.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ach],
    }));
  };

  const updateAchievement = (updatedAch: AchievementItem) => {
    setContent((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((a) => (a.id === updatedAch.id ? { ...updatedAch, updatedAt: new Date().toISOString() } : a)),
    }));
  };

  const deleteAchievement = (id: string) => {
    setContent((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a.id !== id),
    }));
  };

  const toggleAchievementPublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).map((a) => (a.id === id ? { ...a, published: !a.published } : a)),
    }));
  };

  // Experience CMS
  const addExperience = (newExp: Omit<ExperienceItem, 'id'> & { id?: string }) => {
    const exp: ExperienceItem = {
      ...newExp,
      id: newExp.id || genId('exp'),
      published: newExp.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      experience: [...prev.experience, exp],
    }));
  };

  const updateExperience = (updatedExp: ExperienceItem) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === updatedExp.id ? { ...updatedExp, updatedAt: new Date().toISOString() } : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const toggleExperiencePublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, published: e.published === false } : e)),
    }));
  };

  // Education CMS
  const updateEducation = (updatedEdu: EducationItem) => {
    setContent((prev) => ({
      ...prev,
      education: updatedEdu,
    }));
  };

  const addEducationMilestone = (newM: Omit<EducationMilestone, 'id'> & { id?: string }) => {
    const milestone: EducationMilestone = {
      ...newM,
      id: newM.id || genId('edu-m'),
      published: newM.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent((prev) => ({
      ...prev,
      educationMilestones: [...(prev.educationMilestones || []), milestone],
    }));
  };

  const updateEducationMilestone = (updatedM: EducationMilestone) => {
    setContent((prev) => ({
      ...prev,
      educationMilestones: (prev.educationMilestones || []).map((m) => (m.id === updatedM.id ? { ...updatedM, updatedAt: new Date().toISOString() } : m)),
    }));
  };

  const deleteEducationMilestone = (id: string) => {
    setContent((prev) => ({
      ...prev,
      educationMilestones: (prev.educationMilestones || []).filter((m) => m.id !== id),
    }));
  };

  const toggleEducationMilestonePublish = (id: string) => {
    setContent((prev) => ({
      ...prev,
      educationMilestones: (prev.educationMilestones || []).map((m) => (m.id === id ? { ...m, published: m.published === false } : m)),
    }));
  };

  // Stats Bar CMS
  const updateStatsBar = (newStats: StatItem[]) => {
    setContent((prev) => ({
      ...prev,
      statsBar: newStats,
    }));
  };

  const updateStatItem = (index: number, updatedStat: Partial<StatItem>) => {
    setContent((prev) => {
      const currentStats = prev.statsBar ? [...prev.statsBar] : [...defaultStatsBar];
      if (currentStats[index]) {
        currentStats[index] = { ...currentStats[index], ...updatedStat };
      }
      return {
        ...prev,
        statsBar: currentStats,
      };
    });
  };

  // Focus Tracks CMS
  const updateFocusTrack = (updated: FocusTrack) => {
    setContent((prev) => ({
      ...prev,
      focusTracks: (prev.focusTracks || defaultFocusTracks).map((t) =>
        t.id === updated.id ? updated : t
      ),
    }));
  };

  const addFocusTrack = (newTrack: Omit<FocusTrack, 'id'> & { id?: string }) => {
    const track: FocusTrack = {
      ...newTrack,
      id: newTrack.id || genId('track'),
      published: newTrack.published !== false,
    };
    setContent((prev) => ({
      ...prev,
      focusTracks: [...(prev.focusTracks || defaultFocusTracks), track],
    }));
  };

  const deleteFocusTrack = (id: string) => {
    setContent((prev) => ({
      ...prev,
      focusTracks: (prev.focusTracks || defaultFocusTracks).filter((t) => t.id !== id),
    }));
  };

  // About Pillars CMS
  const updateAboutPillar = (updated: AboutPillar) => {
    setContent((prev) => ({
      ...prev,
      aboutPillars: (prev.aboutPillars || defaultAboutPillars).map((p) =>
        p.id === updated.id ? updated : p
      ),
    }));
  };

  const addAboutPillar = (newPillar: Omit<AboutPillar, 'id'> & { id?: string }) => {
    const pillar: AboutPillar = {
      ...newPillar,
      id: newPillar.id || genId('pillar'),
      published: newPillar.published !== false,
    };
    setContent((prev) => ({
      ...prev,
      aboutPillars: [...(prev.aboutPillars || defaultAboutPillars), pillar],
    }));
  };

  const deleteAboutPillar = (id: string) => {
    setContent((prev) => ({
      ...prev,
      aboutPillars: (prev.aboutPillars || defaultAboutPillars).filter((p) => p.id !== id),
    }));
  };

  return (
    <PortfolioContext.Provider
      value={{
        content,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        authToken,
        isCloudSynced,
        getSyncUrl,
        forceSyncToLatestDefaults,
        login,
        logout,
        saveChanges,
        cancelChanges,
        resetToDefaults,
        exportData,
        importData,
        updateProfile,

        // Stats Bar
        updateStatsBar,
        updateStatItem,

        // Focus Tracks
        updateFocusTrack,
        addFocusTrack,
        deleteFocusTrack,

        // About Pillars
        updateAboutPillar,
        addAboutPillar,
        deleteAboutPillar,

        // Skills
        addSkill,
        updateSkill,
        deleteSkill,
        toggleSkillPublish,

        // Projects
        addProject,
        updateProject,
        deleteProject,
        toggleProjectPublish,

        // Learning Journey
        addLearningEntry,
        updateLearningEntry,
        deleteLearningEntry,
        toggleLearningPublish,

        // Certifications
        addCertification,
        updateCertification,
        deleteCertification,
        toggleCertPublish,

        // Achievements
        addAchievement,
        updateAchievement,
        deleteAchievement,
        toggleAchievementPublish,

        // Experience
        addExperience,
        updateExperience,
        deleteExperience,
        toggleExperiencePublish,

        // Education
        updateEducation,
        addEducationMilestone,
        updateEducationMilestone,
        deleteEducationMilestone,
        toggleEducationMilestonePublish,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

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
  EducationMilestone
} from '../types';
import { defaultPortfolioContent } from '../data/portfolioData';

interface PortfolioContextType {
  content: PortfolioContent;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  hasUnsavedChanges: boolean;
  authToken: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveChanges: (overrideContent?: PortfolioContent) => Promise<{ success: boolean; message?: string; error?: string }>;
  cancelChanges: () => void;
  resetToDefaults: () => Promise<{ success: boolean; message?: string }>;
  exportData: () => void;
  importData: (imported: PortfolioContent) => void;

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

  // Load server-persisted content on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.isCustom && data.content) {
            // Merge with defaults to ensure all fields exist
            const merged: PortfolioContent = {
              ...defaultPortfolioContent,
              ...data.content,
              learningJourney: data.content.learningJourney || defaultPortfolioContent.learningJourney,
              certifications: data.content.certifications || defaultPortfolioContent.certifications,
              achievements: data.content.achievements || defaultPortfolioContent.achievements,
              educationMilestones: data.content.educationMilestones || defaultPortfolioContent.educationMilestones,
            };
            setContent(merged);
            setSavedBaseline(merged);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch server content, using local defaults', err);
      }

      // Check localStorage fallback
      try {
        const local = localStorage.getItem('shaik_portfolio_content');
        if (local) {
          const parsed = JSON.parse(local);
          const merged: PortfolioContent = {
            ...defaultPortfolioContent,
            ...parsed,
            learningJourney: parsed.learningJourney || defaultPortfolioContent.learningJourney,
            certifications: parsed.certifications || defaultPortfolioContent.certifications,
            achievements: parsed.achievements || defaultPortfolioContent.achievements,
            educationMilestones: parsed.educationMilestones || defaultPortfolioContent.educationMilestones,
          };
          setContent(merged);
          setSavedBaseline(merged);
        }
      } catch (e) {
        // Fallback silently
      }
    }

    loadInitialData();
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

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setAuthToken(data.token);
      setIsEditMode(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error' };
    }
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
    try {
      const dataToSave = overrideContent || content;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/content/save', {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSave),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to save changes.' };
      }

      // Update baseline and localStorage
      setSavedBaseline(dataToSave);
      setHasUnsavedChanges(false);
      try {
        localStorage.setItem('shaik_portfolio_content', JSON.stringify(dataToSave));
      } catch {
        // Ignore
      }

      return { success: true, message: data.message || 'Portfolio saved successfully!' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save to server.' };
    }
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
    try {
      localStorage.removeItem('shaik_portfolio_content');
    } catch {
      // Ignore
    }
    return { success: true, message: 'Portfolio reset to default successfully.' };
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

  return (
    <PortfolioContext.Provider
      value={{
        content,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        authToken,
        login,
        logout,
        saveChanges,
        cancelChanges,
        resetToDefaults,
        exportData,
        importData,
        updateProfile,

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

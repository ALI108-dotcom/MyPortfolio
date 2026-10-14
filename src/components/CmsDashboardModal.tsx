import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  BookOpen, 
  Briefcase, 
  Award, 
  Trophy, 
  GraduationCap, 
  User, 
  Code, 
  Layers, 
  Sparkles,
  Video,
  Camera,
  BarChart3
} from 'lucide-react';
import { parseVideoUrl } from '../utils/videoHelper';
import { processImageFile } from '../utils/imageHelper';
import profilePhoto from '../assets/profile.jpg';
import { defaultStatsBar } from '../data/portfolioData';
import { 
  SkillItem, 
  ProjectItem, 
  LearningEntry, 
  CertificationItem, 
  AchievementItem, 
  ExperienceItem, 
  EducationMilestone
} from '../types';

interface CmsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 
  | 'overview' 
  | 'statsbar'
  | 'skills' 
  | 'projects' 
  | 'learning' 
  | 'certifications' 
  | 'achievements' 
  | 'experience' 
  | 'education' 
  | 'profile';

export const CmsDashboardModal: React.FC<CmsDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    content,
    hasUnsavedChanges,
    saveChanges,
    cancelChanges,
    exportData,
    importData,
    updateProfile,
    updateStatsBar,
    updateStatItem,
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
    addEducationMilestone,
    updateEducationMilestone,
    deleteEducationMilestone,
    toggleEducationMilestonePublish,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Active edit/create form state
  const [editingItemType, setEditingItemType] = useState<TabType | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // null = new item
  const [formData, setFormData] = useState<any>({});
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSaveToServer = async () => {
    setSaving(true);
    setSaveStatus(null);
    const res = await saveChanges();
    setSaving(false);
    if (res.success) {
      setSaveStatus({ type: 'success', message: res.message || 'Changes safely persisted to server storage!' });
      setTimeout(() => setSaveStatus(null), 3500);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to save changes.' });
    }
  };

  // Tag helper
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.tags || formData.technologies || formData.relatedTechnologies || formData.skills || [];
    const newTags = [...currentTags, tagInput.trim()];
    if (formData.tags !== undefined) setFormData({ ...formData, tags: newTags });
    else if (formData.technologies !== undefined) setFormData({ ...formData, technologies: newTags });
    else if (formData.relatedTechnologies !== undefined) setFormData({ ...formData, relatedTechnologies: newTags });
    else if (formData.skills !== undefined) setFormData({ ...formData, skills: newTags });
    else setFormData({ ...formData, tags: newTags });
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = formData.tags || formData.technologies || formData.relatedTechnologies || formData.skills || [];
    const newTags = currentTags.filter((_: any, i: number) => i !== index);
    if (formData.tags !== undefined) setFormData({ ...formData, tags: newTags });
    else if (formData.technologies !== undefined) setFormData({ ...formData, technologies: newTags });
    else if (formData.relatedTechnologies !== undefined) setFormData({ ...formData, relatedTechnologies: newTags });
    else if (formData.skills !== undefined) setFormData({ ...formData, skills: newTags });
  };

  // Import JSON handler
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.profile && parsed.skills) {
          importData(parsed);
          setSaveStatus({ type: 'success', message: 'Backup file imported! Click "Save to Server" to persist.' });
        } else {
          setSaveStatus({ type: 'error', message: 'Invalid portfolio backup format.' });
        }
      } catch (err: any) {
        setSaveStatus({ type: 'error', message: `Import error: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  // Submit item handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemType) return;

    if (editingItemType === 'skills') {
      if (!formData.name?.trim()) return;
      if (editingItemId) {
        updateSkill(formData as SkillItem);
      } else {
        addSkill({
          name: formData.name,
          category: formData.category || 'core',
          description: formData.description || '',
          tags: formData.tags || [],
          proficiency: formData.proficiency || 'Practical',
          iconName: formData.iconName || 'Code',
          gradientClass: formData.gradientClass || 'grad-verdant',
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'projects') {
      if (!formData.title?.trim()) return;
      if (editingItemId) {
        updateProject(formData as ProjectItem);
      } else {
        addProject({
          title: formData.title,
          tagline: formData.tagline || '',
          problemStatement: formData.problemStatement || '',
          description: formData.description || '',
          technologies: formData.technologies || [],
          category: formData.category || 'Python & EDA',
          repoUrl: formData.repoUrl || 'https://github.com/ALI108-dotcom',
          demoUrl: formData.demoUrl || '',
          highlightBadge: formData.highlightBadge || 'Verified Project',
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'learning') {
      if (!formData.title?.trim()) return;
      if (editingItemId) {
        updateLearningEntry(formData as LearningEntry);
      } else {
        addLearningEntry({
          title: formData.title,
          category: formData.category || 'Data Science',
          summary: formData.summary || '',
          keyConcepts: typeof formData.keyConcepts === 'string' 
            ? formData.keyConcepts.split('\n').map((s: string) => s.trim()).filter(Boolean)
            : formData.keyConcepts || [],
          practicalApplication: formData.practicalApplication || '',
          relatedTechnologies: formData.relatedTechnologies || [],
          relatedProjectUrl: formData.relatedProjectUrl || '',
          dateLearned: formData.dateLearned || '2024 - Present',
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'certifications') {
      if (!formData.name?.trim()) return;
      if (editingItemId) {
        updateCertification(formData as CertificationItem);
      } else {
        addCertification({
          name: formData.name,
          issuingOrg: formData.issuingOrg || '',
          issueDate: formData.issueDate || '',
          credentialId: formData.credentialId || '',
          verificationUrl: formData.verificationUrl || '',
          description: formData.description || '',
          skills: formData.skills || [],
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'achievements') {
      if (!formData.title?.trim()) return;
      if (editingItemId) {
        updateAchievement(formData as AchievementItem);
      } else {
        addAchievement({
          title: formData.title,
          category: formData.category || 'Academic & Training',
          description: formData.description || '',
          date: formData.date || '',
          verificationUrl: formData.verificationUrl || '',
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'experience') {
      if (!formData.role?.trim() && !formData.organization?.trim()) return;
      if (editingItemId) {
        updateExperience(formData as ExperienceItem);
      } else {
        addExperience({
          role: formData.role || '',
          organization: formData.organization || '',
          location: formData.location || 'Remote',
          period: formData.period || '',
          status: formData.status || 'Completed',
          summary: formData.summary || '',
          tasksCompleted: typeof formData.tasksCompleted === 'string'
            ? formData.tasksCompleted.split('\n').map((s: string) => s.trim()).filter(Boolean)
            : formData.tasksCompleted || [],
          skillsPracticed: formData.skillsPracticed || [],
          verificationUrl: formData.verificationUrl || '',
          published: formData.published !== false,
        });
      }
    } else if (editingItemType === 'education') {
      if (!formData.title?.trim()) return;
      if (editingItemId) {
        updateEducationMilestone(formData as EducationMilestone);
      } else {
        addEducationMilestone({
          num: formData.num || '05',
          title: formData.title,
          subtitle: formData.subtitle || '',
          period: formData.period || '',
          published: formData.published !== false,
        });
      }
    }

    setEditingItemType(null);
    setEditingItemId(null);
    setFormData({});
  };

  // Helper to start editing
  const startEdit = (type: TabType, item: any) => {
    setEditingItemType(type);
    setEditingItemId(item.id);
    setFormData({ ...item });
  };

  // Helper to start creating
  const startCreate = (type: TabType) => {
    setEditingItemType(type);
    setEditingItemId(null);
    if (type === 'skills') {
      setFormData({ category: 'core', tags: [], published: true, iconName: 'Code' });
    } else if (type === 'projects') {
      setFormData({ category: 'Python & EDA', technologies: [], published: true, repoUrl: 'https://github.com/ALI108-dotcom' });
    } else if (type === 'learning') {
      setFormData({ category: 'Data Analysis', relatedTechnologies: [], keyConcepts: [], published: true, dateLearned: '2024 - Present' });
    } else if (type === 'certifications') {
      setFormData({ skills: [], published: true, issueDate: '2024' });
    } else if (type === 'achievements') {
      setFormData({ category: 'Academic & Training', published: true, date: '2024' });
    } else if (type === 'experience') {
      setFormData({ location: 'Remote', status: 'Completed', tasksCompleted: [], published: true });
    } else if (type === 'education') {
      setFormData({ period: 'BATCH OF 2028', published: true });
    }
  };

  // Counts
  const skillsCount = content.skills?.length || 0;
  const projectsCount = content.projects?.length || 0;
  const learningCount = content.learningJourney?.length || 0;
  const certsCount = content.certifications?.length || 0;
  const achCount = content.achievements?.length || 0;
  const expCount = content.experience?.length || 0;
  const eduCount = (content.educationMilestones?.length || 4);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-foreground/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-dashboard-title"
    >
      <div className="relative flex flex-col w-full max-w-6xl h-[92vh] overflow-hidden rounded-2xl bg-card border border-border grand-shadow-lg text-foreground">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-foreground px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-happy-orange text-foreground font-display text-sm font-bold shadow-sm">
              CMS
            </div>
            <div>
              <h2 id="cms-dashboard-title" className="font-display text-sm sm:text-base uppercase tracking-wider text-white">
                DYNAMIC PORTFOLIO CONTENT MANAGEMENT SYSTEM
              </h2>
              <p className="text-[11px] text-white/70">
                Logged in as Administrator · Persistent Server Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToServer}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-malachite px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:opacity-90 shadow cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Save to Server'}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close CMS Dashboard"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {saveStatus && (
          <div
            className={`flex items-center justify-between px-5 py-2.5 text-xs font-bold uppercase tracking-wider ${
              saveStatus.type === 'success'
                ? 'bg-malachite/20 text-malachite border-b border-malachite/30'
                : 'bg-destructive/20 text-destructive-foreground border-b border-destructive/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {saveStatus.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{saveStatus.message}</span>
            </div>
            <button onClick={() => setSaveStatus(null)} className="text-foreground hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Content Area: Sidebar + Content Pane */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <aside className="w-60 shrink-0 border-r border-border bg-muted/30 overflow-y-auto hidden md:flex flex-col justify-between p-3">
            <nav className="space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                CMS Content Collections
              </p>

              {[
                { id: 'overview', label: 'Overview & Stats', icon: Sparkles, count: null },
                { id: 'statsbar', label: 'Stats Highlights', icon: BarChart3, count: 4 },
                { id: 'skills', label: 'Skills & Tools', icon: Code, count: skillsCount },
                { id: 'projects', label: 'Featured Projects', icon: Layers, count: projectsCount },
                { id: 'learning', label: 'Learning Journey', icon: BookOpen, count: learningCount },
                { id: 'certifications', label: 'Certifications', icon: Award, count: certsCount },
                { id: 'achievements', label: 'Achievements', icon: Trophy, count: achCount },
                { id: 'experience', label: 'Experience & Roles', icon: Briefcase, count: expCount },
                { id: 'education', label: 'Education & Timeline', icon: GraduationCap, count: eduCount },
                { id: 'profile', label: 'Profile & Video', icon: User, count: null },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabType);
                      setEditingItemType(null);
                      setEditingItemId(null);
                    }}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'grad-ink text-white grand-shadow'
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.count !== null && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-foreground'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Utilities */}
            <div className="pt-3 border-t border-border/80 space-y-1.5">
              <button
                onClick={exportData}
                className="w-full flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-azure" /> Backup / Export JSON
              </button>

              <label className="w-full flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-malachite" />
                <span>Restore from Backup</span>
                <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>
            </div>
          </aside>

          {/* Right Main Panel */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            
            {/* Mobile Category Tab Strip */}
            <div className="flex md:hidden overflow-x-auto gap-1 pb-3 mb-4 border-b border-border">
              {(['overview', 'statsbar', 'skills', 'projects', 'learning', 'certifications', 'achievements', 'experience', 'education', 'profile'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setEditingItemType(null);
                  }}
                  className={`whitespace-nowrap px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                    activeTab === tab ? 'grad-ink text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* If Form is Active: Render the Form */}
            {editingItemType ? (
              <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-5 sm:p-7 grand-shadow">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                  <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                    {editingItemId ? `Edit ${editingItemType.slice(0, -1)}` : `Add New ${editingItemType.slice(0, -1)}`}
                  </h3>
                  <button
                    onClick={() => setEditingItemType(null)}
                    className="text-xs font-bold uppercase text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel &amp; Return
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Category-specific fields */}
                  {editingItemType === 'skills' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Skill Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. NumPy, Snowflake, Scikit-Learn"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Category</label>
                          <select
                            value={formData.category || 'core'}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          >
                            <option value="core">Programming (Core)</option>
                            <option value="tool">BI &amp; Database (Tool)</option>
                            <option value="domain">Specialized Domains</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Brief summary of practical capability..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Proficiency Level</label>
                          <select
                            value={formData.proficiency || 'Practical'}
                            onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          >
                            <option value="Foundational">Foundational</option>
                            <option value="Practical">Practical (Applied in Projects)</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Card Accent Gradient</label>
                          <select
                            value={formData.gradientClass || 'grad-verdant'}
                            onChange={(e) => setFormData({ ...formData, gradientClass: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          >
                            <option value="grad-verdant">Verdant (Emerald/Malachite)</option>
                            <option value="grad-azure">Azure (Ocean Blue)</option>
                            <option value="grad-sunrise">Sunrise (Warm Orange)</option>
                            <option value="grad-ink">Ink (Dark Civic)</option>
                          </select>
                        </div>
                      </div>

                      {/* Tag Management */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Keywords / Sub-skills</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                            placeholder="Add tag and press Enter"
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-bold uppercase text-white cursor-pointer"
                          >
                            Add Tag
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(formData.tags || []).map((t: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground">
                              {t}
                              <button type="button" onClick={() => handleRemoveTag(idx)} className="text-muted-foreground hover:text-coral">&times;</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Projects form */}
                  {editingItemType === 'projects' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Customer Churn Prediction Engine"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Category</label>
                          <select
                            value={formData.category || 'Python & EDA'}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          >
                            <option value="Power BI">Power BI &amp; Business Intelligence</option>
                            <option value="Python & EDA">Python &amp; Exploratory Data Analysis</option>
                            <option value="Machine Learning">Supervised Machine Learning</option>
                            <option value="AI Applications">AI Prototypes &amp; Applications</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Tagline</label>
                        <input
                          type="text"
                          value={formData.tagline || ''}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          placeholder="e.g. Predictive Modeling &amp; Feature Importance"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Problem Statement</label>
                        <textarea
                          rows={2}
                          value={formData.problemStatement || ''}
                          onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                          placeholder="What business problem or analytical question does this project solve?"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Detailed Technical Implementation</label>
                        <textarea
                          rows={3}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Methodology, cleaning steps, algorithms or DAX formulas utilized..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">GitHub Repository URL</label>
                          <input
                            type="url"
                            value={formData.repoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                            placeholder="https://github.com/ALI108-dotcom/..."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Live Demo / Dashboard URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.demoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      {/* Tech Pills */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Technologies Used</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                            placeholder="e.g. Scikit-Learn, Pandas, DAX"
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-bold uppercase text-white cursor-pointer"
                          >
                            Add Tech
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(formData.technologies || []).map((t: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground">
                              {t}
                              <button type="button" onClick={() => handleRemoveTag(idx)} className="text-muted-foreground hover:text-coral">&times;</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Learning Journey Form */}
                  {editingItemType === 'learning' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Topic Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. SQL Window Functions (Row_Number, Rank)"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Category</label>
                          <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Databases & SQL, Machine Learning, Python"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">What I Learned / Summary *</label>
                        <textarea
                          rows={2}
                          required
                          value={formData.summary || ''}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          placeholder="Clear conceptual takeaway of what was learned..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Key Concepts (One per line)</label>
                        <textarea
                          rows={3}
                          value={Array.isArray(formData.keyConcepts) ? formData.keyConcepts.join('\n') : formData.keyConcepts || ''}
                          onChange={(e) => setFormData({ ...formData, keyConcepts: e.target.value.split('\n') })}
                          placeholder="Partition By partitioning&#10;Order By frame ranking&#10;Running total aggregations"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Practical Application</label>
                        <input
                          type="text"
                          value={formData.practicalApplication || ''}
                          onChange={(e) => setFormData({ ...formData, practicalApplication: e.target.value })}
                          placeholder="e.g. Applied to rank customer transactions by monthly volume"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Related Project URL (Optional)</label>
                          <input
                            type="url"
                            value={formData.relatedProjectUrl || ''}
                            onChange={(e) => setFormData({ ...formData, relatedProjectUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Date / Timeframe</label>
                          <input
                            type="text"
                            value={formData.dateLearned || ''}
                            onChange={(e) => setFormData({ ...formData, dateLearned: e.target.value })}
                            placeholder="e.g. October 2024"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      {/* Tech Pills */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Related Technologies</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                            placeholder="e.g. PostgreSQL, SQL Server"
                            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="rounded-md bg-secondary px-3 py-1.5 text-xs font-bold uppercase text-white cursor-pointer"
                          >
                            Add Tag
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(formData.relatedTechnologies || []).map((t: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground">
                              {t}
                              <button type="button" onClick={() => handleRemoveTag(idx)} className="text-muted-foreground hover:text-coral">&times;</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Certifications form */}
                  {editingItemType === 'certifications' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Course / Certificate Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Data Analysis with Python"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Issuing Organization *</label>
                          <input
                            type="text"
                            required
                            value={formData.issuingOrg || ''}
                            onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                            placeholder="e.g. Coursera, Microsoft, IBM, Yuva"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Completion Date</label>
                          <input
                            type="text"
                            value={formData.issueDate || ''}
                            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                            placeholder="e.g. 2024"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Credential ID (Optional)</label>
                          <input
                            type="text"
                            value={formData.credentialId || ''}
                            onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                            placeholder="e.g. CERT-98234-XYZ"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Verification URL (Optional)</label>
                        <input
                          type="url"
                          value={formData.verificationUrl || ''}
                          onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Curriculum covered, projects completed..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                    </>
                  )}

                  {/* Achievements form */}
                  {editingItemType === 'achievements' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Achievement Title *</label>
                          <input
                            type="text"
                            required
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Hackathon Finalist / Competition Recognition"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">Category</label>
                          <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Hackathon, Academic, Coding Contest"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Date</label>
                        <input
                          type="text"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          placeholder="e.g. 2024"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Details of participation, project presented..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                    </>
                  )}

                  {/* Publication Status Toggle */}
                  <div className="rounded-lg bg-muted/40 p-3.5 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-foreground block">Publication Visibility</span>
                      <span className="text-[11px] text-muted-foreground">
                        {formData.published !== false ? 'Published — Visible on public website' : 'Draft — Hidden from public visitors, visible only in CMS'}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published !== false}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="h-4 w-4 rounded border-border text-azure focus:ring-azure"
                      />
                      <span className="text-xs font-bold uppercase text-foreground">
                        {formData.published !== false ? 'Publish Now' : 'Save as Draft'}
                      </span>
                    </label>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditingItemType(null)}
                      className="rounded-md border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md grad-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                    >
                      {editingItemId ? 'Update Entry' : 'Create & Save Entry'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* If List is Active: Render the Collections View */
              <div>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-foreground">
                        Content Management Overview
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Manage all skills, projects, learning milestones, and certifications. Changes can be published immediately or saved as drafts.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Skills Recorded', count: skillsCount, tab: 'skills', color: 'text-azure' },
                        { label: 'Projects Built', count: projectsCount, tab: 'projects', color: 'text-malachite' },
                        { label: 'Learning Logs', count: learningCount, tab: 'learning', color: 'text-coral' },
                        { label: 'Certifications', count: certsCount, tab: 'certifications', color: 'text-happy-orange' },
                      ].map((s) => (
                        <div
                          key={s.label}
                          onClick={() => setActiveTab(s.tab as TabType)}
                          className="rounded-xl border border-border bg-card p-4 grand-shadow cursor-pointer hover:border-azure transition-colors"
                        >
                          <span className={`font-display text-3xl sm:text-4xl block leading-none ${s.color}`}>
                            {s.count}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-2 block">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Shortcuts */}
                    <div className="rounded-xl border border-border bg-card p-5 grand-shadow space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-happy-orange" /> Quick Actions
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                          onClick={() => startCreate('skills')}
                          className="rounded-lg border border-border bg-background p-3 text-left hover:border-azure transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-azure mb-1.5" />
                          <span className="font-display text-xs uppercase block text-foreground">Add New Skill</span>
                          <span className="text-[10px] text-muted-foreground">New framework/tool</span>
                        </button>

                        <button
                          onClick={() => startCreate('projects')}
                          className="rounded-lg border border-border bg-background p-3 text-left hover:border-malachite transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-malachite mb-1.5" />
                          <span className="font-display text-xs uppercase block text-foreground">Add New Project</span>
                          <span className="text-[10px] text-muted-foreground">New repo/dashboard</span>
                        </button>

                        <button
                          onClick={() => startCreate('learning')}
                          className="rounded-lg border border-border bg-background p-3 text-left hover:border-coral transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-coral mb-1.5" />
                          <span className="font-display text-xs uppercase block text-foreground">Log Learning</span>
                          <span className="text-[10px] text-muted-foreground">Concept/practice</span>
                        </button>

                        <button
                          onClick={() => startCreate('certifications')}
                          className="rounded-lg border border-border bg-background p-3 text-left hover:border-happy-orange transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-happy-orange mb-1.5" />
                          <span className="font-display text-xs uppercase block text-foreground">Add Certificate</span>
                          <span className="text-[10px] text-muted-foreground">Course verification</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STATS BAR TAB */}
                {activeTab === 'statsbar' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-happy-orange" />
                          Highlight Stats Cards (Portfolio at a Glance)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Edit the 4 highlight metric cards displayed across the top of your portfolio.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateStatsBar(defaultStatsBar)}
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      >
                        Reset to Defaults
                      </button>
                    </div>

                    {/* Cards Editor Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(content.statsBar && content.statsBar.length > 0 ? content.statsBar : defaultStatsBar).map((stat, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-card p-4 sm:p-5 grand-shadow space-y-3">
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-happy-orange">
                              Card 0{idx + 1}
                            </span>
                            <span className={`text-xs font-bold uppercase ${stat.colorClass || 'text-azure'}`}>
                              ● Accent
                            </span>
                          </div>

                          {/* Label input */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Card Category Title
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => updateStatItem(idx, { label: e.target.value })}
                              placeholder="e.g. DEGREE SPECIALIZATION"
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-bold uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                            />
                          </div>

                          {/* Value input */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Card Main Metric Value
                            </label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => updateStatItem(idx, { value: e.target.value })}
                              placeholder="e.g. B.TECH AI & DS"
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-display uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                            />
                          </div>

                          {/* Color select */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Accent Color
                            </label>
                            <select
                              value={stat.colorClass || 'text-azure'}
                              onChange={(e) => updateStatItem(idx, { colorClass: e.target.value })}
                              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                            >
                              <option value="text-azure">Azure Blue</option>
                              <option value="text-malachite">Malachite Green</option>
                              <option value="text-coral">Coral Red</option>
                              <option value="text-happy-orange">Happy Orange</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Live Preview */}
                    <div className="rounded-xl border border-border bg-card p-5 grand-shadow">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Homepage Preview
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border">
                        {(content.statsBar && content.statsBar.length > 0 ? content.statsBar : defaultStatsBar).map((stat, i) => (
                          <div key={i} className="p-4 bg-background">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${stat.colorClass || 'text-azure'}`}>
                              {stat.label || 'LABEL'}
                            </span>
                            <span className="font-display text-base uppercase block text-foreground mt-1 truncate">
                              {stat.value || 'VALUE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SKILLS TAB */}
                {activeTab === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Technical Skills Management
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {skillsCount} total skills · Published skills appear on public portfolio
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('skills')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Skill
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {content.skills?.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 grand-shadow"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm uppercase text-foreground">{skill.name}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {skill.category}
                              </span>
                              {skill.published !== false ? (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-malachite/20 text-malachite border border-malachite/30">
                                  Published
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">{skill.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleSkillPublish(skill.id)}
                              title={skill.published !== false ? 'Unpublish to Draft' : 'Publish to Website'}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {skill.published !== false ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('skills', skill)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                              title="Edit Skill"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                              title="Delete Skill"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Projects Management
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {projectsCount} projects · Add completely new projects with repo URLs &amp; demos
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('projects')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Project
                      </button>
                    </div>

                    <div className="space-y-3">
                      {content.projects?.map((proj) => (
                        <div
                          key={proj.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 grand-shadow"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display text-base uppercase text-foreground">{proj.title}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-azure/10 text-azure border border-azure/20">
                                {proj.category}
                              </span>
                              {proj.published !== false ? (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-malachite/20 text-malachite border border-malachite/30">
                                  Published
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{proj.problemStatement || proj.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {proj.technologies?.slice(0, 4).map((t) => (
                                <span key={t} className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-foreground">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleProjectPublish(proj.id)}
                              title={proj.published !== false ? 'Unpublish' : 'Publish'}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {proj.published !== false ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('projects', proj)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProject(proj.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LEARNING JOURNEY TAB */}
                {activeTab === 'learning' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Learning Journey Logs
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Record new technical concepts, algorithms, and frameworks as you master them
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('learning')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Log Learning Topic
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(content.learningJourney || []).length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No learning topics logged yet. Click &ldquo;Log Learning Topic&rdquo; above to publish your first entry.</p>
                        </div>
                      ) : (
                        (content.learningJourney || []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 grand-shadow"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-display text-base uppercase text-foreground">{item.title}</span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-malachite/10 text-malachite border border-malachite/20">
                                  {item.category}
                                </span>
                                {item.published ? (
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-malachite/20 text-malachite border border-malachite/30">
                                    Published
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{item.summary}</p>
                              {item.practicalApplication && (
                                <p className="text-[11px] text-foreground/80 italic mt-1">&ldquo;{item.practicalApplication}&rdquo;</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => toggleLearningPublish(item.id)}
                                title={item.published ? 'Unpublish' : 'Publish'}
                                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                              >
                                {item.published ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => startEdit('learning', item)}
                                className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                                title="Edit Entry"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteLearningEntry(item.id)}
                                className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                                title="Delete Entry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* CERTIFICATIONS TAB */}
                {activeTab === 'certifications' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Courses &amp; Certifications
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Manage verified credentials, course completions, and verification links
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('certifications')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Certification
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(content.certifications || []).map((cert) => (
                        <div
                          key={cert.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 grand-shadow"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm uppercase text-foreground">{cert.name}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {cert.issuingOrg}
                              </span>
                              {cert.published ? (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-malachite/20 text-malachite">
                                  Published
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                  Draft
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{cert.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleCertPublish(cert.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {cert.published ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('certifications', cert)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteCertification(cert.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACHIEVEMENTS TAB */}
                {activeTab === 'achievements' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Achievements &amp; Recognition
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Record hackathons, competition participation, and academic milestones
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('achievements')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Achievement
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(content.achievements || []).map((ach) => (
                        <div
                          key={ach.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 grand-shadow"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm uppercase text-foreground">{ach.title}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-happy-orange/15 text-happy-orange">
                                {ach.category}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleAchievementPublish(ach.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {ach.published ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('achievements', ach)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAchievement(ach.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXPERIENCE TAB */}
                {activeTab === 'experience' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Experience &amp; Internships
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Add future internships, apprenticeships, and verified roles
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('experience')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Experience
                      </button>
                    </div>

                    <div className="space-y-3">
                      {content.experience?.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 grand-shadow"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-sm uppercase text-foreground">{exp.role}</span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {exp.organization}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{exp.summary}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleExperiencePublish(exp.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {exp.published !== false ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('experience', exp)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteExperience(exp.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EDUCATION TAB */}
                {activeTab === 'education' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                          Education &amp; Timeline Milestones
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Undergraduate degree details and milestone timeline rows
                        </p>
                      </div>
                      <button
                        onClick={() => startCreate('education')}
                        className="inline-flex items-center gap-1.5 rounded-md grad-ink px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <Plus className="h-4 w-4" /> Add Timeline Milestone
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(content.educationMilestones || []).map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 grand-shadow"
                        >
                          <div className="min-w-0">
                            <span className="font-display text-sm uppercase text-foreground block">{m.title}</span>
                            <span className="text-xs text-muted-foreground block">{m.subtitle}</span>
                            <span className="text-[10px] font-mono text-azure mt-0.5 block">{m.period}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => toggleEducationMilestonePublish(m.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            >
                              {m.published !== false ? <Eye className="h-4 w-4 text-malachite" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => startEdit('education', m)}
                              className="p-1.5 rounded text-muted-foreground hover:text-azure hover:bg-muted cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteEducationMilestone(m.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="max-w-2xl space-y-4">
                    <h3 className="font-display text-xl uppercase tracking-wider text-foreground pb-2 border-b border-border">
                      Profile &amp; Media Settings
                    </h3>

                    {/* PROFILE PORTRAIT PHOTO SETTINGS */}
                    <div className="rounded-xl border border-azure/30 bg-muted/20 p-4 sm:p-5 grand-shadow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                        <div>
                          <span className="font-display text-base uppercase tracking-wider text-azure flex items-center gap-2">
                            <Camera className="h-4 w-4" /> Profile Portrait Photo
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Connect to your File Explorer to select and update your homepage photo.
                          </p>
                        </div>
                        {content.profile.photoUrl ? (
                          <span className="rounded bg-malachite/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-malachite border border-malachite/30 w-fit">
                            Custom Image Active
                          </span>
                        ) : (
                          <span className="rounded bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border w-fit">
                            Default Photo
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        {/* Thumbnail Preview */}
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-azure/50 bg-foreground grand-shadow">
                          <img
                            src={content.profile.photoUrl || profilePhoto}
                            alt="Profile Preview"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>

                        {/* File Exploration Controls */}
                        <div className="flex-1 space-y-2.5 text-center sm:text-left">
                          <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                            <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-azure text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow transition-all hover:scale-105 active:scale-95">
                              <Camera className="h-4 w-4" />
                              <span>Select Image from Computer</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const optimized = await processImageFile(file);
                                    updateProfile({ photoUrl: optimized });
                                  } catch (err: any) {
                                    alert(err.message || 'Failed to process image');
                                  }
                                }}
                              />
                            </label>

                            {content.profile.photoUrl && (
                              <button
                                type="button"
                                onClick={() => updateProfile({ photoUrl: '' })}
                                className="rounded-md border border-border bg-background px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-coral hover:bg-muted cursor-pointer transition-colors"
                              >
                                Revert to Default Photo
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Click <strong>Select Image from Computer</strong> to open your File Explorer and choose any photo (JPG, PNG, WEBP). Click <strong>Save to Server</strong> to persist your change.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Full Name</label>
                        <input
                          type="text"
                          value={content.profile.name || ''}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Role Title</label>
                        <input
                          type="text"
                          value={content.profile.roleTitle || ''}
                          onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground mb-1">Hero Bio Summary</label>
                      <textarea
                        rows={3}
                        value={content.profile.bioSummary || ''}
                        onChange={(e) => updateProfile({ bioSummary: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-foreground mb-1">About Narrative</label>
                      <textarea
                        rows={3}
                        value={content.profile.aboutParagraph || ''}
                        onChange={(e) => updateProfile({ aboutParagraph: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={content.profile.emailConfigurable || ''}
                          onChange={(e) => updateProfile({ emailConfigurable: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">LinkedIn URL</label>
                        <input
                          type="url"
                          value={content.profile.linkedinConfigurable || ''}
                          onChange={(e) => updateProfile({ linkedinConfigurable: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>
                    </div>

                    {/* Dedicated Introduction Video Settings Card */}
                    <div className="rounded-xl border border-happy-orange/30 bg-muted/20 p-4 sm:p-5 grand-shadow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                        <div>
                          <span className="font-display text-base uppercase tracking-wider text-happy-orange flex items-center gap-2">
                            <Video className="h-4 w-4" /> Introduction Video Settings
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Update the introduction video displayed on your homepage showcase.
                          </p>
                        </div>
                        <span className="rounded bg-happy-orange/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-happy-orange border border-happy-orange/30 w-fit">
                          Allowed: 3 to 13 Minutes
                        </span>
                      </div>

                      <div className="rounded-lg bg-azure/10 border border-azure/20 p-3 text-xs text-azure leading-relaxed">
                        <strong>Format Instructions:</strong> Enter only the video URL link. You can paste any standard YouTube link (e.g. <code>https://www.youtube.com/watch?v=...</code>), YouTube Short, Vimeo link, or direct MP4 link. Video must be a minimum of 3 minutes and a maximum of 13 minutes.
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-foreground mb-1">
                          Video URL Link * (YouTube / Vimeo / MP4)
                        </label>
                        <input
                          type="url"
                          placeholder="e.g. https://www.youtube.com/watch?v=xC-c7E5PK0Y"
                          value={content.profile.introVideoUrl || ''}
                          onChange={(e) => updateProfile({ introVideoUrl: e.target.value })}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">
                            Video Title / Heading
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Introduction to Data Science Journey"
                            value={content.profile.introVideoTitle || ''}
                            onChange={(e) => updateProfile({ introVideoTitle: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-foreground mb-1">
                            Duration Badge (Min 3m, Max 13m)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. ~3 min (3–13 min allowed)"
                            value={content.profile.introVideoDuration || ''}
                            onChange={(e) => updateProfile({ introVideoDuration: e.target.value })}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                          />
                        </div>
                      </div>

                      {/* Live Video Preview in CMS Modal */}
                      {content.profile.introVideoUrl && (
                        <div className="pt-2 border-t border-border/60">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-happy-orange" />
                            Live Player Preview (Test Before Saving)
                          </p>
                          <div className="overflow-hidden rounded-lg bg-black border border-border aspect-video max-w-lg mx-auto shadow-md">
                            {parseVideoUrl(content.profile.introVideoUrl).type === 'mp4' ? (
                              <video
                                src={parseVideoUrl(content.profile.introVideoUrl).embedUrl}
                                controls
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <iframe
                                src={parseVideoUrl(content.profile.introVideoUrl).embedUrl}
                                title="CMS Video Preview"
                                className="w-full h-full border-0"
                                allowFullScreen
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-coral">
                <AlertCircle className="h-4 w-4" /> Unsaved changes pending server write
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-malachite">
                <CheckCircle2 className="h-4 w-4" /> All content synced with persistent server storage
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {hasUnsavedChanges && (
              <button
                onClick={cancelChanges}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer"
              >
                Discard Edits
              </button>
            )}
            <button
              onClick={handleSaveToServer}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary text-white grad-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5 text-azure" />
              {saving ? 'Writing to Disk...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-foreground/30 bg-background px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer"
            >
              Close &amp; Preview
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Save, 
  User, 
  BookOpen, 
  Code, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  Mail,
  CheckCircle2
} from 'lucide-react';

interface ContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({ isOpen, onClose }) => {
  const { 
    content, 
    updateProfile, 
    updateSkill, 
    updateProject, 
    updateExperience, 
    updateEducation,
    saveChanges,
    hasUnsavedChanges
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'contact'>('profile');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaveStatus('Saving changes to persistent server storage...');
    const res = await saveChanges();
    if (res.success) {
      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus(`Error saving: ${res.error}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-foreground/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
    >
      <div className="relative flex flex-col w-full max-w-4xl h-[90vh] overflow-hidden rounded-xl bg-card border border-border grand-shadow-lg text-foreground">
        
        {/* Top Tiranga Rule */}
        <div className="tiranga-rule shrink-0" aria-hidden="true" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-azure">
              ADMINISTRATIVE CONTROL PANEL
            </span>
            <h2 id="editor-modal-title" className="font-display text-xl uppercase leading-tight text-foreground">
              Portfolio Content Editor
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-md grad-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              <Save className="h-3.5 w-3.5 text-azure" />
              <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {saveStatus && (
          <div className="bg-azure/10 border-b border-azure/20 px-6 py-2 text-xs font-bold uppercase tracking-wider text-azure flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Modal Content with Left Navigation Tabs & Right Editing Panel */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
          
          {/* Navigation Tabs */}
          <nav className="flex md:flex-col shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/40 p-2 md:p-3 overflow-x-auto md:w-52 space-y-0 md:space-y-1">
            {[
              { id: 'profile', label: 'Hero & Identity', icon: User },
              { id: 'about', label: 'About & Pillars', icon: BookOpen },
              { id: 'skills', label: 'Technical Skills', icon: Code },
              { id: 'projects', label: 'Projects & Work', icon: Layers },
              { id: 'experience', label: 'Apprenticeship', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'contact', label: 'Contact Details', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-left transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'grad-ink text-white grand-shadow'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-happy-orange' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Editing Panel Form */}
          <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-6">
            
            {/* 1. Hero & Identity Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Hero Section &amp; Brand Identity
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={content.profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Professional Role Title
                  </label>
                  <input
                    type="text"
                    value={content.profile.roleTitle}
                    onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Bio Headline
                  </label>
                  <input
                    type="text"
                    value={content.profile.bioHeadline}
                    onChange={(e) => updateProfile({ bioHeadline: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Bio Summary (Hero Paragraph)
                  </label>
                  <textarea
                    rows={3}
                    value={content.profile.bioSummary}
                    onChange={(e) => updateProfile({ bioSummary: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                      Academic Institution
                    </label>
                    <input
                      type="text"
                      value={content.profile.institution}
                      onChange={(e) => updateProfile({ institution: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                      Graduation Batch
                    </label>
                    <input
                      type="text"
                      value={content.profile.graduationBatch}
                      onChange={(e) => updateProfile({ graduationBatch: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Career Target Goal
                  </label>
                  <input
                    type="text"
                    value={content.profile.careerGoal}
                    onChange={(e) => updateProfile({ careerGoal: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {/* 2. About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  About Section Information
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    About Narrative Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={content.profile.bioSummary}
                    onChange={(e) => updateProfile({ bioSummary: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="rounded-lg bg-sand/30 border border-border p-4 text-xs text-muted-foreground">
                  The four foundational pillars in the About section (Academic Foundation, Analytical Rigor, Data Storytelling, Continuous Practice) reflect your core values.
                </div>
              </div>
            )}

            {/* 3. Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Technical Skills &amp; Tools ({content.skills.length})
                </h3>

                <div className="space-y-4">
                  {content.skills.map((skill) => (
                    <div key={skill.id} className="rounded-lg border border-border bg-background p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            Skill Name
                          </label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill({ ...skill, name: e.target.value })}
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            Category
                          </label>
                          <select
                            value={skill.category}
                            onChange={(e) => updateSkill({ ...skill, category: e.target.value as any })}
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                          >
                            <option value="core">Core Programming</option>
                            <option value="tool">BI &amp; Database Tool</option>
                            <option value="domain">Domain Knowledge</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={skill.description}
                          onChange={(e) => updateSkill({ ...skill, description: e.target.value })}
                          className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={skill.tags.join(', ')}
                          onChange={(e) => updateSkill({ 
                            ...skill, 
                            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                          })}
                          className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Projects &amp; Deliverables ({content.projects.length})
                </h3>

                <div className="space-y-6">
                  {content.projects.map((proj, idx) => (
                    <div key={proj.id} className="rounded-xl border border-border bg-background p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="font-display text-xs uppercase text-azure">
                          Project {idx + 1}: {proj.category}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                          {proj.highlightBadge || 'Project'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            Project Title
                          </label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject({ ...proj, title: e.target.value })}
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={proj.tagline}
                            onChange={(e) => updateProject({ ...proj, tagline: e.target.value })}
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Problem Statement
                        </label>
                        <textarea
                          rows={2}
                          value={proj.problemStatement}
                          onChange={(e) => updateProject({ ...proj, problemStatement: e.target.value })}
                          className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Technical Implementation / Description
                        </label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => updateProject({ ...proj, description: e.target.value })}
                          className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Technologies Used (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={proj.technologies.join(', ')}
                          onChange={(e) => updateProject({ 
                            ...proj, 
                            technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                          })}
                          className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            GitHub Repository URL
                          </label>
                          <input
                            type="text"
                            value={proj.repoUrl || ''}
                            onChange={(e) => updateProject({ ...proj, repoUrl: e.target.value })}
                            placeholder="https://github.com/ALI108-dotcom/..."
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                            Live Demo URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={proj.demoUrl || ''}
                            onChange={(e) => updateProject({ ...proj, demoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full rounded border border-border bg-card px-3 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Internship &amp; Practical Training
                </h3>

                {content.experience.map((exp) => (
                  <div key={exp.id} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience({ ...exp, role: e.target.value })}
                          className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                          Organization
                        </label>
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => updateExperience({ ...exp, organization: e.target.value })}
                          className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                        Summary
                      </label>
                      <textarea
                        rows={3}
                        value={exp.summary}
                        onChange={(e) => updateExperience({ ...exp, summary: e.target.value })}
                        className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">
                        Skills Practiced (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={exp.skillsPracticed.join(', ')}
                        onChange={(e) => updateExperience({
                          ...exp,
                          skillsPracticed: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                        className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Academic Education Information
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={content.education.degree}
                    onChange={(e) => updateEducation({ ...content.education, degree: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={content.education.specialization}
                    onChange={(e) => updateEducation({ ...content.education, specialization: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={content.education.institution}
                      onChange={(e) => updateEducation({ ...content.education, institution: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                      Batch Period
                    </label>
                    <input
                      type="text"
                      value={content.education.batch}
                      onChange={(e) => updateEducation({ ...content.education, batch: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={content.education.location}
                    onChange={(e) => updateEducation({ ...content.education, location: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {/* 7. Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-5">
                <h3 className="font-display text-base uppercase text-azure border-b border-border pb-2">
                  Contact Channels &amp; Configuration
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    Direct Email Address
                  </label>
                  <input
                    type="email"
                    value={content.profile.emailConfigurable}
                    onChange={(e) => updateProfile({ emailConfigurable: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={content.profile.linkedinConfigurable}
                    onChange={(e) => updateProfile({ linkedinConfigurable: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                    GitHub URL (Verified)
                  </label>
                  <input
                    type="url"
                    value={content.profile.githubUrl}
                    onChange={(e) => updateProfile({ githubUrl: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3.5 py-2 text-sm"
                  />
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between px-6 py-3.5 border-t border-border bg-background">
          <span className="text-xs text-muted-foreground">
            {hasUnsavedChanges ? '⚠️ You have unsaved changes' : '✓ All changes in sync'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted"
            >
              Close Editor
            </button>
            <button
              onClick={handleSave}
              className="rounded grad-ink px-5 py-2 text-xs font-bold uppercase tracking-wider text-white grand-shadow"
            >
              Save to Server
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

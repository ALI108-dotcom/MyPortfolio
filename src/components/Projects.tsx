import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultPortfolioContent } from '../data/portfolioData';
import { ProjectItem } from '../types';
import { 
  BarChart2, 
  Terminal, 
  Cpu, 
  MessageSquareCode, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Layers, 
  Sparkles,
  Edit2,
  Plus,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';

interface EditProjectModalProps {
  project: ProjectItem;
  onSave: (p: ProjectItem) => void;
  onClose: () => void;
  onDelete: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState<ProjectItem>({ ...project });
  const [techString, setTechString] = useState<string>(project.technologies?.join(', ') || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated: ProjectItem = {
      ...form,
      technologies: techString.split(',').map((t) => t.trim()).filter(Boolean),
    };
    onSave(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-azure/20 border border-azure/30">
              <Edit2 className="h-4 w-4 text-azure" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-azure">Edit Project</p>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs">{form.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Project Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="e.g. Sales Analytics Dashboard"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              >
                <option value="Power BI">Power BI</option>
                <option value="Python & EDA">Python & EDA</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="AI Applications">AI Applications</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tagline / Short Subtitle</label>
              <input
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="Brief summary line"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Highlight Badge / Milestone</label>
              <input
                value={form.highlightBadge || ''}
                onChange={(e) => setForm({ ...form, highlightBadge: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="e.g. FEATURED DASHBOARD"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Problem Statement / Core Challenge</label>
            <textarea
              rows={3}
              value={form.problemStatement}
              onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="What business problem or analytical question does this address?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Technical Implementation / Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="Details on methodologies, tools, and technical outcomes..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Technologies (comma separated)</label>
            <input
              value={techString}
              onChange={(e) => setTechString(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              placeholder="e.g. Python, Pandas, Matplotlib, Scikit-Learn"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">GitHub Repo URL</label>
              <input
                value={form.repoUrl || ''}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Demo / Live Report URL</label>
              <input
                value={form.demoUrl || ''}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.featured || false}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded border-border text-azure focus:ring-azure cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer">
              Pin as Featured Showcase Project
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-6 py-4 sticky bottom-0 z-10 backdrop-blur-md">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="h-4 w-4" /> Delete Project
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">Cancel</button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'}`}
            >
              {saved ? <><CheckCircle className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Project</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddProjectModalProps {
  onSave: (p: Omit<ProjectItem, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onSave, onClose }) => {
  const [form, setForm] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    tagline: '',
    problemStatement: '',
    description: '',
    technologies: ['Python', 'Pandas'],
    category: 'Python & EDA',
    featured: false,
    repoUrl: 'https://github.com/ALI108-dotcom',
    demoUrl: '',
    published: true,
  });
  const [techString, setTechString] = useState('Python, Pandas');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.title.trim()) return;
    const newProject = {
      ...form,
      technologies: techString.split(',').map((t) => t.trim()).filter(Boolean),
    };
    onSave(newProject);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-6 py-4 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-malachite/20 border border-malachite/30">
              <Plus className="h-4 w-4 text-malachite" />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-malachite">Add New Project</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Project Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="e.g. Customer Churn Prediction"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              >
                <option value="Power BI">Power BI</option>
                <option value="Python & EDA">Python & EDA</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="AI Applications">AI Applications</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tagline</label>
              <input
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="One sentence overview"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Highlight Badge</label>
              <input
                value={form.highlightBadge || ''}
                onChange={(e) => setForm({ ...form, highlightBadge: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="e.g. MACHINE LEARNING"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Problem Statement</label>
            <textarea
              rows={3}
              value={form.problemStatement}
              onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="What core analytical problem is addressed?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description / Implementation</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="Detailed explanation..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Technologies (comma separated)</label>
            <input
              value={techString}
              onChange={(e) => setTechString(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              placeholder="e.g. Scikit-Learn, Pandas, Seaborn"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">GitHub Repo URL</label>
              <input
                value={form.repoUrl || ''}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Demo / Live URL</label>
              <input
                value={form.demoUrl || ''}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/30 px-6 py-4 sticky bottom-0 z-10 backdrop-blur-md">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">Cancel</button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'}`}
          >
            {saved ? <><CheckCircle className="h-4 w-4" /> Added!</> : <><Plus className="h-4 w-4" /> Create Project</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const { content, isEditMode, updateProject, addProject, deleteProject, saveChanges } = usePortfolio();
  const rawProjects = content.projects || defaultPortfolioContent.projects;
  const publishedProjects = rawProjects.filter((p) => p.published !== false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [saving, setSaving] = useState(false);

  const featuredProject = publishedProjects[0] || defaultPortfolioContent.projects[0];
  const secondProject = publishedProjects[1] || defaultPortfolioContent.projects[1];
  const thirdProject = publishedProjects[2] || defaultPortfolioContent.projects[2];
  const additionalProjects = publishedProjects.slice(3);

  const handleSaveAll = async () => {
    setSaving(true);
    await saveChanges();
    setSaving(false);
  };

  return (
    <section id="projects" className="grad-paper-soft border-y border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        
        {/* Section Heading & Edit Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-4xl">
            <p className="eyebrow tracking-[0.2em] text-azure">WHAT I DID TILL NOW</p>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-5xl text-foreground">
              PROJECTS &amp; BUILDS
            </h2>
            <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
          </div>

          {/* Edit Mode Toolbar */}
          {isEditMode && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-azure/20 bg-azure/5 p-2 sm:p-3">
              <span className="text-xs font-bold uppercase tracking-widest text-azure flex items-center gap-1.5 px-2">
                <Edit2 className="h-3.5 w-3.5" /> Project Editor
              </span>
              <button
                onClick={() => setShowAddProject(true)}
                className="flex items-center gap-1.5 rounded-lg border border-malachite/30 bg-malachite/10 px-3 py-1.5 text-xs font-bold text-malachite hover:bg-malachite/20 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Project
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-azure/30 bg-azure/10 px-3 py-1.5 text-xs font-bold text-azure hover:bg-azure/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {saving ? 'Saving...' : <><Save className="h-3 w-3" /> Save Changes</>}
              </button>
            </div>
          )}
        </div>

        {/* Master Showcase Card - Matching Reference Awards & Recognition Card */}
        <article className="grad-surface mt-10 overflow-hidden rounded-xl border border-border grand-shadow bg-card relative">
          <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
            
            {/* Left Big Featured Card: Project 1 */}
            <div className="relative group flex min-h-80 flex-col justify-between border-b border-border p-6 sm:p-9 lg:border-b-0 lg:border-r">
              {/* Inline Edit Trigger */}
              {isEditMode && featuredProject && (
                <button
                  onClick={() => setEditingProject(featuredProject)}
                  className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-md border border-azure/40 bg-azure/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer shadow-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Featured
                </button>
              )}

              <div>
                <span className="grid h-14 w-14 place-items-center rounded-lg grad-verdant text-foreground">
                  <BarChart2 className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="mt-8">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    PROJECT 01 · {featuredProject?.highlightBadge || 'FEATURED DASHBOARD'}
                  </span>
                  <h3 className="mt-2 font-display text-2xl uppercase leading-tight sm:text-3xl text-foreground">
                    {featuredProject?.title}
                  </h3>
                  <strong className="mt-3 block font-display text-3xl sm:text-4xl leading-none text-azure">
                    {featuredProject?.category || 'POWER BI & DAX'}
                  </strong>
                  <p className="mt-4 text-sm sm:text-base leading-6 text-muted-foreground">
                    {featuredProject?.problemStatement}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {featuredProject?.technologies?.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded bg-muted px-2 py-1 text-[11px] font-bold text-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProject(featuredProject)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md grad-ink px-4 py-2 text-xs font-bold uppercase tracking-widest text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    View Details
                  </button>
                  {featuredProject?.repoUrl && (
                    <a
                      href={featuredProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-azure hover:underline"
                    >
                      GitHub <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column Stack: Project 2 & Project 3 */}
            <ol className="divide-y divide-border">
              {/* Project 2 */}
              {secondProject && (
                <li className="relative group grid min-h-36 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-8 hover:bg-muted/30 transition-colors">
                  {isEditMode && (
                    <button
                      onClick={() => setEditingProject(secondProject)}
                      className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-azure/40 bg-azure/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer shadow-sm"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  )}
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-azure text-white">
                    <Layers className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      PROJECT 02 · {secondProject.category}
                    </span>
                    <h3 className="mt-1 font-display text-lg sm:text-xl uppercase leading-tight text-foreground">
                      {secondProject.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {secondProject.tagline || secondProject.problemStatement}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProject(secondProject)}
                      className="text-xs font-bold uppercase tracking-widest text-azure hover:text-coral transition-colors cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                  </div>
                </li>
              )}

              {/* Project 3 */}
              {thirdProject && (
                <li className="relative group grid min-h-36 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-8 hover:bg-muted/30 transition-colors">
                  {isEditMode && (
                    <button
                      onClick={() => setEditingProject(thirdProject)}
                      className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-azure/40 bg-azure/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer shadow-sm"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  )}
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-sunrise text-foreground">
                    <Terminal className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      PROJECT 03 · {thirdProject.highlightBadge || thirdProject.category}
                    </span>
                    <h3 className="mt-1 font-display text-lg sm:text-xl uppercase leading-tight text-foreground">
                      {thirdProject.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {thirdProject.tagline || thirdProject.problemStatement}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProject(thirdProject)}
                      className="text-xs font-bold uppercase tracking-widest text-azure hover:text-coral transition-colors cursor-pointer"
                    >
                      Inspect &rarr;
                    </button>
                  </div>
                </li>
              )}
            </ol>
          </div>

          {/* Bottom Bar: Methodology Standards */}
          <div className="border-t border-border bg-muted/45 px-6 py-5 sm:px-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              PROJECT ENGINEERING STANDARDS
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase text-foreground">
                <span className="font-display text-coral">01</span> Star Schema Modeling
              </span>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase text-foreground">
                <span className="font-display text-coral">02</span> Python Wrangling
              </span>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase text-foreground">
                <span className="font-display text-coral">03</span> Statistical Plots
              </span>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase text-foreground">
                <span className="font-display text-coral">04</span> Model Benchmarking
              </span>
            </div>
          </div>
        </article>

        {/* Lower Grid: Additional Work */}
        <div className="mt-12 border-t-2 border-foreground pt-7">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="eyebrow tracking-[0.2em] text-malachite">ADDITIONAL WORK</p>
              <h3 className="mt-2 max-w-md font-display text-2xl uppercase leading-tight sm:text-3xl text-foreground">
                MACHINE LEARNING &amp; AI COACH PROTOTYPES
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
                Click any card to inspect full problem statements, parameters, and technologies.
              </p>
            </div>

            <ul className="grid border-l border-t border-border sm:grid-cols-2">
              {additionalProjects.length > 0 ? (
                additionalProjects.map((proj, idx) => (
                  <li 
                    key={proj.id || idx}
                    className="relative group grid min-h-24 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-r border-border bg-background/60 p-5 hover:bg-muted/60 transition-colors"
                  >
                    {isEditMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(proj);
                        }}
                        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-md border border-azure/40 bg-azure/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer shadow-sm"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                    )}
                    <span 
                      onClick={() => setSelectedProject(proj)}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card cursor-pointer"
                    >
                      {proj.category?.toLowerCase().includes('power') ? (
                        <BarChart2 className="h-5 w-5 text-happy-orange" />
                      ) : proj.category?.toLowerCase().includes('ai') ? (
                        <MessageSquareCode className="h-5 w-5 text-malachite" />
                      ) : (
                        <Cpu className="h-5 w-5 text-azure" />
                      )}
                    </span>
                    <div 
                      onClick={() => setSelectedProject(proj)}
                      className="cursor-pointer"
                    >
                      <span className="block text-xs font-bold uppercase text-azure tracking-wider">
                        PROJECT {String(idx + 4).padStart(2, '0')} · {proj.category}
                      </span>
                      <span className="text-sm font-bold uppercase leading-snug text-foreground block">
                        {proj.title}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="grid min-h-24 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-r border-border bg-background/60 p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card">
                      <Sparkles className="h-5 w-5 text-coral" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">PRACTICE SUITE</span>
                      <span className="text-sm font-bold uppercase leading-snug text-foreground block">
                        Seaborn Correlation Heatmaps
                      </span>
                    </div>
                  </li>
                  <li className="grid min-h-24 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-r border-border bg-background/60 p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card">
                      <CheckCircle2 className="h-5 w-5 text-happy-orange" />
                    </span>
                    <div>
                      <span className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">PRACTICE SUITE</span>
                      <span className="text-sm font-bold uppercase leading-snug text-foreground block">
                        Modular SQL Scripting &amp; Joins
                      </span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

      </div>

      {/* Accessible Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-card border border-border grand-shadow-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-azure">
                  {selectedProject.category} {selectedProject.highlightBadge ? `· ${selectedProject.highlightBadge}` : ''}
                </span>
                <h3 id="modal-title" className="font-display text-xl sm:text-2xl uppercase text-foreground mt-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="Close project modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problem Statement</h4>
                <p className="mt-1 text-sm leading-relaxed text-foreground bg-muted/40 p-3 rounded-md border border-border/50">
                  {selectedProject.problemStatement}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Implementation</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.stats && selectedProject.stats.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Technical Parameters</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedProject.stats.map((s, idx) => (
                      <div key={idx} className="rounded-lg border border-border bg-background p-2.5 text-center">
                        <span className="block text-[10px] font-bold uppercase text-muted-foreground">{s.label}</span>
                        <span className="font-display text-xs text-foreground uppercase">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies?.map((t) => (
                    <span key={t} className="rounded-full bg-azure/10 px-3 py-1 text-xs font-bold text-azure border border-azure/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Author: {content.profile.name}
              </span>
              <div className="flex items-center gap-3">
                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md grad-ink px-4 py-2 text-xs font-bold uppercase tracking-widest text-white grand-shadow"
                  >
                    View Code <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onSave={(p) => {
            updateProject(p);
            setEditingProject(null);
          }}
          onClose={() => setEditingProject(null)}
          onDelete={() => {
            deleteProject(editingProject.id);
            setEditingProject(null);
          }}
        />
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <AddProjectModal
          onSave={(p) => {
            addProject(p);
            setShowAddProject(false);
          }}
          onClose={() => setShowAddProject(false)}
        />
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { Database, LineChart, Binary, Compass, Video, Edit2, Save, Plus, Trash2, X, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { parseVideoUrl } from '../utils/videoHelper';
import { AboutPillar } from '../types';
import { defaultAboutPillars } from '../data/portfolioData';

// Pillar border color options
const pillarBorderOptions = [
  { label: 'Green', value: 'border-neon-green hover:border-malachite' },
  { label: 'Orange', value: 'border-happy-orange hover:border-coral' },
  { label: 'Blue', value: 'border-azure hover:border-foreground' },
  { label: 'Coral', value: 'border-coral hover:border-happy-orange' },
  { label: 'Purple', value: 'border-purple-400 hover:border-purple-300' },
];

interface EditPillarModalProps {
  pillar: AboutPillar;
  onSave: (p: AboutPillar) => void;
  onClose: () => void;
  onDelete: () => void;
}

const EditPillarModal: React.FC<EditPillarModalProps> = ({ pillar, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState<AboutPillar>({ ...pillar });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-azure/20 border border-azure/30">
              <Edit2 className="h-4 w-4 text-azure" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-azure">Edit Pillar</p>
              <p className="text-[11px] text-muted-foreground">Card {form.num}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Number</label>
              <input
                value={form.num}
                onChange={(e) => setForm({ ...form, num: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
                placeholder="01"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Color Accent</label>
              <select
                value={form.borderClass}
                onChange={(e) => setForm({ ...form, borderClass: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              >
                {pillarBorderOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              placeholder="e.g. FOUNDATION IN AI & DATA SCIENCE"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="Describe this pillar..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-4">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">Cancel</button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'}`}
            >
              {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save Pillar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddPillarModalProps {
  onSave: (p: Omit<AboutPillar, 'id'> & { id?: string }) => void;
  onClose: () => void;
  nextNum: string;
}

const AddPillarModal: React.FC<AddPillarModalProps> = ({ onSave, onClose, nextNum }) => {
  const [form, setForm] = useState<Omit<AboutPillar, 'id'>>({
    num: nextNum,
    title: '',
    desc: '',
    borderClass: 'border-azure hover:border-foreground',
    published: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-malachite/20 border border-malachite/30">
              <Plus className="h-4 w-4 text-malachite" />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-malachite">Add New Pillar</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Number</label>
              <input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure" placeholder="05" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Color Accent</label>
              <select value={form.borderClass} onChange={(e) => setForm({ ...form, borderClass: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure">
                {pillarBorderOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure" placeholder="e.g. NEW SKILL AREA" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
            <textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none" placeholder="Describe this pillar..." />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/30 px-5 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">Cancel</button>
          <button onClick={handleSave} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'}`}>
            {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Added!</> : <><Plus className="h-3.5 w-3.5" /> Add Pillar</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export const About: React.FC = () => {
  const { content, isEditMode, updateAboutPillar, addAboutPillar, deleteAboutPillar, saveChanges } = usePortfolio();
  const profile = content.profile;
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'philosophy'>('video');
  const [editingPillar, setEditingPillar] = useState<AboutPillar | null>(null);
  const [showAddPillar, setShowAddPillar] = useState(false);
  const [saving, setSaving] = useState(false);

  const videoInfo = parseVideoUrl(profile.introVideoUrl);

  const pillars = (content.aboutPillars && content.aboutPillars.length > 0
    ? content.aboutPillars
    : defaultAboutPillars
  ).filter((p) => p.published !== false);

  const handleSaveAll = async () => {
    setSaving(true);
    await saveChanges();
    setSaving(false);
  };

  const nextPillarNum = String(pillars.length + 1).padStart(2, '0');

  return (
    <section id="about" className="scroll-mt-24">
      {/* Top 2-column introduction */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        
        {/* Left narrative */}
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-azure">ABOUT MY JOURNEY</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.92] sm:text-5xl lg:text-6xl text-foreground">
            WHAT I KNOW<br />&amp; WHAT I DID
          </h2>
          <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
          <p className="mt-7 max-w-md text-base sm:text-lg font-medium leading-relaxed text-muted-foreground">
            {profile.aboutParagraph}
          </p>
        </div>

        {/* Right showcase card: Video Introduction & Analytical Philosophy */}
        <div className="overflow-hidden rounded-xl grand-shadow bg-secondary text-white p-5 sm:p-7 flex flex-col justify-between border border-border/30 relative min-h-[380px] sm:min-h-[420px]">
          <div className="civic-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
          
          {/* Card Top Bar with Tab Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-happy-orange flex items-center gap-2">
              {activeMediaTab === 'video' ? <Video className="h-4 w-4" /> : <Binary className="h-4 w-4" />}
              {activeMediaTab === 'video' ? '01/10 INTRODUCTION VIDEO' : '01/10 ANALYTICAL PHILOSOPHY'}
            </span>

            {/* Toggle Switch */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-happy-orange text-foreground font-black shadow-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Watch introduction video (3 to 13 minutes)"
              >
                ▶ Video (3 Min)
              </button>
              <button
                onClick={() => setActiveMediaTab('philosophy')}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMediaTab === 'philosophy'
                    ? 'bg-happy-orange text-foreground font-black shadow-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="View 4-step data science philosophy"
              >
                Philosophy
              </button>
            </div>
          </div>

          {/* Center Content: Video Player or Philosophy Grid */}
          {activeMediaTab === 'video' ? (
            <div className="relative z-10 flex-1 flex flex-col justify-center my-1">
              <div className="w-full overflow-hidden rounded-lg bg-black/80 border border-white/15 aspect-video shadow-inner relative group">
                {videoInfo.type === 'mp4' ? (
                  <video
                    src={videoInfo.embedUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={profile.introVideoTitle || 'Shaik Ali Ahammad — Introduction Video (3 to 13 min)'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video Title / Status Caption */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/70">
                <span className="truncate font-medium">
                  {profile.introVideoTitle || 'Introduction to Data Science & Analytical Journey'}
                </span>
                <span className="shrink-0 text-happy-orange font-bold text-[10px] uppercase ml-2">
                  {profile.introVideoDuration || '~3 Min'} (3–13 Min Allowed)
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-2 gap-3.5 py-4 sm:grid-cols-4 my-auto">
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Database className="mx-auto h-5 w-5 text-azure mb-1.5" />
                <span className="block font-display text-xs text-white">01. INGEST</span>
                <span className="text-[10px] text-white/60">SQL &amp; CSV Clean</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Compass className="mx-auto h-5 w-5 text-malachite mb-1.5" />
                <span className="block font-display text-xs text-white">02. EXPLORE</span>
                <span className="text-[10px] text-white/60">Python &amp; EDA</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <LineChart className="mx-auto h-5 w-5 text-happy-orange mb-1.5" />
                <span className="block font-display text-xs text-white">03. VISUALIZE</span>
                <span className="text-[10px] text-white/60">Power BI Reports</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Binary className="mx-auto h-5 w-5 text-coral mb-1.5" />
                <span className="block font-display text-xs text-white">04. PREDICT</span>
                <span className="text-[10px] text-white/60">ML Evaluation</span>
              </div>
            </div>
          )}

          {/* Bottom Card Bar */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
            <span>Focus: What I Know &amp; What I Have Built</span>
            <div className="flex items-center gap-2">
              {isEditMode && (
                <span className="rounded bg-azure/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure border border-azure/30">
                  Edit Video in CMS (Ctrl+Shift+E)
                </span>
              )}
              <span className="text-malachite font-bold uppercase text-[11px] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-malachite animate-pulse" />
                {activeMediaTab === 'video' ? 'Interactive Video' : 'Active Pair Programming'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom numbered pillars */}
      <div className="mt-10 lg:mt-12">
        {/* Edit mode pillar controls */}
        {isEditMode && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-azure/20 bg-azure/5 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-widest text-azure flex items-center gap-1.5">
              <Edit2 className="h-3.5 w-3.5" /> About Pillars — Edit Mode
            </span>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setShowAddPillar(true)}
                className="flex items-center gap-1.5 rounded-lg border border-malachite/30 bg-malachite/10 px-3 py-1.5 text-xs font-bold text-malachite hover:bg-malachite/20 transition-all cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Pillar
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-azure/30 bg-azure/10 px-3 py-1.5 text-xs font-bold text-azure hover:bg-azure/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {saving ? 'Saving...' : <><Save className="h-3 w-3" /> Save All</>}
              </button>
            </div>
          </div>
        )}

        <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((item) => (
            <li
              key={item.id}
              className={`group relative min-w-0 border-t-4 bg-background p-5 transition-colors hover:bg-muted/55 sm:p-6 ${item.borderClass || 'border-azure hover:border-foreground'}`}
            >
              {/* Edit button (edit mode only) */}
              {isEditMode && (
                <button
                  onClick={() => setEditingPillar(item)}
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border border-azure/40 bg-azure/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
              <span className="block font-display text-3xl leading-none text-muted-foreground/30">
                {item.num}
              </span>
              <h3 className="mt-3 font-display text-base uppercase leading-tight sm:text-lg text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {item.desc}
              </p>
            </li>
          ))}

          {/* Empty state for edit mode */}
          {isEditMode && pillars.length === 0 && (
            <li className="col-span-4 flex min-h-32 items-center justify-center text-center text-sm text-muted-foreground">
              <div>
                <p className="font-bold">No pillars defined</p>
                <p className="text-xs mt-1">Click "Add Pillar" above to start</p>
              </div>
            </li>
          )}
        </ol>
      </div>

      {/* Modals */}
      {editingPillar && (
        <EditPillarModal
          pillar={editingPillar}
          onSave={(updated) => { updateAboutPillar(updated); setEditingPillar(null); }}
          onClose={() => setEditingPillar(null)}
          onDelete={() => { deleteAboutPillar(editingPillar.id); setEditingPillar(null); }}
        />
      )}
      {showAddPillar && (
        <AddPillarModal
          nextNum={nextPillarNum}
          onSave={(p) => { addAboutPillar(p); setShowAddPillar(false); }}
          onClose={() => setShowAddPillar(false)}
        />
      )}
    </section>
  );
};

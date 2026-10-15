import React, { useState } from 'react';
import { Terminal, BarChart2, Edit2, Plus, Trash2, Save, X, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { FocusTrack } from '../types';
import { defaultFocusTracks } from '../data/portfolioData';

const TrackIcon: React.FC<{ iconName?: string; className?: string }> = ({ iconName, className }) => {
  if (iconName === 'BarChart2') return <BarChart2 className={className} aria-hidden="true" />;
  return <Terminal className={className} aria-hidden="true" />;
};

const trackColors: Record<string, { bg: string; label: string; header: string }> = {
  azure: { bg: 'grad-azure', label: 'text-azure', header: 'bg-azure/10 border-azure/30' },
  verdant: { bg: 'grad-verdant', label: 'text-azure', header: 'bg-malachite/10 border-malachite/30' },
};

interface EditTrackModalProps {
  track: FocusTrack;
  onSave: (t: FocusTrack) => void;
  onClose: () => void;
  onDelete: () => void;
}

const EditTrackModal: React.FC<EditTrackModalProps> = ({ track, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState<FocusTrack>({ ...track });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-azure/20 border border-azure/30">
              <Edit2 className="h-4 w-4 text-azure" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-azure">Edit Focus Track</p>
              <p className="text-[11px] text-muted-foreground">{track.trackLabel}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Track Label</label>
            <input
              value={form.trackLabel}
              onChange={(e) => setForm({ ...form, trackLabel: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              placeholder="e.g. Track A"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Full Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure"
              placeholder="e.g. TRACK A : PYTHON DATA SCIENCE & EDA"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none"
              placeholder="Describe this specialization track..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Color Theme</label>
            <div className="flex gap-3">
              {(['azure', 'verdant'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, colorVariant: v })}
                  className={`flex-1 rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    form.colorVariant === v
                      ? v === 'azure' ? 'border-azure bg-azure/20 text-azure' : 'border-malachite bg-malachite/20 text-malachite'
                      : 'border-border text-muted-foreground hover:border-muted'
                  }`}
                >
                  {v === 'azure' ? '🔵 Azure (Blue)' : '🟢 Verdant (Green)'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Icon</label>
            <div className="flex gap-3">
              {[{ name: 'Terminal', label: 'Terminal (Code)' }, { name: 'BarChart2', label: 'BarChart (BI)' }].map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => setForm({ ...form, iconName: icon.name })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    form.iconName === icon.name
                      ? 'border-azure bg-azure/20 text-azure'
                      : 'border-border text-muted-foreground hover:border-muted'
                  }`}
                >
                  <TrackIcon iconName={icon.name} className="h-4 w-4" />
                  {icon.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-4">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Track
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${
                saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'
              }`}
            >
              {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save Track</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddTrackModalProps {
  onSave: (t: Omit<FocusTrack, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const AddTrackModal: React.FC<AddTrackModalProps> = ({ onSave, onClose }) => {
  const [form, setForm] = useState<Omit<FocusTrack, 'id'>>({
    trackLabel: 'Track C',
    title: '',
    description: '',
    iconName: 'Terminal',
    colorVariant: 'azure',
    published: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) return;
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
            <p className="text-xs font-bold uppercase tracking-widest text-malachite">Add New Focus Track</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Track Label</label>
            <input value={form.trackLabel} onChange={(e) => setForm({ ...form, trackLabel: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure" placeholder="e.g. Track C" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Full Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure" placeholder="e.g. TRACK C : DEEP LEARNING" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure resize-none" placeholder="Describe this track..." />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Color Theme</label>
            <div className="flex gap-3">
              {(['azure', 'verdant'] as const).map((v) => (
                <button key={v} onClick={() => setForm({ ...form, colorVariant: v })} className={`flex-1 rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${form.colorVariant === v ? (v === 'azure' ? 'border-azure bg-azure/20 text-azure' : 'border-malachite bg-malachite/20 text-malachite') : 'border-border text-muted-foreground'}`}>
                  {v === 'azure' ? '🔵 Azure' : '🟢 Verdant'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/30 px-5 py-4">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-all cursor-pointer">Cancel</button>
          <button onClick={handleSave} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer ${saved ? 'bg-malachite' : 'bg-azure hover:bg-azure/80'}`}>
            {saved ? <><CheckCircle className="h-3.5 w-3.5" /> Added!</> : <><Plus className="h-3.5 w-3.5" /> Add Track</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FocusTracks: React.FC = () => {
  const { content, isEditMode, updateFocusTrack, addFocusTrack, deleteFocusTrack, saveChanges } = usePortfolio();
  const tracks = (content.focusTracks && content.focusTracks.length > 0 ? content.focusTracks : defaultFocusTracks).filter((t) => t.published !== false);

  const [editingTrack, setEditingTrack] = useState<FocusTrack | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpdateTrack = (updated: FocusTrack) => {
    updateFocusTrack(updated);
  };

  const handleDeleteTrack = (id: string) => {
    deleteFocusTrack(id);
    setEditingTrack(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await saveChanges();
    setSaving(false);
  };

  return (
    <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 relative">
      {/* Left heading column */}
      <div className="min-w-0">
        <p className="eyebrow tracking-[0.2em] text-azure">TWO SPECIALIZATION DOMAINS</p>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[0.92] sm:text-4xl lg:text-5xl text-foreground">
          DATA SCIENCE<br />PILLARS
        </h2>
        <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
        <p className="mt-6 text-sm sm:text-base leading-7 text-muted-foreground max-w-sm">
          Bridging technical exploratory coding in Python with executive business storytelling in Power BI to deliver actionable intelligence.
        </p>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 rounded-lg border border-malachite/30 bg-malachite/10 px-3 py-2 text-xs font-bold text-malachite hover:bg-malachite/20 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Track
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-azure/30 bg-azure/10 px-3 py-2 text-xs font-bold text-azure hover:bg-azure/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving...' : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      {/* Right track cards */}
      <div className={`grid gap-5 ${tracks.length === 1 ? '' : 'sm:grid-cols-2'}`}>
        {tracks.map((track) => {
          const colorKey = track.colorVariant || 'azure';
          const colors = trackColors[colorKey] || trackColors.azure;
          return (
            <article
              key={track.id}
              className="grad-surface lift-on-hover flex min-w-0 flex-col rounded-xl border border-border p-6 grand-shadow sm:min-h-96 sm:p-8 bg-card relative group"
            >
              {/* Edit button overlay (only in edit mode) */}
              {isEditMode && (
                <button
                  onClick={() => setEditingTrack(track)}
                  className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-azure/40 bg-azure/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-azure opacity-0 group-hover:opacity-100 transition-all hover:bg-azure/25 cursor-pointer shadow-md"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              )}
              <span className={`grid h-14 w-14 place-items-center rounded-lg sm:h-16 sm:w-16 ${colors.bg} text-white`}>
                <TrackIcon iconName={track.iconName} className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <div className="mt-8 sm:mt-auto sm:pt-12">
                <p className={`text-xs font-bold uppercase tracking-widest ${colors.label}`}>{track.trackLabel}</p>
                <h3 className="mt-1 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
                  {track.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-7 text-muted-foreground">
                  {track.description}
                </p>
              </div>
            </article>
          );
        })}

        {/* Empty state for edit mode */}
        {isEditMode && tracks.length === 0 && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-border text-center text-sm text-muted-foreground sm:col-span-2">
            <div>
              <p className="font-bold">No tracks yet</p>
              <p className="mt-1 text-xs">Click "Add Track" to create your first specialization track</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingTrack && (
        <EditTrackModal
          track={editingTrack}
          onSave={(updated) => { handleUpdateTrack(updated); setEditingTrack(null); }}
          onClose={() => setEditingTrack(null)}
          onDelete={() => handleDeleteTrack(editingTrack.id)}
        />
      )}
      {showAdd && (
        <AddTrackModal
          onSave={(t) => { addFocusTrack(t); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </section>
  );
};

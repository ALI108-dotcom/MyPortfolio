import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Save, 
  RotateCcw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  LayoutDashboard
} from 'lucide-react';

interface EditToolbarProps {
  onOpenQuickEdit?: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({ onOpenQuickEdit }) => {
  const { 
    isEditMode, 
    hasUnsavedChanges, 
    saveChanges, 
    cancelChanges, 
    logout 
  } = usePortfolio();

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  if (!isEditMode) return null;

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await saveChanges();
    setSaving(false);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message || 'Changes saved successfully!' });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to save changes.' });
    }
  };

  const handleConfirmCancel = () => {
    cancelChanges();
    setShowConfirmCancel(false);
    setFeedback({ type: 'success', message: 'Unsaved edits discarded.' });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleConfirmExit = async () => {
    setShowConfirmExit(false);
    await logout();
  };

  return (
    <>
      {/* Floating Top Edit Mode Bar */}
      <aside aria-label="Portfolio Edit Mode Controls" className="sticky top-0 z-50 w-full border-b border-happy-orange/40 bg-foreground text-white shadow-xl animate-in slide-in-from-top duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          
          {/* Left: Edit Mode Status Indicator */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-happy-orange opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-happy-orange" />
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs uppercase tracking-wider text-happy-orange">
                PORTFOLIO EDIT MODE
              </span>
              {hasUnsavedChanges ? (
                <span className="rounded bg-coral/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral border border-coral/40">
                  Unsaved Changes
                </span>
              ) : (
                <span className="hidden sm:inline-block rounded bg-malachite/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-malachite border border-malachite/30">
                  Synced
                </span>
              )}
            </div>
          </div>

          {/* Center / Mobile Feedback notification banner if active */}
          {feedback && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                feedback.type === 'success'
                  ? 'bg-malachite/20 text-malachite border border-malachite/30'
                  : 'bg-destructive/20 text-destructive-foreground border border-destructive/40'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
              <span className="truncate max-w-[180px] sm:max-w-none">{feedback.message}</span>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenQuickEdit && (
              <button
                onClick={onOpenQuickEdit}
                className="inline-flex items-center gap-1.5 rounded bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer border border-white/20"
                title="Open Dynamic Content Management System Dashboard"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-happy-orange" />
                <span>CMS Dashboard</span>
              </button>
            )}

            {hasUnsavedChanges && (
              <button
                onClick={() => setShowConfirmCancel(true)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded border border-white/20 hover:bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors cursor-pointer disabled:opacity-50"
                title="Discard unsaved changes"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Discard</span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-1.5 rounded px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground grand-shadow transition-all cursor-pointer disabled:opacity-50 ${
                hasUnsavedChanges
                  ? 'grad-sunrise text-foreground font-black hover:scale-105'
                  : 'bg-white/90 text-foreground hover:bg-white'
              }`}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  setShowConfirmExit(true);
                } else {
                  handleConfirmExit();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded border border-white/20 hover:bg-white/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Exit Edit Mode"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Confirmation Modal for Discarding Edits */}
      {showConfirmCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-card border border-border p-6 grand-shadow-lg text-foreground">
            <h3 className="font-display text-base uppercase text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-coral" /> Discard Unsaved Edits?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              All edits made during this session will be reverted to the last saved version. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="rounded border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-muted"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmCancel}
                className="rounded bg-coral px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Exiting with Unsaved Edits */}
      {showConfirmExit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-card border border-border p-6 grand-shadow-lg text-foreground">
            <h3 className="font-display text-base uppercase text-foreground mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-coral" /> Unsaved Changes Warning
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              You have unsaved changes. Exiting Edit Mode now will discard any unsaved modifications.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="rounded border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="rounded bg-destructive px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

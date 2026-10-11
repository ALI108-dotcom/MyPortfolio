import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, X, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const { login } = usePortfolio();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setSuccess(false);
      // Auto-focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your portfolio administrative password.');
      return;
    }

    setError(null);
    setLoading(true);

    const result = await login(password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 400);
    } else {
      setError(result.error || 'Invalid password. Access denied.');
      inputRef.current?.select();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-dialog-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-card border border-border grand-shadow-lg">
        {/* Top Tiranga Rule */}
        <div className="tiranga-rule" aria-hidden="true" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg grad-ink text-white grand-shadow">
              <Lock className="h-5 w-5 text-happy-orange" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-azure">
                SECURITY VERIFICATION
              </span>
              <h2 id="password-dialog-title" className="font-display text-lg uppercase text-foreground leading-tight">
                Enter Edit Mode
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close authentication dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please enter your administrator password to unlock inline editing and customization controls.
          </p>

          {/* Error Message Alert */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive animate-in fade-in"
              role="alert"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-snug font-medium">{error}</span>
            </div>
          )}

          {/* Success Notification */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-malachite/10 border border-malachite/30 p-3 text-xs text-malachite font-bold uppercase animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Access Granted · Initializing Edit Mode...</span>
            </div>
          )}

          {/* Password Input Field with Show/Hide toggle */}
          <div>
            <label
              htmlFor="edit-mode-password"
              className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5"
            >
              Master Password <span className="text-coral">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                id="edit-mode-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading || success}
                className="w-full rounded-md border border-border bg-background px-4 py-2.5 pr-11 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:opacity-50"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || success}
              className="rounded-md border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex items-center justify-center gap-2 rounded-md grad-ink px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white grand-shadow hover:-translate-y-0.5 transition-transform cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Edit Mode'}
              <ArrowRight className="h-3.5 w-3.5 text-azure" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

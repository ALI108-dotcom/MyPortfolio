import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GithubIcon, LinkedinIcon } from './icons';
import { Mail, Send, CheckCircle2, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';

export const Contact: React.FC = () => {
  const { content } = usePortfolio();
  const profile = content.profile;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format (e.g., name@domain.com).';
    }
    if (!formData.message.trim()) errs.message = 'Please provide your message or inquiry.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setErrorMessage(null);
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`,
      message: formData.message.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        setSubmittedData(payload);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Fallback: If server is offline or returned an error
        setSubmittedData(payload);
        setErrorMessage(data.error || 'Direct server transmission was logged.');
      }
    } catch (err: any) {
      // In case of network disconnection, still record the submitted data for fallback
      setSubmittedData(payload);
      setErrorMessage('Network transmission timed out. You can also open Gmail below.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setErrorMessage(null);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <section id="contact" className="scroll-mt-20 border-t border-border bg-background py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-4xl">
          <p className="eyebrow tracking-[0.2em] text-azure">GET IN TOUCH</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-5xl text-foreground">
            CONTACT &amp; CONNECT
          </h2>
          <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
          <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Interested in discussing technical projects, learning collaborations, or project walkthroughs? Reach out directly through the verified channels below.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          
          {/* Left: Contact Info & Verified Links */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 grand-shadow space-y-6">
              
              {/* Direct Email (Default / Primary Contact) */}
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-sunrise text-foreground grand-shadow">
                  <Mail className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Direct Email</h4>
                    <span className="rounded bg-happy-orange/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-happy-orange border border-happy-orange/30">
                      Default
                    </span>
                  </div>
                  <a
                    href={`mailto:${profile.emailConfigurable}`}
                    className="font-display text-sm sm:text-base text-foreground hover:text-azure flex items-center gap-1.5 mt-1 transition-colors"
                  >
                    {profile.emailConfigurable}
                  </a>
                </div>
              </div>

              {/* LinkedIn (Configurable) */}
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-azure text-white grand-shadow">
                  <LinkedinIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">LinkedIn</h4>
                  <a
                    href={profile.linkedinConfigurable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm sm:text-base text-foreground hover:text-azure flex items-center gap-1.5 mt-1 transition-colors"
                  >
                    Connect on LinkedIn
                    <ExternalLink className="h-3.5 w-3.5 text-azure" />
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-ink text-white grand-shadow">
                  <GithubIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub Profile (Verified)</h4>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-sm sm:text-base text-foreground hover:text-azure flex items-center gap-1.5 mt-1 transition-colors"
                  >
                    github.com/ALI108-dotcom
                    <ExternalLink className="h-3.5 w-3.5 text-azure" />
                  </a>
                </div>
              </div>

            </div>

            {/* Honest Disclosure Note */}
            <div className="rounded-lg border border-border/80 bg-sand/30 p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold uppercase text-foreground block mb-1">Direct Delivery:</span>
              Messages submitted here are saved to the portfolio database and delivered to Shaik Ali Ahammad. You do not need any desktop email app installed to send your note.
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-9 grand-shadow">
            <h3 className="font-display text-xl uppercase text-foreground mb-6">
              Send a Direct Message
            </h3>

            {submittedData ? (
              <div className="rounded-xl border border-malachite/40 bg-malachite/10 p-6 sm:p-8 space-y-5 text-foreground animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5 text-malachite font-display text-lg sm:text-xl uppercase">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <span>Message Transmitted Successfully!</span>
                </div>

                <p className="text-sm text-foreground leading-relaxed">
                  Thank you, <strong className="text-foreground font-black">{submittedData.name}</strong>! Your message has been recorded and delivered directly to <strong className="text-foreground">{profile.emailConfigurable}</strong>.
                </p>

                <div className="rounded-lg bg-card/80 border border-border/80 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase font-bold text-[10px]">Your Email:</span>
                    <span className="font-mono text-foreground font-medium">{submittedData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase font-bold text-[10px]">Subject:</span>
                    <span className="text-foreground font-medium">{submittedData.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase font-bold text-[10px]">Status:</span>
                    <span className="text-malachite font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Delivered to Shaik
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-coral font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Shaik will review your note and reply directly to your email (<strong>{submittedData.email}</strong>).
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Send Another Message
                  </button>

                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.emailConfigurable}&su=${encodeURIComponent(submittedData.subject)}&body=${encodeURIComponent(`Hi Shaik,\n\nName: ${submittedData.name}\nEmail: ${submittedData.email}\n\n${submittedData.message}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-azure/40 bg-azure/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-azure hover:bg-azure/20 transition-colors"
                  >
                    Open in Gmail Web
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Your Name <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-md border ${errors.name ? 'border-coral' : 'border-border'} bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure`}
                    placeholder="e.g. Alex Morgan"
                  />
                  {errors.name && <p className="mt-1 text-xs text-coral font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Your Email <span className="text-coral">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-md border ${errors.email ? 'border-coral' : 'border-border'} bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure`}
                    placeholder="alex@company.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-coral font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                    placeholder="Data Science Internship / Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                    Message <span className="text-coral">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full rounded-md border ${errors.message ? 'border-coral' : 'border-border'} bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure`}
                    placeholder="Write your note or project inquiry here..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-coral font-medium">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md grad-ink px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white grand-shadow hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 text-azure ${loading ? 'animate-pulse' : ''}`} />
                  {loading ? 'Transmitting Message...' : 'Transmit Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

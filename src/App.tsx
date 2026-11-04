import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { HighlightBanner } from './components/HighlightBanner';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { FocusTracks } from './components/FocusTracks';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { FaqSection } from './components/FaqSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PasswordModal } from './components/PasswordModal';
import { EditToolbar } from './components/EditToolbar';
import { CmsDashboardModal } from './components/CmsDashboardModal';
import { LearningJourney } from './components/LearningJourney';
import { CertificationsAchievements } from './components/CertificationsAchievements';

const PortfolioLayout: React.FC = () => {
  const { isEditMode } = usePortfolio();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editorModalOpen, setEditorModalOpen] = useState(false);

  // Global Keyboard Shortcut & URL Hash Trigger: Ctrl + Shift + E or #edit
  useEffect(() => {
    // Check if URL contains #edit (ideal for mobile bookmarking / sharing)
    if (typeof window !== 'undefined') {
      const checkUrlEdit = () => {
        if (window.location.hash === '#edit' || window.location.hash === '#admin' || window.location.search.includes('edit=true')) {
          if (isEditMode) {
            setEditorModalOpen(true);
          } else {
            setPasswordModalOpen(true);
          }
        }
      };
      checkUrlEdit();
      window.addEventListener('hashchange', checkUrlEdit);
      return () => window.removeEventListener('hashchange', checkUrlEdit);
    }
  }, [isEditMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in form inputs, textareas, or contentEditable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check for Ctrl + Shift + E (support Ctrl on Windows/Linux or Meta on macOS)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        e.stopPropagation();

        if (isEditMode) {
          // If already authenticated, toggle/open the content editor
          setEditorModalOpen((prev) => !prev);
        } else {
          // Open the password authentication dialog
          setPasswordModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode]);

  return (
    <div className="seva-landing relative isolate flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden w-full">
      {/* Authenticated Edit Mode Admin Toolbar - STRICTLY visible only when isEditMode === true */}
      {isEditMode && <EditToolbar onOpenQuickEdit={() => setEditorModalOpen(true)} />}

      {/* Mobile Floating Admin Bar: strictly when authenticated on mobile */}
      {isEditMode && (
        <aside className="fixed bottom-4 inset-x-4 z-40 lg:hidden flex items-center justify-between gap-2 rounded-xl bg-foreground/95 text-white p-2.5 shadow-2xl border border-happy-orange/50 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 pl-2">
            <span className="h-2 w-2 rounded-full bg-happy-orange animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-happy-orange">Admin Active</span>
          </div>
          <button
            onClick={() => setEditorModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg grad-ink px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-azure" />
            <span>Open CMS</span>
          </button>
        </aside>
      )}

      {/* Top Sticky Header */}
      <Header
        onOpenLogin={() => setPasswordModalOpen(true)}
        onOpenEditor={() => setEditorModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="overflow-hidden">
          {/* Section 0: Hero with brand-glow and civic-grid */}
          <Hero />

          {/* Core Content Container with standard spacing */}
          <div className="mx-auto w-full max-w-7xl space-y-20 px-5 py-16 sm:px-8 sm:py-20 lg:space-y-28 lg:px-10 lg:py-24">
            {/* Section 1: Stats at a glance */}
            <StatsBar />

            {/* Section 2: Apprenticeship & Highlight Banner */}
            <HighlightBanner />

            {/* Section 3: About My Journey & 4-pillar principles */}
            <About />

            {/* Section 4: Skills & Technical Tools Grid */}
            <Skills />

            {/* Section 4.5: Dynamic Learning Journey / What I'm Learning */}
            <LearningJourney />

            {/* Section 5: Two Specialization Domains / Tracks */}
            <FocusTracks />
          </div>

          {/* Section 6: Experience & Learning Level (Full-width sunrise banner) */}
          <Experience />

          {/* Section 7: Education & Indicative Schedule */}
          <Education />

          {/* Section 8: Projects Showcase & Interactive Modal */}
          <Projects />

          {/* Section 8.5: Dynamic Certifications & Achievements */}
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
            <CertificationsAchievements />
          </div>

          {/* Section 9: Recruiter FAQ Accordion */}
          <FaqSection />

          {/* Section 10: Verified Contact Channels & Message Dispatch */}
          <Contact />
        </div>
      </main>

      {/* Footer with tiranga rule and dark ink gradient */}
      <Footer
        onOpenLogin={() => setPasswordModalOpen(true)}
        onOpenEditor={() => setEditorModalOpen(true)}
      />

      {/* Hidden Password Authentication Dialog (Ctrl + Shift + E) */}
      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      {/* Authenticated Dynamic CMS Dashboard Modal */}
      {isEditMode && (
        <CmsDashboardModal
          isOpen={editorModalOpen}
          onClose={() => setEditorModalOpen(false)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <PortfolioLayout />
    </PortfolioProvider>
  );
};

export default App;

import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GithubIcon, LinkedinIcon } from './icons';
import { Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content } = usePortfolio();
  const profile = content.profile;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nameParts = profile.name.trim().split(' ');
  const initials = nameParts.map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  return (
    <footer className="grad-ink border-t border-foreground text-white relative">
      {/* Top Tiranga Rule - Reference Hallmark */}
      <div className="tiranga-rule" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_0.8fr_0.9fr] lg:px-8">
        
        {/* Column 1: Identity & Bio */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-foreground font-display text-base">
              {initials}
            </div>
            <div>
              <span className="block font-display text-base uppercase tracking-tight text-white">
                {profile.name}
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-azure">
                {profile.roleTitle}
              </span>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-xs sm:text-sm text-white/75 leading-relaxed">
            {profile.degreeFull} · {profile.institution}. Dedicated to turning data into meaningful insights through Python, SQL, Power BI, and Machine Learning.
          </p>
          <p className="mt-4 text-[11px] text-white/50">
            Graduation Batch: {profile.graduationBatch}
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neon-green">
            Navigation
          </h4>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
            <li>
              <a href="#home" className="text-white/75 hover:text-white hover:underline transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="text-white/75 hover:text-white hover:underline transition-colors">
                About &amp; Specialization
              </a>
            </li>
            <li>
              <a href="#skills" className="text-white/75 hover:text-white hover:underline transition-colors">
                Technical Skills &amp; Tools
              </a>
            </li>
            <li>
              <a href="#projects" className="text-white/75 hover:text-white hover:underline transition-colors">
                Featured Projects
              </a>
            </li>
            <li>
              <a href="#experience" className="text-white/75 hover:text-white hover:underline transition-colors">
                Yuva Apprenticeship
              </a>
            </li>
            <li>
              <a href="#education" className="text-white/75 hover:text-white hover:underline transition-colors">
                Education &amp; Timeline
              </a>
            </li>
            <li>
              <a href="#contact" className="text-white/75 hover:text-white hover:underline transition-colors">
                Contact &amp; Connect
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Connect & Social Channels */}
        <div>
          <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-neon-green">
            Connect
          </h4>
          <p className="mt-4 text-xs sm:text-sm text-white/75 leading-relaxed">
            Open to exploratory data science conversations, internships, and collaborative opportunities.
          </p>
          
          <div className="mt-5 flex gap-3" aria-label="Social media">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-white/80 hover:border-white hover:text-white rounded-md transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.linkedinConfigurable}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-white/80 hover:border-white hover:text-white rounded-md transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${profile.emailConfigurable}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-white/80 hover:border-white hover:text-white rounded-md transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-white/80 hover:border-azure hover:text-azure rounded-md transition-colors ml-auto cursor-pointer"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Copyright bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        <div className="mx-auto max-w-7xl px-5 flex flex-col sm:row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>Designed with high fidelity reference to Seva First Innovation UI architecture.</span>
        </div>
      </div>
    </footer>
  );
};

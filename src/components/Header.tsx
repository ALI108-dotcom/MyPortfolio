import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ExternalLink, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Header: React.FC = () => {
  const { content } = usePortfolio();
  const personalProfile = content.profile;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Learning', href: '#learning' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certs', href: '#certifications' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b border-border transition-all duration-200 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background/90 backdrop-blur-sm'}`}>
      {/* Top Tiranga Rule - Reference visual hallmark */}
      <div className="tiranga-rule" aria-hidden="true" />
      
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <a 
          href="#home" 
          aria-label={`${personalProfile.name} portfolio home`}
          className="flex shrink-0 items-center gap-2.5 sm:gap-3 group"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg grad-ink text-white font-display text-base sm:text-lg tracking-wider grand-shadow transition-transform group-hover:scale-105">
            SA
          </div>
          <div className="min-w-0">
            <span className="block font-display text-xs sm:text-base uppercase tracking-tight text-foreground whitespace-nowrap">
              {personalProfile.name}
            </span>
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-azure whitespace-nowrap">
              {personalProfile.roleTitle || 'What I Know & What I Did'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation (visible on large screens lg+) */}
        <nav className="ml-auto hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="border-b-4 border-transparent px-2.5 xl:px-3 py-2 text-[11px] xl:text-xs font-bold uppercase tracking-wider xl:tracking-widest text-muted-foreground transition-colors hover:border-coral hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure rounded-sm"
            >
              {link.label}
            </a>
          ))}

          {/* Specialization indicator pill */}
          <div className="relative inline-flex items-center ml-1 xl:ml-2">
            <Globe className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="h-8 xl:h-9 inline-flex items-center rounded-md border border-border bg-background py-1 pl-7 pr-2.5 text-[10px] xl:text-xs font-bold uppercase tracking-wider text-foreground">
              B.Tech AI &amp; DS
            </span>
          </div>

          {/* Open to opportunities pulse pill */}
          <a
            href="#contact"
            aria-label="Open to internship & data science opportunities"
            className="shrink-0 items-center gap-1.5 rounded-full grad-sunrise font-extrabold uppercase tracking-wider xl:tracking-widest text-foreground shadow-[0_4px_14px_-4px_rgba(255,132,57,0.55)] transition-all duration-200 hover:shadow-[0_8px_22px_-6px_rgba(255,132,57,0.7)] hover:-translate-y-0.5 active:scale-95 ml-2 xl:ml-3 mr-1 xl:mr-2 hidden xl:inline-flex px-3.5 py-2 text-[10px] xl:text-[11px]"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
            </span>
            Open to Roles
          </a>

          {/* Secondary CTA: LinkedIn */}
          <a
            href={personalProfile.linkedinConfigurable}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure border border-azure/40 bg-background shadow-sm hover:bg-muted ml-1 xl:ml-2 h-auto rounded-md px-3 xl:px-4 py-2 xl:py-2.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider xl:tracking-widest text-azure"
          >
            LinkedIn
            <ExternalLink className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-azure" aria-hidden="true" />
          </a>

          {/* Secondary CTA: GitHub */}
          <a
            href={personalProfile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure border border-border bg-background shadow-sm hover:bg-muted ml-1 xl:ml-2 h-auto rounded-md px-3 xl:px-4 py-2 xl:py-2.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider xl:tracking-widest text-foreground"
          >
            GitHub
            <ExternalLink className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-muted-foreground" aria-hidden="true" />
          </a>

          {/* Primary CTA: Explore Projects */}
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-primary text-white shadow ml-1.5 xl:ml-2 h-auto rounded-md grad-ink px-3 xl:px-4 py-2 xl:py-2.5 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider xl:tracking-widest grand-shadow transition-transform hover:-translate-y-0.5"
          >
            Projects
            <ArrowRight className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-azure" aria-hidden="true" />
          </a>
        </nav>

        {/* Mobile / Tablet controls (visible on screens < lg) */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1 rounded-full grad-sunrise px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-ping mr-0.5" />
            Roles
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-5 py-6 lg:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <a
                href={personalProfile.linkedinConfigurable}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md border border-azure/40 text-azure py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-azure/10"
              >
                LinkedIn Profile
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={personalProfile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-xs font-bold uppercase tracking-widest"
              >
                GitHub Profile
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-md grad-ink py-2.5 text-xs font-bold uppercase tracking-widest text-white grand-shadow"
              >
                Explore Projects
                <ArrowRight className="h-3.5 w-3.5 text-azure" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

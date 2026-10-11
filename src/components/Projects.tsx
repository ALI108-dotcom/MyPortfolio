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
  Sparkles
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { content } = usePortfolio();
  const rawProjects = content.projects || defaultPortfolioContent.projects;
  const publishedProjects = rawProjects.filter((p) => p.published !== false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const featuredProject = publishedProjects[0] || defaultPortfolioContent.projects[0];
  const secondProject = publishedProjects[1] || defaultPortfolioContent.projects[1];
  const thirdProject = publishedProjects[2] || defaultPortfolioContent.projects[2];
  const additionalProjects = publishedProjects.slice(3);

  return (
    <section id="projects" className="grad-paper-soft border-y border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        
        {/* Section Heading */}
        <div className="max-w-4xl">
          <p className="eyebrow tracking-[0.2em] text-azure">VERIFIED WORK &amp; DELIVERABLES</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-5xl text-foreground">
            FEATURED PROJECTS &amp; DASHBOARDS
          </h2>
          <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
        </div>

        {/* Master Showcase Card - Matching Reference Awards & Recognition Card */}
        <article className="grad-surface mt-10 overflow-hidden rounded-xl border border-border grand-shadow bg-card">
          <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
            
            {/* Left Big Featured Card: Project 1 */}
            <div className="flex min-h-80 flex-col justify-between border-b border-border p-6 sm:p-9 lg:border-b-0 lg:border-r">
              <div>
                <span className="grid h-14 w-14 place-items-center rounded-lg grad-verdant text-foreground">
                  <BarChart2 className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="mt-8">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    PROJECT 01 · FEATURED DASHBOARD
                  </span>
                  <h3 className="mt-2 font-display text-2xl uppercase leading-tight sm:text-3xl text-foreground">
                    {featuredProject.title}
                  </h3>
                  <strong className="mt-3 block font-display text-3xl sm:text-4xl leading-none text-azure">
                    POWER BI &amp; DAX
                  </strong>
                  <p className="mt-4 text-sm sm:text-base leading-6 text-muted-foreground">
                    {featuredProject.problemStatement}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {featuredProject.technologies.slice(0, 4).map((tech) => (
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
                  <a
                    href={featuredProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-azure hover:underline"
                  >
                    GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column Stack: Project 2 & Project 3 */}
            <ol className="divide-y divide-border">
              {/* Project 2 */}
              <li className="grid min-h-36 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-azure text-white">
                  <Layers className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    PROJECT 02
                  </span>
                  <h3 className="mt-1 font-display text-lg sm:text-xl uppercase leading-tight text-foreground">
                    {secondProject.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {secondProject.tagline}
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

              {/* Project 3: Titanic EDA */}
              <li className="grid min-h-36 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg grad-sunrise text-foreground">
                  <Terminal className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    PROJECT 03 · YUVA APPRENTICESHIP
                  </span>
                  <h3 className="mt-1 font-display text-lg sm:text-xl uppercase leading-tight text-foreground">
                    {thirdProject.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {thirdProject.tagline}
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

        {/* Lower Grid matching "Beyond the prize" from reference */}
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
                    onClick={() => setSelectedProject(proj)}
                    className="grid min-h-24 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-b border-r border-border bg-background/60 p-5 cursor-pointer hover:bg-muted/60 transition-colors"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card">
                      {proj.category?.toLowerCase().includes('power') ? (
                        <BarChart2 className="h-5 w-5 text-happy-orange" />
                      ) : proj.category?.toLowerCase().includes('ai') ? (
                        <MessageSquareCode className="h-5 w-5 text-malachite" />
                      ) : (
                        <Cpu className="h-5 w-5 text-azure" />
                      )}
                    </span>
                    <div>
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
                  {selectedProject.category} · {selectedProject.highlightBadge}
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

              {selectedProject.stats && (
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
                  {selectedProject.technologies.map((t) => (
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
    </section>
  );
};

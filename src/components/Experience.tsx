import React from 'react';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Experience: React.FC = () => {
  const { content } = usePortfolio();
  const profile = content.profile;
  const publishedExperiences = (content.experience || []).filter((e) => e.published !== false);
  const edu = content.education;

  return (
    <section id="experience" className="grad-sunrise relative overflow-hidden py-16 sm:py-20 lg:py-28 scroll-mt-20">
      {/* Background print dots matching reference */}
      <div className="print-dots absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow tracking-[0.2em] text-foreground/80 font-bold mb-2">VERIFIED BACKGROUND</p>
            <h2 className="font-display text-3xl uppercase leading-[0.92] text-foreground sm:text-5xl lg:text-6xl">
              PRACTICAL EXPERIENCE &amp; TRAINING
            </h2>
          </div>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-primary text-white shadow hover:opacity-95 h-auto w-full rounded-md grad-ink px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest grand-shadow transition-transform hover:-translate-y-0.5 sm:w-fit sm:px-8 sm:py-5"
          >
            Explore Repositories
            <ArrowRight className="h-4 w-4 text-azure" aria-hidden="true" />
          </a>
        </div>

        {/* Experience Cards matching reference Level 1, 2, 3 layout */}
        <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
          {publishedExperiences.map((exp, idx) => (
            <article
              key={exp.id || idx}
              className="min-w-0 rounded-xl border border-foreground/15 bg-background/90 p-6 text-foreground backdrop-blur grand-shadow sm:p-8 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
                  Phase {String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
                  {exp.organization ? exp.organization.toUpperCase() : 'DATA SCIENCE APPRENTICE'}
                </h3>
                <p className="mt-4 text-sm sm:text-base font-semibold leading-snug text-foreground">
                  {exp.role} — {exp.location || 'Remote'}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {exp.summary}
                </p>
                {exp.tasksCompleted && exp.tasksCompleted.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {exp.tasksCompleted.slice(0, 2).map((t, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-malachite font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-malachite uppercase">
                  <CheckCircle2 className="h-4 w-4" /> {exp.status || 'Verified Training'}
                </span>
                {exp.period && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {exp.period}
                  </span>
                )}
              </div>
            </article>
          ))}

          {/* If only 1 experience is recorded, show the Capstone & Academic foundations cards to preserve Seva 3-card balance */}
          {publishedExperiences.length === 1 && (
            <>
              {/* Card 2: Titanic Project */}
              <article className="min-w-0 rounded-xl border border-foreground/15 bg-background/90 p-6 text-foreground backdrop-blur grand-shadow sm:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Phase 02</p>
                  <h3 className="mt-3 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
                    TITANIC DATASET EDA CAPSTONE
                  </h3>
                  <p className="mt-4 text-sm sm:text-base font-semibold leading-snug text-foreground">
                    Exploratory Data Analysis Project &amp; Visualizations
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Supported apprenticeship capstone: rigorously cleaned dataset, investigated passenger survival demographics across classes and genders, and rendered correlation heatmaps.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-azure uppercase">
                    <Award className="h-4 w-4" /> Capstone Deliverable
                  </span>
                </div>
              </article>

              {/* Card 3: Academic Labs & Growth */}
              <article className="min-w-0 rounded-xl border border-foreground/15 bg-background/90 p-6 text-foreground backdrop-blur grand-shadow sm:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Phase 03</p>
                  <h3 className="mt-3 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
                    ACADEMIC LABS &amp; FOUNDATIONS
                  </h3>
                  <p className="mt-4 text-sm sm:text-base font-semibold leading-snug text-foreground">
                    {edu?.degree || 'B.Tech'} in {edu?.specialization || 'Artificial Intelligence & Data Science'} ({profile.graduationBatch} Batch)
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Coursework in database management systems (SQL &amp; MongoDB), algorithms, statistics, and machine learning foundations at {edu?.institution || profile.institution}.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-happy-orange uppercase">
                    <CheckCircle2 className="h-4 w-4" /> In Progress (Batch {profile.graduationBatch})
                  </span>
                </div>
              </article>
            </>
          )}
        </div>

      </div>
    </section>
  );
};

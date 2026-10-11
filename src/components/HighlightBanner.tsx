import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const HighlightBanner: React.FC = () => {
  const { content } = usePortfolio();
  const profile = content.profile;

  return (
    <section className="scroll-mt-28 overflow-hidden rounded-xl border border-border grand-shadow bg-card">
      <div className="grad-rule h-1.5 w-full" aria-hidden="true" />
      <div className="grad-surface grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
        
        {/* Left Information */}
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-malachite flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            VERIFIED APPRENTICESHIP &amp; PRACTICAL TRAINING
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.92] text-foreground sm:text-4xl lg:text-5xl">
            YUVA DATA SCIENCE APPRENTICE
          </h2>
          <div className="grad-rule mt-5 h-2 w-24 rounded-full sm:w-32" aria-hidden="true" />
          
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-border bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground">
              Python Data Analysis &amp; Scripting
            </span>
            <span className="rounded-full border border-border bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground">
              Titanic Dataset Exploratory Data Analysis
            </span>
            <span className="rounded-full border border-border bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground">
              Pandas · Matplotlib · Seaborn
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-primary text-white shadow h-auto rounded-md grad-ink px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-widest grand-shadow transition-transform hover:-translate-y-0.5"
          >
            <Terminal className="mr-1 h-4 w-4 text-azure" aria-hidden="true" />
            VIEW GITHUB CODEBASE
          </a>
          <p className="max-w-xs text-xs sm:text-sm leading-6 text-muted-foreground lg:text-right">
            Practical exploratory data science training covering data wrangling, correlation heatmaps, and distribution insights.
          </p>
        </div>

      </div>
    </section>
  );
};

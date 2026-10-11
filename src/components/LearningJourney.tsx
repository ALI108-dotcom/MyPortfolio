import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, Sparkles, CheckCircle2, ExternalLink, Tag, Calendar } from 'lucide-react';

export const LearningJourney: React.FC = () => {
  const { content } = usePortfolio();
  const rawEntries = content.learningJourney || [];
  const publishedEntries = rawEntries.filter((item) => item.published !== false);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(publishedEntries.map((e) => e.category).filter(Boolean)))];

  const filteredEntries = activeCategory === 'all'
    ? publishedEntries
    : publishedEntries.filter((e) => e.category === activeCategory);

  if (publishedEntries.length === 0) {
    return null;
  }

  return (
    <section id="learning" className="scroll-mt-24 border-t border-border pt-16 sm:pt-20 lg:pt-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end lg:mb-14">
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-malachite flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            CONTINUOUS GROWTH &amp; KNOWLEDGE ACQUISITION
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none sm:text-5xl lg:text-6xl text-foreground">
            WHAT I&apos;M LEARNING<br />&amp; MASTERING
          </h2>
          <div className="grad-rule mt-5 h-2 w-28 rounded-full sm:w-36" aria-hidden="true" />
          <p className="mt-5 max-w-xl text-sm sm:text-base text-muted-foreground">
            A dynamic log of tools, algorithmic paradigms, database mechanisms, and data science principles I am currently exploring and applying in practical workflows.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'grad-ink text-white grand-shadow'
                    : 'border border-border bg-background text-muted-foreground hover:border-malachite hover:text-foreground'
                }`}
              >
                {cat === 'all' ? 'All Topics' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Grid of Learning Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry, idx) => (
          <article
            key={entry.id || idx}
            className="grad-surface lift-on-hover flex min-w-0 flex-col justify-between rounded-xl border border-border p-6 grand-shadow bg-card relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="grad-rule absolute top-0 inset-x-0 h-1" aria-hidden="true" />

            <div>
              {/* Header: Category & Date */}
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-malachite/10 border border-malachite/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-malachite">
                  <Tag className="h-3 w-3" />
                  {entry.category || 'Data Science'}
                </span>
                {entry.dateLearned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {entry.dateLearned}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-display text-lg uppercase leading-snug sm:text-xl text-foreground">
                {entry.title}
              </h3>

              {/* Summary */}
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {entry.summary}
              </p>

              {/* Key Concepts */}
              {entry.keyConcepts && entry.keyConcepts.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-azure mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Key Concepts Mastered
                  </p>
                  <ul className="space-y-1.5">
                    {entry.keyConcepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/90">
                        <CheckCircle2 className="h-3.5 w-3.5 text-malachite shrink-0 mt-0.5" />
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Application */}
              {entry.practicalApplication && (
                <div className="mt-4 rounded-lg bg-muted/40 border border-border/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Hands-on Application
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed italic">
                    &ldquo;{entry.practicalApplication}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Footer: Tech Pills & Project Link */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(entry.relatedTechnologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {entry.relatedProjectUrl && (
                <a
                  href={entry.relatedProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase text-azure hover:underline ml-auto"
                >
                  Project <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

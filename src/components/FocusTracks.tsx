import React from 'react';
import { Terminal, BarChart2 } from 'lucide-react';

export const FocusTracks: React.FC = () => {
  return (
    <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
      {/* Left heading column */}
      <div className="min-w-0">
        <p className="eyebrow tracking-[0.2em] text-azure">TWO SPECIALIZATION DOMAINS</p>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[0.92] sm:text-4xl lg:text-5xl text-foreground">
          DATA SCIENCE<br />PILLARS
        </h2>
        <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
        <p className="mt-6 text-sm sm:text-base leading-7 text-muted-foreground max-w-sm">
          Bridging technical exploratory coding in Python with executive business storytelling in Power BI to deliver actionable intelligence.
        </p>
      </div>

      {/* Right two track cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Track A */}
        <article className="grad-surface lift-on-hover flex min-w-0 flex-col rounded-xl border border-border p-6 grand-shadow sm:min-h-96 sm:p-8 bg-card">
          <span className="grid h-14 w-14 place-items-center rounded-lg sm:h-16 sm:w-16 grad-azure text-white">
            <Terminal className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </span>
          <div className="mt-8 sm:mt-auto sm:pt-12">
            <p className="text-xs font-bold uppercase tracking-widest text-azure">Track A</p>
            <h3 className="mt-1 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
              TRACK A : PYTHON DATA SCIENCE &amp; EDA
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-7 text-muted-foreground">
              Hands-on data wrangling, missing data treatment, bivariate correlation analysis, and machine learning foundations using Pandas, NumPy, and Scikit-Learn.
            </p>
          </div>
        </article>

        {/* Track B */}
        <article className="grad-surface lift-on-hover flex min-w-0 flex-col rounded-xl border border-border p-6 grand-shadow sm:min-h-96 sm:p-8 bg-card">
          <span className="grid h-14 w-14 place-items-center rounded-lg sm:h-16 sm:w-16 grad-verdant text-foreground">
            <BarChart2 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
          </span>
          <div className="mt-8 sm:mt-auto sm:pt-12">
            <p className="text-xs font-bold uppercase tracking-widest text-azure">Track B</p>
            <h3 className="mt-1 font-display text-xl uppercase leading-tight sm:text-2xl text-foreground">
              TRACK B : BUSINESS INTELLIGENCE &amp; BI
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-7 text-muted-foreground">
              Star schema data modeling, custom DAX metrics, interactive multi-page dashboards, and executive reporting in Microsoft Power BI and Excel.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

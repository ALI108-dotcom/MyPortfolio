import React from 'react';

export const StatsBar: React.FC = () => {
  const stats = [
    { label: 'DEGREE SPECIALIZATION', value: 'B.TECH AI & DS', colorClass: 'text-azure' },
    { label: 'CORE SKILLS KNOWN', value: 'PYTHON & SQL', colorClass: 'text-malachite' },
    { label: 'PROJECTS & ANALYTICS', value: 'POWER BI & EDA', colorClass: 'text-coral' },
    { label: 'PORTFOLIO FOCUS', value: 'WHAT I KNOW & DID', colorClass: 'text-happy-orange' },
  ];

  return (
    <section aria-label="Portfolio at a glance" className="relative">
      <div className="grad-rule h-1.5 w-full rounded-t-xl" aria-hidden="true" />
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-b-xl border border-t-0 border-border bg-border grand-shadow lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="grad-surface flex min-w-0 flex-col justify-between gap-4 p-5 pt-7 sm:gap-6 sm:p-8 sm:pt-9 bg-card"
          >
            <dt className={`text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs ${stat.colorClass}`}>
              {stat.label}
            </dt>
            <dd className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl lg:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

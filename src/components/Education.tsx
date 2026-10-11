import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, BookOpen } from 'lucide-react';

export const Education: React.FC = () => {
  const { content } = usePortfolio();
  const edu = content.education;
  const profile = content.profile;

  const defaultMilestones = [
    {
      id: 'default-1',
      num: '01',
      title: `${edu.degree.toUpperCase()} IN ${edu.specialization.toUpperCase()}`,
      subtitle: `${edu.institution}, ${edu.location}`,
      period: `BATCH OF ${profile.graduationBatch}`,
    },
    {
      id: 'default-2',
      num: '02',
      title: 'YUVA VIRTUAL DATA SCIENCE WITH PYTHON APPRENTICESHIP',
      subtitle: 'Hands-on practical training & Titanic dataset exploratory data analysis',
      period: 'COMPLETED',
    },
    {
      id: 'default-3',
      num: '03',
      title: 'POWER BI & DATA VISUALIZATION DASHBOARD SUITE',
      subtitle: 'Development of business performance & operational KPI dashboards',
      period: 'PRACTICE SUITE',
    },
    {
      id: 'default-4',
      num: '04',
      title: `TARGET CAREER MILESTONE: ${(profile.targetRole || 'Data Scientist').toUpperCase()}`,
      subtitle: 'Securing an opportunity at a leading technology enterprise',
      period: `GRADUATION ${profile.graduationBatch}`,
    },
  ];

  const milestones = content.educationMilestones && content.educationMilestones.length > 0
    ? content.educationMilestones.filter((m) => m.published !== false)
    : defaultMilestones;

  return (
    <section id="education" className="grad-paper-soft scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          
          {/* Left Column: Heading & Academic Overview */}
          <div className="min-w-0">
            <p className="eyebrow tracking-[0.2em] text-azure flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              ACADEMIC FOUNDATION
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase leading-none sm:text-5xl lg:text-6xl text-foreground">
              EDUCATION &amp;<br />TIMELINE
            </h2>
            <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
            
            <div className="mt-8 rounded-xl border border-border bg-card p-6 grand-shadow">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-azure mb-3">
                <BookOpen className="h-4 w-4" /> Core Undergraduate Coursework
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                {(edu.keyCoursework || []).map((course, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-malachite font-bold">•</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Timeline Rows */}
          <ol className="space-y-4">
            {milestones.map((item) => (
              <li
                key={item.num}
                className="grad-surface grid min-w-0 grid-cols-1 gap-3 rounded-xl border border-border p-5 grand-shadow sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:p-6 bg-card"
              >
                <span className="hidden font-display text-3xl leading-none text-coral sm:block">
                  {item.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base uppercase leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.subtitle}
                  </p>
                </div>
                <span className="font-display text-xs sm:text-sm uppercase leading-tight sm:shrink-0 sm:text-right text-azure bg-azure/10 px-3 py-1.5 rounded-md border border-azure/20">
                  {item.period}
                </span>
              </li>
            ))}
          </ol>

        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Code, 
  Database, 
  Layers, 
  BarChart3, 
  FileSpreadsheet, 
  Cpu, 
  TrendingUp, 
  PieChart 
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { content } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'core' | 'tool' | 'domain'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'Database': return <Database className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'Layers': return <Layers className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'BarChart3': return <BarChart3 className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'Cpu': return <Cpu className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'TrendingUp': return <TrendingUp className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      case 'PieChart': return <PieChart className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
      default: return <Code className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden="true" />;
    }
  };

  const publishedSkills = (content.skills || []).filter((s) => s.published !== false);
  const filteredSkills = filter === 'all' 
    ? publishedSkills 
    : publishedSkills.filter(s => s.category === filter);

  return (
    <section id="skills" className="scroll-mt-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end lg:mb-14">
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-azure">TECHNICAL COMPETENCIES</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none sm:text-5xl lg:text-6xl text-foreground">
            CORE DATA SCIENCE<br />SKILLS &amp; TOOLS
          </h2>
          <div className="grad-rule mt-5 h-2 w-28 rounded-full sm:w-36" aria-hidden="true" />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'core', 'tool', 'domain'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                filter === cat
                  ? 'grad-ink text-white grand-shadow'
                  : 'border border-border bg-background text-muted-foreground hover:border-azure hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All Skills' : cat === 'core' ? 'Programming' : cat === 'tool' ? 'BI & Database' : 'Domains'}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid - matching reference multi-card layout */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredSkills.map((skill, idx) => {
          const bgGradient = skill.gradientClass || (idx % 3 === 0 ? 'grad-verdant' : idx % 3 === 1 ? 'grad-azure' : 'grad-sunrise');
          return (
            <div
              key={skill.id}
              className={`lift-on-hover flex min-h-60 min-w-0 flex-col justify-between rounded-xl p-6 grand-shadow sm:min-h-72 ${bgGradient}`}
            >
            <span className="flex items-start justify-between gap-3">
              <span className="font-display text-4xl leading-none opacity-45 sm:text-5xl">
                {String(idx + 1).padStart(2, '0')}
              </span>
              {getIcon(skill.iconName || '')}
            </span>

            <span className="mt-8 block">
              <span className="block font-display text-lg uppercase leading-tight sm:text-xl">
                {skill.name}
              </span>
              <span className="mt-3 block text-xs leading-5 opacity-90 font-medium">
                {skill.description}
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {skill.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-block rounded bg-black/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </span>
          </div>
          );
        })}
      </div>
    </section>
  );
};

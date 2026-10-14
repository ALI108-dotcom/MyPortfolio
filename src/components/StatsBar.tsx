import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultStatsBar } from '../data/portfolioData';
import { StatItem } from '../types';
import { Edit3, Check, X, RotateCcw, Layers } from 'lucide-react';

const COLOR_OPTIONS = [
  { label: 'Azure Blue', value: 'text-azure', bgClass: 'bg-azure' },
  { label: 'Malachite Green', value: 'text-malachite', bgClass: 'bg-malachite' },
  { label: 'Coral Red', value: 'text-coral', bgClass: 'bg-coral' },
  { label: 'Happy Orange', value: 'text-happy-orange', bgClass: 'bg-happy-orange' },
];

export const StatsBar: React.FC = () => {
  const { content, isEditMode, updateStatsBar } = usePortfolio();
  const stats: StatItem[] = content.statsBar && content.statsBar.length > 0 ? content.statsBar : defaultStatsBar;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftStats, setDraftStats] = useState<StatItem[]>(stats);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const handleOpenModal = (index = 0) => {
    setDraftStats(stats.map((s) => ({ ...s })));
    setActiveCardIndex(index);
    setIsModalOpen(true);
  };

  const handleStatChange = (index: number, field: keyof StatItem, val: string) => {
    setDraftStats((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: val };
      }
      return updated;
    });
  };

  const handleSave = () => {
    updateStatsBar(draftStats);
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setDraftStats(defaultStatsBar.map((s) => ({ ...s })));
  };

  return (
    <section aria-label="Portfolio at a glance" className="relative group">
      {/* Top rule matching design system */}
      <div className="grad-rule h-1.5 w-full rounded-t-xl" aria-hidden="true" />

      {/* Edit Mode Quick Trigger Button */}
      {isEditMode && (
        <div className="absolute -top-10 right-0 z-20 flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(0)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-happy-orange px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground shadow-lg hover:brightness-110 transition-transform active:scale-95"
            title="Click to edit all 4 highlight stat cards"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Stats Cards</span>
          </button>
        </div>
      )}

      {/* Stats Cards Display */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-b-xl border border-t-0 border-border bg-border grand-shadow lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.id || idx}
            onClick={() => isEditMode && handleOpenModal(idx)}
            className={`grad-surface relative flex min-w-0 flex-col justify-between gap-4 p-5 pt-7 sm:gap-6 sm:p-8 sm:pt-9 bg-card transition-all ${
              isEditMode
                ? 'cursor-pointer hover:bg-muted/70 hover:ring-2 hover:ring-happy-orange/50'
                : ''
            }`}
            title={isEditMode ? 'Click to edit this stat card' : undefined}
          >
            {/* Small edit indicator when in Edit Mode */}
            {isEditMode && (
              <span className="absolute top-2.5 right-2.5 rounded-md bg-happy-orange/20 border border-happy-orange/40 p-1 text-happy-orange opacity-80 hover:opacity-100 transition-opacity">
                <Edit3 className="h-3 w-3" />
              </span>
            )}

            <dt className={`text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs ${stat.colorClass || 'text-azure'}`}>
              {stat.label}
            </dt>
            <dd className="font-display text-2xl uppercase leading-none text-foreground sm:text-3xl lg:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Edit Modal for Stats Bar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-happy-orange/20 text-happy-orange font-bold">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-foreground">
                    Edit Highlight Stats Bar
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customize the 4 highlight metric cards displayed beneath your profile introduction.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Selector for Cards 1-4 */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
              {draftStats.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCardIndex(idx)}
                  className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeCardIndex === idx
                      ? 'bg-happy-orange text-foreground font-black shadow-sm'
                      : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Card {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Card Form Fields */}
            {draftStats[activeCardIndex] && (
              <div className="space-y-4 rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-happy-orange">
                    Editing Card #{activeCardIndex + 1}
                  </span>
                  <span className={`text-xs font-bold uppercase ${draftStats[activeCardIndex].colorClass || 'text-azure'}`}>
                    Active Accent Color
                  </span>
                </div>

                {/* Stat Label */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Card Label / Category Title <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftStats[activeCardIndex].label}
                    onChange={(e) => handleStatChange(activeCardIndex, 'label', e.target.value)}
                    placeholder="e.g. DEGREE SPECIALIZATION"
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Keep brief for best visual balance (2–3 words uppercase).
                  </p>
                </div>

                {/* Stat Value */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Card Metric Value / Main Text <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={draftStats[activeCardIndex].value}
                    onChange={(e) => handleStatChange(activeCardIndex, 'value', e.target.value)}
                    placeholder="e.g. B.TECH AI & DS"
                    className="w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm font-display uppercase text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    The large prominent text shown inside the card.
                  </p>
                </div>

                {/* Accent Color Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Header Color Accent
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map((col) => {
                      const isSelected = (draftStats[activeCardIndex].colorClass || 'text-azure') === col.value;
                      return (
                        <button
                          key={col.value}
                          type="button"
                          onClick={() => handleStatChange(activeCardIndex, 'colorClass', col.value)}
                          className={`cursor-pointer flex items-center gap-2 rounded-lg border p-2.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-foreground bg-muted font-bold text-foreground shadow-sm'
                              : 'border-border bg-card text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full ${col.bgClass}`} />
                          <span className="truncate">{col.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Live Preview of All 4 Cards */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Live Preview
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg border border-border bg-border overflow-hidden">
                {draftStats.map((st, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveCardIndex(i)}
                    className={`cursor-pointer p-3 bg-card transition-all ${
                      activeCardIndex === i ? 'ring-2 ring-happy-orange' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`text-[9px] font-bold uppercase truncate ${st.colorClass || 'text-azure'}`}>
                      {st.label || 'LABEL'}
                    </div>
                    <div className="font-display text-sm uppercase truncate text-foreground mt-1">
                      {st.value || 'VALUE'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-border px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Reset to original default stats"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-md border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-md bg-happy-orange px-5 py-2 text-xs font-bold uppercase tracking-widest text-foreground shadow hover:brightness-110 transition-transform active:scale-95"
                >
                  <Check className="h-4 w-4" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

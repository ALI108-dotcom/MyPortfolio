import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, CheckCircle2, ExternalLink, ShieldCheck, Trophy, Calendar } from 'lucide-react';

export const CertificationsAchievements: React.FC = () => {
  const { content } = usePortfolio();
  const certs = (content.certifications || []).filter((c) => c.published !== false);
  const achievements = (content.achievements || []).filter((a) => a.published !== false);

  const [activeTab, setActiveTab] = useState<'all' | 'certs' | 'achievements'>('all');

  if (certs.length === 0 && achievements.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="scroll-mt-24 border-t border-border pt-16 sm:pt-20 lg:pt-24">
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end lg:mb-14">
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-coral flex items-center gap-2">
            <Award className="h-4 w-4" />
            VALIDATED COMPETENCIES &amp; MILESTONES
          </p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-none sm:text-5xl lg:text-6xl text-foreground">
            CERTIFICATIONS &amp;<br />ACHIEVEMENTS
          </h2>
          <div className="grad-rule mt-5 h-2 w-28 rounded-full sm:w-36" aria-hidden="true" />
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2">
          {(['all', 'certs', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === tab
                  ? 'grad-ink text-white grand-shadow'
                  : 'border border-border bg-background text-muted-foreground hover:border-coral hover:text-foreground'
              }`}
            >
              {tab === 'all' ? 'All Milestones' : tab === 'certs' ? `Certifications (${certs.length})` : `Achievements (${achievements.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Certifications Column */}
        {(activeTab === 'all' || activeTab === 'certs') && certs.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <ShieldCheck className="h-5 w-5 text-azure" /> Verified Courses &amp; Certifications
            </h3>

            <div className="space-y-4">
              {certs.map((cert) => (
                <article
                  key={cert.id}
                  className="grad-surface lift-on-hover rounded-xl border border-border p-5 grand-shadow bg-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-azure block mb-1">
                          {cert.issuingOrg}
                        </span>
                        <h4 className="font-display text-base sm:text-lg uppercase text-foreground leading-snug">
                          {cert.name}
                        </h4>
                      </div>
                      {cert.issueDate && (
                        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
                          <Calendar className="h-3 w-3" />
                          {cert.issueDate}
                        </span>
                      )}
                    </div>

                    {cert.description && (
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {cert.description}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cert.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-azure/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure border border-azure/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    {cert.credentialId ? (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        ID: {cert.credentialId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-malachite uppercase">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Completion
                      </span>
                    )}

                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold uppercase text-azure hover:underline text-[11px]"
                      >
                        Verify Credential <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Column */}
        {(activeTab === 'all' || activeTab === 'achievements') && achievements.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-foreground flex items-center gap-2 pb-2 border-b border-border">
              <Trophy className="h-5 w-5 text-happy-orange" /> Key Achievements &amp; Recognition
            </h3>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <article
                  key={ach.id}
                  className="grad-surface lift-on-hover rounded-xl border border-border p-5 grand-shadow bg-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-happy-orange block mb-1">
                          {ach.category || 'Achievement'}
                        </span>
                        <h4 className="font-display text-base sm:text-lg uppercase text-foreground leading-snug">
                          {ach.title}
                        </h4>
                      </div>
                      {ach.date && (
                        <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
                          <Calendar className="h-3 w-3" />
                          {ach.date}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  {ach.verificationUrl && (
                    <div className="mt-4 pt-3 border-t border-border flex justify-end">
                      <a
                        href={ach.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold uppercase text-azure hover:underline text-[11px]"
                      >
                        View Verification <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

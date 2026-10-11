import React, { useState } from 'react';
import { faqData } from '../data/portfolioData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="grad-paper-soft border-t border-border scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        
        {/* Section Heading */}
        <div className="max-w-4xl">
          <p className="eyebrow tracking-[0.2em] text-azure flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> RECRUITER &amp; COLLABORATOR INQUIRIES
          </p>
          <h2 id="faq-title" className="mt-3 font-display text-3xl uppercase leading-[0.95] sm:text-5xl text-foreground">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
        </div>

        {/* Accordion list matching reference */}
        <div className="mt-10 lg:mt-12">
          <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card grand-shadow">
            {faqData.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <li key={faq.id} className="min-w-0">
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure sm:px-7 sm:py-6"
                    >
                      <span className="font-display text-xl leading-none text-muted-foreground/40 sm:text-2xl">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-sm font-bold uppercase leading-snug tracking-wide text-foreground sm:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-azure' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 text-sm leading-relaxed text-muted-foreground sm:px-7 sm:pb-7">
                      <div className="rounded-lg bg-background/80 p-4 border border-border/60">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

      </div>
    </section>
  );
};

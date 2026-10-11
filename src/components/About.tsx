import React, { useState } from 'react';
import { Database, LineChart, Binary, Compass, Video } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { parseVideoUrl } from '../utils/videoHelper';

export const About: React.FC = () => {
  const { content, isEditMode } = usePortfolio();
  const profile = content.profile;
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'philosophy'>('video');

  const videoInfo = parseVideoUrl(profile.introVideoUrl);

  const pillars = [
    {
      num: '01',
      title: 'ACADEMIC FOUNDATION IN AI & DS',
      desc: `Currently pursuing ${profile.degreeShort} in Artificial Intelligence and Data Science at ${profile.institution}, ${profile.location} (Batch ${profile.graduationBatch}).`,
      borderClass: 'border-neon-green hover:border-malachite',
    },
    {
      num: '02',
      title: 'ANALYTICAL RIGOR & EXPLORATION',
      desc: 'Passionate about statistical analysis, data cleaning, outlier treatment, and extracting meaningful demographic patterns using Python.',
      borderClass: 'border-happy-orange hover:border-coral',
    },
    {
      num: '03',
      title: 'DATA STORYTELLING & POWER BI',
      desc: 'Skilled in transforming raw tables into executive business intelligence dashboards, star schema models, and actionable KPI reports.',
      borderClass: 'border-azure hover:border-foreground',
    },
    {
      num: '04',
      title: 'CONTINUOUS PRACTICE & CODING',
      desc: 'Dedicated to persistent practice, project documentation, code craftsmanship, and securing a position at a forward-looking technology company.',
      borderClass: 'border-coral hover:border-happy-orange',
    },
  ];

  return (
    <section id="about" className="scroll-mt-24">
      {/* Top 2-column introduction */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        
        {/* Left narrative */}
        <div className="min-w-0">
          <p className="eyebrow tracking-[0.2em] text-azure">ABOUT MY JOURNEY</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.92] sm:text-5xl lg:text-6xl text-foreground">
            TURNING DATA<br />INTO INSIGHTS
          </h2>
          <div className="grad-rule mt-6 h-2.5 w-32 rounded-full sm:w-40" aria-hidden="true" />
          <p className="mt-7 max-w-md text-base sm:text-lg font-medium leading-relaxed text-muted-foreground">
            {profile.aboutParagraph || `I am a student specializing in Artificial Intelligence and Data Science at ${profile.institution}. I focus on developing practical competence across Python data science libraries, relational database queries in SQL, Power BI analytics dashboards, and predictive modeling fundamentals.`}
          </p>
        </div>

        {/* Right showcase card: Video Introduction & Analytical Philosophy */}
        <div className="overflow-hidden rounded-xl grand-shadow bg-secondary text-white p-5 sm:p-7 flex flex-col justify-between border border-border/30 relative min-h-[380px] sm:min-h-[420px]">
          <div className="civic-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
          
          {/* Card Top Bar with Tab Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-happy-orange flex items-center gap-2">
              {activeMediaTab === 'video' ? <Video className="h-4 w-4" /> : <Binary className="h-4 w-4" />}
              {activeMediaTab === 'video' ? '01/10 INTRODUCTION VIDEO' : '01/10 ANALYTICAL PHILOSOPHY'}
            </span>

            {/* Toggle Switch */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-happy-orange text-foreground font-black shadow-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="Watch introduction video (3 to 13 minutes)"
              >
                ▶ Video (3 Min)
              </button>
              <button
                onClick={() => setActiveMediaTab('philosophy')}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMediaTab === 'philosophy'
                    ? 'bg-happy-orange text-foreground font-black shadow-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                title="View 4-step data science philosophy"
              >
                Philosophy
              </button>
            </div>
          </div>

          {/* Center Content: Video Player or Philosophy Grid */}
          {activeMediaTab === 'video' ? (
            <div className="relative z-10 flex-1 flex flex-col justify-center my-1">
              <div className="w-full overflow-hidden rounded-lg bg-black/80 border border-white/15 aspect-video shadow-inner relative group">
                {videoInfo.type === 'mp4' ? (
                  <video
                    src={videoInfo.embedUrl}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                ) : (
                  <iframe
                    src={videoInfo.embedUrl}
                    title={profile.introVideoTitle || 'Shaik Ali Ahammad — Introduction Video (3 to 13 min)'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video Title / Status Caption */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/70">
                <span className="truncate font-medium">
                  {profile.introVideoTitle || 'Introduction to Data Science & Analytical Journey'}
                </span>
                <span className="shrink-0 text-happy-orange font-bold text-[10px] uppercase ml-2">
                  {profile.introVideoDuration || '~3 Min'} (3–13 Min Allowed)
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-2 gap-3.5 py-4 sm:grid-cols-4 my-auto">
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Database className="mx-auto h-5 w-5 text-azure mb-1.5" />
                <span className="block font-display text-xs text-white">01. INGEST</span>
                <span className="text-[10px] text-white/60">SQL &amp; CSV Clean</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Compass className="mx-auto h-5 w-5 text-malachite mb-1.5" />
                <span className="block font-display text-xs text-white">02. EXPLORE</span>
                <span className="text-[10px] text-white/60">Python &amp; EDA</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <LineChart className="mx-auto h-5 w-5 text-happy-orange mb-1.5" />
                <span className="block font-display text-xs text-white">03. VISUALIZE</span>
                <span className="text-[10px] text-white/60">Power BI Reports</span>
              </div>
              <div className="rounded-lg bg-white/5 p-3.5 border border-white/10 text-center">
                <Binary className="mx-auto h-5 w-5 text-coral mb-1.5" />
                <span className="block font-display text-xs text-white">04. PREDICT</span>
                <span className="text-[10px] text-white/60">ML Evaluation</span>
              </div>
            </div>
          )}

          {/* Bottom Card Bar */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
            <span>Career Goal: Professional Data Scientist</span>
            <div className="flex items-center gap-2">
              {isEditMode && (
                <span className="rounded bg-azure/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-azure border border-azure/30">
                  Edit Video in CMS (Ctrl+Shift+E)
                </span>
              )}
              <span className="text-malachite font-bold uppercase text-[11px] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-malachite animate-pulse" />
                {activeMediaTab === 'video' ? 'Interactive Video' : 'Active Pair Programming'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom 4 numbered cards with colored top borders */}
      <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {pillars.map((item) => (
          <li
            key={item.num}
            className={`group relative min-w-0 border-t-4 bg-background p-5 transition-colors hover:bg-muted/55 sm:p-6 ${item.borderClass}`}
          >
            <span className="block font-display text-3xl leading-none text-muted-foreground/30">
              {item.num}
            </span>
            <h3 className="mt-3 font-display text-base uppercase leading-tight sm:text-lg text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {item.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

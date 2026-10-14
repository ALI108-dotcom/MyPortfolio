import React from 'react';
import { ArrowRight, ExternalLink, Camera } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { processImageFile } from '../utils/imageHelper';
import profilePhoto from '../assets/profile.jpg';

export const Hero: React.FC = () => {
  const { content, isEditMode, updateProfile } = usePortfolio();
  const profile = content.profile;

  // Split name for visual layout if needed
  const nameParts = profile.name.trim().split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await processImageFile(file);
      updateProfile({ photoUrl: optimized });
    } catch (err: any) {
      alert(err.message || 'Failed to process selected image file.');
    }
  };

  return (
    <section id="home" className="brand-glow relative overflow-hidden border-b border-border">
      {/* Background Civic Grid pattern matching reference */}
      <div className="civic-grid absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="editorial-rise relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:py-28">
        
        {/* Left Column: Heading and introduction */}
        <div className="relative z-10 min-w-0 lg:col-span-7">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-azure sm:text-xs">
            <span className="grad-rule h-2.5 w-10 rounded-full" aria-hidden="true" />
            WHAT I KNOW &amp; WHAT I DID TILL NOW
          </p>

          <h1 className="font-display text-[2.6rem] uppercase leading-[0.92] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            HI, I AM<br />
            {firstName}<br />
            {lastName ? <span className="grad-headline">{lastName}</span> : null}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:mt-9 sm:text-lg">
            {profile.bioSummary}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-5">
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure bg-primary text-white shadow hover:opacity-95 h-auto w-full rounded-md grad-ink px-7 py-4 text-sm font-bold uppercase tracking-widest grand-shadow transition-transform motion-safe:hover:-translate-y-0.5 sm:w-auto sm:px-9 sm:py-5"
            >
              Explore My Projects
              <ArrowRight className="h-4 w-4 text-azure" aria-hidden="true" />
            </a>

            <a
              href={profile.linkedinConfigurable}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure shadow-sm h-auto w-full rounded-md border-2 border-azure/80 bg-background/70 px-7 py-4 text-sm font-bold uppercase tracking-widest text-azure backdrop-blur transition-transform hover:bg-azure/10 motion-safe:hover:-translate-y-0.5 sm:w-auto sm:px-8 sm:py-5"
            >
              LinkedIn
              <ExternalLink className="h-4 w-4 text-azure" aria-hidden="true" />
            </a>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure shadow-sm h-auto w-full rounded-md border-2 border-foreground/80 bg-background/70 px-7 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur transition-transform hover:bg-background motion-safe:hover:-translate-y-0.5 sm:w-auto sm:px-9 sm:py-5"
            >
              View GitHub
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right Column: Hero Portrait Showcase with grad-sunrise glow - Matching Reference Website */}
        <div className="relative lg:col-span-5">
          <div className="grad-sunrise absolute -inset-3 rounded-2xl opacity-70 blur-[3px] sm:-inset-4" aria-hidden="true" />
          
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl grand-shadow-lg sm:aspect-[3/4] lg:aspect-[4/5] bg-foreground border border-border/20 group">
            <img 
              src={profile.photoUrl || profilePhoto} 
              alt={`${profile.name} — What I Know & What I Did`} 
              className="documentary-drift h-full w-full object-cover object-top"
              loading="eager"
            />

            {/* In Edit Mode: Quick Change Photo Button connecting directly to File Explorer */}
            {isEditMode && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <label 
                  className="cursor-pointer flex items-center gap-1.5 rounded-full bg-foreground/90 hover:bg-foreground backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-happy-orange/60 shadow-lg transition-transform hover:scale-105 active:scale-95"
                  title="Click to open File Explorer and choose a new profile photo"
                >
                  <Camera className="h-3.5 w-3.5 text-happy-orange" />
                  <span>Change Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </label>
                {profile.photoUrl && (
                  <button
                    onClick={() => updateProfile({ photoUrl: '' })}
                    className="cursor-pointer flex items-center gap-1 rounded-full bg-foreground/80 hover:bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 hover:text-coral border border-white/20 shadow-md"
                    title="Reset to default original photo"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
            
            {/* Cinematic dark gradient overlay at bottom matching reference */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/25 to-transparent" aria-hidden="true" />

            {/* Profile badge overlay at bottom of photo */}
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-md text-white font-display text-base border border-white/20 grand-shadow">
                  {nameParts.map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'SA'}
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg uppercase tracking-wide text-white">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    {profile.roleTitle} · {profile.degreeShort}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-white/15">
                <span className="rounded bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                  Python &amp; SQL
                </span>
                <span className="rounded bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                  Microsoft Power BI
                </span>
                <span className="rounded bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                  Machine Learning
                </span>
              </div>
            </div>

            {/* Top-right floating status chip */}
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-black/50 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-azure border border-azure/40">
                Batch {profile.graduationBatch}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

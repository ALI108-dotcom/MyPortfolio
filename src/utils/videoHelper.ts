export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'mp4' | 'iframe';
  embedUrl: string;
}

/**
 * Parses and normalizes various video URL formats into embeddable URLs.
 * Supports:
 * - YouTube standard watch, short, embed URLs
 * - Vimeo URLs
 * - Direct MP4 / WebM files
 * - Google Drive preview links
 */
export function parseVideoUrl(rawUrl?: string): VideoEmbedInfo {
  const defaultUrl = 'https://www.youtube.com/embed/xC-c7E5PK0Y?rel=0&modestbranding=1';
  
  if (!rawUrl || !rawUrl.trim()) {
    return {
      type: 'youtube',
      embedUrl: defaultUrl,
    };
  }

  const url = rawUrl.trim();

  // YouTube Watch / Shorts / Embed / youtu.be
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct HTML5 video file (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return {
      type: 'mp4',
      embedUrl: url,
    };
  }

  // Google Drive preview
  const gdriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
    };
  }

  // Fallback as iframe
  return {
    type: 'iframe',
    embedUrl: url,
  };
}

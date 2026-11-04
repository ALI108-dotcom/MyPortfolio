export interface VideoEmbedInfo {
  type: 'youtube' | 'vimeo' | 'mp4' | 'iframe';
  embedUrl: string;
}

/**
 * Parses and normalizes various video URL formats into embeddable URLs.
 * Supports:
 * - YouTube standard watch, short, embed URLs, youtu.be
 * - Vimeo URLs
 * - Direct MP4 / WebM / OGG / MOV / M4V files
 * - Data URLs (data:video/mp4;base64,...)
 * - Blob URLs (blob:http...)
 * - Google Drive preview links
 * - Loom share links
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

  // 1. Data URLs (e.g. Base64 video) or Blob URLs (Camera / Local File Upload)
  if (
    url.startsWith('data:video/') ||
    url.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov|m4v|mkv)($|\?)/i.test(url)
  ) {
    return {
      type: 'mp4',
      embedUrl: url,
    };
  }

  // 2. YouTube Watch / Shorts / Embed / youtu.be
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
    };
  }

  // 3. Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // 4. Google Drive preview
  const gdriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdriveMatch = url.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
    };
  }

  // 5. Loom links (https://www.loom.com/share/ID -> https://www.loom.com/embed/ID)
  const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/;
  const loomMatch = url.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
    };
  }

  // 6. Direct HTTP(S) video file if ends with common query or video extension
  if (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')) {
    return {
      type: 'mp4',
      embedUrl: url,
    };
  }

  // Fallback as iframe / web embed
  return {
    type: 'iframe',
    embedUrl: url,
  };
}

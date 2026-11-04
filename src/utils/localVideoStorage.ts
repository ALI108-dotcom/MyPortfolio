// IndexedDB Media Storage for Local and Camera Videos
// Enables smooth persistence of large local video files across browser reloads without localStorage quota errors.

const DB_NAME = 'ShaikPortfolioMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';
const INTRO_VIDEO_KEY = 'shaik_intro_video_blob';
const META_KEY = 'shaik_intro_video_meta';

interface VideoMeta {
  filename?: string;
  title?: string;
  duration?: string;
  sourceType: 'local' | 'camera' | 'url';
  sizeBytes?: number;
  mimeType?: string;
  updatedAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a video Blob or File in IndexedDB
 */
export async function saveLocalVideoBlob(
  blob: Blob | File,
  meta: Partial<VideoMeta> = {}
): Promise<{ objectUrl: string; base64Url?: string; meta: VideoMeta }> {
  const db = await openDB();

  const fullMeta: VideoMeta = {
    filename: (blob as File).name || 'video_recording.webm',
    title: meta.title || 'Personal Introduction & Journey',
    duration: meta.duration || '~3 Min',
    sourceType: meta.sourceType || 'local',
    sizeBytes: blob.size,
    mimeType: blob.type || 'video/mp4',
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    store.put(blob, INTRO_VIDEO_KEY);
    store.put(fullMeta, META_KEY);

    tx.oncomplete = async () => {
      const objectUrl = URL.createObjectURL(blob);

      // If under 3MB, generate base64 for cloud sync capability
      let base64Url: string | undefined;
      if (blob.size < 3.2 * 1024 * 1024) {
        try {
          base64Url = await blobToBase64(blob);
        } catch {}
      }

      try {
        localStorage.setItem('shaik_has_local_intro_video', 'true');
        localStorage.setItem('shaik_local_video_meta', JSON.stringify(fullMeta));
      } catch {}

      resolve({ objectUrl, base64Url, meta: fullMeta });
    };

    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Loads the saved video Blob from IndexedDB and returns a playable Object URL
 */
export async function loadLocalVideoBlob(): Promise<{
  objectUrl: string;
  meta: VideoMeta | null;
  blob: Blob;
} | null> {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      const blobReq = store.get(INTRO_VIDEO_KEY);
      const metaReq = store.get(META_KEY);

      tx.oncomplete = () => {
        const blob = blobReq.result;
        const meta = metaReq.result || null;

        if (blob && blob instanceof Blob) {
          const objectUrl = URL.createObjectURL(blob);
          resolve({ objectUrl, meta, blob });
        } else {
          resolve(null);
        }
      };

      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clears stored local video from IndexedDB
 */
export async function clearLocalVideoBlob(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(INTRO_VIDEO_KEY);
      store.delete(META_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    try {
      localStorage.removeItem('shaik_has_local_intro_video');
      localStorage.removeItem('shaik_local_video_meta');
    } catch {}
  } catch {}
}

/**
 * Converts a Blob to a Base64 Data URL
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

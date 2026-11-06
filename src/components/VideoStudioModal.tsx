import React, { useState, useRef, useEffect } from 'react';
import {
  Link,
  Upload,
  Camera,
  X,
  Play,
  Square,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  Info,
  Film
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { parseVideoUrl } from '../utils/videoHelper';
import { saveLocalVideoBlob } from '../utils/localVideoStorage';

interface VideoStudioModalProps {
  isOpen: boolean;
  initialTab?: 'url' | 'local' | 'camera';
  onClose: () => void;
}

export const VideoStudioModal: React.FC<VideoStudioModalProps> = ({ isOpen, initialTab, onClose }) => {
  const { content, updateProfile, saveChanges } = usePortfolio();
  const profile = content.profile;

  // Tabs: 'local' | 'url' | 'camera'
  const [activeTab, setActiveTab] = useState<'url' | 'local' | 'camera'>(initialTab || 'local');

  // URL state
  const [urlInput, setUrlInput] = useState<string>(profile.introVideoUrl || '');
  const [videoTitle, setVideoTitle] = useState<string>(
    profile.introVideoTitle || 'Introduction & Technical Learning Journey'
  );
  const [videoDuration, setVideoDuration] = useState<string>(
    profile.introVideoDuration || '~3 Min (30 Sec – 30 Min Allowed)'
  );

  // Local file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localVideoPreviewUrl, setLocalVideoPreviewUrl] = useState<string | null>(null);
  const [localFileSizeMB, setLocalFileSizeMB] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera Recording state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoLiveRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Global saving indicator
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Sync inputs on open
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
        if (initialTab === 'camera') {
          startCameraStream();
        }
      }
      setUrlInput(profile.introVideoUrl || '');
      setVideoTitle(profile.introVideoTitle || 'Introduction & Technical Learning Journey');
      setVideoDuration(profile.introVideoDuration || '~3 Min (30 Sec – 30 Min Allowed)');
      setSaveSuccess(null);
    } else {
      // Clean up camera stream if modal is closed
      stopCameraStream();
    }
  }, [isOpen, initialTab, profile]);

  // Clean up when switching away from camera tab
  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCameraStream();
    }
  }, [activeTab]);

  // --------------------------------------------------------------------------
  // Camera Management
  // --------------------------------------------------------------------------
  const startCameraStream = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or requires a secure HTTPS connection.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      mediaStreamRef.current = stream;
      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
        videoLiveRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera/Microphone permission was denied. Please allow camera access in your browser settings.'
          : `Could not access camera: ${err.message || 'Device in use or not found'}`
      );
      setCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoLiveRef.current) {
      videoLiveRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCameraStream(nextMode);
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;

    recordedChunksRef.current = [];
    setRecordedBlob(null);
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl);
      setRecordedPreviewUrl(null);
    }

    // Determine supported mimeType
    const mimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];
    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    try {
      const recorder = new MediaRecorder(
        mediaStreamRef.current,
        selectedMime ? { mimeType: selectedMime } : undefined
      );

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(recordedChunksRef.current, {
          type: selectedMime || 'video/webm',
        });
        setRecordedBlob(fullBlob);
        const objUrl = URL.createObjectURL(fullBlob);
        setRecordedPreviewUrl(objUrl);
        setIsRecording(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };

      recorder.start(500); // 500ms chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          if (next >= 1800) {
            // Max 30 minutes limit
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (e: any) {
      console.error('MediaRecorder start failed:', e);
      setCameraError('Recording failed to start: ' + e.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const discardRecording = () => {
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl);
    }
    setRecordedBlob(null);
    setRecordedPreviewUrl(null);
    setRecordingSeconds(0);
    startCameraStream();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --------------------------------------------------------------------------
  // Local File Handler
  // --------------------------------------------------------------------------
  const handleLocalFileSelect = (file: File) => {
    if (!file) return;

    setSelectedFile(file);
    const sizeMb = +(file.size / (1024 * 1024)).toFixed(2);
    setLocalFileSizeMB(sizeMb);

    // Create instant preview URL
    if (localVideoPreviewUrl) {
      URL.revokeObjectURL(localVideoPreviewUrl);
    }
    const preview = URL.createObjectURL(file);
    setLocalVideoPreviewUrl(preview);

    // Inspect duration of selected video (supports 30s to 30min range)
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        const durationSecs = Math.round(tempVideo.duration);
        if (!isNaN(durationSecs) && durationSecs > 0) {
          const mins = Math.floor(durationSecs / 60);
          const secs = durationSecs % 60;
          const formatted = mins > 0 ? `${mins}m ${secs > 0 ? `${secs}s` : ''}`.trim() : `${secs}s`;
          setVideoDuration(`${formatted} (30s–30m Allowed)`);
        }
      };
      tempVideo.src = preview;
    } catch {
      // Fallback
    }

    // Auto-fill video title if empty
    if (!videoTitle || videoTitle === 'Introduction & Technical Learning Journey') {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setVideoTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  // --------------------------------------------------------------------------
  // Apply & Save Actions
  // --------------------------------------------------------------------------
  const handleApplyUrl = async () => {
    if (!urlInput.trim()) {
      alert('Please enter a valid video URL.');
      return;
    }

    setSaving(true);
    try {
      updateProfile({
        introVideoUrl: urlInput.trim(),
        introVideoTitle: videoTitle.trim(),
        introVideoDuration: videoDuration.trim(),
      });
      await saveChanges();
      setSaveSuccess('URL Video updated and synchronized to Supabase Cloud!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e: any) {
      alert('Error saving video: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyLocalFile = async () => {
    if (!selectedFile && !localVideoPreviewUrl) {
      alert('Please choose a video file from your device first.');
      return;
    }

    setSaving(true);
    try {
      let finalUrl = localVideoPreviewUrl || '';

      if (selectedFile) {
        // Save to IndexedDB for persistent local playback across reloads
        const { objectUrl, base64Url } = await saveLocalVideoBlob(selectedFile, {
          title: videoTitle,
          duration: videoDuration,
          filename: selectedFile.name,
          sourceType: 'local',
        });

        // If file is compact (< 3.2MB), use base64 for cross-device cloud sync
        if (base64Url) {
          finalUrl = base64Url;
        } else {
          finalUrl = objectUrl;
        }
      }

      updateProfile({
        introVideoUrl: finalUrl,
        introVideoTitle: videoTitle.trim(),
        introVideoDuration: videoDuration.trim(),
      });

      await saveChanges();
      setSaveSuccess(
        selectedFile && selectedFile.size > 3.2 * 1024 * 1024
          ? 'Video saved to high-speed local database on this device!'
          : 'Local video saved and synchronized across devices!'
      );

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      console.error('Save local video failed:', err);
      alert('Failed to save local video: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyCameraRecording = async () => {
    if (!recordedBlob) {
      alert('Please record a video clip first before saving.');
      return;
    }

    setSaving(true);
    try {
      const { objectUrl, base64Url } = await saveLocalVideoBlob(recordedBlob, {
        title: videoTitle.trim(),
        duration: videoDuration.trim() || `${formatTimer(recordingSeconds)} (Recorded)`,
        filename: `camera_record_${Date.now()}.webm`,
        sourceType: 'camera',
      });

      const finalUrl = base64Url || objectUrl;

      updateProfile({
        introVideoUrl: finalUrl,
        introVideoTitle: videoTitle.trim(),
        introVideoDuration: videoDuration.trim() || `${formatTimer(recordingSeconds)} (Recorded)`,
      });

      await saveChanges();
      stopCameraStream();
      setSaveSuccess('Camera video recording saved to portfolio!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      alert('Failed to save camera recording: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-happy-orange/30 bg-card text-foreground shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 bg-secondary/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-happy-orange/20 border border-happy-orange/40 text-happy-orange shadow-sm">
              <Film className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                  Intro Video Studio
                </h3>
                <span className="rounded bg-happy-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-happy-orange border border-happy-orange/30">
                  Any Source
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add YouTube, Vimeo, Google Drive, local video files, or record live with camera.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Close Video Studio"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* DROPDOWN SELECTOR FORMAT (Switch between Computer, URL, and Camera) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-muted/40 p-3.5 px-5">
          <div className="flex items-center gap-2">
            <label htmlFor="video-mode-select" className="text-xs font-black uppercase tracking-wider text-happy-orange flex items-center gap-1.5">
              <span>Select Video Option (Dropdown):</span>
            </label>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              (Select an option to open that particular role)
            </span>
          </div>

          <div className="relative min-w-[280px]">
            <select
              id="video-mode-select"
              value={activeTab}
              onChange={(e) => {
                const newTab = e.target.value as 'local' | 'url' | 'camera';
                setActiveTab(newTab);
                if (newTab === 'camera') {
                  startCameraStream();
                } else {
                  stopCameraStream();
                }
              }}
              className="w-full rounded-lg border-2 border-happy-orange bg-background px-3.5 py-2 text-xs font-black uppercase tracking-wider text-foreground focus:outline-none focus:ring-2 focus:ring-happy-orange cursor-pointer shadow-sm"
            >
              <option value="local">💻 Select Video from Computer</option>
              <option value="url">🌐 Add Video via URL Link (YouTube / Drive / Vimeo)</option>
              <option value="camera">📹 Record Camera Video (Webcam / Mobile Camera)</option>
            </select>
          </div>
        </div>

        {/* Quick Tab Buttons */}
        <div className="grid grid-cols-3 border-b border-border bg-muted/20 p-2 gap-2 text-xs font-bold uppercase">
          <button
            onClick={() => {
              setActiveTab('local');
              stopCameraStream();
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'local'
                ? 'bg-azure text-white font-black shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>1. From Computer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('url');
              stopCameraStream();
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-happy-orange text-foreground font-black shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Link className="h-4 w-4" />
            <span>2. URL Link</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              if (!cameraActive) {
                startCameraStream();
              }
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-coral text-white font-black shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>3. Camera Video</span>
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Success Banner */}
          {saveSuccess && (
            <div className="flex items-center gap-2.5 rounded-lg bg-malachite/15 border border-malachite/30 p-3 text-xs text-malachite font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 1: URL LINKS                                                 */}
          {/* ================================================================ */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-azure/10 border border-azure/20 p-3.5 text-xs text-azure leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Supported URL Formats:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-azure/90">
                    <li>YouTube (Full links, Shorts, Embeds, <code>youtu.be</code>)</li>
                    <li>Google Drive (Preview &amp; Share links)</li>
                    <li>Vimeo links</li>
                    <li>Loom screen recordings</li>
                    <li>Direct MP4, WebM, or MOV web URLs</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Paste Video URL Link *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/..."
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure pr-24"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => setUrlInput('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground hover:text-foreground px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick default presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('https://www.youtube.com/watch?v=xC-c7E5PK0Y');
                    setVideoTitle('Introduction & Technical Learning Journey');
                    setVideoDuration('3 Min (30 Sec – 30 Min Allowed)');
                  }}
                  className="rounded-full bg-muted/60 hover:bg-muted text-foreground text-[10px] font-bold px-3 py-1 border border-border/80 transition-colors cursor-pointer"
                >
                  Original Data Science Journey (YouTube)
                </button>
              </div>

              {/* Live Preview */}
              {urlInput && (
                <div className="rounded-xl border border-border bg-black/60 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-azure" />
                    Live URL Player Preview
                  </p>
                  <div className="overflow-hidden rounded-lg bg-black border border-white/10 aspect-video max-w-lg mx-auto shadow-inner">
                    {parseVideoUrl(urlInput).type === 'mp4' ? (
                      <video
                        src={parseVideoUrl(urlInput).embedUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={parseVideoUrl(urlInput).embedUrl}
                        title="URL Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: LOCAL VIDEO FILE                                          */}
          {/* ================================================================ */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-happy-orange/10 border border-happy-orange/20 p-3.5 text-xs text-happy-orange leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Local Video Storage:</strong> Select any video file from your computer or phone (<code>.mp4</code>, <code>.webm</code>, <code>.mov</code>, <code>.mkv</code>). It is stored in high-performance browser storage on this device, so it plays reliably every time you open your portfolio!
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.webm,.mov,.mkv,.m4v,.avi"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLocalFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {/* Action Button: SELECT VIDEO FROM COMPUTER */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-azure text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-md transition-all hover:scale-105 active:scale-95">
                  <Upload className="h-4 w-4" />
                  <span>Select Video from Computer</span>
                  <input
                    type="file"
                    accept="video/*,.mp4,.webm,.mov,.mkv,.m4v,.avi"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLocalFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Drop / Click Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleLocalFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-happy-orange/40 hover:border-happy-orange rounded-xl bg-happy-orange/5 hover:bg-happy-orange/10 transition-all cursor-pointer text-center group"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-happy-orange/20 text-happy-orange mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-foreground">
                  Or Drag &amp; Drop Video File Here
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Supports MP4, WebM, MOV, MKV from your PC or mobile gallery
                </p>
              </div>

              {/* Selected File Details */}
              {selectedFile && (
                <div className="rounded-lg border border-border bg-muted/40 p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      📁 {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Size: {localFileSizeMB} MB • Type: {selectedFile.type || 'video'}
                    </p>
                    {localFileSizeMB && localFileSizeMB <= 3.2 ? (
                      <span className="inline-block mt-1 text-[10px] font-bold text-malachite">
                        ✅ Compact size (&lt; 3.2MB): Syncs to Supabase Cloud &amp; other devices!
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[10px] font-bold text-happy-orange">
                        💾 Large file: Stored in high-speed local database on this device.
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (localVideoPreviewUrl) {
                        URL.revokeObjectURL(localVideoPreviewUrl);
                        setLocalVideoPreviewUrl(null);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-coral rounded-md transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Local Video Preview */}
              {localVideoPreviewUrl && (
                <div className="rounded-xl border border-border bg-black/60 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-happy-orange" />
                    Local File Player Preview
                  </p>
                  <div className="overflow-hidden rounded-lg bg-black border border-white/10 aspect-video max-w-lg mx-auto shadow-inner">
                    <video
                      src={localVideoPreviewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: CAMERA VIDEO RECORDING                                    */}
          {/* ================================================================ */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-coral/10 border border-coral/20 p-3.5 text-xs text-coral leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Live Camera Studio:</strong> Use your laptop webcam or mobile phone camera to record your introduction directly in the browser!
                </div>
              </div>

              {cameraError && (
                <div className="rounded-lg bg-coral/15 border border-coral/30 p-3 text-xs text-coral font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Viewfinder / Player Container */}
              <div className="relative overflow-hidden rounded-xl bg-black border border-border aspect-video max-w-xl mx-auto shadow-2xl flex items-center justify-center">
                
                {/* 1. Live Camera Viewfinder */}
                {!recordedPreviewUrl && (
                  <video
                    ref={videoLiveRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* 2. Recorded Review Player */}
                {recordedPreviewUrl && (
                  <video
                    src={recordedPreviewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}

                {/* Overlays during live recording */}
                {isRecording && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-coral px-3 py-1 text-xs font-black text-white shadow-lg animate-pulse">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    <span>REC {formatTimer(recordingSeconds)}</span>
                  </div>
                )}

                {/* Inactive camera placeholder */}
                {!cameraActive && !recordedPreviewUrl && !cameraError && (
                  <div className="text-center p-6 text-muted-foreground">
                    <Camera className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold">Camera is idle.</p>
                    <button
                      type="button"
                      onClick={() => startCameraStream()}
                      className="mt-3 rounded-lg bg-coral px-4 py-2 text-xs font-bold text-white hover:bg-coral/90 cursor-pointer shadow-md"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Camera Controls Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {!recordedPreviewUrl ? (
                  <>
                    {/* Toggle Front / Back on mobile */}
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Switch Front / Back Camera"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Flip Camera ({facingMode === 'user' ? 'Front' : 'Back'})</span>
                    </button>

                    {/* Record / Stop Button */}
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        disabled={!cameraActive}
                        className="flex items-center gap-2 rounded-lg bg-coral hover:bg-coral/90 disabled:opacity-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all cursor-pointer"
                      >
                        <span className="h-3 w-3 rounded-full bg-white" />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-2 rounded-lg bg-foreground hover:bg-foreground/90 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-background shadow-md transition-all cursor-pointer animate-pulse"
                      >
                        <Square className="h-3.5 w-3.5" />
                        <span>Stop Recording ({formatTimer(recordingSeconds)})</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Review Controls */}
                    <button
                      type="button"
                      onClick={discardRecording}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retake / Record Again</span>
                    </button>

                    {recordedBlob && (
                      <a
                        href={recordedPreviewUrl}
                        download={`shaik_intro_${Date.now()}.webm`}
                        className="flex items-center gap-1.5 rounded-lg border border-azure/40 bg-azure/10 text-azure px-3.5 py-2 text-xs font-bold hover:bg-azure/20 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Clip</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* COMMON METADATA INPUTS (Title & Duration)                        */}
          {/* ================================================================ */}
          <div className="pt-4 border-t border-border/80 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                Video Title / Headline
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. Introduction & Technical Learning Journey"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                Duration Badge
              </label>
              <input
                type="text"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="e.g. ~3 Min (30 Sec – 30 Min Allowed)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-border bg-secondary/60 px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="rounded-lg px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {activeTab === 'url' && (
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={saving || !urlInput.trim()}
                className="flex items-center gap-2 rounded-lg bg-azure hover:bg-azure/90 disabled:opacity-50 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Apply &amp; Save URL
                  </>
                )}
              </button>
            )}

            {activeTab === 'local' && (
              <button
                type="button"
                onClick={handleApplyLocalFile}
                disabled={saving || (!selectedFile && !localVideoPreviewUrl)}
                className="flex items-center gap-2 rounded-lg bg-happy-orange hover:bg-happy-orange/90 disabled:opacity-50 px-5 py-2 text-xs font-black uppercase tracking-wider text-foreground shadow-md transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Storing Video...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Use &amp; Save Local Video
                  </>
                )}
              </button>
            )}

            {activeTab === 'camera' && (
              <button
                type="button"
                onClick={handleApplyCameraRecording}
                disabled={saving || !recordedBlob}
                className="flex items-center gap-2 rounded-lg bg-coral hover:bg-coral/90 disabled:opacity-50 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saving Recording...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Use Recorded Video
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

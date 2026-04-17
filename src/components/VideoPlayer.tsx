'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink VideoPlayer Component
 *
 * Custom HTML5 video player with controls.
 *
 * Usage:
 *   <VideoPlayer src="/video.mp4" />
 *   <VideoPlayer src={videoUrl} poster="/thumbnail.jpg" autoPlay />
 */

export interface VideoPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError' | 'onTimeUpdate'> {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVideoError?: (error: string) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      autoPlay = false,
      muted = false,
      loop = false,
      onEnded,
      onTimeUpdate,
      onVideoError,
      className = '',
      ...props
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(muted ? 0 : 1);
    const [isMuted, setIsMuted] = useState(muted);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Show/hide controls
    const showControlsTemporarily = useCallback(() => {
      setShowControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      if (isPlaying) {
        hideControlsTimeout.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    }, [isPlaying]);

    // Play/pause
    const togglePlay = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, []);

    // Mute/unmute
    const toggleMute = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = !video.muted;
      setIsMuted(video.muted);
      setVolume(video.muted ? 0 : 1);
    }, []);

    // Fullscreen
    const toggleFullscreen = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }, []);

    // Seek
    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      const progress = progressRef.current;
      if (!video || !progress) return;

      const rect = progress.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    }, []);

    // Skip forward/backward
    const skip = useCallback((seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
    }, []);

    // Event handlers
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        onTimeUpdate?.(video.currentTime, video.duration);
      };
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };
      const handleWaiting = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        const errorMsg = 'Failed to load video';
        setError(errorMsg);
        onVideoError?.(errorMsg);
      };
      const handleEnded = () => {
        setIsPlaying(false);
        onEnded?.();
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('ended', handleEnded);
      };
    }, [onTimeUpdate, onEnded, onVideoError]);

    // Fullscreen change listener
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target !== containerRef.current && !containerRef.current?.contains(e.target as Node)) return;

        switch (e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            togglePlay();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            skip(-10);
            break;
          case 'ArrowRight':
            e.preventDefault();
            skip(10);
            break;
          case 'm':
            e.preventDefault();
            toggleMute();
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay, toggleMute, toggleFullscreen, skip]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (error) {
      return (
        <div
          ref={ref}
          className={`relative aspect-video bg-mist rounded-xl flex items-center justify-center ${className}`}
          {...props}
        >
          <div className="text-center">
            <svg className="w-12 h-12 text-error/50 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-lagoon">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`relative aspect-video bg-abyss rounded-xl overflow-hidden group ${className}`}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        tabIndex={0}
        {...props}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-abyss/50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Play button overlay */}
        {!isPlaying && !isLoading && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-abyss/30 transition-opacity"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-tide ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}

        {/* Controls */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-4
            bg-gradient-to-t from-abyss/80 to-transparent
            transition-opacity duration-300
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 group/progress"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-tide rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-tide transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Skip buttons */}
              <button
                onClick={() => skip(-10)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Rewind 10 seconds"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              <button
                onClick={() => skip(10)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Forward 10 seconds"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="text-white/70 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="text-white/70 text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

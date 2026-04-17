'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink AudioRecorder Component
 *
 * Audio recording component for voice samples.
 *
 * Usage:
 *   <AudioRecorder onRecording={(blob, url) => saveRecording(blob)} />
 *   <AudioRecorder maxDuration={60} onRecording={handleRecording} />
 */

export interface AudioRecorderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onRecording: (blob: Blob, url: string) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  maxDuration?: number; // seconds
  disabled?: boolean;
  label?: string;
  error?: string;
  showPlayback?: boolean;
  showWaveform?: boolean;
}

export const AudioRecorder = forwardRef<HTMLDivElement, AudioRecorderProps>(
  (
    {
      onRecording,
      onRecordingStart,
      onRecordingStop,
      maxDuration = 120,
      disabled = false,
      label,
      error,
      showPlayback = true,
      showWaveform = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioLevels, setAudioLevels] = useState<number[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const animationRef = useRef<number | null>(null);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        if (audioUrl) URL.revokeObjectURL(audioUrl);
      };
    }, [audioUrl]);

    const startRecording = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Setup audio context for visualization
        if (showWaveform) {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 64;

          const updateLevels = () => {
            if (!analyserRef.current || !isRecording) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const levels = Array.from(dataArray.slice(0, 16)).map(v => v / 255);
            setAudioLevels(levels);
            animationRef.current = requestAnimationFrame(updateLevels);
          };
          updateLevels();
        }

        // Setup media recorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          onRecording(blob, url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start(100);
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
        setAudioUrl(null);
        onRecordingStart?.();

        // Start timer
        timerRef.current = setInterval(() => {
          setDuration(d => {
            if (d >= maxDuration - 1) {
              stopRecording();
              return maxDuration;
            }
            return d + 1;
          });
        }, 1000);

      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }, [maxDuration, onRecording, onRecordingStart, showWaveform]);

    const stopRecording = useCallback(() => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        onRecordingStop?.();

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        setAudioLevels([]);
      }
    }, [isRecording, onRecordingStop]);

    const pauseRecording = useCallback(() => {
      if (mediaRecorderRef.current && isRecording) {
        if (isPaused) {
          mediaRecorderRef.current.resume();
          timerRef.current = setInterval(() => {
            setDuration(d => d + 1);
          }, 1000);
        } else {
          mediaRecorderRef.current.pause();
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
        setIsPaused(!isPaused);
      }
    }, [isRecording, isPaused]);

    const playRecording = useCallback(() => {
      if (!audioUrl) return;

      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, [audioUrl, isPlaying]);

    const clearRecording = useCallback(() => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setDuration(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    }, [audioUrl]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">{label}</label>
        )}

        <div
          className={`
            p-4 rounded-xl border-2
            ${error ? 'border-error' : isRecording ? 'border-error bg-error-bg' : 'border-mist bg-breeze'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {/* Waveform visualization */}
          {showWaveform && isRecording && (
            <div className="flex items-center justify-center gap-1 h-12 mb-4">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className="w-1 bg-error rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, level * 48)}px` }}
                />
              ))}
              {audioLevels.length === 0 && (
                <div className="text-lagoon text-sm">Initializing...</div>
              )}
            </div>
          )}

          {/* Duration display */}
          <div className="text-center mb-4">
            <span className={`text-2xl font-mono ${isRecording ? 'text-error' : 'text-abyss'}`}>
              {formatTime(duration)}
            </span>
            {maxDuration && (
              <span className="text-lagoon text-sm ml-2">/ {formatTime(maxDuration)}</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isRecording && !audioUrl && (
              <button
                type="button"
                onClick={startRecording}
                disabled={disabled}
                className="flex items-center gap-2 px-6 py-3 bg-error text-white rounded-full font-medium hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="6" />
                </svg>
                Record
              </button>
            )}

            {isRecording && (
              <>
                <button
                  type="button"
                  onClick={pauseRecording}
                  className="p-3 bg-white text-lagoon rounded-full hover:bg-mist transition-colors"
                >
                  {isPaused ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-3 bg-error text-white rounded-full hover:bg-error/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                </button>
              </>
            )}

            {audioUrl && showPlayback && (
              <>
                <button
                  type="button"
                  onClick={playRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-tide text-white rounded-full font-medium hover:bg-tide/90 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                      Pause
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      Play
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={disabled}
                  className="p-3 bg-mist text-lagoon rounded-full hover:bg-bubble transition-colors disabled:opacity-50"
                  title="Re-record"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={clearRecording}
                  className="p-3 bg-mist text-lagoon rounded-full hover:bg-error-bg hover:text-error transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {error && <p className="text-error text-sm mt-1.5">{error}</p>}
      </div>
    );
  }
);

AudioRecorder.displayName = 'AudioRecorder';

export default AudioRecorder;

'use client';

import { forwardRef, useEffect, useRef, useState, useCallback } from 'react';

/**
 * Articulink WaveformVisualizer Component
 *
 * Audio waveform visualization using Web Audio API.
 *
 * Usage:
 *   <WaveformVisualizer audioUrl={url} />
 *   <WaveformVisualizer audioElement={audioRef.current} live />
 */

export interface WaveformVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  audioUrl?: string;
  audioElement?: HTMLAudioElement | null;
  live?: boolean;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
  barPlayedColor?: string;
  backgroundColor?: string;
  height?: number;
  showProgress?: boolean;
  onSeek?: (progress: number) => void;
}

export const WaveformVisualizer = forwardRef<HTMLDivElement, WaveformVisualizerProps>(
  (
    {
      audioUrl,
      audioElement,
      live = false,
      barWidth = 3,
      barGap = 1,
      barColor = '#94A3B8',
      barPlayedColor = '#037DE4',
      backgroundColor = 'transparent',
      height = 64,
      showProgress = true,
      onSeek,
      className = '',
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [progress, setProgress] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // Generate static waveform from audio file
    const generateWaveform = useCallback(async (url: string) => {
      try {
        const audioContext = new AudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData = audioBuffer.getChannelData(0);
        const samples = 100;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }
          filteredData.push(sum / blockSize);
        }

        // Normalize
        const maxVal = Math.max(...filteredData);
        const normalizedData = filteredData.map((v) => v / maxVal);

        setWaveformData(normalizedData);
        audioContext.close();
      } catch (error) {
        console.error('Error generating waveform:', error);
      }
    }, []);

    // Initialize waveform for URL
    useEffect(() => {
      if (audioUrl && !live) {
        generateWaveform(audioUrl);
      }
    }, [audioUrl, live, generateWaveform]);

    // Track progress from audio element
    useEffect(() => {
      if (!audioElement) return;

      const updateProgress = () => {
        if (audioElement.duration) {
          setProgress(audioElement.currentTime / audioElement.duration);
        }
      };

      audioElement.addEventListener('timeupdate', updateProgress);
      return () => audioElement.removeEventListener('timeupdate', updateProgress);
    }, [audioElement]);

    // Live visualization with analyzer
    useEffect(() => {
      if (!live || !audioElement) return;

      const setupAnalyzer = async () => {
        try {
          const audioContext = new AudioContext();
          const analyzer = audioContext.createAnalyser();
          analyzer.fftSize = 256;

          const source = audioContext.createMediaElementSource(audioElement);
          source.connect(analyzer);
          analyzer.connect(audioContext.destination);

          analyzerRef.current = analyzer;
          setIsInitialized(true);

          const bufferLength = analyzer.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const draw = () => {
            if (!canvasRef.current || !analyzerRef.current) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            analyzerRef.current.getByteFrequencyData(dataArray);

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const totalBars = Math.floor(canvas.width / (barWidth + barGap));
            const step = Math.floor(bufferLength / totalBars);

            for (let i = 0; i < totalBars; i++) {
              const value = dataArray[i * step] / 255;
              const barHeight = value * canvas.height;
              const x = i * (barWidth + barGap);
              const y = (canvas.height - barHeight) / 2;

              ctx.fillStyle = barPlayedColor;
              ctx.fillRect(x, y, barWidth, barHeight);
            }

            animationRef.current = requestAnimationFrame(draw);
          };

          draw();
        } catch (error) {
          console.error('Error setting up analyzer:', error);
        }
      };

      setupAnalyzer();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [live, audioElement, barWidth, barGap, barPlayedColor, backgroundColor]);

    // Draw static waveform
    useEffect(() => {
      if (live || waveformData.length === 0 || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.offsetWidth, height);

      const totalBars = waveformData.length;
      const availableWidth = canvas.offsetWidth;
      const calculatedBarWidth = (availableWidth - (totalBars - 1) * barGap) / totalBars;

      waveformData.forEach((value, i) => {
        const barHeight = Math.max(2, value * (height * 0.8));
        const x = i * (calculatedBarWidth + barGap);
        const y = (height - barHeight) / 2;

        const progressPoint = i / totalBars;
        ctx.fillStyle = showProgress && progressPoint <= progress ? barPlayedColor : barColor;
        ctx.fillRect(x, y, calculatedBarWidth, barHeight);
      });
    }, [waveformData, progress, height, barWidth, barGap, barColor, barPlayedColor, backgroundColor, live, showProgress]);

    // Handle click to seek
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onSeek || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = clickX / rect.width;

      onSeek(Math.max(0, Math.min(1, newProgress)));
    };

    return (
      <div
        ref={ref}
        className={`w-full ${className}`}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className={`w-full ${onSeek ? 'cursor-pointer' : ''}`}
          style={{ height }}
          onClick={handleClick}
        />
      </div>
    );
  }
);

WaveformVisualizer.displayName = 'WaveformVisualizer';

export default WaveformVisualizer;

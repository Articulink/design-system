'use client';

import { forwardRef, useState, useEffect, useCallback, useRef } from 'react';

/**
 * Articulink VoiceInput Component
 *
 * Voice-to-text input button using Web Speech API.
 *
 * Usage:
 *   <VoiceInput onTranscript={(text) => setText(prev => prev + text)} />
 *   <VoiceInput onTranscript={handleText} continuous />
 */

// Web Speech API types (not available in all TypeScript libs)
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface VoiceInputProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
  onTranscript: (text: string, isFinal: boolean) => void;
  onListeningChange?: (isListening: boolean) => void;
  onVoiceError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  label?: string;
}

const sizeClasses = {
  sm: 'p-1.5 w-8 h-8',
  md: 'p-2 w-10 h-10',
  lg: 'p-3 w-12 h-12',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

// Check for browser support
const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const VoiceInput = forwardRef<HTMLButtonElement, VoiceInputProps>(
  (
    {
      onTranscript,
      onListeningChange,
      onVoiceError,
      continuous = true,
      interimResults = true,
      disabled = false,
      size = 'md',
      showPreview = true,
      label = 'Voice input',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null as SpeechRecognition | null);

    // Check support on mount
    useEffect(() => {
      setIsSupported(isSpeechRecognitionSupported());
    }, []);

    // Initialize speech recognition
    useEffect(() => {
      if (!isSupported || typeof window === 'undefined') return;

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) return;

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript('');
          onTranscript(final, true);
        } else if (interim && interimResults) {
          onTranscript(interim, false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied';
            break;
          case 'network':
            errorMessage = 'Network error';
            break;
        }
        setError(errorMessage);
        onVoiceError?.(errorMessage);
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;

      return () => {
        recognition.abort();
      };
    }, [isSupported, continuous, interimResults, onTranscript, onListeningChange, onVoiceError]);

    // Show error tooltip
    useEffect(() => {
      if (error) {
        setShowTooltip(true);
        const timer = setTimeout(() => setShowTooltip(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    const startListening = useCallback(() => {
      if (!recognitionRef.current) return;
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onListeningChange?.(true);
      } catch {
        // Already started, ignore
      }
    }, [onListeningChange]);

    const stopListening = useCallback(() => {
      if (!recognitionRef.current) return;
      recognitionRef.current.stop();
      setIsListening(false);
      onListeningChange?.(false);
    }, [onListeningChange]);

    const handleClick = () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    };

    // Don't render if not supported
    if (!isSupported) {
      return null;
    }

    return (
      <div className={`relative inline-flex ${className}`}>
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={label}
          title={isListening ? 'Stop recording' : 'Start voice input'}
          className={`
            ${sizeClasses[size]}
            rounded-lg transition-all duration-200
            ${isListening
              ? 'bg-error/10 text-error hover:bg-error/20 animate-pulse'
              : 'bg-mist text-lagoon hover:bg-mist/80 hover:text-abyss'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-tide focus:ring-offset-1
          `}
          {...props}
        >
          {isListening ? (
            <StopIcon className={iconSizes[size]} />
          ) : (
            <MicrophoneIcon className={iconSizes[size]} />
          )}
        </button>

        {/* Recording indicator */}
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
          </span>
        )}

        {/* Interim transcript preview */}
        {showPreview && isListening && interimTranscript && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-abyss text-white text-sm rounded-lg shadow-lg max-w-xs z-50 whitespace-pre-wrap">
            <span className="opacity-70">{interimTranscript}</span>
          </div>
        )}

        {/* Error tooltip */}
        {showTooltip && error && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-error text-white text-sm rounded-lg shadow-lg max-w-xs z-50">
            {error}
          </div>
        )}
      </div>
    );
  }
);

VoiceInput.displayName = 'VoiceInput';

// Inline icons
function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
      />
    </svg>
  );
}

export default VoiceInput;

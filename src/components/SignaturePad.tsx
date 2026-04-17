'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink SignaturePad Component
 *
 * Digital signature input for consent forms.
 *
 * Usage:
 *   <SignaturePad onSignature={(dataUrl) => setSignature(dataUrl)} />
 *   <SignaturePad value={signature} onSignature={setSignature} />
 */

export interface SignaturePadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string | null;
  onSignature: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SignaturePad = forwardRef<HTMLDivElement, SignaturePadProps>(
  (
    {
      value,
      onSignature,
      width = 400,
      height = 200,
      strokeColor = '#012A4D',
      strokeWidth = 2,
      backgroundColor = '#FFFFFF',
      label,
      error,
      disabled = false,
      placeholder = 'Sign here',
      className = '',
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

    // Initialize canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Load existing signature if provided
      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          setHasSignature(true);
        };
        img.src = value;
      }
    }, [width, height, backgroundColor, value]);

    const getPoint = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if ('touches' in e) {
          const touch = e.touches[0];
          return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
          };
        }

        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      },
      []
    );

    const startDrawing = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (disabled) return;

        const point = getPoint(e);
        if (!point) return;

        setIsDrawing(true);
        setLastPoint(point);
        setHasSignature(true);
      },
      [disabled, getPoint]
    );

    const draw = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !lastPoint) return;

        const point = getPoint(e);
        if (!point) return;

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        setLastPoint(point);
      },
      [isDrawing, disabled, lastPoint, getPoint, strokeColor, strokeWidth]
    );

    const stopDrawing = useCallback(() => {
      if (isDrawing) {
        setIsDrawing(false);
        setLastPoint(null);

        // Save signature
        const canvas = canvasRef.current;
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          onSignature(dataUrl);
        }
      }
    }, [isDrawing, onSignature]);

    const clear = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      setHasSignature(false);
      onSignature(null);
    }, [backgroundColor, width, height, onSignature]);

    // Prevent scrolling while drawing on touch devices
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const preventScroll = (e: TouchEvent) => {
        if (isDrawing) {
          e.preventDefault();
        }
      };

      canvas.addEventListener('touchmove', preventScroll, { passive: false });
      return () => canvas.removeEventListener('touchmove', preventScroll);
    }, [isDrawing]);

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">{label}</label>
        )}

        <div
          className={`
            relative rounded-xl border-2 overflow-hidden
            ${error ? 'border-error' : 'border-mist'}
            ${disabled ? 'opacity-50' : ''}
          `}
          style={{ width: '100%', maxWidth: width }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`
              w-full touch-none
              ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}
            `}
            style={{ aspectRatio: `${width}/${height}` }}
          />

          {/* Placeholder */}
          {!hasSignature && !disabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-lagoon/40 text-lg">{placeholder}</span>
            </div>
          )}

          {/* Signature line */}
          <div className="absolute bottom-8 left-8 right-8 border-b border-dashed border-lagoon/30" />

          {/* Clear button */}
          {hasSignature && !disabled && (
            <button
              type="button"
              onClick={clear}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-mist rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {error && <p className="text-error text-sm mt-1.5">{error}</p>}

        <p className="text-lagoon text-xs mt-2">
          {disabled ? 'Signature locked' : 'Draw your signature above'}
        </p>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;

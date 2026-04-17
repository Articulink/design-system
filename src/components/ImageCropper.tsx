'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink ImageCropper Component
 *
 * Image cropping tool with zoom and pan.
 *
 * Usage:
 *   <ImageCropper
 *     src={imageUrl}
 *     onCrop={(croppedBlob) => handleCrop(croppedBlob)}
 *   />
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCropperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  src: string;
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  cropShape?: 'rect' | 'round';
  showGrid?: boolean;
  onCrop?: (blob: Blob, area: CropArea) => void;
  onCropAreaChange?: (area: CropArea) => void;
}

export const ImageCropper = forwardRef<HTMLDivElement, ImageCropperProps>(
  (
    {
      src,
      aspectRatio = 1,
      minZoom = 1,
      maxZoom = 3,
      cropShape = 'rect',
      showGrid = true,
      onCrop,
      onCropAreaChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

    // Calculate crop area size based on container and aspect ratio
    useEffect(() => {
      if (!containerRef.current) return;

      const updateSizes = () => {
        const container = containerRef.current;
        if (!container) return;

        const { width, height } = container.getBoundingClientRect();
        setContainerSize({ width, height });

        // Calculate crop area that fits within container
        const maxCropWidth = width * 0.8;
        const maxCropHeight = height * 0.8;

        let cropWidth, cropHeight;
        if (maxCropWidth / aspectRatio <= maxCropHeight) {
          cropWidth = maxCropWidth;
          cropHeight = maxCropWidth / aspectRatio;
        } else {
          cropHeight = maxCropHeight;
          cropWidth = maxCropHeight * aspectRatio;
        }

        setCropSize({ width: cropWidth, height: cropHeight });
      };

      updateSizes();
      const resizeObserver = new ResizeObserver(updateSizes);
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }, [aspectRatio]);

    // Load image and get dimensions
    useEffect(() => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = src;
    }, [src]);

    // Calculate crop area for output
    const getCropArea = useCallback((): CropArea => {
      if (!imageRef.current || cropSize.width === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }

      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (!containerRect) return { x: 0, y: 0, width: 0, height: 0 };

      // Crop area position in container
      const cropX = (containerRect.width - cropSize.width) / 2;
      const cropY = (containerRect.height - cropSize.height) / 2;

      // Image position relative to container
      const imgX = imgRect.left - containerRect.left;
      const imgY = imgRect.top - containerRect.top;

      // Calculate crop area in original image coordinates
      const scale = imageSize.width / imgRect.width;
      const x = (cropX - imgX) * scale;
      const y = (cropY - imgY) * scale;
      const width = cropSize.width * scale;
      const height = cropSize.height * scale;

      return {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(width, imageSize.width - x),
        height: Math.min(height, imageSize.height - y),
      };
    }, [cropSize, imageSize]);

    // Notify crop area changes
    useEffect(() => {
      const area = getCropArea();
      onCropAreaChange?.(area);
    }, [position, zoom, getCropArea, onCropAreaChange]);

    // Mouse/touch handlers
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      },
      [isDragging, dragStart]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Zoom handler
    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setZoom(parseFloat(e.target.value));
    };

    // Crop handler
    const handleCrop = async () => {
      if (!imageRef.current || !onCrop) return;

      const area = getCropArea();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = area.width;
      canvas.height = area.height;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(
          img,
          area.x,
          area.y,
          area.width,
          area.height,
          0,
          0,
          area.width,
          area.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            onCrop(blob, area);
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = src;
    };

    // Calculate image display size
    const getImageStyle = () => {
      if (cropSize.width === 0 || imageSize.width === 0) return {};

      // Scale image to cover crop area at zoom=1
      const scaleX = cropSize.width / imageSize.width;
      const scaleY = cropSize.height / imageSize.height;
      const baseScale = Math.max(scaleX, scaleY);

      const width = imageSize.width * baseScale * zoom;
      const height = imageSize.height * baseScale * zoom;

      return {
        width,
        height,
        transform: `translate(${position.x}px, ${position.y}px)`,
      };
    };

    return (
      <div ref={ref} className={`flex flex-col ${className}`} {...props}>
        {/* Cropper area */}
        <div
          ref={containerRef}
          className="relative w-full h-64 bg-abyss overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={src}
            alt="Crop preview"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none select-none pointer-events-none"
            style={getImageStyle()}
            draggable={false}
          />

          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark overlay outside crop area */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Crop window */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent ${
                cropShape === 'round' ? 'rounded-full' : 'rounded-lg'
              }`}
              style={{
                width: cropSize.width,
                height: cropSize.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* Grid */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-white/30"
                    />
                  ))}
                </div>
              )}

              {/* Border */}
              <div
                className={`absolute inset-0 border-2 border-white ${
                  cropShape === 'round' ? 'rounded-full' : 'rounded-lg'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-4 px-4">
          {/* Zoom slider */}
          <div className="flex-1 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-lagoon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={0.1}
              value={zoom}
              onChange={handleZoomChange}
              className="flex-1 h-1 bg-mist rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-tide"
            />
            <svg
              className="w-4 h-4 text-lagoon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>

          {/* Crop button */}
          {onCrop && (
            <button
              type="button"
              onClick={handleCrop}
              className="px-4 py-2 bg-tide text-white rounded-lg hover:bg-surf transition-colors"
            >
              Crop
            </button>
          )}
        </div>
      </div>
    );
  }
);

ImageCropper.displayName = 'ImageCropper';

export default ImageCropper;

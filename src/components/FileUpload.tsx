'use client';

import { forwardRef, useState, useRef, useCallback } from 'react';

/**
 * Articulink FileUpload Component
 *
 * Drag-and-drop file upload with preview and progress.
 *
 * Usage:
 *   <FileUpload
 *     accept="image/*"
 *     onFileSelect={(file) => handleUpload(file)}
 *   />
 *
 *   <FileUpload
 *     accept="video/*"
 *     maxSize={100 * 1024 * 1024}
 *     onFileSelect={handleFile}
 *     progress={uploadProgress}
 *   />
 */

export type FileUploadAccept = 'image/*' | 'video/*' | 'audio/*' | '.pdf' | string;

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'onError'> {
  accept?: FileUploadAccept;
  maxSize?: number; // in bytes
  onFileSelect: (file: File) => void;
  onUploadError?: (error: string) => void;
  progress?: number; // 0-100
  disabled?: boolean;
  preview?: string | null;
  label?: string;
  hint?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getAcceptDescription(accept: string): string {
  if (accept.includes('image')) return 'PNG, JPG, GIF up to 10MB';
  if (accept.includes('video')) return 'MP4, MOV up to 100MB';
  if (accept.includes('audio')) return 'MP3, WAV up to 50MB';
  if (accept.includes('pdf')) return 'PDF files';
  return 'Supported files';
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept = 'image/*',
      maxSize = 10 * 1024 * 1024, // 10MB default
      onFileSelect,
      onUploadError,
      progress,
      disabled = false,
      preview,
      label = 'Upload a file',
      hint,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isUploading = progress !== undefined && progress > 0 && progress < 100;
    const isComplete = progress === 100;

    const validateFile = useCallback((file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File too large. Maximum size is ${formatFileSize(maxSize)}`;
      }

      if (accept && accept !== '*') {
        const acceptTypes = accept.split(',').map(t => t.trim());
        const fileType = file.type;
        const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;

        const isValid = acceptTypes.some(type => {
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', '/'));
          }
          if (type.startsWith('.')) {
            return fileExt === type.toLowerCase();
          }
          return fileType === type;
        });

        if (!isValid) {
          return `Invalid file type. Accepted: ${accept}`;
        }
      }

      return null;
    }, [accept, maxSize]);

    const handleFile = useCallback((file: File) => {
      const error = validateFile(file);
      if (error) {
        onUploadError?.(error);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }, [validateFile, onFileSelect, onUploadError]);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    }, [disabled, isUploading, handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    }, [disabled, isUploading]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    }, [handleFile]);

    const handleClick = () => {
      if (!disabled && !isUploading) {
        inputRef.current?.click();
      }
    };

    const showPreview = preview || (selectedFile && selectedFile.type.startsWith('image/'));
    const previewUrl = preview || (selectedFile ? URL.createObjectURL(selectedFile) : null);

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">
            {label}
          </label>
        )}

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl
            transition-all duration-200
            ${isDragging
              ? 'border-tide bg-info-bg'
              : 'border-mist hover:border-tide hover:bg-breeze'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled || isUploading}
            className="sr-only"
          />

          {showPreview && previewUrl ? (
            <div className="relative aspect-video">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-abyss/50 flex items-center justify-center rounded-xl">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm font-medium">{progress}%</p>
                  </div>
                </div>
              )}
              {isComplete && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              {isUploading ? (
                <>
                  <div className="w-12 h-12 border-4 border-tide border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm font-medium text-abyss">Uploading... {progress}%</p>
                  <div className="mt-3 w-full max-w-xs mx-auto bg-mist rounded-full h-2">
                    <div
                      className="bg-tide h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-lagoon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="mt-4 text-sm text-abyss">
                    <span className="font-semibold text-tide">Click to upload</span>
                    {' '}or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-lagoon">
                    {hint || getAcceptDescription(accept)}
                  </p>
                  {selectedFile && !isUploading && (
                    <p className="mt-2 text-sm text-lagoon">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;

'use client';

import { forwardRef, useState, useRef, useCallback } from 'react';

/**
 * Articulink SortableList Component
 *
 * Drag-and-drop reorderable list.
 *
 * Usage:
 *   <SortableList
 *     items={items}
 *     onReorder={(newItems) => setItems(newItems)}
 *     renderItem={(item, index) => <div>{item.name}</div>}
 *   />
 */

export interface SortableListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  direction?: 'vertical' | 'horizontal';
  handle?: boolean;
  disabled?: boolean;
  dragHandleClass?: string;
}

function SortableListInner<T>(
  {
    items,
    onReorder,
    renderItem,
    keyExtractor = (_, index) => String(index),
    direction = 'vertical',
    handle = false,
    disabled = false,
    dragHandleClass = 'sortable-handle',
    className = '',
    ...props
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragStartY = useRef(0);
  const dragStartX = useRef(0);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      if (disabled) return;

      // Check if using handle mode and the target is the handle
      if (handle) {
        const target = e.target as HTMLElement;
        if (!target.closest(`.${dragHandleClass}`)) {
          e.preventDefault();
          return;
        }
      }

      setDraggedIndex(index);
      dragStartY.current = e.clientY;
      dragStartX.current = e.clientX;

      // Set drag image
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
      }
    },
    [disabled, handle, dragHandleClass]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      setOverIndex(index);
    },
    [draggedIndex]
  );

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && overIndex !== null && draggedIndex !== overIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(overIndex, 0, draggedItem);
      onReorder(newItems);
    }

    setDraggedIndex(null);
    setOverIndex(null);
  }, [draggedIndex, overIndex, items, onReorder]);

  const handleDragLeave = useCallback(() => {
    setOverIndex(null);
  }, []);

  return (
    <div
      ref={ref}
      className={`
        ${direction === 'horizontal' ? 'flex flex-row gap-2' : 'flex flex-col gap-2'}
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => {
        const key = keyExtractor(item, index);
        const isDragging = draggedIndex === index;
        const isOver = overIndex === index;

        return (
          <div
            key={key}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`
              transition-all duration-200
              ${isDragging ? 'opacity-50 scale-95' : ''}
              ${isOver ? 'ring-2 ring-tide ring-offset-2' : ''}
              ${disabled ? 'cursor-default' : handle ? 'cursor-default' : 'cursor-grab'}
            `}
          >
            {renderItem(item, index, isDragging)}
          </div>
        );
      })}
    </div>
  );
}

export const SortableList = forwardRef(SortableListInner) as <T>(
  props: SortableListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof SortableListInner>;

/**
 * SortableHandle - Drag handle for sortable items
 */
export interface SortableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const SortableHandle = forwardRef<HTMLDivElement, SortableHandleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`sortable-handle cursor-grab active:cursor-grabbing ${className}`}
        {...props}
      >
        {children || (
          <svg
            className="w-5 h-5 text-lagoon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8h16M4 16h16"
            />
          </svg>
        )}
      </div>
    );
  }
);

SortableHandle.displayName = 'SortableHandle';

export default SortableList;

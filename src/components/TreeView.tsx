'use client';

import { forwardRef, useState, useCallback, createContext, useContext } from 'react';

/**
 * Articulink TreeView Component
 *
 * Hierarchical tree structure for nested data.
 *
 * Usage:
 *   <TreeView>
 *     <TreeItem id="1" label="Parent">
 *       <TreeItem id="1.1" label="Child 1" />
 *       <TreeItem id="1.2" label="Child 2" />
 *     </TreeItem>
 *   </TreeView>
 */

interface TreeViewContextType {
  expandedIds: Set<string>;
  selectedId: string | null;
  toggleExpanded: (id: string) => void;
  selectItem: (id: string) => void;
}

const TreeViewContext = createContext<TreeViewContextType | null>(null);

const useTreeView = () => {
  const context = useContext(TreeViewContext);
  if (!context) {
    throw new Error('useTreeView must be used within a TreeView');
  }
  return context;
};

export interface TreeViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onToggle'> {
  children: React.ReactNode;
  defaultExpanded?: string[];
  defaultSelected?: string;
  onSelect?: (id: string) => void;
  onToggle?: (id: string, expanded: boolean) => void;
}

export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      children,
      defaultExpanded = [],
      defaultSelected,
      onSelect,
      onToggle,
      className = '',
      ...props
    },
    ref
  ) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpanded));
    const [selectedId, setSelectedId] = useState<string | null>(defaultSelected || null);

    const toggleExpanded = useCallback(
      (id: string) => {
        setExpandedIds((prev) => {
          const next = new Set(prev);
          const isExpanded = next.has(id);
          if (isExpanded) {
            next.delete(id);
          } else {
            next.add(id);
          }
          onToggle?.(id, !isExpanded);
          return next;
        });
      },
      [onToggle]
    );

    const selectItem = useCallback(
      (id: string) => {
        setSelectedId(id);
        onSelect?.(id);
      },
      [onSelect]
    );

    return (
      <TreeViewContext.Provider value={{ expandedIds, selectedId, toggleExpanded, selectItem }}>
        <div
          ref={ref}
          role="tree"
          className={`${className}`}
          {...props}
        >
          {children}
        </div>
      </TreeViewContext.Provider>
    );
  }
);

TreeView.displayName = 'TreeView';

/**
 * TreeItem
 */
export interface TreeItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  ({ id, label, icon, disabled, children, className = '', ...props }, ref) => {
    const { expandedIds, selectedId, toggleExpanded, selectItem } = useTreeView();

    const hasChildren = !!children;
    const isExpanded = expandedIds.has(id);
    const isSelected = selectedId === id;

    const handleClick = () => {
      if (disabled) return;
      selectItem(id);
      if (hasChildren) {
        toggleExpanded(id);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
      if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
        toggleExpanded(id);
      }
      if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
        toggleExpanded(id);
      }
    };

    return (
      <div ref={ref} role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} {...props}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
            transition-colors
            ${isSelected ? 'bg-info-bg text-tide' : 'text-abyss hover:bg-mist'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Expand/collapse icon */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) toggleExpanded(id);
              }}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
              tabIndex={-1}
            >
              <svg
                className={`w-3 h-3 text-lagoon transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Icon */}
          {icon && <span className="flex-shrink-0">{icon}</span>}

          {/* Label */}
          <span className="flex-1 truncate text-sm">{label}</span>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-mist ml-2 mt-1" role="group">
            {children}
          </div>
        )}
      </div>
    );
  }
);

TreeItem.displayName = 'TreeItem';

export default TreeView;

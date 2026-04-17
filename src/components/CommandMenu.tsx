'use client';

import { forwardRef, useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Articulink CommandMenu Component
 *
 * Command palette (Cmd+K) for quick actions and navigation.
 *
 * Usage:
 *   <CommandMenu
 *     open={open}
 *     onOpenChange={setOpen}
 *     commands={[
 *       { id: '1', label: 'Go to Dashboard', group: 'Navigation', onSelect: () => navigate('/') },
 *       { id: '2', label: 'New Client', group: 'Actions', onSelect: () => openModal() },
 *     ]}
 *   />
 */

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  group?: string;
  onSelect: () => void;
  disabled?: boolean;
  keywords?: string[];
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  hotkey?: string;
}

export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(
  (
    {
      open,
      onOpenChange,
      commands,
      placeholder = 'Type a command or search...',
      emptyMessage = 'No results found.',
      hotkey = 'k',
    },
    ref
  ) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter commands based on query
    const filteredCommands = useMemo(() => {
      if (!query) return commands;
      const lowerQuery = query.toLowerCase();
      return commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(lowerQuery) ||
          cmd.description?.toLowerCase().includes(lowerQuery) ||
          cmd.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
          cmd.group?.toLowerCase().includes(lowerQuery)
      );
    }, [commands, query]);

    // Group commands
    const groupedCommands = useMemo(() => {
      const groups: Record<string, CommandItem[]> = {};
      filteredCommands.forEach((cmd) => {
        const group = cmd.group || 'Commands';
        if (!groups[group]) groups[group] = [];
        groups[group].push(cmd);
      });
      return groups;
    }, [filteredCommands]);

    // Flat list for keyboard navigation
    const flatList = useMemo(() => {
      return Object.values(groupedCommands).flat();
    }, [groupedCommands]);

    // Reset state when opening/closing
    useEffect(() => {
      if (open) {
        setQuery('');
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }, [open]);

    // Reset selection when results change
    useEffect(() => {
      setSelectedIndex(0);
    }, [filteredCommands.length]);

    // Global hotkey
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
          e.preventDefault();
          onOpenChange(!open);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hotkey, open, onOpenChange]);

    // Close on escape
    useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onOpenChange]);

    // Scroll selected item into view
    useEffect(() => {
      if (listRef.current && open) {
        const selected = listRef.current.querySelector('[data-selected="true"]');
        selected?.scrollIntoView({ block: 'nearest' });
      }
    }, [selectedIndex, open]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
            break;
          case 'Enter':
            e.preventDefault();
            const selected = flatList[selectedIndex];
            if (selected && !selected.disabled) {
              selected.onSelect();
              onOpenChange(false);
            }
            break;
        }
      },
      [flatList, selectedIndex, onOpenChange]
    );

    const handleSelect = useCallback(
      (cmd: CommandItem) => {
        if (!cmd.disabled) {
          cmd.onSelect();
          onOpenChange(false);
        }
      },
      [onOpenChange]
    );

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-abyss/50 z-50"
          onClick={() => onOpenChange(false)}
        />

        {/* Dialog */}
        <div
          ref={ref}
          className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-mist overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-mist">
              <svg
                className="w-5 h-5 text-lagoon flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 text-abyss placeholder:text-lagoon/50 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-lagoon bg-mist rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
              {flatList.length === 0 ? (
                <div className="px-4 py-8 text-center text-lagoon">
                  {emptyMessage}
                </div>
              ) : (
                Object.entries(groupedCommands).map(([group, items]) => (
                  <div key={group}>
                    <div className="px-4 py-2 text-xs font-semibold text-lagoon uppercase tracking-wider">
                      {group}
                    </div>
                    {items.map((cmd) => {
                      const index = flatList.indexOf(cmd);
                      const isSelected = index === selectedIndex;

                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          data-selected={isSelected}
                          onClick={() => handleSelect(cmd)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          disabled={cmd.disabled}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors
                            ${isSelected ? 'bg-info-bg' : 'hover:bg-mist/50'}
                            ${cmd.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          {cmd.icon && (
                            <span className={`flex-shrink-0 ${isSelected ? 'text-tide' : 'text-lagoon'}`}>
                              {cmd.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`truncate ${isSelected ? 'text-tide font-medium' : 'text-abyss'}`}>
                              {cmd.label}
                            </p>
                            {cmd.description && (
                              <p className="text-sm text-lagoon truncate">{cmd.description}</p>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <div className="flex items-center gap-1">
                              {cmd.shortcut.map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-1.5 py-0.5 text-xs text-lagoon bg-mist rounded"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-mist bg-breeze text-xs text-lagoon">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white rounded border border-mist">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-white rounded border border-mist">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white rounded border border-mist">↵</kbd>
                  <span>select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white rounded border border-mist">esc</kbd>
                <span>close</span>
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
);

CommandMenu.displayName = 'CommandMenu';

export default CommandMenu;

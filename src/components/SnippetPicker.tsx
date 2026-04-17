'use client';

import { forwardRef, useState, useEffect, useCallback, ReactNode } from 'react';

/**
 * Articulink SnippetPicker Component
 *
 * Collapsible snippet/phrase picker with categories.
 *
 * Usage:
 *   <SnippetPicker
 *     categories={[
 *       { key: 'greeting', label: 'Greetings', snippets: ['Hello!', 'Hi there'] },
 *       { key: 'closing', label: 'Closings', snippets: ['Best regards', 'Thanks'] },
 *     ]}
 *     onInsert={(snippet) => insertText(snippet)}
 *   />
 */

export interface SnippetCategory {
  key: string;
  label: string;
  color?: string;
  snippets: string[];
}

export interface SnippetPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: SnippetCategory[];
  onInsert: (snippet: string, categoryKey: string) => void;
  title?: string;
  defaultExpanded?: boolean;
  allowCustom?: boolean;
  storageKey?: string; // localStorage key for custom snippets
  maxHeight?: number;
  icon?: ReactNode;
}

export const SnippetPicker = forwardRef<HTMLDivElement, SnippetPickerProps>(
  (
    {
      categories,
      onInsert,
      title = 'Quick Phrases',
      defaultExpanded = false,
      allowCustom = true,
      storageKey,
      maxHeight = 192,
      icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [activeCategory, setActiveCategory] = useState(categories[0]?.key || '');
    const [customSnippets, setCustomSnippets] = useState<Record<string, string[]>>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSnippet, setNewSnippet] = useState('');
    const [addCategory, setAddCategory] = useState(activeCategory);

    // Load custom snippets from localStorage
    useEffect(() => {
      if (storageKey) {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            setCustomSnippets(JSON.parse(saved));
          } catch {
            // Invalid data, ignore
          }
        }
      }
    }, [storageKey]);

    // Save custom snippets
    const saveCustomSnippets = useCallback(
      (snippets: Record<string, string[]>) => {
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(snippets));
        }
        setCustomSnippets(snippets);
      },
      [storageKey]
    );

    const handleAddSnippet = () => {
      if (!newSnippet.trim()) return;

      const updated = {
        ...customSnippets,
        [addCategory]: [...(customSnippets[addCategory] || []), newSnippet.trim()],
      };
      saveCustomSnippets(updated);
      setNewSnippet('');
      setShowAddModal(false);
    };

    const handleRemoveCustomSnippet = (categoryKey: string, index: number) => {
      const updated = {
        ...customSnippets,
        [categoryKey]: customSnippets[categoryKey].filter((_, i) => i !== index),
      };
      saveCustomSnippets(updated);
    };

    const currentCategory = categories.find((c) => c.key === activeCategory);
    const defaultSnippets = currentCategory?.snippets || [];
    const categoryCustomSnippets = customSnippets[activeCategory] || [];
    const allSnippets = [...defaultSnippets, ...categoryCustomSnippets];

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl border border-mist overflow-hidden ${className}`}
        {...props}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-mist/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon || (
              <svg
                className="w-5 h-5 text-tide"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>
            )}
            <span className="font-medium text-abyss">{title}</span>
          </div>
          <svg
            className={`w-5 h-5 text-lagoon transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="border-t border-mist">
            {/* Category tabs */}
            <div className="flex items-center gap-1 p-2 bg-mist/50 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors
                    ${activeCategory === cat.key
                      ? cat.color || 'bg-info-bg text-tide'
                      : 'text-lagoon hover:bg-mist'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}

              {allowCustom && (
                <button
                  onClick={() => {
                    setAddCategory(activeCategory);
                    setShowAddModal(true);
                  }}
                  className="ml-auto px-2 py-1.5 text-xs text-tide hover:bg-info-bg rounded-lg flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add
                </button>
              )}
            </div>

            {/* Snippets list */}
            <div className="overflow-y-auto p-2 space-y-1" style={{ maxHeight }}>
              {allSnippets.length > 0 ? (
                allSnippets.map((snippet, index) => {
                  const isCustom = index >= defaultSnippets.length;
                  return (
                    <div key={index} className="group flex items-start gap-1">
                      <button
                        onClick={() => onInsert(snippet, activeCategory)}
                        className="flex-1 text-left px-3 py-2 text-sm text-lagoon hover:bg-info-bg hover:text-abyss rounded-lg transition-colors"
                      >
                        {snippet}
                      </button>
                      {isCustom && allowCustom && (
                        <button
                          onClick={() =>
                            handleRemoveCustomSnippet(activeCategory, index - defaultSnippets.length)
                          }
                          className="p-2 text-lagoon/30 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove snippet"
                          aria-label="Remove snippet"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-lagoon text-center py-4">No snippets in this category</p>
              )}
            </div>

            {/* Hint */}
            <div className="px-3 py-2 bg-mist/50 border-t border-mist">
              <p className="text-xs text-lagoon">Click a snippet to insert it</p>
            </div>
          </div>
        )}

        {/* Add snippet modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-5">
              <h3 className="text-lg font-semibold text-abyss mb-4">Add Custom Snippet</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-lagoon mb-1">Category</label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-mist rounded-lg focus:ring-2 focus:ring-tide focus:border-tide"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lagoon mb-1">Snippet</label>
                  <textarea
                    value={newSnippet}
                    onChange={(e) => setNewSnippet(e.target.value)}
                    placeholder="Enter your custom snippet..."
                    rows={3}
                    className="w-full px-3 py-2 border border-mist rounded-lg focus:ring-2 focus:ring-tide focus:border-tide"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSnippet('');
                  }}
                  className="flex-1 py-2 px-4 border border-mist text-lagoon font-medium rounded-lg hover:bg-mist/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSnippet}
                  disabled={!newSnippet.trim()}
                  className="flex-1 py-2 px-4 bg-tide text-white font-medium rounded-lg hover:bg-surf disabled:opacity-50"
                >
                  Add Snippet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SnippetPicker.displayName = 'SnippetPicker';

export default SnippetPicker;

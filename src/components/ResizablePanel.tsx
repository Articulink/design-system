'use client';

import { forwardRef, useState, useRef, useCallback, useEffect, createContext, useContext } from 'react';

/**
 * Articulink ResizablePanel Component
 *
 * Draggable resizable panel layout.
 *
 * Usage:
 *   <ResizablePanelGroup direction="horizontal">
 *     <ResizablePanel defaultSize={25} minSize={15}>
 *       Sidebar content
 *     </ResizablePanel>
 *     <ResizableHandle />
 *     <ResizablePanel defaultSize={75}>
 *       Main content
 *     </ResizablePanel>
 *   </ResizablePanelGroup>
 */

export type ResizableDirection = 'horizontal' | 'vertical';

interface PanelData {
  id: string;
  size: number;
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsed: boolean;
  collapsedSize: number;
}

interface ResizablePanelGroupContextType {
  direction: ResizableDirection;
  panels: Map<string, PanelData>;
  registerPanel: (id: string, data: Omit<PanelData, 'id'>) => void;
  unregisterPanel: (id: string) => void;
  resizePanel: (id: string, delta: number) => void;
  toggleCollapse: (id: string) => void;
  getPanelSize: (id: string) => number;
}

const ResizablePanelGroupContext = createContext<ResizablePanelGroupContextType | null>(null);

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection;
  children: React.ReactNode;
  onLayout?: (sizes: number[]) => void;
}

export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ direction = 'horizontal', children, onLayout, className = '', ...props }, ref) => {
    const [panels, setPanels] = useState<Map<string, PanelData>>(new Map());
    const panelOrderRef = useRef<string[]>([]);

    const registerPanel = useCallback((id: string, data: Omit<PanelData, 'id'>) => {
      setPanels((prev) => {
        const next = new Map(prev);
        next.set(id, { ...data, id });
        return next;
      });
      if (!panelOrderRef.current.includes(id)) {
        panelOrderRef.current.push(id);
      }
    }, []);

    const unregisterPanel = useCallback((id: string) => {
      setPanels((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      panelOrderRef.current = panelOrderRef.current.filter((p) => p !== id);
    }, []);

    const resizePanel = useCallback((id: string, delta: number) => {
      setPanels((prev) => {
        const next = new Map(prev);
        const panelOrder = panelOrderRef.current;
        const currentIndex = panelOrder.indexOf(id);

        if (currentIndex === -1 || currentIndex === panelOrder.length - 1) return prev;

        const currentPanel = next.get(id);
        const nextPanelId = panelOrder[currentIndex + 1];
        const nextPanel = next.get(nextPanelId);

        if (!currentPanel || !nextPanel) return prev;

        // Calculate new sizes
        let newCurrentSize = currentPanel.size + delta;
        let newNextSize = nextPanel.size - delta;

        // Apply constraints
        if (newCurrentSize < currentPanel.minSize) {
          const diff = currentPanel.minSize - newCurrentSize;
          newCurrentSize = currentPanel.minSize;
          newNextSize += diff;
        }
        if (newCurrentSize > currentPanel.maxSize) {
          const diff = newCurrentSize - currentPanel.maxSize;
          newCurrentSize = currentPanel.maxSize;
          newNextSize += diff;
        }
        if (newNextSize < nextPanel.minSize) {
          const diff = nextPanel.minSize - newNextSize;
          newNextSize = nextPanel.minSize;
          newCurrentSize -= diff;
        }
        if (newNextSize > nextPanel.maxSize) {
          const diff = newNextSize - nextPanel.maxSize;
          newNextSize = nextPanel.maxSize;
          newCurrentSize += diff;
        }

        next.set(id, { ...currentPanel, size: newCurrentSize });
        next.set(nextPanelId, { ...nextPanel, size: newNextSize });

        return next;
      });
    }, []);

    const toggleCollapse = useCallback((id: string) => {
      setPanels((prev) => {
        const next = new Map(prev);
        const panel = next.get(id);

        if (!panel || !panel.collapsible) return prev;

        const panelOrder = panelOrderRef.current;
        const currentIndex = panelOrder.indexOf(id);

        // Find adjacent panel to give/take space
        const adjacentId = currentIndex > 0
          ? panelOrder[currentIndex - 1]
          : panelOrder[currentIndex + 1];
        const adjacentPanel = adjacentId ? next.get(adjacentId) : null;

        if (!adjacentPanel) return prev;

        if (panel.collapsed) {
          // Expand: restore size from adjacent panel
          const restoreSize = panel.size; // This was the collapsed size
          const originalSize = Math.max(panel.minSize, 20); // Restore to at least minSize or 20%
          next.set(id, { ...panel, collapsed: false, size: originalSize });
          next.set(adjacentId, { ...adjacentPanel, size: adjacentPanel.size - originalSize + restoreSize });
        } else {
          // Collapse: give space to adjacent panel
          const sizeToGive = panel.size - panel.collapsedSize;
          next.set(id, { ...panel, collapsed: true, size: panel.collapsedSize });
          next.set(adjacentId, { ...adjacentPanel, size: adjacentPanel.size + sizeToGive });
        }

        return next;
      });
    }, []);

    const getPanelSize = useCallback((id: string): number => {
      return panels.get(id)?.size ?? 0;
    }, [panels]);

    // Notify layout changes
    useEffect(() => {
      if (onLayout && panels.size > 0) {
        const sizes = panelOrderRef.current.map((id) => panels.get(id)?.size ?? 0);
        onLayout(sizes);
      }
    }, [panels, onLayout]);

    return (
      <ResizablePanelGroupContext.Provider
        value={{ direction, panels, registerPanel, unregisterPanel, resizePanel, toggleCollapse, getPanelSize }}
      >
        <div
          ref={ref}
          className={`
            flex h-full w-full
            ${direction === 'horizontal' ? 'flex-row' : 'flex-col'}
            ${className}
          `}
          {...props}
        >
          {children}
        </div>
      </ResizablePanelGroupContext.Provider>
    );
  }
);

ResizablePanelGroup.displayName = 'ResizablePanelGroup';

/**
 * ResizablePanel - Individual panel within a group
 */
export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  onCollapse?: () => void;
  onExpand?: () => void;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      children,
      defaultSize = 50,
      minSize = 10,
      maxSize = 90,
      collapsible = false,
      collapsedSize = 0,
      onCollapse,
      onExpand,
      className = '',
      ...props
    },
    ref
  ) => {
    const context = useContext(ResizablePanelGroupContext);
    if (!context) {
      throw new Error('ResizablePanel must be used within a ResizablePanelGroup');
    }

    const { direction, registerPanel, unregisterPanel, getPanelSize } = context;
    const idRef = useRef(`panel-${Math.random().toString(36).slice(2, 9)}`);
    const prevCollapsedRef = useRef(false);

    useEffect(() => {
      const id = idRef.current;
      registerPanel(id, {
        size: defaultSize,
        minSize,
        maxSize,
        collapsible,
        collapsed: false,
        collapsedSize,
      });

      return () => unregisterPanel(id);
    }, [registerPanel, unregisterPanel, defaultSize, minSize, maxSize, collapsible, collapsedSize]);

    const size = getPanelSize(idRef.current);
    const panel = context.panels.get(idRef.current);
    const isCollapsed = panel?.collapsed ?? false;

    // Fire collapse/expand callbacks
    useEffect(() => {
      if (isCollapsed !== prevCollapsedRef.current) {
        if (isCollapsed) {
          onCollapse?.();
        } else {
          onExpand?.();
        }
        prevCollapsedRef.current = isCollapsed;
      }
    }, [isCollapsed, onCollapse, onExpand]);

    const style: React.CSSProperties = direction === 'horizontal'
      ? { width: `${size}%`, minWidth: 0 }
      : { height: `${size}%`, minHeight: 0 };

    return (
      <div
        ref={ref}
        className={`overflow-hidden ${className}`}
        style={style}
        data-collapsed={isCollapsed}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResizablePanel.displayName = 'ResizablePanel';

/**
 * ResizableHandle - Draggable handle between panels
 */
export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle = true, className = '', ...props }, ref) => {
    const context = useContext(ResizablePanelGroupContext);
    if (!context) {
      throw new Error('ResizableHandle must be used within a ResizablePanelGroup');
    }

    const { direction, resizePanel, panels } = context;
    const [isDragging, setIsDragging] = useState(false);
    const handleRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);

        const startPos = direction === 'horizontal' ? e.clientX : e.clientY;
        const container = handleRef.current?.parentElement;
        if (!container) return;

        const containerSize = direction === 'horizontal'
          ? container.offsetWidth
          : container.offsetHeight;

        // Find the panel before this handle
        const handleElement = handleRef.current;
        let prevSibling = handleElement?.previousElementSibling;
        while (prevSibling && !prevSibling.hasAttribute('data-collapsed')) {
          prevSibling = prevSibling.previousElementSibling;
        }

        // Get panel ID from order
        const panelIds = Array.from(panels.keys());
        const handleIndex = Array.from(container.children).indexOf(handleElement!);
        const panelIndex = Math.floor(handleIndex / 2);
        const panelId = panelIds[panelIndex];

        if (!panelId) return;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
          const delta = ((currentPos - startPos) / containerSize) * 100;
          resizePanel(panelId, delta);
        };

        const handleMouseUp = () => {
          setIsDragging(false);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      },
      [direction, resizePanel, panels]
    );

    const isHorizontal = direction === 'horizontal';

    return (
      <div
        ref={(node) => {
          handleRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`
          relative flex items-center justify-center
          ${isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
          ${isDragging ? 'bg-tide' : 'bg-mist hover:bg-bubble'}
          transition-colors
          ${className}
        `}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {withHandle && (
          <div
            className={`
              absolute z-10 flex items-center justify-center
              bg-mist border border-mist rounded
              ${isHorizontal ? 'w-3 h-6' : 'w-6 h-3'}
              ${isDragging ? 'bg-tide border-tide' : 'hover:bg-bubble hover:border-bubble'}
              transition-colors
            `}
          >
            <div
              className={`
                flex gap-0.5
                ${isHorizontal ? 'flex-col' : 'flex-row'}
              `}
            >
              <div className="w-0.5 h-0.5 rounded-full bg-lagoon" />
              <div className="w-0.5 h-0.5 rounded-full bg-lagoon" />
              <div className="w-0.5 h-0.5 rounded-full bg-lagoon" />
            </div>
          </div>
        )}
      </div>
    );
  }
);

ResizableHandle.displayName = 'ResizableHandle';

export default ResizablePanelGroup;

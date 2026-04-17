/**
 * Articulink Design System Components
 *
 * Shared React components for all Articulink applications.
 */

// Core Components
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { Select } from './Select';
export type { SelectProps } from './Select';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps, ConfirmDialogVariant } from './ConfirmDialog';

// Form Helpers
export { FormField, FormSection, FormActions } from './FormField';
export type { FormFieldProps, FormSectionProps, FormActionsProps } from './FormField';

// Data Display
export { DataTable } from './DataTable';
export type { DataTableProps, Column } from './DataTable';

export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { DashboardCard } from './DashboardCard';
export type { DashboardCardProps, DashboardCardGradient, DashboardCardAction } from './DashboardCard';

export { StatusIndicator, StatusDot } from './StatusIndicator';
export type { StatusIndicatorProps, StatusIndicatorStatus, StatusIndicatorSize, StatusDotProps } from './StatusIndicator';

export { MediaCard } from './MediaCard';
export type { MediaCardProps, MediaCardType } from './MediaCard';

// Feedback
export { ToastProvider, useToast, useSuccessToast, useErrorToast, useWarningToast, useInfoToast } from './Toast';
export type { Toast, ToastType, ToastContextType } from './Toast';

export { Alert } from './Alert';
export type { AlertProps, AlertVariant } from './Alert';

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar } from './Skeleton';
export type { SkeletonProps, SkeletonTextProps, SkeletonCardProps, SkeletonAvatarProps } from './Skeleton';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps, EmptyStateAction } from './EmptyState';

// Navigation
export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs';

export { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider } from './Dropdown';
export type { DropdownProps, DropdownMenuAlign, DropdownMenuProps, DropdownItemProps, DropdownDividerProps } from './Dropdown';

// Overlays
export { Tooltip } from './Tooltip';
export type { TooltipProps, TooltipPosition } from './Tooltip';

// Form Components
export { Switch } from './Switch';
export type { SwitchProps, SwitchSize } from './Switch';

export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

export { FileUpload } from './FileUpload';
export type { FileUploadProps, FileUploadAccept } from './FileUpload';

// Layout Components
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from './Accordion';

export { Stepper, StepperContent } from './Stepper';
export type { StepperProps, StepperStep, StepperVariant, StepperOrientation, StepperContentProps } from './Stepper';

// Data Display
export { StatCard, StatCardGrid } from './StatCard';
export type { StatCardProps, StatCardVariant, StatCardTrend, StatCardGridProps } from './StatCard';

export { ProgressRing, ProgressBar } from './ProgressRing';
export type { ProgressRingProps, ProgressRingSize, ProgressRingVariant, ProgressBarProps } from './ProgressRing';

// Media
export { VideoPlayer } from './VideoPlayer';
export type { VideoPlayerProps } from './VideoPlayer';

// Loading & Progress
export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner';

export { CountdownTimer } from './CountdownTimer';
export type { CountdownTimerProps } from './CountdownTimer';

// Charts
export { LineChart } from './LineChart';
export type { LineChartProps, LineChartDataPoint, LineChartLine } from './LineChart';

// Responsive Layout
export { ResponsiveTable, StackableTable, StackableRow, MobileCard, MobileCardRow } from './ResponsiveTable';
export type { ResponsiveTableProps, StackableTableProps, StackableRowProps, MobileCardProps, MobileCardRowProps } from './ResponsiveTable';

// Voice & Media Input
export { VoiceInput } from './VoiceInput';
export type { VoiceInputProps } from './VoiceInput';

// Celebrations
export { CelebrationOverlay } from './CelebrationOverlay';
export type { CelebrationOverlayProps, CelebrationVariant } from './CelebrationOverlay';

// Timeline
export { Timeline, TimelineItem, TimelineGroup } from './Timeline';
export type { TimelineProps, TimelineItemProps, TimelineItemVariant, TimelineGroupProps } from './Timeline';

// Chat & Messaging
export { ChatMessage, ChatInput, ConversationList, ConversationItem } from './ChatMessage';
export type { ChatMessageProps, ChatInputProps, ConversationListProps, ConversationItemProps } from './ChatMessage';

// Achievement Badges
export { BadgeDisplay, BadgeGrid, BadgeRow, RarityLabel } from './BadgeDisplay';
export type { BadgeDisplayProps, BadgeRarity, BadgeGridProps, BadgeRowProps, RarityLabelProps } from './BadgeDisplay';

// Snippets & Templates
export { SnippetPicker } from './SnippetPicker';
export type { SnippetPickerProps, SnippetCategory } from './SnippetPicker';

// Rich Text
export { RichTextEditor } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

// Form Controls
export { Checkbox, CheckboxGroup } from './Checkbox';
export type { CheckboxProps, CheckboxGroupProps } from './Checkbox';

export { RadioGroup, RadioItem, RadioCard } from './RadioGroup';
export type { RadioGroupProps, RadioItemProps, RadioCardProps, RadioGroupOrientation } from './RadioGroup';

export { Slider } from './Slider';
export type { SliderProps } from './Slider';

export { Combobox } from './Combobox';
export type { ComboboxProps, ComboboxOption } from './Combobox';

// Date & Time
export { Calendar } from './Calendar';
export type { CalendarProps, CalendarMode } from './Calendar';

export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

// Navigation
export { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItemProps } from './Breadcrumb';

// Layout
export { Divider } from './Divider';
export type { DividerProps, DividerOrientation, DividerVariant } from './Divider';

export { Drawer, DrawerContent, DrawerFooter } from './Drawer';
export type { DrawerProps, DrawerContentProps, DrawerFooterProps, DrawerPosition, DrawerSize } from './Drawer';

// Overlays
export { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverClose } from './Popover';
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps, PopoverHeaderProps, PopoverBodyProps, PopoverFooterProps, PopoverCloseProps, PopoverAlign, PopoverSide } from './Popover';

export { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';
export type { HoverCardProps, HoverCardTriggerProps, HoverCardContentProps, HoverCardSide, HoverCardAlign } from './HoverCard';

// Command Palette
export { CommandMenu } from './CommandMenu';
export type { CommandMenuProps, CommandItem } from './CommandMenu';

// Collapsible
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from './Collapsible';

// Utilities
export { AspectRatio } from './AspectRatio';
export type { AspectRatioProps } from './AspectRatio';

export { VisuallyHidden } from './VisuallyHidden';
export type { VisuallyHiddenProps } from './VisuallyHidden';

// Toggle
export { Toggle, ToggleGroup, ToggleGroupItem } from './Toggle';
export type { ToggleProps, ToggleSize, ToggleVariant, ToggleGroupProps, ToggleGroupItemProps } from './Toggle';

// OTP Input
export { InputOTP } from './InputOTP';
export type { InputOTPProps, InputOTPSize } from './InputOTP';

// Scroll
export { ScrollArea } from './ScrollArea';
export type { ScrollAreaProps, ScrollAreaOrientation } from './ScrollArea';

// Context Menu
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel } from './ContextMenu';
export type { ContextMenuProps, ContextMenuTriggerProps, ContextMenuContentProps, ContextMenuItemProps, ContextMenuSeparatorProps, ContextMenuLabelProps } from './ContextMenu';

// Resizable Panels
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ResizablePanel';
export type { ResizablePanelGroupProps, ResizablePanelProps, ResizableHandleProps, ResizableDirection } from './ResizablePanel';

// Navigation Menu
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport } from './NavigationMenu';
export type { NavigationMenuProps, NavigationMenuListProps, NavigationMenuItemProps, NavigationMenuTriggerProps, NavigationMenuContentProps, NavigationMenuLinkProps, NavigationMenuIndicatorProps, NavigationMenuViewportProps } from './NavigationMenu';

// Number Input
export { NumberInput } from './NumberInput';
export type { NumberInputProps, NumberInputSize } from './NumberInput';

// Color Picker
export { ColorPicker } from './ColorPicker';
export type { ColorPickerProps } from './ColorPicker';

// Rating
export { Rating } from './Rating';
export type { RatingProps, RatingIcon, RatingSize } from './Rating';

// Keyboard
export { Kbd, KbdShortcut } from './Kbd';
export type { KbdProps, KbdShortcutProps, KbdSize } from './Kbd';

// Copy Button
export { CopyButton } from './CopyButton';
export type { CopyButtonProps, CopyButtonSize, CopyButtonVariant } from './CopyButton';

// Password Input
export { PasswordInput } from './PasswordInput';
export type { PasswordInputProps } from './PasswordInput';

// Time Picker
export { TimePicker } from './TimePicker';
export type { TimePickerProps, TimePickerFormat } from './TimePicker';

// Tag Input
export { TagInput } from './TagInput';
export type { TagInputProps } from './TagInput';

// Signature Pad
export { SignaturePad } from './SignaturePad';
export type { SignaturePadProps } from './SignaturePad';

// Audio Recorder
export { AudioRecorder } from './AudioRecorder';
export type { AudioRecorderProps } from './AudioRecorder';

// Image Gallery
export { ImageGallery, Lightbox } from './ImageGallery';
export type { ImageGalleryProps, GalleryImage, LightboxProps } from './ImageGallery';

// Charts
export { BarChart } from './BarChart';
export type { BarChartProps, BarChartDataPoint } from './BarChart';

export { PieChart } from './PieChart';
export type { PieChartProps, PieChartDataPoint } from './PieChart';

// Notification Bell
export { NotificationBell } from './NotificationBell';
export type { NotificationBellProps, Notification } from './NotificationBell';

// Callout
export { Callout } from './Callout';
export type { CalloutProps, CalloutVariant } from './Callout';

// Sidebar
export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarItem, SidebarTrigger, useSidebar } from './Sidebar';
export type { SidebarProps, SidebarHeaderProps, SidebarContentProps, SidebarFooterProps, SidebarGroupProps, SidebarItemProps, SidebarTriggerProps } from './Sidebar';

// Tree View
export { TreeView, TreeItem } from './TreeView';
export type { TreeViewProps, TreeItemProps } from './TreeView';

// Phone Input
export { PhoneInput, COUNTRIES } from './PhoneInput';
export type { PhoneInputProps, Country } from './PhoneInput';

// Carousel
export { Carousel, CarouselSlide } from './Carousel';
export type { CarouselProps, CarouselSlideProps } from './Carousel';

// Virtual List
export { VirtualList } from './VirtualList';
export type { VirtualListProps } from './VirtualList';

// Image Cropper
export { ImageCropper } from './ImageCropper';
export type { ImageCropperProps, CropArea } from './ImageCropper';

// Waveform Visualizer
export { WaveformVisualizer } from './WaveformVisualizer';
export type { WaveformVisualizerProps } from './WaveformVisualizer';

// Week Schedule
export { WeekSchedule } from './WeekSchedule';
export type { WeekScheduleProps, ScheduleEvent } from './WeekSchedule';

// Sortable List
export { SortableList, SortableHandle } from './SortableList';
export type { SortableListProps, SortableHandleProps } from './SortableList';

// Infinite Scroll
export { InfiniteScroll } from './InfiniteScroll';
export type { InfiniteScrollProps } from './InfiniteScroll';

// Theme Provider
export { ThemeProvider, useTheme, ThemeToggle, ThemeSelect } from './ThemeProvider';
export type { ThemeProviderProps, ThemeContextType, Theme, ResolvedTheme, ThemeToggleProps, ThemeSelectProps } from './ThemeProvider';

// Error Boundary
export { ErrorBoundary, DefaultErrorFallback, withErrorBoundary, useErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps, ErrorBoundaryState, ErrorFallbackProps, DefaultErrorFallbackProps } from './ErrorBoundary';

// Animations
export { Animate, FadeIn, SlideIn, ScaleIn, Stagger } from './Animate';
export type { AnimateProps, AnimationPreset, FadeInProps, SlideInProps, SlideDirection, ScaleInProps, StaggerProps } from './Animate';

// Maps
export { USMap } from './USMap';
export type { USMapProps, USMapDataPoint } from './USMap';

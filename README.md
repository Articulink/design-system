# @articulink/design-system

Centralized design system for all Articulink applications. **This is the single source of truth for shared UI components.**

## Important Rules

1. **Always import shared components from this package** — never create local duplicates of Button, Input, Modal, Card, or Toast
2. **Use semantic color tokens** for status indicators (success-bg, warning-bg, error-bg, info-bg)
3. **Add new shared components here** when they're needed across multiple apps
4. **Edit tokens in `src/tokens/index.css`** to change colors/styles globally

## Installation

This package is part of the monorepo workspaces. All apps (portal, app, admin, website) automatically have access via:

```json
{
  "dependencies": {
    "@articulink/design-system": "workspace:*"
  }
}
```

## Usage

### 1. Import CSS Tokens

In your app's `globals.css`:

```css
@import "tailwindcss";
@import "@articulink/design-system/src/tokens/index.css";
```

### 2. Use React Components

```tsx
import { Button, Input, Card, Modal } from '@articulink/design-system';

function MyComponent() {
  return (
    <Card depth hover>
      <Input label="Email" placeholder="you@example.com" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### 3. Use Tailwind Color Classes

All brand colors are available as Tailwind utilities:

```tsx
<div className="bg-tide text-white">Primary blue</div>
<div className="bg-sunshine text-abyss">Accent yellow</div>
<div className="bg-breeze border-mist">Light background</div>
```

## Design Tokens

### Core Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `tide` | `#037DE4` | Primary actions, links, focus states |
| `surf` | `#1E96FC` | Secondary blue, hover states |
| `abyss` | `#012A4D` | Text, dark elements |
| `cloud` | `#FFFFFF` | Backgrounds |
| `sunshine` | `#FCDE1E` | Accent, highlights, CTAs |

### Blue Scale (Ocean Journey)

| Token | Hex | Usage |
|-------|-----|-------|
| `breeze` | `#F7FBFF` | Lightest background |
| `mist` | `#E4F2FE` | Borders, dividers |
| `bubble` | `#AFD9FD` | Hover borders |
| `lagoon` | `#013F74` | Secondary text |
| `depths` | `#01355E` | Dark accents |
| `trench` | `#001C33` | Darkest |

### UI Feedback

| Token | Hex | Usage |
|-------|-----|-------|
| `info` | `#3B82F6` | Information |
| `success` | `#22C55E` | Success states |
| `warning` | `#F59E0B` | Warnings |
| `error` | `#EF4444` | Errors |

### Status Badges

Use these for consistent status indicators:

```tsx
// Success badge
<span className="bg-success-bg text-success-text px-2 py-1 rounded-full text-sm">
  Completed
</span>

// Warning badge  
<span className="bg-warning-bg text-warning-text px-2 py-1 rounded-full text-sm">
  Pending
</span>

// Error badge
<span className="bg-error-bg text-error-text px-2 py-1 rounded-full text-sm">
  Failed
</span>
```

| Background | Text | Usage |
|------------|------|-------|
| `success-bg` | `success-text` | Completed, active, approved |
| `warning-bg` | `warning-text` | Pending, in progress |
| `error-bg` | `error-text` | Failed, rejected, cancelled |
| `info-bg` | `info-text` | Informational, neutral |

### Deep/Pressed States

| Token | Hex | Usage |
|-------|-----|-------|
| `tide-deep` | `#0369c1` | Primary button pressed |
| `sunshine-deep` | `#d4a90e` | Accent button pressed |

## Components

### Button

Duolingo-style 3D press effect button.

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent (Yellow)</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// As links (renders as Next.js Link or external anchor)
<Button href="/dashboard">Go to Dashboard</Button>
<Button href="https://example.com" external>External Link</Button>
```

### Input

Accessible form input with validation states.

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" required />
<Input error="This field is required" />
<Input hint="We'll never share your email" />
```

### Card

Container with optional depth shadow and hover effects.

```tsx
<Card>Default card</Card>
<Card depth={false}>No shadow</Card>
<Card hover>Lift on hover</Card>
<Card padding="lg">Extra padding</Card>
```

### Modal

Accessible dialog with focus trapping and keyboard navigation.

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
>
  Modal content here
</Modal>
```

### Toast

Toast notification system with context-based state management.

```tsx
// 1. Wrap your app with ToastProvider (in layout.tsx)
import { ToastProvider } from '@articulink/design-system';

<ToastProvider>
  <App />
</ToastProvider>

// 2. Use in components
import { useToast, useSuccessToast, useErrorToast } from '@articulink/design-system';

function MyComponent() {
  const { addToast } = useToast();
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  return (
    <>
      <button onClick={() => addToast('info', 'Hello!')}>Info</button>
      <button onClick={() => showSuccess('Saved!')}>Success</button>
      <button onClick={() => showError('Failed!')}>Error</button>
    </>
  );
}
```

### Textarea

Multiline text input consistent with Input component styling.

```tsx
<Textarea label="Description" placeholder="Enter description..." />
<Textarea label="Notes" rows={6} />
<Textarea label="Bio" error="This field is required" />
<Textarea label="Comments" hint="Max 500 characters" />
```

### Select

Styled dropdown consistent with Input component.

```tsx
<Select label="Country">
  <option value="">Select country...</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</Select>

<Select label="Status" error="Please select a status" required>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</Select>
```

### Badge

Status badges with semantic colors.

```tsx
// Variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Cancelled</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="neutral">Draft</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With dot indicator
<Badge variant="success" dot>Online</Badge>
```

### Avatar

User avatars with image support and initials fallback.

```tsx
// With image
<Avatar src="/user.jpg" alt="John Doe" />

// With initials fallback
<Avatar name="John Doe" />

// Sizes
<Avatar name="John Doe" size="xs" />
<Avatar name="John Doe" size="sm" />
<Avatar name="John Doe" size="md" />
<Avatar name="John Doe" size="lg" />
<Avatar name="John Doe" size="xl" />
```

### Alert

Inline feedback banners with semantic variants.

```tsx
<Alert variant="success" title="Saved!" />
<Alert variant="error" title="Error" description="Something went wrong." />
<Alert variant="warning" title="Warning" description="This action cannot be undone." />
<Alert variant="info" title="Info" description="Check your email for confirmation." />

// Dismissible
<Alert
  variant="success"
  title="Profile updated"
  dismissible
  onDismiss={() => console.log('dismissed')}
/>
```

### Skeleton

Loading placeholders for content.

```tsx
// Basic skeleton
<Skeleton className="h-4 w-32" />
<Skeleton variant="circular" className="w-10 h-10" />
<Skeleton variant="rectangular" className="h-40 w-full" />

// Animation types
<Skeleton animation="pulse" />
<Skeleton animation="wave" />
<Skeleton animation="none" />

// Preset helpers
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonAvatar size="lg" />
```

### EmptyState

Empty state displays for zero-data scenarios.

```tsx
<EmptyState
  icon={<CalendarIcon />}
  title="No appointments"
  description="You don't have any upcoming appointments."
  action={{
    label: "Book appointment",
    onClick: () => handleBook()
  }}
/>

// With link action
<EmptyState
  title="No messages"
  description="Start a conversation"
  action={{
    label: "Send message",
    href: "/messages/new"
  }}
/>
```

### Pagination

Page navigation with ellipsis support.

```tsx
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>

// With custom sibling count
<Pagination
  currentPage={5}
  totalPages={20}
  siblingCount={2}
  onPageChange={handlePageChange}
/>
```

### Tabs

Tab navigation with keyboard support.

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content...</TabsContent>
  <TabsContent value="analytics">Analytics content...</TabsContent>
  <TabsContent value="settings">Settings content...</TabsContent>
</Tabs>

// Controlled
<Tabs value={activeTab} onValueChange={setActiveTab}>
  ...
</Tabs>
```

### ConfirmDialog

Confirmation dialog for important actions.

```tsx
<ConfirmDialog
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  title="Delete appointment?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  variant="danger"
  onConfirm={() => handleDelete()}
/>

// Primary variant (non-destructive)
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Save changes?"
  description="Your changes will be saved."
  confirmLabel="Save"
  variant="primary"
  onConfirm={() => handleSave()}
/>

// With loading state
<ConfirmDialog
  isOpen={isOpen}
  onClose={close}
  title="Processing..."
  onConfirm={handleConfirm}
  loading={isProcessing}
/>
```

### Tooltip

Hover tooltips for additional context.

```tsx
<Tooltip content="More information">
  <button>Hover me</button>
</Tooltip>

// Positions
<Tooltip content="Top tooltip" position="top">...</Tooltip>
<Tooltip content="Bottom tooltip" position="bottom">...</Tooltip>
<Tooltip content="Left tooltip" position="left">...</Tooltip>
<Tooltip content="Right tooltip" position="right">...</Tooltip>

// Custom delay
<Tooltip content="Delayed tooltip" delay={500}>
  <span>Hover with delay</span>
</Tooltip>
```

### Dropdown

Dropdown menus with keyboard navigation.

```tsx
<Dropdown>
  <DropdownTrigger>
    <button>Options</button>
  </DropdownTrigger>
  <DropdownMenu>
    <DropdownItem onClick={() => handleEdit()}>Edit</DropdownItem>
    <DropdownItem onClick={() => handleDuplicate()}>Duplicate</DropdownItem>
    <DropdownDivider />
    <DropdownItem destructive onClick={() => handleDelete()}>Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>

// With icons
<DropdownItem icon={<EditIcon />}>Edit</DropdownItem>

// Alignment
<DropdownMenu align="end">...</DropdownMenu>

// Disabled item
<DropdownItem disabled>Archived</DropdownItem>
```

### DashboardCard

Widget cards for dashboard displays with gradient headers.

```tsx
<DashboardCard
  title="Practice Streak"
  subtitle="Keep it up!"
  icon={<FireIcon />}
  gradient="success"
  action={{ label: "View all", onClick: () => {} }}
>
  <p className="text-2xl font-bold">7 days</p>
</DashboardCard>

// Gradient variants: primary, success, warning, info, purple, neutral
<DashboardCard gradient="warning" title="Pending Reviews" icon={<ClockIcon />}>
  <p>3 items need attention</p>
</DashboardCard>

// Loading state
<DashboardCard title="Stats" loading>...</DashboardCard>
```

### StatusIndicator

Unified status indicators for connection states, sync status, etc.

```tsx
// Full indicator with label
<StatusIndicator status="online" />
<StatusIndicator status="syncing" label="Syncing changes..." />
<StatusIndicator status="error" label="Connection lost" size="lg" />

// Status options: online, offline, syncing, pending, success, error, warning, idle
<StatusIndicator status="pending" />

// Dot-only (no label)
<StatusDot status="online" />
<StatusDot status="error" pulse />
```

### Switch

Toggle switch for boolean values.

```tsx
// Basic usage
<Switch checked={enabled} onChange={setEnabled} />

// With label
<Switch
  checked={notifications}
  onChange={setNotifications}
  label="Enable notifications"
/>

// Sizes
<Switch size="sm" checked={value} onChange={setValue} />
<Switch size="md" checked={value} onChange={setValue} />
<Switch size="lg" checked={value} onChange={setValue} />

// Disabled
<Switch checked={value} onChange={setValue} disabled />

// With description
<Switch
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark mode"
  description="Use dark theme throughout the app"
/>
```

### SearchInput

Search input with icon, clear button, and optional debounce.

```tsx
// Basic usage
<SearchInput
  value={query}
  onChange={setQuery}
  placeholder="Search..."
/>

// With debounced search callback
<SearchInput
  value={search}
  onChange={setSearch}
  onSearch={handleSearch}
  debounce={300}
/>

// Sizes
<SearchInput size="sm" value={query} onChange={setQuery} />
<SearchInput size="md" value={query} onChange={setQuery} />
<SearchInput size="lg" value={query} onChange={setQuery} />

// Loading state
<SearchInput value={query} onChange={setQuery} loading />
```

### FileUpload

Drag-and-drop file upload with preview and progress.

```tsx
// Image upload
<FileUpload
  accept="image/*"
  onFileSelect={(file) => handleUpload(file)}
/>

// Video upload with max size
<FileUpload
  accept="video/*"
  maxSize={100 * 1024 * 1024}
  onFileSelect={handleFile}
/>

// With upload progress
<FileUpload
  accept="image/*"
  onFileSelect={handleFile}
  progress={uploadProgress}
/>

// With preview
<FileUpload
  accept="image/*"
  onFileSelect={handleFile}
  preview={imageUrl}
/>

// Custom labels
<FileUpload
  label="Upload Avatar"
  hint="PNG or JPG up to 5MB"
  onFileSelect={handleFile}
/>
```

### Accordion

Expandable content panels.

```tsx
// Basic usage
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1...</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2...</AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple open at once
<Accordion type="multiple">...</Accordion>

// Default expanded
<Accordion defaultValue="item-1">...</Accordion>

// Controlled
<Accordion value={openItem} onValueChange={setOpenItem}>
  ...
</Accordion>
```

### Stepper

Step indicator for multi-step wizards.

```tsx
// Simple stepper with string labels
<Stepper
  steps={['Account', 'Profile', 'Review']}
  currentStep={2}
/>

// Detailed stepper with descriptions
<Stepper
  steps={[
    { label: 'Details', description: 'Enter your info' },
    { label: 'Payment', description: 'Add payment method' },
    { label: 'Confirm', description: 'Review and submit' }
  ]}
  currentStep={2}
  variant="detailed"
/>

// Vertical orientation
<Stepper
  steps={['Step 1', 'Step 2', 'Step 3']}
  currentStep={2}
  orientation="vertical"
/>

// Clickable steps
<Stepper
  steps={['Details', 'Review', 'Submit']}
  currentStep={1}
  onStepClick={(step) => setCurrentStep(step)}
/>

// With StepperContent wrapper
<Stepper steps={steps} currentStep={current} />
<StepperContent>
  {current === 1 && <Step1Form />}
  {current === 2 && <Step2Form />}
</StepperContent>
```

### StatCard

Metric display cards with optional trend indicators.

```tsx
// Basic stat
<StatCard label="Total Users" value={1234} />

// With trend
<StatCard
  label="Revenue"
  value="$12,450"
  trend={{ value: 12, direction: 'up', label: 'vs last month' }}
/>

// With icon and variant
<StatCard
  label="Sessions"
  value={89}
  icon={<CalendarIcon />}
  variant="success"
/>

// Loading state
<StatCard label="Loading..." value={0} loading />

// Grid layout
<StatCardGrid columns={4}>
  <StatCard label="Users" value={1234} />
  <StatCard label="Revenue" value="$5,678" />
  <StatCard label="Orders" value={89} />
  <StatCard label="Conversion" value="2.4%" />
</StatCardGrid>
```

### ProgressRing

Circular progress indicator.

```tsx
// Basic usage
<ProgressRing value={75} />

// Sizes
<ProgressRing value={50} size="sm" />
<ProgressRing value={50} size="md" />
<ProgressRing value={50} size="lg" />
<ProgressRing value={50} size="xl" />

// Variants
<ProgressRing value={100} variant="success" />
<ProgressRing value={50} variant="warning" />
<ProgressRing value={25} variant="error" />

// With label
<ProgressRing value={75} label="Complete" />

// Hide value
<ProgressRing value={50} showValue={false} />
```

### ProgressBar

Linear progress indicator.

```tsx
// Basic usage
<ProgressBar value={60} />

// With label and value
<ProgressBar value={75} label="Upload progress" showValue />

// Sizes
<ProgressBar value={50} size="sm" />
<ProgressBar value={50} size="md" />
<ProgressBar value={50} size="lg" />

// Variants
<ProgressBar value={100} variant="success" />
<ProgressBar value={50} variant="warning" />
```

### VideoPlayer

Custom HTML5 video player with controls.

```tsx
// Basic usage
<VideoPlayer src="/video.mp4" />

// With poster and autoplay
<VideoPlayer
  src={videoUrl}
  poster="/thumbnail.jpg"
  autoPlay
  muted
/>

// With callbacks
<VideoPlayer
  src="/video.mp4"
  onTimeUpdate={(time, duration) => console.log(time, duration)}
  onEnded={() => console.log('Video ended')}
  onVideoError={(error) => console.log(error)}
/>

// Looping video
<VideoPlayer src="/video.mp4" loop muted />
```

**Keyboard shortcuts:**
- `Space` / `K` - Play/Pause
- `Arrow Left/Right` - Skip -10s/+10s
- `M` - Mute/Unmute
- `F` - Fullscreen

### MediaCard

Cards for displaying media content with thumbnails.

```tsx
<MediaCard
  thumbnail="/video-thumb.jpg"
  title="Session Recording"
  type="video"
  duration={125}
  metadata="March 15, 2026"
  onClick={() => playVideo()}
/>

// Types: video, audio, image, document
<MediaCard type="audio" title="Voice Sample" duration={45} />

// With status
<MediaCard title="Processing..." status="processing" />
<MediaCard title="Upload failed" status="error" />

// With delete button
<MediaCard
  title="Recording"
  onDelete={() => handleDelete()}
/>

// Custom badge
<MediaCard
  title="New Recording"
  badge={<Badge variant="success" size="sm">New</Badge>}
/>
```

### FormField

Wrapper for consistent form field styling.

```tsx
// Wrap custom inputs
<FormField label="Custom Input" error={errors.field} required>
  <input type="text" className="..." />
</FormField>

// With hint text
<FormField label="Bio" hint="Max 500 characters">
  <textarea />
</FormField>

// FormSection for grouping related fields
<FormSection title="Contact Information" description="How can we reach you?">
  <Input label="Email" />
  <Input label="Phone" />
</FormSection>

// FormActions for submit/cancel buttons
<FormActions align="right">
  <Button variant="ghost">Cancel</Button>
  <Button type="submit">Save</Button>
</FormActions>
```

### Spinner

Loading spinner with customizable size and color.

```tsx
// Basic usage
<Spinner />

// Sizes
<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Variants
<Spinner variant="default" />
<Spinner variant="primary" />
<Spinner variant="light" />  // For dark backgrounds
<Spinner variant="dark" />

// With label for accessibility
<Spinner label="Loading content..." />
```

### CountdownTimer

Countdown timer with visual states for upcoming, now, and past.

```tsx
// Basic usage
<CountdownTimer targetTime={sessionStartTime} />

// With callback
<CountdownTimer
  targetTime={date}
  onTimeReached={() => alert('Time to start!')}
/>

// Custom thresholds
<CountdownTimer
  targetTime={date}
  urgentThreshold={5}  // Minutes before showing urgent state
  pastThreshold={10}   // Minutes past before showing "past" state
/>

// Sizes
<CountdownTimer size="sm" targetTime={date} />
<CountdownTimer size="md" targetTime={date} />
<CountdownTimer size="lg" targetTime={date} />

// Hide seconds
<CountdownTimer targetTime={date} showSeconds={false} />
```

### LineChart

Simple SVG-based line chart for time series data.

```tsx
// Basic usage
<LineChart
  data={[
    { x: 'Jan', y: 50 },
    { x: 'Feb', y: 65 },
    { x: 'Mar', y: 80 },
  ]}
/>

// With title and labels
<LineChart
  data={data}
  title="Progress Over Time"
  subtitle="Last 30 days"
  xLabel="Date"
  yLabel="Score"
/>

// With reference lines
<LineChart
  data={data}
  referenceLines={[
    { value: 80, label: 'Target', color: 'success', dashed: true },
    { value: 40, label: 'Baseline', color: 'warning', dashed: true },
  ]}
/>

// Custom formatting
<LineChart
  data={data}
  formatX={(val) => format(val, 'MMM d')}
  formatY={(val) => `${val}%`}
/>
```

### ResponsiveTable

Mobile-responsive table components.

```tsx
// Scrollable table wrapper
<ResponsiveTable>
  <table>...</table>
</ResponsiveTable>

// Stackable table (switches to cards on mobile)
<StackableTable headers={['Name', 'Email', 'Status']}>
  {data.map(item => (
    <StackableRow
      key={item.id}
      mobileCard={
        <MobileCard>
          <MobileCardRow label="Name">{item.name}</MobileCardRow>
          <MobileCardRow label="Email">{item.email}</MobileCardRow>
        </MobileCard>
      }
    >
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.status}</td>
    </StackableRow>
  ))}
</StackableTable>
```

### VoiceInput

Voice-to-text input button using Web Speech API.

```tsx
// Basic usage
<VoiceInput
  onTranscript={(text, isFinal) => {
    if (isFinal) setText(prev => prev + text);
  }}
/>

// With listening change callback
<VoiceInput
  onTranscript={handleTranscript}
  onListeningChange={(listening) => setIsRecording(listening)}
/>

// Sizes
<VoiceInput size="sm" onTranscript={handleTranscript} />
<VoiceInput size="md" onTranscript={handleTranscript} />
<VoiceInput size="lg" onTranscript={handleTranscript} />

// Without preview
<VoiceInput showPreview={false} onTranscript={handleTranscript} />
```

### CelebrationOverlay

Confetti and celebration animation overlay.

```tsx
// Basic usage
<CelebrationOverlay
  isOpen={showCelebration}
  onClose={() => setShowCelebration(false)}
  title="Great Job!"
  message="You completed the task!"
/>

// Variants
<CelebrationOverlay variant="success" ... />
<CelebrationOverlay variant="achievement" ... />
<CelebrationOverlay variant="milestone" ... />
<CelebrationOverlay variant="streak" ... />

// With custom icon and action
<CelebrationOverlay
  isOpen={show}
  onClose={handleClose}
  title="Level Up!"
  subtitle="You reached Level 5"
  icon={<TrophyIcon />}
  actionLabel="Keep Going"
  onAction={() => navigateToNext()}
/>

// Custom auto-close delay (or disable)
<CelebrationOverlay autoCloseDelay={8000} ... />
<CelebrationOverlay autoCloseDelay={0} ... />  // Never auto-close
```

### Timeline

Vertical timeline for displaying chronological events.

```tsx
// Basic usage
<Timeline>
  <TimelineItem
    date="March 15"
    title="Session completed"
    variant="success"
  />
  <TimelineItem
    date="March 10"
    title="Goal updated"
    variant="info"
  />
</Timeline>

// With groups
<Timeline>
  <TimelineGroup label="March 2026">
    <TimelineItem title="Event 1" variant="success" />
    <TimelineItem title="Event 2" variant="info" />
  </TimelineGroup>
  <TimelineGroup label="February 2026">
    <TimelineItem title="Event 3" />
  </TimelineGroup>
</Timeline>

// Clickable items
<TimelineItem
  title="View details"
  onClick={() => openDetails(id)}
  isSelected={selectedId === id}
/>

// With icon
<TimelineItem
  title="Recording"
  icon={<PlayIcon />}
  variant="milestone"
/>
```

### ChatMessage

Chat UI components for messaging interfaces.

```tsx
// Message bubble
<ChatMessage
  content="Hello! How can I help?"
  timestamp="2:30 PM"
  senderName="Dr. Smith"
/>

// Own message
<ChatMessage
  content="Thanks for the update!"
  timestamp="2:32 PM"
  isOwn
  status="read"
/>

// Chat input
<ChatInput
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  placeholder="Type a message..."
  sending={isSending}
/>

// Conversation list
<ConversationList>
  <ConversationItem
    name="Dr. Smith"
    avatar={<Avatar name="Dr. Smith" />}
    lastMessage="See you tomorrow!"
    timestamp="2:30 PM"
    unreadCount={2}
    isOnline
    onClick={() => selectConversation(id)}
  />
</ConversationList>
```

### BadgeDisplay

Achievement badge display with rarity levels.

```tsx
// Basic badge
<BadgeDisplay
  icon="🏆"
  name="First Steps"
  description="Complete your first session"
  rarity="common"
/>

// With details
<BadgeDisplay
  icon="⭐"
  name="Streak Master"
  rarity="legendary"
  showDetails
  earnedAt="March 15, 2026"
/>

// Locked badge with progress
<BadgeDisplay
  icon="🎯"
  name="Perfect Score"
  locked
  progress={75}
  showDetails
/>

// Badge grid
<BadgeGrid columns={5}>
  {badges.map(badge => <BadgeDisplay key={badge.id} {...badge} />)}
</BadgeGrid>

// Compact badge row
<BadgeRow maxDisplay={8} totalCount={badges.length}>
  {badges.map(badge => <BadgeDisplay key={badge.id} {...badge} size="sm" />)}
</BadgeRow>

// Rarity label
<RarityLabel rarity="epic" />
```

### SnippetPicker

Collapsible snippet/phrase picker with categories.

```tsx
// Basic usage
<SnippetPicker
  categories={[
    { key: 'greeting', label: 'Greetings', snippets: ['Hello!', 'Hi there'] },
    { key: 'closing', label: 'Closings', snippets: ['Best regards', 'Thanks'] },
  ]}
  onInsert={(snippet, category) => insertText(snippet)}
/>

// With localStorage persistence
<SnippetPicker
  categories={categories}
  onInsert={handleInsert}
  storageKey="my_custom_snippets"
  allowCustom
/>

// Customization
<SnippetPicker
  categories={categories}
  onInsert={handleInsert}
  title="Quick Phrases"
  defaultExpanded
  maxHeight={300}
/>
```

### RichTextEditor

WYSIWYG rich text editor using TipTap.

**Note:** Requires TipTap packages as peer dependencies:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder
```

```tsx
// Basic usage
<RichTextEditor
  content={html}
  onChange={setHtml}
  placeholder="Start writing..."
/>

// With image upload
<RichTextEditor
  content={html}
  onChange={setHtml}
  onImageUpload={async (file) => {
    const url = await uploadToS3(file);
    return url;
  }}
/>

// Custom toolbar
<RichTextEditor
  content={html}
  onChange={setHtml}
  toolbar={['bold', 'italic', 'heading', 'list', 'link']}
/>

// Read-only mode
<RichTextEditor
  content={html}
  onChange={() => {}}
  readOnly
/>
```

### Checkbox

Checkbox input with label and indeterminate state support.

```tsx
// Basic usage
<Checkbox label="Accept terms" checked={accepted} onChange={setAccepted} />

// With description
<Checkbox
  label="Email notifications"
  description="Receive updates about your appointments"
  checked={enabled}
  onChange={setEnabled}
/>

// Indeterminate state
<Checkbox label="Select all" indeterminate={someSelected && !allSelected} />

// Sizes
<Checkbox label="Small" size="sm" />
<Checkbox label="Medium" size="md" />
<Checkbox label="Large" size="lg" />

// CheckboxGroup
<CheckboxGroup value={selected} onChange={setSelected} label="Select options">
  <Checkbox value="a" label="Option A" />
  <Checkbox value="b" label="Option B" />
  <Checkbox value="c" label="Option C" />
</CheckboxGroup>

// Horizontal orientation
<CheckboxGroup orientation="horizontal" value={selected} onChange={setSelected}>
  ...
</CheckboxGroup>
```

### RadioGroup

Radio button group for single selection.

```tsx
// Basic usage
<RadioGroup value={selected} onChange={setSelected} label="Choose one">
  <RadioItem value="a" label="Option A" />
  <RadioItem value="b" label="Option B" />
  <RadioItem value="c" label="Option C" />
</RadioGroup>

// With descriptions
<RadioGroup value={plan} onChange={setPlan}>
  <RadioItem value="free" label="Free" description="Basic features" />
  <RadioItem value="pro" label="Pro" description="All features" />
</RadioGroup>

// Card-style radio options
<RadioGroup value={plan} onChange={setPlan}>
  <RadioCard
    value="basic"
    label="Basic Plan"
    description="$9/month"
    icon={<StarIcon />}
  />
  <RadioCard
    value="pro"
    label="Pro Plan"
    description="$19/month"
    icon={<RocketIcon />}
  />
</RadioGroup>

// Horizontal orientation
<RadioGroup orientation="horizontal" value={selected} onChange={setSelected}>
  ...
</RadioGroup>
```

### Slider

Range slider for selecting numeric values.

```tsx
// Single value
<Slider value={50} onChange={setValue} />

// Range slider
<Slider value={[20, 80]} onChange={setRange} />

// With min/max/step
<Slider value={volume} onChange={setVolume} min={0} max={100} step={5} />

// With label and value display
<Slider
  value={brightness}
  onChange={setBrightness}
  label="Brightness"
  showValue
/>

// With ticks
<Slider
  value={rating}
  onChange={setRating}
  min={1}
  max={5}
  showTicks
  tickCount={5}
/>

// Sizes
<Slider size="sm" value={val} onChange={setVal} />
<Slider size="md" value={val} onChange={setVal} />
<Slider size="lg" value={val} onChange={setVal} />

// Custom value formatting
<Slider
  value={price}
  onChange={setPrice}
  formatValue={(v) => `$${v}`}
  showValue
/>
```

### Combobox

Searchable select/autocomplete input.

```tsx
// Basic usage
<Combobox
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Select option..."
/>

// With descriptions and icons
<Combobox
  options={[
    { value: 'us', label: 'United States', description: 'North America', icon: <FlagIcon /> },
    { value: 'uk', label: 'United Kingdom', description: 'Europe', icon: <FlagIcon /> },
  ]}
  value={country}
  onChange={setCountry}
/>

// Async search
<Combobox
  options={searchResults}
  value={selected}
  onChange={setSelected}
  onSearch={handleSearch}
  loading={isSearching}
/>

// Creatable (allow new values)
<Combobox
  options={tags}
  value={selectedTag}
  onChange={setSelectedTag}
  creatable
  onCreate={(value) => addNewTag(value)}
/>

// Clearable
<Combobox
  options={options}
  value={selected}
  onChange={setSelected}
  clearable
/>
```

### Calendar

Month calendar view for date selection.

```tsx
// Single date selection
<Calendar value={selectedDate} onChange={setSelectedDate} />

// Date range selection
<Calendar value={dateRange} onChange={setDateRange} mode="range" />

// Multiple date selection
<Calendar value={selectedDates} onChange={setSelectedDates} mode="multiple" />

// With min/max dates
<Calendar
  value={date}
  onChange={setDate}
  minDate={new Date()}
  maxDate={addMonths(new Date(), 3)}
/>

// Disable specific dates
<Calendar
  value={date}
  onChange={setDate}
  disabledDates={holidays}
/>

// Multiple months
<Calendar
  value={range}
  onChange={setRange}
  mode="range"
  numberOfMonths={2}
/>

// Week starts on Monday
<Calendar value={date} onChange={setDate} weekStartsOn={1} />

// Highlighted dates
<Calendar value={date} onChange={setDate} highlightedDates={importantDates} />
```

### DatePicker

Date input with calendar dropdown.

```tsx
// Basic usage
<DatePicker value={date} onChange={setDate} />

// Date range picker
<DatePicker value={range} onChange={setRange} mode="range" />

// With label and error
<DatePicker
  label="Appointment Date"
  value={date}
  onChange={setDate}
  error="Please select a date"
/>

// Custom format
<DatePicker
  value={date}
  onChange={setDate}
  format={(d) => d.toLocaleDateString('en-GB')}
/>

// With min/max dates
<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
  placeholder="Select future date"
/>

// Clearable
<DatePicker value={date} onChange={setDate} clearable />
```

### Drawer

Slide-in panel from screen edge.

```tsx
// Basic usage
<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <DrawerContent title="Settings">
    Drawer content here...
  </DrawerContent>
</Drawer>

// Position variants
<Drawer position="left" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer position="right" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer position="top" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer position="bottom" isOpen={isOpen} onClose={close}>...</Drawer>

// Size variants
<Drawer size="sm" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer size="md" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer size="lg" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer size="xl" isOpen={isOpen} onClose={close}>...</Drawer>
<Drawer size="full" isOpen={isOpen} onClose={close}>...</Drawer>

// With footer
<Drawer isOpen={isOpen} onClose={close}>
  <DrawerContent title="Edit Profile">
    <form>...</form>
  </DrawerContent>
  <DrawerFooter>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button>Save</Button>
  </DrawerFooter>
</Drawer>
```

### Breadcrumb

Navigation breadcrumbs.

```tsx
// Basic usage
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/clients">Clients</BreadcrumbItem>
  <BreadcrumbItem current>John Doe</BreadcrumbItem>
</Breadcrumb>

// With custom separator
<Breadcrumb separator="/">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
</Breadcrumb>

// With icons
<Breadcrumb>
  <BreadcrumbItem href="/" icon={<HomeIcon />}>Home</BreadcrumbItem>
  <BreadcrumbItem href="/settings" icon={<SettingsIcon />}>Settings</BreadcrumbItem>
</Breadcrumb>
```

### Divider

Horizontal or vertical separator line.

```tsx
// Basic horizontal divider
<Divider />

// With label
<Divider label="OR" />

// Vertical divider
<Divider orientation="vertical" />

// Variants
<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />

// Spacing
<Divider spacing="none" />
<Divider spacing="sm" />
<Divider spacing="md" />
<Divider spacing="lg" />
```

### Popover

Floating content panel triggered by click.

```tsx
// Basic usage
<Popover>
  <PopoverTrigger>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    Popover content here
  </PopoverContent>
</Popover>

// With header, body, and footer
<Popover>
  <PopoverTrigger>
    <Button>Settings</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <h3>Settings</h3>
      <PopoverClose />
    </PopoverHeader>
    <PopoverBody>
      Settings content...
    </PopoverBody>
    <PopoverFooter>
      <Button size="sm">Save</Button>
    </PopoverFooter>
  </PopoverContent>
</Popover>

// Positioning
<PopoverContent side="top">...</PopoverContent>
<PopoverContent side="bottom">...</PopoverContent>
<PopoverContent side="left">...</PopoverContent>
<PopoverContent side="right">...</PopoverContent>

// Alignment
<PopoverContent align="start">...</PopoverContent>
<PopoverContent align="center">...</PopoverContent>
<PopoverContent align="end">...</PopoverContent>

// Controlled
<Popover open={isOpen} onOpenChange={setIsOpen}>
  ...
</Popover>
```

### HoverCard

Content preview that appears on hover.

```tsx
// Basic usage
<HoverCard>
  <HoverCardTrigger>
    <a href="/user/123">@username</a>
  </HoverCardTrigger>
  <HoverCardContent>
    <UserPreview userId="123" />
  </HoverCardContent>
</HoverCard>

// Custom delays
<HoverCard openDelay={300} closeDelay={200}>
  ...
</HoverCard>

// Positioning
<HoverCardContent side="top" align="start">
  ...
</HoverCardContent>
```

### CommandMenu

Command palette (Cmd+K) for quick actions and navigation.

```tsx
// Basic usage
<CommandMenu
  open={isOpen}
  onOpenChange={setIsOpen}
  commands={[
    { id: '1', label: 'Go to Dashboard', group: 'Navigation', onSelect: () => navigate('/') },
    { id: '2', label: 'New Client', group: 'Actions', onSelect: () => openModal() },
    { id: '3', label: 'Search...', group: 'Actions', onSelect: () => openSearch() },
  ]}
/>

// With shortcuts and icons
<CommandMenu
  open={isOpen}
  onOpenChange={setIsOpen}
  commands={[
    {
      id: '1',
      label: 'New Document',
      group: 'Actions',
      icon: <PlusIcon />,
      shortcut: ['⌘', 'N'],
      onSelect: () => createDoc()
    },
  ]}
/>

// Custom hotkey
<CommandMenu hotkey="j" open={isOpen} onOpenChange={setIsOpen} commands={commands} />

// Custom placeholder and empty message
<CommandMenu
  placeholder="Search commands..."
  emptyMessage="No commands found"
  open={isOpen}
  onOpenChange={setIsOpen}
  commands={commands}
/>
```

### Collapsible

Animated expand/collapse container.

```tsx
// Basic usage
<Collapsible>
  <CollapsibleTrigger>
    <Button>Toggle</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content here
  </CollapsibleContent>
</Collapsible>

// Default open
<Collapsible defaultOpen>
  ...
</Collapsible>

// Controlled
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  ...
</Collapsible>

// Disabled
<Collapsible disabled>
  ...
</Collapsible>
```

### Toggle

Button that toggles between on/off states.

```tsx
// Basic usage
<Toggle pressed={isBold} onPressedChange={setIsBold}>
  <BoldIcon />
</Toggle>

// Variants
<Toggle variant="default">...</Toggle>
<Toggle variant="outline">...</Toggle>

// Sizes
<Toggle size="sm">...</Toggle>
<Toggle size="md">...</Toggle>
<Toggle size="lg">...</Toggle>

// ToggleGroup for single selection
<ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
  <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
</ToggleGroup>

// ToggleGroup for multiple selection
<ToggleGroup type="multiple" value={formatting} onValueChange={setFormatting}>
  <ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline"><Underline /></ToggleGroupItem>
</ToggleGroup>
```

### InputOTP

One-time password input with individual character slots.

```tsx
// Basic usage
<InputOTP length={6} value={otp} onChange={setOtp} />

// 4-digit PIN
<InputOTP length={4} value={pin} onChange={setPin} />

// Password mode (hidden)
<InputOTP length={6} value={otp} onChange={setOtp} type="password" />

// With separator
<InputOTP length={6} value={otp} onChange={setOtp} separator={3} />

// On complete callback
<InputOTP
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={(value) => verifyOTP(value)}
/>

// Sizes
<InputOTP size="sm" length={6} value={otp} onChange={setOtp} />
<InputOTP size="md" length={6} value={otp} onChange={setOtp} />
<InputOTP size="lg" length={6} value={otp} onChange={setOtp} />

// Error state
<InputOTP length={6} value={otp} onChange={setOtp} error />
```

### ScrollArea

Custom scrollbar container for consistent cross-browser scrolling.

```tsx
// Basic usage
<ScrollArea className="h-72">
  <div className="p-4">
    Long content here...
  </div>
</ScrollArea>

// Horizontal scrolling
<ScrollArea orientation="horizontal" className="w-full">
  <div className="flex gap-4">
    {items.map(item => <Card key={item.id} />)}
  </div>
</ScrollArea>

// Both directions
<ScrollArea orientation="both" className="h-96 w-full">
  ...
</ScrollArea>

// Thin scrollbar
<ScrollArea scrollbarSize="thin">
  ...
</ScrollArea>

// Hide scrollbar (still scrollable)
<ScrollArea hideScrollbar>
  ...
</ScrollArea>
```

### ContextMenu

Right-click context menu.

```tsx
// Basic usage
<ContextMenu>
  <ContextMenuTrigger>
    <div>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => copy()}>Copy</ContextMenuItem>
    <ContextMenuItem onSelect={() => paste()}>Paste</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem onSelect={() => remove()} destructive>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

// With icons and shortcuts
<ContextMenuContent>
  <ContextMenuItem icon={<CopyIcon />} shortcut="⌘C" onSelect={copy}>
    Copy
  </ContextMenuItem>
  <ContextMenuItem icon={<ClipboardIcon />} shortcut="⌘V" onSelect={paste}>
    Paste
  </ContextMenuItem>
</ContextMenuContent>

// With labels/sections
<ContextMenuContent>
  <ContextMenuLabel>Actions</ContextMenuLabel>
  <ContextMenuItem>Edit</ContextMenuItem>
  <ContextMenuItem>Duplicate</ContextMenuItem>
  <ContextMenuSeparator />
  <ContextMenuLabel>Danger Zone</ContextMenuLabel>
  <ContextMenuItem destructive>Delete</ContextMenuItem>
</ContextMenuContent>
```

### ResizablePanelGroup

Draggable resizable panel layout.

```tsx
// Horizontal layout
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={25} minSize={15}>
    Sidebar content
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={75}>
    Main content
  </ResizablePanel>
</ResizablePanelGroup>

// Vertical layout
<ResizablePanelGroup direction="vertical">
  <ResizablePanel defaultSize={30}>
    Top panel
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={70}>
    Bottom panel
  </ResizablePanel>
</ResizablePanelGroup>

// With constraints
<ResizablePanel defaultSize={25} minSize={10} maxSize={50}>
  ...
</ResizablePanel>

// Collapsible panel
<ResizablePanel
  collapsible
  collapsedSize={0}
  onCollapse={() => console.log('collapsed')}
  onExpand={() => console.log('expanded')}
>
  ...
</ResizablePanel>

// Handle without grip dots
<ResizableHandle withHandle={false} />
```

### NavigationMenu

Site navigation with dropdown menus.

```tsx
// Basic usage
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/product-a">Product A</NavigationMenuLink>
        <NavigationMenuLink href="/product-b">Product B</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// Active link
<NavigationMenuLink href="/current-page" active>
  Current Page
</NavigationMenuLink>
```

### NumberInput

Numeric input with increment/decrement controls.

```tsx
// Basic usage
<NumberInput value={quantity} onChange={setQuantity} />

// With min/max
<NumberInput value={qty} onChange={setQty} min={0} max={100} />

// With step
<NumberInput value={price} onChange={setPrice} step={0.01} precision={2} />

// With prefix/suffix
<NumberInput value={price} onChange={setPrice} prefix="$" />
<NumberInput value={percent} onChange={setPercent} suffix="%" />

// With label
<NumberInput
  label="Quantity"
  value={qty}
  onChange={setQty}
  min={1}
  max={99}
/>

// Mouse wheel support
<NumberInput value={val} onChange={setVal} allowMouseWheel />

// Hide controls
<NumberInput value={val} onChange={setVal} showControls={false} />

// Sizes
<NumberInput size="sm" value={val} onChange={setVal} />
<NumberInput size="md" value={val} onChange={setVal} />
<NumberInput size="lg" value={val} onChange={setVal} />
```

### ColorPicker

Color selection input with presets and custom color support.

```tsx
// Basic usage
<ColorPicker value={color} onChange={setColor} />

// With label
<ColorPicker label="Brand Color" value={color} onChange={setColor} />

// Custom presets
<ColorPicker
  value={color}
  onChange={setColor}
  presets={['#FF0000', '#00FF00', '#0000FF', '#FFFF00']}
/>

// Hide text input
<ColorPicker value={color} onChange={setColor} showInput={false} />
```

### Rating

Star rating input for feedback and reviews.

```tsx
// Basic usage
<Rating value={rating} onChange={setRating} />

// Read-only display
<Rating value={4.5} readonly />

// Different max values
<Rating value={rating} onChange={setRating} max={10} />

// Half-star precision
<Rating value={rating} onChange={setRating} allowHalf />

// Different icons
<Rating value={rating} onChange={setRating} icon="heart" />
<Rating value={rating} onChange={setRating} icon="circle" />

// With value display
<Rating value={rating} onChange={setRating} showValue />

// Sizes
<Rating size="sm" value={rating} onChange={setRating} />
<Rating size="md" value={rating} onChange={setRating} />
<Rating size="lg" value={rating} onChange={setRating} />
```

### Kbd

Keyboard key display for shortcuts and instructions.

```tsx
// Single key
<Kbd>⌘</Kbd>

// Multiple keys
<Kbd>⌘</Kbd><Kbd>K</Kbd>

// Shortcut helper
<KbdShortcut keys={['⌘', 'Shift', 'P']} />

// With separator
<KbdShortcut keys={['Ctrl', 'C']} separator="+" />

// Sizes
<Kbd size="sm">Esc</Kbd>
<Kbd size="md">Enter</Kbd>
<Kbd size="lg">Space</Kbd>
```

### CopyButton

Button that copies text to clipboard with feedback.

```tsx
// Basic usage
<CopyButton text="Hello World" />

// With label
<CopyButton text={code} label="Copy code" showLabel />

// Variants
<CopyButton text={text} variant="default" />
<CopyButton text={text} variant="ghost" />
<CopyButton text={text} variant="outline" />

// Sizes
<CopyButton text={text} size="sm" />
<CopyButton text={text} size="md" />
<CopyButton text={text} size="lg" />

// With callbacks
<CopyButton
  text={text}
  onCopy={() => showToast('Copied!')}
  onCopyError={(err) => showError(err.message)}
/>
```

### PasswordInput

Password input with show/hide toggle and strength indicator.

```tsx
// Basic usage
<PasswordInput value={password} onChange={setPassword} />

// With label
<PasswordInput
  label="Password"
  value={password}
  onChange={setPassword}
/>

// With strength indicator
<PasswordInput
  label="Create Password"
  value={password}
  onChange={setPassword}
  showStrength
/>

// Custom strength labels
<PasswordInput
  value={password}
  onChange={setPassword}
  showStrength
  strengthLabels={['', 'Too weak', 'Could be better', 'Good', 'Excellent']}
/>

// With hint
<PasswordInput
  label="Password"
  value={password}
  onChange={setPassword}
  hint="Must be at least 8 characters"
/>
```

### AspectRatio

Container that maintains a specific aspect ratio.

```tsx
// 16:9 video container
<AspectRatio ratio={16/9}>
  <video src="/video.mp4" className="object-cover w-full h-full" />
</AspectRatio>

// 4:3 image container
<AspectRatio ratio="4:3">
  <img src="/photo.jpg" alt="Photo" className="object-cover w-full h-full" />
</AspectRatio>

// Square
<AspectRatio ratio={1}>
  <Avatar name="John Doe" className="w-full h-full" />
</AspectRatio>
```

### VisuallyHidden

Content that is hidden visually but accessible to screen readers.

```tsx
// Icon button with accessible label
<button>
  <SearchIcon />
  <VisuallyHidden>Search</VisuallyHidden>
</button>

// Page title for screen readers
<VisuallyHidden as="h1">Dashboard Overview</VisuallyHidden>

// Skip link (visible on focus)
<VisuallyHidden as="a" href="#main" focusable>
  Skip to main content
</VisuallyHidden>
```

### TimePicker

Time input with dropdown selection.

```tsx
// Basic usage
<TimePicker value={time} onChange={setTime} />

// 12-hour format (default)
<TimePicker value={time} onChange={setTime} format="12h" />

// 24-hour format
<TimePicker value={time} onChange={setTime} format="24h" />

// With minute step
<TimePicker value={time} onChange={setTime} minuteStep={15} />

// With min/max time
<TimePicker
  value={time}
  onChange={setTime}
  minTime="09:00"
  maxTime="17:00"
/>

// With label and error
<TimePicker
  label="Appointment Time"
  value={time}
  onChange={setTime}
  error="Please select a time"
/>
```

### TagInput

Multi-tag input with autocomplete support.

```tsx
// Basic usage
<TagInput value={tags} onChange={setTags} />

// With suggestions
<TagInput
  value={tags}
  onChange={setTags}
  suggestions={['React', 'TypeScript', 'Next.js']}
/>

// With max tags
<TagInput value={tags} onChange={setTags} maxTags={5} />

// With custom validation
<TagInput
  value={tags}
  onChange={setTags}
  validateTag={(tag) => tag.length >= 2}
/>

// With duplicate prevention
<TagInput value={tags} onChange={setTags} allowDuplicates={false} />
```

### SignaturePad

Canvas-based digital signature component.

```tsx
// Basic usage
<SignaturePad onSave={(dataUrl) => saveSignature(dataUrl)} />

// With clear button text
<SignaturePad
  onSave={handleSave}
  onClear={() => console.log('Cleared')}
/>

// Custom dimensions
<SignaturePad
  width={400}
  height={200}
  onSave={handleSave}
/>

// Custom stroke settings
<SignaturePad
  strokeColor="#037DE4"
  strokeWidth={3}
  onSave={handleSave}
/>
```

### AudioRecorder

Audio recording component with waveform visualization.

```tsx
// Basic usage
<AudioRecorder onRecording={(blob, url) => saveRecording(blob)} />

// With max duration (seconds)
<AudioRecorder
  maxDuration={60}
  onRecording={handleRecording}
/>

// With callbacks
<AudioRecorder
  onRecording={handleRecording}
  onRecordingStart={() => console.log('Started')}
  onRecordingStop={() => console.log('Stopped')}
/>

// With label
<AudioRecorder
  label="Record voice sample"
  onRecording={handleRecording}
/>
```

### ImageGallery

Image gallery with lightbox viewer.

```tsx
// Basic usage
<ImageGallery
  images={[
    { src: '/img1.jpg', alt: 'Image 1' },
    { src: '/img2.jpg', alt: 'Image 2', caption: 'A caption' },
  ]}
/>

// With columns
<ImageGallery images={images} columns={4} />

// With gap
<ImageGallery images={images} gap={16} />

// Standalone Lightbox
<Lightbox
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  images={images}
  initialIndex={0}
/>
```

### WaveformVisualizer

Audio waveform visualization component.

```tsx
// Static waveform from URL
<WaveformVisualizer audioUrl="/audio.mp3" />

// With seek functionality
<WaveformVisualizer
  audioUrl="/audio.mp3"
  showProgress
  onSeek={(progress) => audio.currentTime = progress * audio.duration}
/>

// Live visualization
<WaveformVisualizer
  audioElement={audioRef.current}
  live
/>

// Custom styling
<WaveformVisualizer
  audioUrl="/audio.mp3"
  barColor="#94A3B8"
  barPlayedColor="#037DE4"
  barWidth={3}
  barGap={1}
  height={64}
/>
```

### WeekSchedule

Weekly schedule/calendar view for availability.

```tsx
// Basic usage
<WeekSchedule
  events={[
    { id: '1', title: 'Meeting', day: 1, startHour: 9, duration: 60 },
    { id: '2', title: 'Lunch', day: 2, startHour: 12, duration: 45 },
  ]}
/>

// Custom hours
<WeekSchedule events={events} startHour={8} endHour={18} />

// Show weekends
<WeekSchedule events={events} showWeekend />

// With click handlers
<WeekSchedule
  events={events}
  onSlotClick={(day, hour) => openBooking(day, hour)}
  onEventClick={(event) => openEvent(event)}
/>

// Custom event rendering
<WeekSchedule
  events={events}
  renderEvent={(event) => (
    <div className="font-bold">{event.title}</div>
  )}
/>
```

### BarChart

Horizontal or vertical bar chart component.

```tsx
// Vertical bar chart (default)
<BarChart
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 120 },
  ]}
/>

// Horizontal bar chart
<BarChart data={data} orientation="horizontal" />

// With title
<BarChart data={data} title="Monthly Sales" subtitle="2024" />

// Custom color
<BarChart data={data} barColor="#22C55E" />

// Hide labels/values
<BarChart data={data} showLabels={false} showValues={false} />

// Format values
<BarChart data={data} formatValue={(v) => `$${v.toLocaleString()}`} />
```

### PieChart

Pie and donut chart component.

```tsx
// Pie chart
<PieChart
  data={[
    { label: 'Desktop', value: 60 },
    { label: 'Mobile', value: 30 },
    { label: 'Tablet', value: 10 },
  ]}
/>

// Donut chart
<PieChart data={data} variant="donut" />

// With center label (donut only)
<PieChart
  data={data}
  variant="donut"
  centerLabel="Total"
  centerValue="100%"
/>

// With title
<PieChart data={data} title="Device Usage" subtitle="Last 30 days" />

// Custom size
<PieChart data={data} size={300} />

// Custom colors
<PieChart data={data} colors={['#037DE4', '#22C55E', '#F59E0B']} />

// Show labels on segments
<PieChart data={data} showLabels />
```

### Sidebar

Collapsible sidebar navigation with compound components.

```tsx
// Basic usage
<Sidebar>
  <SidebarHeader>Logo</SidebarHeader>
  <SidebarContent>
    <SidebarGroup title="Main">
      <SidebarItem href="/" icon={<HomeIcon />}>Home</SidebarItem>
      <SidebarItem href="/settings" icon={<SettingsIcon />}>Settings</SidebarItem>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>Footer content</SidebarFooter>
</Sidebar>

// With active state
<SidebarItem href="/dashboard" active>Dashboard</SidebarItem>

// With badge
<SidebarItem href="/notifications" badge={<Badge>3</Badge>}>
  Notifications
</SidebarItem>

// Disabled item
<SidebarItem disabled>Coming Soon</SidebarItem>

// Custom widths
<Sidebar width={280} collapsedWidth={80}>...</Sidebar>

// Default collapsed
<Sidebar defaultCollapsed>...</Sidebar>

// Mobile trigger
<SidebarTrigger />
```

### TreeView

Hierarchical tree structure for nested data.

```tsx
// Basic usage
<TreeView>
  <TreeItem id="1" label="Documents">
    <TreeItem id="1.1" label="Reports" />
    <TreeItem id="1.2" label="Images">
      <TreeItem id="1.2.1" label="photo.jpg" />
    </TreeItem>
  </TreeItem>
</TreeView>

// With default expanded
<TreeView defaultExpanded={['1', '1.2']}>...</TreeView>

// With icons
<TreeItem id="1" label="Folder" icon={<FolderIcon />}>...</TreeItem>

// With callbacks
<TreeView
  onSelect={(id) => console.log('Selected:', id)}
  onToggle={(id, expanded) => console.log(id, expanded)}
>
  ...
</TreeView>
```

### Carousel

Image/content carousel with navigation.

```tsx
// Basic usage
<Carousel>
  <CarouselSlide>Slide 1</CarouselSlide>
  <CarouselSlide>Slide 2</CarouselSlide>
  <CarouselSlide>Slide 3</CarouselSlide>
</Carousel>

// Auto-play
<Carousel autoPlay autoPlayInterval={5000}>...</Carousel>

// Hide controls
<Carousel showArrows={false} showDots={false}>...</Carousel>

// Non-looping
<Carousel loop={false}>...</Carousel>

// With onChange callback
<Carousel onChange={(index) => console.log('Slide:', index)}>...</Carousel>
```

### Callout

Highlighted information boxes for tips, warnings, notes.

```tsx
// Info callout (default)
<Callout title="Note">Important information here.</Callout>

// Warning
<Callout variant="warning" title="Warning">Be careful!</Callout>

// Success
<Callout variant="success" title="Success">Operation completed.</Callout>

// Error
<Callout variant="error" title="Error">Something went wrong.</Callout>

// Tip
<Callout variant="tip" title="Pro Tip">Here's a helpful tip.</Callout>

// Custom icon
<Callout icon={<CustomIcon />} title="Custom">Custom icon callout.</Callout>
```

### NotificationBell

Notification indicator with dropdown.

```tsx
// Basic usage
<NotificationBell
  notifications={[
    { id: '1', title: 'New message', timestamp: new Date() },
    { id: '2', title: 'Update available', timestamp: '2024-01-15' },
  ]}
/>

// With notification types
<NotificationBell
  notifications={[
    { id: '1', title: 'Success', type: 'success', read: false },
    { id: '2', title: 'Warning', type: 'warning', read: true },
  ]}
/>

// With callbacks
<NotificationBell
  notifications={notifications}
  onNotificationClick={(n) => markAsRead(n.id)}
  onMarkAllRead={markAllRead}
  onViewAll={() => router.push('/notifications')}
/>

// Custom max count
<NotificationBell notifications={notifications} maxCount={9} />
```

### PhoneInput

Phone number input with country code selector.

```tsx
// Basic usage
<PhoneInput value={phone} onChange={setPhone} />

// Default country
<PhoneInput value={phone} onChange={setPhone} defaultCountry="GB" />

// With label
<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
/>

// With error
<PhoneInput
  value={phone}
  onChange={setPhone}
  error="Invalid phone number"
/>

// Full callback
<PhoneInput
  value={phone}
  onChange={(value, country) => {
    setPhone(value);
    setCountryCode(country.dialCode);
  }}
/>
```

### ImageCropper

Image cropping tool with zoom and pan.

```tsx
// Basic usage
<ImageCropper
  src="/image.jpg"
  onCrop={(blob, area) => saveCroppedImage(blob)}
/>

// Square crop (default)
<ImageCropper src={src} aspectRatio={1} onCrop={handleCrop} />

// 16:9 crop
<ImageCropper src={src} aspectRatio={16/9} onCrop={handleCrop} />

// Round crop shape
<ImageCropper src={src} cropShape="round" onCrop={handleCrop} />

// Custom zoom range
<ImageCropper src={src} minZoom={0.5} maxZoom={5} onCrop={handleCrop} />

// Hide grid
<ImageCropper src={src} showGrid={false} onCrop={handleCrop} />
```

### VirtualList

Virtualized list for efficient rendering of large datasets.

```tsx
// Basic usage
<VirtualList
  items={items}
  itemHeight={50}
  renderItem={(item, index) => <div>{item.name}</div>}
/>

// With dynamic height
<VirtualList
  items={items}
  itemHeight={(item) => item.expanded ? 100 : 50}
  renderItem={(item, index) => <ItemRow item={item} />}
/>

// With infinite scroll
<VirtualList
  items={items}
  itemHeight={50}
  renderItem={renderItem}
  onEndReached={loadMore}
  loading={isLoading}
/>

// Custom height and overscan
<VirtualList
  items={items}
  itemHeight={50}
  height={600}
  overscan={10}
  renderItem={renderItem}
/>

// Empty state
<VirtualList
  items={[]}
  itemHeight={50}
  renderItem={renderItem}
  emptyComponent={<p>No items found</p>}
/>
```

### SortableList

Drag-and-drop reorderable list.

```tsx
// Basic usage
<SortableList
  items={items}
  onReorder={(newItems) => setItems(newItems)}
  renderItem={(item, index, isDragging) => (
    <div className={isDragging ? 'opacity-50' : ''}>
      {item.name}
    </div>
  )}
/>

// With drag handle
<SortableList
  items={items}
  onReorder={setItems}
  handle
  renderItem={(item) => (
    <div className="flex items-center gap-2">
      <SortableHandle />
      <span>{item.name}</span>
    </div>
  )}
/>

// Horizontal direction
<SortableList
  items={items}
  onReorder={setItems}
  direction="horizontal"
  renderItem={(item) => <div>{item.name}</div>}
/>

// With key extractor
<SortableList
  items={items}
  onReorder={setItems}
  keyExtractor={(item) => item.id}
  renderItem={(item) => <div>{item.name}</div>}
/>
```

### InfiniteScroll

Infinite scroll wrapper that triggers loading when reaching the end.

```tsx
// Basic usage
<InfiniteScroll
  onLoadMore={loadMoreItems}
  hasMore={hasNextPage}
  loading={isLoading}
>
  {items.map(item => <ItemComponent key={item.id} {...item} />)}
</InfiniteScroll>

// Custom loading/end components
<InfiniteScroll
  onLoadMore={loadMore}
  hasMore={hasMore}
  loading={loading}
  loadingComponent={<CustomSpinner />}
  endComponent={<p>You've reached the end!</p>}
>
  {items.map(renderItem)}
</InfiniteScroll>

// With threshold
<InfiniteScroll
  onLoadMore={loadMore}
  hasMore={hasMore}
  threshold={0.5}
  rootMargin="200px"
>
  {children}
</InfiniteScroll>

// Reverse scroll (chat-style)
<InfiniteScroll
  onLoadMore={loadOlderMessages}
  hasMore={hasMore}
  direction="up"
>
  {messages.map(renderMessage)}
</InfiniteScroll>
```

### ThemeProvider

Theme context for dark mode and custom theming.

```tsx
// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>

// With default theme
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>

// Use in components
function MyComponent() {
  const { theme, setTheme, toggleTheme, resolvedTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

// Theme toggle button
<ThemeToggle />
<ThemeToggle size="sm" />
<ThemeToggle size="lg" />

// Theme select dropdown
<ThemeSelect />
```

### ErrorBoundary

React error boundary for graceful error handling.

```tsx
// Basic usage
<ErrorBoundary>
  <App />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<MyErrorPage />}>
  <Component />
</ErrorBoundary>

// With render prop fallback
<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <p>Error: {error?.message}</p>
      <button onClick={resetError}>Retry</button>
    </div>
  )}
>
  <Component />
</ErrorBoundary>

// With callbacks
<ErrorBoundary
  onError={(error, info) => logError(error, info)}
  onReset={() => resetState()}
>
  <Component />
</ErrorBoundary>

// With reset keys
<ErrorBoundary resetKeys={[userId]}>
  <UserProfile userId={userId} />
</ErrorBoundary>

// As HOC
const SafeComponent = withErrorBoundary(DangerousComponent, {
  fallback: <FallbackUI />
});
```

### Animation Components

Reusable animation utilities and presets.

```tsx
// FadeIn
<FadeIn>Content fades in on mount</FadeIn>
<FadeIn delay={200}>Delayed fade</FadeIn>
<FadeIn trigger="inView">Fade when scrolled into view</FadeIn>

// SlideIn
<SlideIn direction="up">Slides up</SlideIn>
<SlideIn direction="left" distance={30}>Custom distance</SlideIn>
<SlideIn trigger="inView">Slide on scroll</SlideIn>

// ScaleIn
<ScaleIn>Scales in from 0.9</ScaleIn>
<ScaleIn initialScale={0.5}>Custom scale</ScaleIn>

// Stagger children
<Stagger staggerDelay={50} animation="fade">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</Stagger>

// Animate with presets
<Animate animation="bounce">Bouncing</Animate>
<Animate animation="shake" trigger="click">Click to shake</Animate>
<Animate animation="pulse" repeat="infinite">Pulsing</Animate>
<Animate animation="wiggle" trigger="hover">Hover to wiggle</Animate>

// Available presets:
// fadeIn, fadeOut, slideUp, slideDown, slideLeft, slideRight,
// scaleIn, scaleOut, bounce, pulse, shake, spin, ping, wiggle
```

## Testing & Storybook

The design system includes testing and documentation infrastructure:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

### Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Writing Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

## CSS Utility Classes

The design system provides these utility classes:

- `.card-depth` - Standard card shadow
- `.card-depth-hover` - Hover shadow effect
- `.btn-3d` - 3D button press effect
- `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-ghost` - CSS-only buttons
- `.form-input` - Styled form inputs
- `.sr-only` - Screen reader only
- `.animate-fade-in-up`, `.animate-float`, etc. - Animations

## Typography

The design system expects these font variables to be set:

- `--font-poppins` - Body text (sans-serif)
- `--font-nunito` - Display/headings
- `--font-caveat` - Handwritten accents

Configure in your root layout:

```tsx
import { Poppins, Nunito, Caveat } from "next/font/google";

const poppins = Poppins({ variable: "--font-poppins", ... });
const nunito = Nunito({ variable: "--font-nunito", ... });
const caveat = Caveat({ variable: "--font-caveat", ... });

<body className={`${poppins.variable} ${nunito.variable} ${caveat.variable} font-sans`}>
```

## Adding New Components

When a component is needed across multiple apps:

1. Create component in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`
3. Document usage in this README
4. Update apps to import from `@articulink/design-system`

```tsx
// src/components/YourComponent.tsx
'use client';

export interface YourComponentProps {
  // ...
}

export function YourComponent({ ... }: YourComponentProps) {
  return (
    // ...
  );
}

// src/components/index.ts
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './YourComponent';
```

## File Structure

```
src/
├── components/
│   ├── index.ts              # Component exports (90 components)
│   │
│   │ # Core Form Controls
│   ├── Button.tsx            # Polymorphic button (button, Link, or anchor)
│   ├── Input.tsx             # Form input with label/error/hint
│   ├── Textarea.tsx          # Multiline text input
│   ├── Select.tsx            # Styled select dropdown
│   ├── Checkbox.tsx          # Checkbox with indeterminate state
│   ├── RadioGroup.tsx        # Radio button group with card variant
│   ├── Switch.tsx            # Toggle switch
│   ├── Slider.tsx            # Range slider (single/dual)
│   ├── Combobox.tsx          # Searchable select/autocomplete
│   ├── NumberInput.tsx       # Numeric input with +/- controls
│   ├── PasswordInput.tsx     # Password with visibility toggle
│   ├── InputOTP.tsx          # One-time password input
│   ├── FileUpload.tsx        # Drag-and-drop file upload
│   ├── SearchInput.tsx       # Search input with debounce
│   ├── ColorPicker.tsx       # Color selection with presets
│   ├── Rating.tsx            # Star rating input
│   │
│   │ # Date & Time
│   ├── Calendar.tsx          # Month calendar view
│   ├── DatePicker.tsx        # Date input with calendar dropdown
│   ├── CountdownTimer.tsx    # Countdown with urgent/past states
│   │
│   │ # Layout
│   ├── Card.tsx              # Content container with depth/hover
│   ├── Divider.tsx           # Horizontal/vertical separator
│   ├── AspectRatio.tsx       # Fixed aspect ratio container
│   ├── ScrollArea.tsx        # Custom scrollbar container
│   ├── Accordion.tsx         # Expandable content panels
│   ├── Collapsible.tsx       # Animated expand/collapse
│   ├── Stepper.tsx           # Multi-step wizard indicator
│   ├── Tabs.tsx              # Tab navigation
│   ├── ResizablePanel.tsx    # Draggable resizable panels
│   │
│   │ # Overlays
│   ├── Modal.tsx             # Accessible dialog with focus trap
│   ├── ConfirmDialog.tsx     # Confirmation dialog
│   ├── Drawer.tsx            # Slide-in panel
│   ├── Popover.tsx           # Floating content panel (click)
│   ├── HoverCard.tsx         # Content preview (hover)
│   ├── Tooltip.tsx           # Hover tooltips
│   ├── ContextMenu.tsx       # Right-click context menu
│   ├── Dropdown.tsx          # Dropdown menus
│   ├── CommandMenu.tsx       # Cmd+K command palette
│   │
│   │ # Navigation
│   ├── Breadcrumb.tsx        # Navigation breadcrumbs
│   ├── Pagination.tsx        # Page navigation
│   ├── NavigationMenu.tsx    # Site navigation with dropdowns
│   │
│   │ # Feedback
│   ├── Alert.tsx             # Inline feedback banners
│   ├── Toast.tsx             # Toast notification system
│   ├── Spinner.tsx           # Loading spinner
│   ├── Skeleton.tsx          # Loading placeholders
│   ├── EmptyState.tsx        # Empty state displays
│   ├── Badge.tsx             # Status badges
│   ├── ProgressRing.tsx      # Circular/linear progress
│   │
│   │ # Data Display
│   ├── DataTable.tsx         # Data table with sorting
│   ├── ResponsiveTable.tsx   # Mobile-responsive table/cards
│   ├── Timeline.tsx          # Vertical event timeline
│   ├── StatCard.tsx          # Metric display cards
│   ├── DashboardCard.tsx     # Dashboard widget cards
│   ├── MediaCard.tsx         # Media content cards
│   ├── Avatar.tsx            # User avatars
│   ├── StatusIndicator.tsx   # Connection/sync status
│   ├── LineChart.tsx         # SVG time-series line chart
│   │
│   │ # Specialized
│   ├── RichTextEditor.tsx    # TipTap WYSIWYG editor
│   ├── VideoPlayer.tsx       # Custom video player
│   ├── VoiceInput.tsx        # Voice-to-text input button
│   ├── CelebrationOverlay.tsx # Confetti celebration animations
│   ├── ChatMessage.tsx       # Chat/messaging UI components
│   ├── SnippetPicker.tsx     # Categorized phrase picker
│   ├── BadgeDisplay.tsx      # Achievement badges with rarity
│   │
│   │ # Utilities
│   ├── Toggle.tsx            # Toggle button with groups
│   ├── FormField.tsx         # Form field wrapper and helpers
│   ├── VisuallyHidden.tsx    # Screen reader only content
│   ├── Kbd.tsx               # Keyboard key display
│   ├── CopyButton.tsx        # Copy to clipboard button
│   │
│   │ # Therapy-Specific
│   ├── TimePicker.tsx        # Time input with dropdown
│   ├── TagInput.tsx          # Multi-tag input with autocomplete
│   ├── SignaturePad.tsx      # Canvas-based digital signature
│   ├── AudioRecorder.tsx     # Audio recording with waveform
│   ├── ImageGallery.tsx      # Image gallery with lightbox
│   ├── WaveformVisualizer.tsx# Audio waveform display
│   ├── WeekSchedule.tsx      # Weekly availability calendar
│   │
│   │ # Charts & Data Visualization
│   ├── BarChart.tsx          # Horizontal/vertical bar charts
│   ├── PieChart.tsx          # Pie and donut charts
│   │
│   │ # Navigation & Layout
│   ├── Sidebar.tsx           # Collapsible sidebar navigation
│   ├── TreeView.tsx          # Hierarchical tree structure
│   ├── Carousel.tsx          # Image/content carousel
│   ├── Callout.tsx           # Info/warning/tip boxes
│   ├── NotificationBell.tsx  # Notification dropdown
│   │
│   │ # Inputs
│   ├── PhoneInput.tsx        # Phone with country code
│   ├── ImageCropper.tsx      # Image crop with zoom/pan
│   ├── VirtualList.tsx       # Virtualized list for large data
│   │
│   │ # Data Utilities
│   ├── SortableList.tsx      # Drag-and-drop reorderable list
│   ├── InfiniteScroll.tsx    # Infinite scroll wrapper
│   │
│   │ # Animation & Theme
│   ├── Animate.tsx           # Animation components (FadeIn, SlideIn, etc.)
│   ├── ThemeProvider.tsx     # Dark mode / theme context
│   └── ErrorBoundary.tsx     # React error boundary
│
├── __tests__/                # Component tests
│   ├── setup.ts              # Test setup and mocks
│   ├── a11y-setup.ts         # Accessibility test config
│   ├── Button.test.tsx       # Button unit tests
│   ├── Input.test.tsx        # Input unit tests
│   └── Modal.test.tsx        # Modal unit tests
│
├── stories/                  # Storybook stories
│   ├── Button.stories.tsx    # Button documentation
│   ├── Input.stories.tsx     # Input documentation
│   ├── Modal.stories.tsx     # Modal documentation
│   └── Card.stories.tsx      # Card documentation
│
├── hooks/
│   └── index.ts              # Shared hooks
├── tokens/
│   └── index.css             # CSS custom properties and Tailwind theme
├── utils/
│   └── index.ts              # Shared utilities
└── index.ts                  # Main package exports
```

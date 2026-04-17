'use client';

import { forwardRef, ReactNode } from 'react';

/**
 * Articulink ChatMessage Components
 *
 * Chat UI components for messaging interfaces.
 *
 * Usage:
 *   <ChatMessage
 *     content="Hello!"
 *     timestamp="2:30 PM"
 *     isOwn
 *   />
 *
 *   <ConversationList>
 *     <ConversationItem
 *       name="Dr. Smith"
 *       lastMessage="See you tomorrow!"
 *       timestamp="2:30 PM"
 *       unreadCount={2}
 *       onClick={() => selectConversation(id)}
 *     />
 *   </ConversationList>
 */

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  timestamp?: string;
  isOwn?: boolean;
  senderName?: string;
  senderAvatar?: ReactNode;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isFirst?: boolean; // First message in a group from same sender
  isLast?: boolean; // Last message in a group from same sender
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      content,
      timestamp,
      isOwn = false,
      senderName,
      senderAvatar,
      status,
      isFirst = true,
      isLast = true,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}
        {...props}
      >
        <div className={`flex gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
          {/* Avatar (only show for first message in group) */}
          {!isOwn && isFirst && senderAvatar && (
            <div className="flex-shrink-0 w-8 h-8">{senderAvatar}</div>
          )}
          {!isOwn && !isFirst && <div className="w-8" />}

          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            {/* Sender name (only show for first message) */}
            {!isOwn && isFirst && senderName && (
              <span className="text-xs text-lagoon mb-1 ml-3">{senderName}</span>
            )}

            {/* Message bubble */}
            <div
              className={`
                px-4 py-2 max-w-full
                ${isOwn
                  ? 'bg-tide text-white rounded-2xl rounded-br-md'
                  : 'bg-mist text-abyss rounded-2xl rounded-bl-md'
                }
                ${!isFirst && isOwn ? 'rounded-tr-md' : ''}
                ${!isFirst && !isOwn ? 'rounded-tl-md' : ''}
                ${!isLast && isOwn ? 'rounded-br-2xl' : ''}
                ${!isLast && !isOwn ? 'rounded-bl-2xl' : ''}
              `}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            </div>

            {/* Timestamp and status (only show for last message) */}
            {isLast && (timestamp || status) && (
              <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'mr-1' : 'ml-3'}`}>
                {timestamp && <span className="text-xs text-lagoon">{timestamp}</span>}
                {status && isOwn && <MessageStatus status={status} />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';

// Message status indicator
function MessageStatus({ status }: { status: string }) {
  switch (status) {
    case 'sending':
      return (
        <div className="w-3 h-3 border border-lagoon/50 border-t-transparent rounded-full animate-spin" />
      );
    case 'sent':
      return (
        <svg className="w-3 h-3 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'delivered':
      return (
        <svg className="w-4 h-3 text-lagoon" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 8l4 4 8-8M10 12l4 4 8-8" />
        </svg>
      );
    case 'read':
      return (
        <svg className="w-4 h-3 text-tide" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 8l4 4 8-8M10 12l4 4 8-8" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-3 h-3 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * ChatInput - Message input with send button
 */
export interface ChatInputProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
  maxLength?: number;
  actions?: ReactNode; // Extra actions (voice input, attach file, etc.)
}

export const ChatInput = forwardRef<HTMLFormElement, ChatInputProps>(
  (
    {
      value,
      onChange,
      onSend,
      placeholder = 'Type a message...',
      disabled = false,
      sending = false,
      maxLength,
      actions,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && !disabled && !sending) {
        onSend();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={`flex items-end gap-2 p-3 bg-white border-t border-mist ${className}`}
        {...props}
      >
        {actions && <div className="flex items-center gap-1">{actions}</div>}

        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            maxLength={maxLength}
            rows={1}
            className="
              w-full px-4 py-2 bg-mist rounded-2xl
              text-sm text-abyss placeholder:text-lagoon/50
              border-2 border-transparent
              focus:outline-none focus:border-tide focus:bg-white
              resize-none max-h-32
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{ minHeight: '40px' }}
          />
        </div>

        <button
          type="submit"
          disabled={!value.trim() || disabled || sending}
          className="
            flex-shrink-0 w-10 h-10 rounded-full
            bg-tide text-white
            flex items-center justify-center
            hover:bg-surf transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    );
  }
);

ChatInput.displayName = 'ChatInput';

/**
 * ConversationList - List of conversation threads
 */
export interface ConversationListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ConversationList = forwardRef<HTMLDivElement, ConversationListProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`divide-y divide-mist ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ConversationList.displayName = 'ConversationList';

/**
 * ConversationItem - Single conversation in the list
 */
export interface ConversationItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  name: string;
  avatar?: ReactNode;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ConversationItem = forwardRef<HTMLButtonElement, ConversationItemProps>(
  (
    {
      name,
      avatar,
      lastMessage,
      timestamp,
      unreadCount = 0,
      isOnline,
      isSelected = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 p-4 text-left
          transition-colors
          ${isSelected ? 'bg-info-bg' : 'hover:bg-mist/50'}
          ${className}
        `}
        {...props}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar || (
            <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center text-lagoon font-medium">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`font-medium truncate ${unreadCount > 0 ? 'text-abyss' : 'text-abyss/80'}`}>
              {name}
            </span>
            {timestamp && (
              <span className={`text-xs flex-shrink-0 ml-2 ${unreadCount > 0 ? 'text-tide font-medium' : 'text-lagoon'}`}>
                {timestamp}
              </span>
            )}
          </div>
          {lastMessage && (
            <p className={`text-sm truncate mt-0.5 ${unreadCount > 0 ? 'text-abyss font-medium' : 'text-lagoon'}`}>
              {lastMessage}
            </p>
          )}
        </div>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-tide text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    );
  }
);

ConversationItem.displayName = 'ConversationItem';

export default ChatMessage;

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessageData } from './ChatMessage';
import './ChatInterface.css';

interface ChatInterfaceProps {
  messages: ChatMessageData[];
  isConnected: boolean;
  onClearMessages?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isConnected,
  onClearMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Detect manual scrolling to disable auto-scroll
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold
      setAutoScroll(isAtBottom);
    }
  };

  const handleToggleCollapse = (messageId: string) => {
    // Optional: Add any global collapse handling logic here
    console.log(`Message ${messageId} collapse toggled`);
  };

  const scrollToBottom = () => {
    setAutoScroll(true);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <h2>Campaign Recommendations</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-indicator"></span>
            <span className="status-text">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="chat-controls">
          <button 
            className="control-button clear-button"
            onClick={onClearMessages}
            disabled={messages.length === 0}
            title="Clear all messages"
          >
            Clear
          </button>
          <button 
            className="control-button scroll-button"
            onClick={scrollToBottom}
            title="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      </div>

      <div 
        className="chat-messages" 
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Campaign recommendations will appear here in real-time.</p>
            <p className="empty-hint">
              {isConnected 
                ? 'Start a campaign simulation to see recommendations.' 
                : 'Please connect to see live recommendations.'
              }
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onToggleCollapse={handleToggleCollapse}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {!autoScroll && (
          <button 
            className="floating-scroll-button"
            onClick={scrollToBottom}
            title="Scroll to latest messages"
          >
            ↓ New messages
          </button>
        )}
      </div>

      <div className="chat-footer">
        <div className="message-count">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </div>
        <div className="streaming-indicator">
          {isConnected && (
            <>
              <span className="streaming-dot"></span>
              <span>Live streaming</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
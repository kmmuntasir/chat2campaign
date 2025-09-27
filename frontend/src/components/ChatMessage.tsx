import React, { useState } from 'react';
import './ChatMessage.css';

export interface ChatMessageData {
  id: string;
  timestamp: string;
  type: 'system' | 'campaign' | 'user';
  content: any; // Can be JSON object or string
  isJson?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageData;
  onToggleCollapse?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onToggleCollapse 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggleCollapse?.(message.id);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const renderContent = () => {
    if (message.isJson && typeof message.content === 'object') {
      const jsonString = JSON.stringify(message.content, null, 2);
      
      if (isCollapsed) {
        // Show summary for collapsed state
        const summary = generateJsonSummary(message.content);
        return (
          <div className="json-content">
            <div className="json-summary" onClick={handleToggleCollapse}>
              <span className="expand-icon">▶</span>
              <span className="summary-text">{summary}</span>
              <span className="json-badge">JSON</span>
            </div>
          </div>
        );
      } else {
        // Show full JSON for expanded state
        return (
          <div className="json-content">
            <div className="json-header" onClick={handleToggleCollapse}>
              <span className="expand-icon">▼</span>
              <span className="json-label">Campaign Recommendation</span>
              <span className="json-badge">JSON</span>
            </div>
            <pre className="json-formatted">{jsonString}</pre>
          </div>
        );
      }
    } else {
      // Regular text content
      return <div className="text-content">{String(message.content)}</div>;
    }
  };

  const generateJsonSummary = (jsonObj: any): string => {
    try {
      if (jsonObj.audience && jsonObj.channel_plan) {
        const audienceSegment = jsonObj.audience.name || jsonObj.audience.segment_id || 'Unknown';
        const channelCount = Array.isArray(jsonObj.channel_plan) ? jsonObj.channel_plan.length : 0;
        const confidence = jsonObj.campaign_meta?.confidence ? 
          `${Math.round(jsonObj.campaign_meta.confidence * 100)}%` : '';
        
        return `${audienceSegment} • ${channelCount} channels ${confidence}`;
      }
      
      // Fallback summary
      const keys = Object.keys(jsonObj);
      return `JSON object with ${keys.length} properties`;
    } catch {
      return 'Campaign recommendation data';
    }
  };

  return (
    <div className={`chat-message ${message.type}`}>
      <div className="message-header">
        <span className="message-type">{message.type}</span>
        <span className="message-timestamp">{formatTimestamp(message.timestamp)}</span>
      </div>
      <div className="message-content">
        {renderContent()}
      </div>
    </div>
  );
};
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
      // Validate and parse schema-compliant JSON
      const validationResult = validateSchemaCompliance(message.content);
      
      if (isCollapsed) {
        // Show enhanced summary for collapsed state
        const summary = generateEnhancedJsonSummary(message.content, validationResult);
        return (
          <div className="json-content">
            <div className="json-summary" onClick={handleToggleCollapse}>
              <span className="expand-icon">▶</span>
              <span className="summary-text">{summary}</span>
              <div className="json-badges">
                <span className="json-badge">JSON</span>
                {validationResult.isValid ? (
                  <span className="validation-badge valid">✓ Valid</span>
                ) : (
                  <span className="validation-badge invalid">⚠ Issues</span>
                )}
              </div>
            </div>
            {!validationResult.isValid && (
              <div className="validation-warning">
                <span className="warning-icon">⚠</span>
                <span>{validationResult.errorSummary}</span>
              </div>
            )}
          </div>
        );
      } else {
        // Show enhanced structured view for expanded state
        return (
          <div className="json-content">
            <div className="json-header" onClick={handleToggleCollapse}>
              <span className="expand-icon">▼</span>
              <span className="json-label">Campaign Recommendation</span>
              <div className="json-badges">
                <span className="json-badge">JSON</span>
                {validationResult.isValid ? (
                  <span className="validation-badge valid">✓ Schema Valid</span>
                ) : (
                  <span className="validation-badge invalid">⚠ Schema Issues</span>
                )}
              </div>
            </div>
            {!validationResult.isValid && (
              <div className="validation-errors">
                <h4>Schema Validation Issues:</h4>
                <ul>
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="validation-error">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="json-structured-view">
              {renderStructuredJson(message.content)}
            </div>
            <details className="json-raw-view">
              <summary>Raw JSON Data</summary>
              <pre className="json-formatted">{JSON.stringify(message.content, null, 2)}</pre>
            </details>
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

  // Enhanced JSON summary with validation info
  const generateEnhancedJsonSummary = (jsonObj: any, _validation: ValidationResult): string => {
    try {
      const baseSummary = generateJsonSummary(jsonObj);
      
      if (jsonObj.audience && jsonObj.channel_plan) {
        const audienceSegment = jsonObj.audience.name || jsonObj.audience.segment_id || 'Unknown';
        const channelCount = Array.isArray(jsonObj.channel_plan) ? jsonObj.channel_plan.length : 0;
        const confidence = jsonObj.campaign_meta?.confidence ? 
          `${Math.round(jsonObj.campaign_meta.confidence * 100)}%` : 'N/A';
        const score = jsonObj.reasoning?.score ? 
          `${Math.round(jsonObj.reasoning.score * 100)}%` : 'N/A';
        
        return `${audienceSegment} • ${channelCount} channels • ${confidence} confidence • ${score} score`;
      }
      
      return baseSummary;
    } catch {
      return 'Campaign recommendation data';
    }
  };

  // Schema compliance validation
  interface ValidationResult {
    isValid: boolean;
    errors: string[];
    errorSummary: string;
    missingFields: string[];
    invalidFields: string[];
  }

  const validateSchemaCompliance = (jsonObj: any): ValidationResult => {
    const errors: string[] = [];
    const missingFields: string[] = [];
    const invalidFields: string[] = [];

    try {
      // Required top-level fields
      const requiredFields = ['id', 'timestamp', 'audience', 'reasoning', 'channel_plan', 'campaign_meta'];
      
      requiredFields.forEach(field => {
        if (!(field in jsonObj) || jsonObj[field] === null || jsonObj[field] === undefined) {
          missingFields.push(field);
          errors.push(`Missing required field: ${field}`);
        }
      });

      // Validate ID
      if (jsonObj.id && (typeof jsonObj.id !== 'string' || jsonObj.id.trim() === '')) {
        invalidFields.push('id');
        errors.push('ID must be a non-empty string');
      }

      // Validate timestamp (ISO8601 format)
      if (jsonObj.timestamp) {
        try {
          const date = new Date(jsonObj.timestamp);
          if (isNaN(date.getTime()) || date.toISOString() !== jsonObj.timestamp) {
            invalidFields.push('timestamp');
            errors.push('Timestamp must be valid ISO8601 format');
          }
        } catch {
          invalidFields.push('timestamp');
          errors.push('Timestamp format is invalid');
        }
      }

      // Validate audience structure
      if (jsonObj.audience && typeof jsonObj.audience === 'object') {
        const audienceRequiredFields = ['segment_id', 'name', 'filters'];
        audienceRequiredFields.forEach(field => {
          if (!(field in jsonObj.audience)) {
            missingFields.push(`audience.${field}`);
            errors.push(`Missing required audience field: ${field}`);
          }
        });
      }

      // Validate reasoning structure
      if (jsonObj.reasoning && typeof jsonObj.reasoning === 'object') {
        if (!Array.isArray(jsonObj.reasoning.signals) || jsonObj.reasoning.signals.length === 0) {
          invalidFields.push('reasoning.signals');
          errors.push('Reasoning signals must be a non-empty array');
        }
        if (typeof jsonObj.reasoning.score !== 'number' || jsonObj.reasoning.score < 0 || jsonObj.reasoning.score > 1) {
          invalidFields.push('reasoning.score');
          errors.push('Reasoning score must be a number between 0 and 1');
        }
        if (!jsonObj.reasoning.explain || typeof jsonObj.reasoning.explain !== 'string') {
          invalidFields.push('reasoning.explain');
          errors.push('Reasoning explanation must be a non-empty string');
        }
      }

      // Validate channel_plan array
      if (jsonObj.channel_plan) {
        if (!Array.isArray(jsonObj.channel_plan) || jsonObj.channel_plan.length === 0) {
          invalidFields.push('channel_plan');
          errors.push('Channel plan must be a non-empty array');
        } else {
          const validChannels = ['Email', 'Push', 'WhatsApp', 'Ads', 'SMS', 'Messenger', 'Voice'];
          jsonObj.channel_plan.forEach((plan: any, index: number) => {
            if (!validChannels.includes(plan.channel)) {
              invalidFields.push(`channel_plan[${index}].channel`);
              errors.push(`Invalid channel in plan ${index + 1}: ${plan.channel}`);
            }
            if (!plan.send_at || !isValidISO8601(plan.send_at)) {
              invalidFields.push(`channel_plan[${index}].send_at`);
              errors.push(`Invalid send_at timestamp in plan ${index + 1}`);
            }
            if (typeof plan.priority !== 'number' || plan.priority < 1) {
              invalidFields.push(`channel_plan[${index}].priority`);
              errors.push(`Invalid priority in plan ${index + 1}`);
            }
          });
        }
      }

      // Validate campaign_meta structure
      if (jsonObj.campaign_meta && typeof jsonObj.campaign_meta === 'object') {
        const metaRequiredFields = ['source_snapshot', 'engine_version', 'confidence'];
        metaRequiredFields.forEach(field => {
          if (!(field in jsonObj.campaign_meta)) {
            missingFields.push(`campaign_meta.${field}`);
            errors.push(`Missing required campaign_meta field: ${field}`);
          }
        });
        
        if (typeof jsonObj.campaign_meta.confidence === 'number' && 
            (jsonObj.campaign_meta.confidence < 0 || jsonObj.campaign_meta.confidence > 1)) {
          invalidFields.push('campaign_meta.confidence');
          errors.push('Campaign meta confidence must be between 0 and 1');
        }
      }

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const isValid = errors.length === 0;
    const errorSummary = errors.length > 0 ? 
      `${errors.length} validation issue${errors.length > 1 ? 's' : ''}` : 
      'All fields valid';

    return {
      isValid,
      errors,
      errorSummary,
      missingFields,
      invalidFields
    };
  };

  // Helper function to validate ISO8601 dates
  const isValidISO8601 = (dateString: string): boolean => {
    try {
      const date = new Date(dateString);
      return date.toISOString() === dateString;
    } catch {
      return false;
    }
  };

  // Render structured JSON with enhanced field display
  const renderStructuredJson = (jsonObj: any) => {
    try {
      return (
        <div className="structured-json">
          {/* Campaign Basic Info */}
          <div className="json-section">
            <h4 className="section-title">🏷️ Campaign Info</h4>
            <div className="field-row">
              <span className="field-label">ID:</span>
              <span className="field-value">{jsonObj.id || 'N/A'}</span>
            </div>
            <div className="field-row">
              <span className="field-label">Timestamp:</span>
              <span className="field-value">{formatTimestamp(jsonObj.timestamp) || 'N/A'}</span>
            </div>
          </div>

          {/* Audience Section */}
          {jsonObj.audience && (
            <div className="json-section">
              <h4 className="section-title">🎯 Audience</h4>
              <div className="field-row">
                <span className="field-label">Segment:</span>
                <span className="field-value">{jsonObj.audience.name || jsonObj.audience.segment_id}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Segment ID:</span>
                <span className="field-value code">{jsonObj.audience.segment_id}</span>
              </div>
              {jsonObj.audience.filters && Object.keys(jsonObj.audience.filters).length > 0 && (
                <div className="field-row">
                  <span className="field-label">Filters:</span>
                  <div className="field-value">
                    {Object.entries(jsonObj.audience.filters).map(([key, value]) => (
                      <span key={key} className="filter-tag">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reasoning Section */}
          {jsonObj.reasoning && (
            <div className="json-section">
              <h4 className="section-title">🧠 Reasoning</h4>
              <div className="field-row">
                <span className="field-label">Score:</span>
                <span className="field-value score">
                  {typeof jsonObj.reasoning.score === 'number' ? 
                    `${Math.round(jsonObj.reasoning.score * 100)}%` : 'N/A'}
                </span>
              </div>
              <div className="field-row">
                <span className="field-label">Explanation:</span>
                <span className="field-value">{jsonObj.reasoning.explain || 'N/A'}</span>
              </div>
              {jsonObj.reasoning.signals && Array.isArray(jsonObj.reasoning.signals) && (
                <div className="field-row">
                  <span className="field-label">Signals:</span>
                  <div className="field-value">
                    <ul className="signals-list">
                      {jsonObj.reasoning.signals.map((signal: string, index: number) => (
                        <li key={index} className="signal-item">{signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Channel Plan Section */}
          {jsonObj.channel_plan && Array.isArray(jsonObj.channel_plan) && (
            <div className="json-section">
              <h4 className="section-title">📱 Channel Plan ({jsonObj.channel_plan.length})</h4>
              {jsonObj.channel_plan.map((plan: any, index: number) => (
                <div key={index} className="channel-plan-item">
                  <div className="channel-header">
                    <span className="channel-name">{plan.channel}</span>
                    <span className="priority-badge">Priority {plan.priority}</span>
                  </div>
                  <div className="channel-details">
                    <div className="field-row">
                      <span className="field-label">Send At:</span>
                      <span className="field-value">{formatTimestamp(plan.send_at)}</span>
                    </div>
                    {plan.payload && (
                      <>
                        {plan.payload.subject && (
                          <div className="field-row">
                            <span className="field-label">Subject:</span>
                            <span className="field-value">{plan.payload.subject}</span>
                          </div>
                        )}
                        <div className="field-row">
                          <span className="field-label">Message:</span>
                          <span className="field-value">{plan.payload.body || 'N/A'}</span>
                        </div>
                        {plan.payload.cta && (
                          <div className="field-row">
                            <span className="field-label">Call-to-Action:</span>
                            <span className="field-value cta">
                              {plan.payload.cta.text || 'Click here'}
                              {plan.payload.cta.url && (
                                <span className="cta-url"> → {plan.payload.cta.url}</span>
                              )}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {plan.delivery_instructions && (
                      <div className="delivery-info">
                        <span className="delivery-label">Delivery:</span>
                        <span className="delivery-value">
                          {plan.delivery_instructions.retry_policy || 'N/A'} • 
                          {plan.delivery_instructions.timeout_sec || 30}s timeout
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Campaign Meta Section */}
          {jsonObj.campaign_meta && (
            <div className="json-section">
              <h4 className="section-title">⚙️ Campaign Metadata</h4>
              <div className="field-row">
                <span className="field-label">Engine Version:</span>
                <span className="field-value code">{jsonObj.campaign_meta.engine_version || 'N/A'}</span>
              </div>
              <div className="field-row">
                <span className="field-label">Confidence:</span>
                <span className="field-value score">
                  {typeof jsonObj.campaign_meta.confidence === 'number' ? 
                    `${Math.round(jsonObj.campaign_meta.confidence * 100)}%` : 'N/A'}
                </span>
              </div>
              {jsonObj.campaign_meta.source_snapshot && 
               Object.keys(jsonObj.campaign_meta.source_snapshot).length > 0 && (
                <div className="field-row">
                  <span className="field-label">Data Sources:</span>
                  <div className="field-value">
                    {Object.keys(jsonObj.campaign_meta.source_snapshot).map(source => (
                      <span key={source} className="source-tag">{source}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    } catch (error) {
      return (
        <div className="json-error">
          <span className="error-icon">⚠</span>
          <span>Error rendering structured view: {error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      );
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
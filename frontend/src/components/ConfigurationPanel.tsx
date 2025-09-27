import React, { useState, useEffect } from 'react';
import './ConfigurationPanel.css';

interface DataSource {
  id: string;
  name: string;
  type: 'mocked' | 'real_api';
  description: string;
  category: string;
  icon: string;
  capabilities: string[];
  realApiConfig?: {
    endpoint?: string;
    authRequired: boolean;
    supportsWebhooks: boolean;
  };
  config: {
    type: 'mocked' | 'real_api';
    enabled: boolean;
    apiConfig?: {
      endpoint?: string;
      authToken?: string;
      webhookUrl?: string;
    };
  };
}

interface ConfigurationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onConfigUpdate?: (sourceId: string, config: any) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  isVisible,
  onClose,
  onConfigUpdate
}) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [expandedSource, setExpandedSource] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      fetchConfiguration();
    }
  }, [isVisible]);

  const fetchConfiguration = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (response.ok) {
        setDataSources(data.dataSources || []);
      } else {
        setError(data.error || 'Failed to fetch configuration');
      }
    } catch (err) {
      setError('Network error while fetching configuration');
      console.error('Configuration fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSourceConfig = async (sourceId: string, updates: any) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId,
          ...updates
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state
        setDataSources(prev => 
          prev.map(source => 
            source.id === sourceId 
              ? { ...source, ...data.source, config: data.config }
              : source
          )
        );
        
        // Notify parent component
        onConfigUpdate?.(sourceId, data.config);
      } else {
        setError(data.error || 'Failed to update configuration');
      }
    } catch (err) {
      setError('Network error while updating configuration');
      console.error('Configuration update error:', err);
    }
  };

  const handleTypeToggle = (sourceId: string, newType: 'mocked' | 'real_api') => {
    updateSourceConfig(sourceId, { type: newType });
  };

  const handleEnabledToggle = (sourceId: string, enabled: boolean) => {
    updateSourceConfig(sourceId, { enabled });
  };

  const handleApiConfigUpdate = (sourceId: string, apiConfig: any) => {
    updateSourceConfig(sourceId, { apiConfig });
  };

  const toggleExpandSource = (sourceId: string) => {
    setExpandedSource(expandedSource === sourceId ? null : sourceId);
  };

  if (!isVisible) return null;

  return (
    <div className="configuration-panel-overlay">
      <div className="configuration-panel">
        <div className="config-header">
          <h2>🔧 Data Source Configuration</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close configuration"></button>
        </div>

        <div className="config-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading configuration...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              <button onClick={fetchConfiguration}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="config-description">
                <p>Configure each data source to use either mocked data for testing or real API connections for production use.</p>
              </div>

              <div className="data-sources-list">
                {dataSources.map(source => (
                  <div key={source.id} className="data-source-config">
                    <div className="source-header" onClick={() => toggleExpandSource(source.id)}>
                      <div className="source-info">
                        <span className="source-icon">{source.icon}</span>
                        <div>
                          <h4>{source.name}</h4>
                          <span className="source-category">{source.category}</span>
                        </div>
                      </div>
                      <div className="source-status">
                        <span className={`status-badge ${source.config.enabled ? 'enabled' : 'disabled'}`}>
                          {source.config.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className={`type-badge ${source.config.type}`}>
                          {source.config.type === 'mocked' ? '🎭 Mocked' : '🌐 Real API'}
                        </span>
                        <span className="expand-icon">
                          {expandedSource === source.id ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {expandedSource === source.id && (
                      <div className="source-details">
                        <p className="source-description">{source.description}</p>
                        
                        <div className="config-controls">
                          <div className="control-group">
                            <label className="control-label">Status</label>
                            <div className="toggle-group">
                              <label className="toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={source.config.enabled}
                                  onChange={(e) => handleEnabledToggle(source.id, e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                              </label>
                              <span>{source.config.enabled ? 'Enabled' : 'Disabled'}</span>
                            </div>
                          </div>

                          <div className="control-group">
                            <label className="control-label">Data Source Type</label>
                            <div className="type-selector">
                              <label className={`type-option ${source.config.type === 'mocked' ? 'selected' : ''}`}>
                                <input
                                  type="radio"
                                  name={`type-${source.id}`}
                                  value="mocked"
                                  checked={source.config.type === 'mocked'}
                                  onChange={() => handleTypeToggle(source.id, 'mocked')}
                                />
                                <div className="option-content">
                                  <span className="option-icon">🎭</span>
                                  <div>
                                    <strong>Mocked Data</strong>
                                    <p>Use simulated data for testing</p>
                                  </div>
                                </div>
                              </label>
                              
                              <label className={`type-option ${source.config.type === 'real_api' ? 'selected' : ''}`}>
                                <input
                                  type="radio"
                                  name={`type-${source.id}`}
                                  value="real_api"
                                  checked={source.config.type === 'real_api'}
                                  onChange={() => handleTypeToggle(source.id, 'real_api')}
                                />
                                <div className="option-content">
                                  <span className="option-icon">🌐</span>
                                  <div>
                                    <strong>Real API</strong>
                                    <p>Connect to live data source</p>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>

                          {source.config.type === 'real_api' && (
                            <ApiConfigurationForm
                              source={source}
                              onConfigUpdate={(apiConfig) => handleApiConfigUpdate(source.id, apiConfig)}
                            />
                          )}
                        </div>

                        <div className="capabilities">
                          <label className="control-label">Capabilities</label>
                          <div className="capabilities-list">
                            {source.capabilities.map(capability => (
                              <span key={capability} className="capability-tag">
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface ApiConfigurationFormProps {
  source: DataSource;
  onConfigUpdate: (config: any) => void;
}

const ApiConfigurationForm: React.FC<ApiConfigurationFormProps> = ({ source, onConfigUpdate }) => {
  const [apiConfig, setApiConfig] = useState({
    endpoint: source.config.apiConfig?.endpoint || source.realApiConfig?.endpoint || '',
    authToken: source.config.apiConfig?.authToken || '',
    webhookUrl: source.config.apiConfig?.webhookUrl || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigUpdate(apiConfig);
  };

  const handleInputChange = (field: string, value: string) => {
    setApiConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="api-config-form">
      <label className="control-label">API Configuration</label>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>API Endpoint URL</label>
          <input
            type="url"
            value={apiConfig.endpoint}
            onChange={(e) => handleInputChange('endpoint', e.target.value)}
            placeholder={source.realApiConfig?.endpoint || 'https://api.example.com'}
            required
          />
        </div>

        {source.realApiConfig?.authRequired && (
          <div className="input-group">
            <label>Authentication Token</label>
            <input
              type="password"
              value={apiConfig.authToken}
              onChange={(e) => handleInputChange('authToken', e.target.value)}
              placeholder="Enter your API key or token"
              required
            />
          </div>
        )}

        {source.realApiConfig?.supportsWebhooks && (
          <div className="input-group">
            <label>Webhook URL (optional)</label>
            <input
              type="url"
              value={apiConfig.webhookUrl}
              onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
              placeholder="https://your-webhook-endpoint.com/webhook"
            />
          </div>
        )}

        <button type="submit" className="save-config-btn">
          💾 Save Configuration
        </button>
      </form>
    </div>
  );
};
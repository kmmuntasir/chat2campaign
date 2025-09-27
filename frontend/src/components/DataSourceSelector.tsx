import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import './DataSourceSelector.css';

interface DataSource {
  id: string;
  name: string;
  type: 'mocked' | 'real_api';
  description?: string;
  category?: string;
  icon?: string;
  capabilities?: string[];
}

interface DataSourceSelectorProps {
  onSelectionChange?: (selectedSources: string[]) => void;
  maxSelections?: number;
  disabled?: boolean;
  initialSelection?: string[];
}

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  onSelectionChange,
  maxSelections = 3,
  disabled = false,
  initialSelection = []
}) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(initialSelection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await ApiService.getSources();
      
      if (response.error) {
        throw new Error(response.error);
      }

      const sources = response.data?.sources || response.data || [];
      setDataSources(sources);
      
      // Extract categories
      const uniqueCategories = [...new Set(sources.map((s: DataSource) => s.category).filter(Boolean))] as string[];
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Error fetching data sources:', err);
      setError('Failed to load data sources. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    if (disabled) return;

    let newSelection: string[];
    
    if (selectedSources.includes(sourceId)) {
      // Remove from selection
      newSelection = selectedSources.filter(id => id !== sourceId);
    } else {
      // Add to selection if under limit
      if (selectedSources.length >= maxSelections) {
        return; // Don't allow selection beyond limit
      }
      newSelection = [...selectedSources, sourceId];
    }
    
    setSelectedSources(newSelection);
    onSelectionChange?.(newSelection);
  };

  const clearSelection = () => {
    if (disabled) return;
    setSelectedSources([]);
    onSelectionChange?.([]);
  };

  const getFilteredSources = () => {
    let filtered = dataSources;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(source => source.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(source => 
        source.name.toLowerCase().includes(term) ||
        source.description?.toLowerCase().includes(term) ||
        source.category?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="data-source-selector">
        <div className="selector-header">
          <h3>Select Data Sources</h3>
          <div className="loading-indicator">Loading data sources...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-source-selector">
        <div className="selector-header">
          <h3>Select Data Sources</h3>
          <div className="error-message">
            {error}
            <button onClick={fetchDataSources} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredSources = getFilteredSources();

  return (
    <div className="data-source-selector">
      <div className="selector-header">
        <h3>Select Data Sources</h3>
        <div className="selection-info">
          {selectedSources.length} of {maxSelections} selected
          {selectedSources.length > 0 && (
            <button onClick={clearSelection} className="clear-button" disabled={disabled}>
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="selector-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search data sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={disabled}
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
            disabled={disabled}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sources-grid">
        {filteredSources.map(source => {
          const isSelected = selectedSources.includes(source.id);
          const canSelect = !isSelected && selectedSources.length < maxSelections;
          const isDisabled = disabled || (!isSelected && !canSelect);
          
          return (
            <div
              key={source.id}
              className={`source-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleSourceToggle(source.id)}
            >
              <div className="source-left">
                <div className="source-icon">
                  {source.icon || '📊'}
                </div>
                <div className="source-info">
                  <h4 className="source-name">{source.name}</h4>
                  <div className="source-meta">
                    <span className={`source-type ${source.type}`}>
                      {source.type === 'mocked' ? 'MOCK' : 'API'}
                    </span>
                    {source.category && (
                      <span className="source-category">{source.category}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="selection-indicator">
                {isSelected && <span className="checkmark">✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSources.length === 0 && (
        <div className="no-sources">
          <p>No data sources found matching your criteria.</p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="reset-filters-button"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {selectedSources.length > 0 && (
        <div className="selected-sources-summary">
          <h4>Selected Sources:</h4>
          <div className="selected-list">
            {selectedSources.map(sourceId => {
              const source = dataSources.find(s => s.id === sourceId);
              return source ? (
                <div key={sourceId} className="selected-item">
                  <span className="selected-icon">{source.icon || '📊'}</span>
                  <span className="selected-name">{source.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSourceToggle(sourceId);
                    }}
                    className="remove-button"
                    disabled={disabled}
                    aria-label="Remove source"
                  >
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
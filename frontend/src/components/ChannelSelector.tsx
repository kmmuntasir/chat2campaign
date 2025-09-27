import React, { useState, useEffect } from 'react';
import './ChannelSelector.css';

interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'messaging' | 'social' | 'advertising' | 'voice';
  capabilities: string[];
  deliverySpeed: 'instant' | 'fast' | 'medium' | 'slow';
  costLevel: 'low' | 'medium' | 'high';
  reachPotential: 'low' | 'medium' | 'high' | 'very_high';
}

interface ChannelSelectorProps {
  onSelectionChange?: (selectedChannels: string[]) => void;
  maxSelections?: number;
  disabled?: boolean;
  initialSelection?: string[];
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  onSelectionChange,
  maxSelections = 4,
  disabled = false,
  initialSelection = []
}) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(initialSelection);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Predefined channels based on PRD requirements
  const availableChannels: Channel[] = [
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      description: 'Traditional email marketing with high engagement and detailed analytics',
      category: 'messaging',
      capabilities: ['personalization', 'automation', 'analytics', 'attachments'],
      deliverySpeed: 'fast',
      costLevel: 'low',
      reachPotential: 'very_high'
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: '💬',
      description: 'Direct text messaging with immediate delivery and high open rates',
      category: 'messaging',
      capabilities: ['instant_delivery', 'high_open_rate', 'character_limit'],
      deliverySpeed: 'instant',
      costLevel: 'medium',
      reachPotential: 'high'
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: '🔔',
      description: 'Mobile app push notifications for real-time engagement',
      category: 'messaging',
      capabilities: ['real_time', 'rich_media', 'location_based', 'segmentation'],
      deliverySpeed: 'instant',
      costLevel: 'low',
      reachPotential: 'high'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💚',
      description: 'Popular messaging platform with rich media and business features',
      category: 'social',
      capabilities: ['rich_media', 'two_way_conversation', 'global_reach', 'business_api'],
      deliverySpeed: 'instant',
      costLevel: 'medium',
      reachPotential: 'very_high'
    },
    {
      id: 'voice',
      name: 'Voice Calls',
      icon: '📞',
      description: 'Direct voice communication for high-priority messages',
      category: 'voice',
      capabilities: ['personal_touch', 'immediate_attention', 'complex_messages'],
      deliverySpeed: 'instant',
      costLevel: 'high',
      reachPotential: 'medium'
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      icon: '💙',
      description: 'Facebook Messenger platform with chatbot and automation support',
      category: 'social',
      capabilities: ['chatbots', 'rich_cards', 'social_integration', 'automation'],
      deliverySpeed: 'fast',
      costLevel: 'low',
      reachPotential: 'high'
    },
    {
      id: 'ads',
      name: 'Digital Ads',
      icon: '🎯',
      description: 'Targeted advertising across social media and search platforms',
      category: 'advertising',
      capabilities: ['precise_targeting', 'visual_creative', 'retargeting', 'conversion_tracking'],
      deliverySpeed: 'medium',
      costLevel: 'high',
      reachPotential: 'very_high'
    }
  ];

  useEffect(() => {
    setSelectedChannels(initialSelection);
  }, [initialSelection]);

  const handleChannelToggle = (channelId: string) => {
    if (disabled) return;

    let newSelection: string[];
    
    if (selectedChannels.includes(channelId)) {
      // Remove from selection
      newSelection = selectedChannels.filter(id => id !== channelId);
    } else {
      // Add to selection if under limit
      if (selectedChannels.length >= maxSelections) {
        return; // Don't allow selection beyond limit
      }
      newSelection = [...selectedChannels, channelId];
    }
    
    setSelectedChannels(newSelection);
    onSelectionChange?.(newSelection);
  };

  const clearSelection = () => {
    if (disabled) return;
    setSelectedChannels([]);
    onSelectionChange?.([]);
  };

  const getFilteredAndSortedChannels = () => {
    let filtered = availableChannels;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(channel => channel.category === filterCategory);
    }

    // Sort channels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'speed':
          const speedOrder = { instant: 4, fast: 3, medium: 2, slow: 1 };
          return speedOrder[b.deliverySpeed] - speedOrder[a.deliverySpeed];
        case 'cost':
          const costOrder = { low: 1, medium: 2, high: 3 };
          return costOrder[a.costLevel] - costOrder[b.costLevel];
        case 'reach':
          const reachOrder = { low: 1, medium: 2, high: 3, very_high: 4 };
          return reachOrder[b.reachPotential] - reachOrder[a.reachPotential];
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getDeliverySpeedColor = (speed: string) => {
    switch (speed) {
      case 'instant': return '#27ae60';
      case 'fast': return '#f39c12';
      case 'medium': return '#e67e22';
      case 'slow': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getCostLevelColor = (cost: string) => {
    switch (cost) {
      case 'low': return '#27ae60';
      case 'medium': return '#f39c12';
      case 'high': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getReachPotentialColor = (reach: string) => {
    switch (reach) {
      case 'very_high': return '#8e44ad';
      case 'high': return '#3498db';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const categories = [...new Set(availableChannels.map(c => c.category))];
  const filteredChannels = getFilteredAndSortedChannels();

  return (
    <div className="channel-selector">
      <div className="selector-header">
        <h3>Select Communication Channels</h3>
        <div className="selection-info">
          {selectedChannels.length} of {maxSelections} selected
          {selectedChannels.length > 0 && (
            <button onClick={clearSelection} className="clear-button" disabled={disabled}>
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="selector-controls">
        <div className="filter-controls">
          <div className="category-filter">
            <label>Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-select"
              disabled={disabled}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              disabled={disabled}
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="speed">Delivery Speed</option>
              <option value="cost">Cost Level</option>
              <option value="reach">Reach Potential</option>
            </select>
          </div>
        </div>
      </div>

      <div className="channels-grid">
        {filteredChannels.map(channel => {
          const isSelected = selectedChannels.includes(channel.id);
          const canSelect = !isSelected && selectedChannels.length < maxSelections;
          const isDisabled = disabled || (!isSelected && !canSelect);
          
          return (
            <div
              key={channel.id}
              className={`channel-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleChannelToggle(channel.id)}
            >
              <div className="channel-left">
                <div className="channel-icon">
                  {channel.icon}
                </div>
                <div className="channel-info">
                  <h4 className="channel-name">{channel.name}</h4>
                  <div className="channel-category">
                    {channel.category.charAt(0).toUpperCase() + channel.category.slice(1)}
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

      {filteredChannels.length === 0 && (
        <div className="no-channels">
          <p>No channels found matching your criteria.</p>
          <button 
            onClick={() => {
              setFilterCategory('all');
              setSortBy('name');
            }}
            className="reset-filters-button"
          >
            Reset Filters
          </button>
        </div>
      )}

      {selectedChannels.length > 0 && (
        <div className="selected-channels-summary">
          <h4>Selected Channels:</h4>
          <div className="selected-list">
            {selectedChannels.map(channelId => {
              const channel = availableChannels.find(c => c.id === channelId);
              return channel ? (
                <div key={channelId} className="selected-item">
                  <span className="selected-icon">{channel.icon}</span>
                  <span className="selected-name">{channel.name}</span>
                  <span className="selected-category">{channel.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChannelToggle(channelId);
                    }}
                    className="remove-button"
                    disabled={disabled}
                  >
                    ×
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
interface DataSource {
  id: string;
  name: string;
  type: 'mocked' | 'real_api';
  description?: string;
  category?: string;
  icon?: string;
  capabilities?: string[];
  mockConfig?: {
    eventTypes: string[];
    sampleRate: number;
  };
  realApiConfig?: {
    endpoint?: string;
    authRequired: boolean;
    supportsWebhooks: boolean;
  };
}

interface DataSourceConfig {
  [sourceId: string]: {
    type: 'mocked' | 'real_api';
    enabled: boolean;
    apiConfig?: {
      endpoint?: string;
      authToken?: string;
      webhookUrl?: string;
    };
  };
}

export class DataSourcesService {
  private dataSourceDefinitions: DataSource[] = [
    {
      id: 'website',
      name: 'Website Events',
      type: 'mocked',
      description: 'Track user behavior, page views, and conversion events on your website',
      category: 'Web Analytics',
      icon: '🌐',
      capabilities: ['pageviews', 'sessions', 'conversions', 'user_events'],
      mockConfig: {
        eventTypes: ['page_view', 'session_start', 'conversion', 'cart_abandonment'],
        sampleRate: 100
      },
      realApiConfig: {
        authRequired: false,
        supportsWebhooks: true
      }
    },
    {
      id: 'shopify',
      name: 'Shopify Store',
      type: 'mocked',
      description: 'E-commerce data from your Shopify store including orders, customers, and products',
      category: 'E-commerce',
      icon: '🛒',
      capabilities: ['orders', 'customers', 'products', 'inventory'],
      mockConfig: {
        eventTypes: ['order_created', 'order_cancelled', 'customer_created', 'product_viewed'],
        sampleRate: 80
      },
      realApiConfig: {
        endpoint: 'https://api.shopify.com',
        authRequired: true,
        supportsWebhooks: true
      }
    },
    {
      id: 'facebook_page',
      name: 'Facebook Page',
      type: 'mocked',
      description: 'Social media engagement metrics and audience insights from your Facebook page',
      category: 'Social Media',
      icon: '📘',
      capabilities: ['posts', 'engagement', 'audience_insights', 'messages'],
      mockConfig: {
        eventTypes: ['post_published', 'comment_received', 'message_received', 'follower_gained'],
        sampleRate: 60
      },
      realApiConfig: {
        endpoint: 'https://graph.facebook.com',
        authRequired: true,
        supportsWebhooks: true
      }
    },
    {
      id: 'google_tag_manager',
      name: 'Google Tag Manager',
      type: 'mocked',
      description: 'Enhanced tracking and event management through Google Tag Manager',
      category: 'Analytics',
      icon: '📊',
      capabilities: ['custom_events', 'enhanced_ecommerce', 'goal_tracking'],
      mockConfig: {
        eventTypes: ['custom_event', 'enhanced_ecommerce', 'goal_completion'],
        sampleRate: 90
      },
      realApiConfig: {
        authRequired: true,
        supportsWebhooks: false
      }
    },
    {
      id: 'google_ads_tag',
      name: 'Google Ads Tag',
      type: 'mocked',
      description: 'Advertising performance data and conversion tracking from Google Ads',
      category: 'Advertising',
      icon: '📢',
      capabilities: ['ad_performance', 'conversion_tracking', 'audience_data'],
      mockConfig: {
        eventTypes: ['ad_click', 'conversion', 'impression', 'cost_data'],
        sampleRate: 70
      },
      realApiConfig: {
        endpoint: 'https://googleads.googleapis.com',
        authRequired: true,
        supportsWebhooks: false
      }
    },
    {
      id: 'facebook_pixel',
      name: 'Facebook Pixel',
      type: 'mocked',
      description: 'Website conversion tracking and audience building through Facebook Pixel',
      category: 'Advertising',
      icon: '👁️',
      capabilities: ['conversion_tracking', 'audience_building', 'retargeting'],
      mockConfig: {
        eventTypes: ['pixel_fired', 'conversion', 'custom_event', 'audience_match'],
        sampleRate: 85
      },
      realApiConfig: {
        endpoint: 'https://graph.facebook.com',
        authRequired: true,
        supportsWebhooks: true
      }
    },
    {
      id: 'crm_system',
      name: 'CRM System',
      type: 'mocked',
      description: 'Customer relationship management data including contacts, deals, and activities',
      category: 'Customer Management',
      icon: '👥',
      capabilities: ['contacts', 'deals', 'activities', 'customer_lifecycle'],
      mockConfig: {
        eventTypes: ['contact_created', 'deal_updated', 'activity_logged', 'lifecycle_stage_change'],
        sampleRate: 95
      },
      realApiConfig: {
        authRequired: true,
        supportsWebhooks: true
      }
    },
    {
      id: 'twitter_page',
      name: 'Twitter Page',
      type: 'mocked',
      description: 'Social media engagement and audience insights from your Twitter account',
      category: 'Social Media',
      icon: '🐦',
      capabilities: ['tweets', 'engagement', 'mentions', 'followers'],
      mockConfig: {
        eventTypes: ['tweet_published', 'mention_received', 'follower_gained', 'engagement_event'],
        sampleRate: 50
      },
      realApiConfig: {
        endpoint: 'https://api.twitter.com',
        authRequired: true,
        supportsWebhooks: true
      }
    },
    {
      id: 'review_sites',
      name: 'Review Sites',
      type: 'mocked',
      description: 'Customer reviews and ratings aggregated from various review platforms',
      category: 'Reputation',
      icon: '⭐',
      capabilities: ['reviews', 'ratings', 'sentiment', 'response_management'],
      mockConfig: {
        eventTypes: ['review_received', 'rating_updated', 'response_posted'],
        sampleRate: 40
      },
      realApiConfig: {
        authRequired: true,
        supportsWebhooks: false
      }
    },
    {
      id: 'ad_managers',
      name: 'Ad Managers',
      type: 'mocked',
      description: 'Multi-platform advertising performance data and campaign management',
      category: 'Advertising',
      icon: '📈',
      capabilities: ['campaign_performance', 'audience_insights', 'budget_optimization'],
      mockConfig: {
        eventTypes: ['campaign_started', 'performance_update', 'budget_alert', 'audience_insight'],
        sampleRate: 75
      },
      realApiConfig: {
        authRequired: true,
        supportsWebhooks: true
      }
    }
  ];

  private currentConfig: DataSourceConfig = {};

  constructor() {
    // Initialize with default mocked configuration
    this.dataSourceDefinitions.forEach(source => {
      this.currentConfig[source.id] = {
        type: 'mocked',
        enabled: true
      };
    });
  }

  public getAllSources(): DataSource[] {
    return this.dataSourceDefinitions.map(source => ({
      ...source,
      type: this.currentConfig[source.id]?.type || source.type
    }));
  }

  public getEnabledSources(): DataSource[] {
    return this.getAllSources().filter(source => 
      this.currentConfig[source.id]?.enabled !== false
    );
  }

  public getSourceById(id: string): DataSource | undefined {
    const source = this.dataSourceDefinitions.find(s => s.id === id);
    if (!source) return undefined;

    return {
      ...source,
      type: this.currentConfig[source.id]?.type || source.type
    };
  }

  public getSourcesByCategory(category: string): DataSource[] {
    return this.getAllSources().filter(source => source.category === category);
  }

  public getAvailableCategories(): string[] {
    return [...new Set(this.dataSourceDefinitions.map(s => s.category))].filter(Boolean) as string[];
  }

  public updateSourceConfig(sourceId: string, config: Partial<DataSourceConfig[string]>): boolean {
    const source = this.dataSourceDefinitions.find(s => s.id === sourceId);
    if (!source) return false;

    this.currentConfig[sourceId] = {
      ...this.currentConfig[sourceId],
      ...config
    };

    return true;
  }

  public setSourceType(sourceId: string, type: 'mocked' | 'real_api'): boolean {
    return this.updateSourceConfig(sourceId, { type });
  }

  public enableSource(sourceId: string, enabled: boolean = true): boolean {
    return this.updateSourceConfig(sourceId, { enabled });
  }

  public getSourceConfig(sourceId: string): DataSourceConfig[string] | undefined {
    return this.currentConfig[sourceId];
  }

  public getAllConfigs(): DataSourceConfig {
    return { ...this.currentConfig };
  }

  public setGlobalType(type: 'mocked' | 'real_api'): void {
    Object.keys(this.currentConfig).forEach(sourceId => {
      this.currentConfig[sourceId].type = type;
    });
  }

  public resetToDefaults(): void {
    this.dataSourceDefinitions.forEach(source => {
      this.currentConfig[source.id] = {
        type: 'mocked',
        enabled: true
      };
    });
  }

  public validateSourceSelection(selectedSources: string[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (selectedSources.length === 0) {
      errors.push('At least one data source must be selected');
    }

    if (selectedSources.length > 3) {
      errors.push('Maximum of 3 data sources can be selected');
    }

    const invalidSources = selectedSources.filter(id => 
      !this.dataSourceDefinitions.find(s => s.id === id)
    );

    if (invalidSources.length > 0) {
      errors.push(`Invalid data sources: ${invalidSources.join(', ')}`);
    }

    const disabledSources = selectedSources.filter(id =>
      this.currentConfig[id]?.enabled === false
    );

    if (disabledSources.length > 0) {
      errors.push(`Disabled data sources: ${disabledSources.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public getSourceStats(): {
    total: number;
    enabled: number;
    mocked: number;
    realApi: number;
    byCategory: Record<string, number>;
  } {
    const sources = this.getAllSources();
    const enabled = sources.filter(s => this.currentConfig[s.id]?.enabled !== false);
    
    return {
      total: sources.length,
      enabled: enabled.length,
      mocked: sources.filter(s => s.type === 'mocked').length,
      realApi: sources.filter(s => s.type === 'real_api').length,
      byCategory: sources.reduce((acc, source) => {
        const category = source.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
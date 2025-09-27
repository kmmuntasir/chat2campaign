/**
 * RealAPIService - Handles connections to external APIs for real data integration
 * Provides authentication, data fetching, transformation, and error handling
 */

import { DataSourcesService } from './datasources.service';
import { MockDataGenerator, MockEvent } from './mock-data.generator';

export interface APICredentials {
  apiKey?: string;
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  webhookSecret?: string;
  customHeaders?: Record<string, string>;
}

export interface APIConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  credentials: APICredentials;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  responseTime: number;
  source: string;
}

export interface TransformedEvent {
  id: string;
  source: string;
  eventType: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  data: Record<string, any>;
  metadata: {
    source_quality: 'high' | 'medium' | 'low';
    api_endpoint: string;
    response_time: number;
    is_real_api: boolean;
    transformation_version: string;
  };
}

export class RealAPIService {
  private dataSourcesService: DataSourcesService;
  private mockDataGenerator: MockDataGenerator;
  private apiClients: Map<string, any> = new Map();
  private failureTracker: Map<string, { count: number; lastFailure: Date }> = new Map();
  private readonly MAX_FAILURES = 3;
  private readonly FAILURE_RESET_TIME = 300000; // 5 minutes

  constructor(dataSourcesService: DataSourcesService) {
    this.dataSourcesService = dataSourcesService;
    this.mockDataGenerator = new MockDataGenerator();
  }

  /**
   * Fetch data from real API or fallback to mock data
   */
  public async fetchRealAPIData(sourceId: string): Promise<TransformedEvent[]> {
    const startTime = Date.now();
    const sourceConfig = this.dataSourcesService.getSourceConfig(sourceId);
    const source = this.dataSourcesService.getSourceById(sourceId);

    if (!source || !sourceConfig) {
      console.error(`Source configuration not found for: ${sourceId}`);
      return this.fallbackToMockData(sourceId, `Source ${sourceId} not configured`);
    }

    // Check if source is configured for real API
    if (sourceConfig.type !== 'real_api') {
      console.log(`Source ${sourceId} is configured for mock data, using MockDataGenerator`);
      return this.convertMockToTransformed(sourceId);
    }

    // Check if API has failed too many times recently
    if (this.isAPITemporarilyDisabled(sourceId)) {
      console.warn(`API for ${sourceId} temporarily disabled due to repeated failures`);
      return this.fallbackToMockData(sourceId, 'API temporarily disabled');
    }

    try {
      const apiResponse = await this.makeAPIRequest(sourceId, sourceConfig);
      
      if (apiResponse.success && apiResponse.data) {
        // Reset failure counter on success
        this.failureTracker.delete(sourceId);
        
        // Transform API data to our standard format
        const transformedEvents = this.transformAPIData(sourceId, apiResponse.data, apiResponse.responseTime);
        
        console.log(`Successfully fetched ${transformedEvents.length} events from ${sourceId} API`);
        return transformedEvents;
      } else {
        throw new Error(apiResponse.error || 'API request failed');
      }
    } catch (error) {
      console.error(`Real API fetch failed for ${sourceId}:`, error);
      
      // Track failure
      this.trackAPIFailure(sourceId);
      
      // Fallback to mock data
      return this.fallbackToMockData(sourceId, error instanceof Error ? error.message : 'Unknown API error');
    }
  }

  /**
   * Make authenticated request to external API
   */
  private async makeAPIRequest(sourceId: string, sourceConfig: any): Promise<APIResponse> {
    const startTime = Date.now();
    
    try {
      const apiConfig = this.buildAPIConfig(sourceId, sourceConfig);
      const response = await this.executeRequest(sourceId, apiConfig);
      
      return {
        success: true,
        data: response,
        responseTime: Date.now() - startTime,
        source: sourceId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'API request failed',
        statusCode: error.status || error.statusCode,
        responseTime: Date.now() - startTime,
        source: sourceId
      };
    }
  }

  /**
   * Build API configuration for specific data source
   */
  private buildAPIConfig(sourceId: string, sourceConfig: any): APIConfig {
    const apiConfig = sourceConfig.apiConfig || {};
    
    const commonConfig = {
      timeout: 30000, // 30 seconds
      retryAttempts: 2,
      retryDelay: 1000, // 1 second
      method: 'GET' as const
    };

    switch (sourceId) {
      case 'website':
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || 'https://api.example.com/analytics',
          credentials: {
            apiKey: apiConfig.authToken,
            customHeaders: {
              'User-Agent': 'Chat2Campaign/1.0',
              'Accept': 'application/json'
            }
          }
        };

      case 'shopify':
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || 'https://api.shopify.com/admin/api/2023-01/orders.json',
          credentials: {
            accessToken: apiConfig.authToken,
            customHeaders: {
              'X-Shopify-Access-Token': apiConfig.authToken,
              'Content-Type': 'application/json'
            }
          }
        };

      case 'facebook_page':
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || 'https://graph.facebook.com/v18.0/me/posts',
          credentials: {
            accessToken: apiConfig.authToken,
            customHeaders: {
              'Authorization': `Bearer ${apiConfig.authToken}`
            }
          }
        };

      case 'google_ads_tag':
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || 'https://googleads.googleapis.com/v13/customers',
          credentials: {
            accessToken: apiConfig.authToken,
            customHeaders: {
              'Authorization': `Bearer ${apiConfig.authToken}`,
              'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN
            }
          }
        };

      case 'crm_system':
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || 'https://api.hubspot.com/crm/v3/objects/contacts',
          credentials: {
            accessToken: apiConfig.authToken,
            customHeaders: {
              'Authorization': `Bearer ${apiConfig.authToken}`,
              'Content-Type': 'application/json'
            }
          }
        };

      default:
        return {
          ...commonConfig,
          endpoint: apiConfig.endpoint || `https://api.${sourceId}.com/data`,
          credentials: {
            apiKey: apiConfig.authToken,
            customHeaders: {
              'Authorization': `Bearer ${apiConfig.authToken}`,
              'Content-Type': 'application/json'
            }
          }
        };
    }
  }

  /**
   * Execute HTTP request with authentication and error handling
   */
  private async executeRequest(sourceId: string, config: APIConfig): Promise<any> {
    const headers: Record<string, string> = {
      'User-Agent': 'Chat2Campaign/1.0',
      'Accept': 'application/json',
      ...config.credentials.customHeaders
    };

    // Add authentication based on credentials type
    if (config.credentials.apiKey) {
      headers['X-API-Key'] = config.credentials.apiKey;
    }
    if (config.credentials.accessToken) {
      headers['Authorization'] = `Bearer ${config.credentials.accessToken}`;
    }

    const requestOptions: RequestInit = {
      method: config.method,
      headers: headers,
      signal: AbortSignal.timeout(config.timeout)
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        console.log(`Attempting API request for ${sourceId} (attempt ${attempt + 1}/${config.retryAttempts + 1})`);
        
        const response = await fetch(config.endpoint, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
      } catch (error: any) {
        lastError = error;
        console.warn(`API request attempt ${attempt + 1} failed for ${sourceId}:`, error.message);
        
        if (attempt < config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, config.retryDelay * (attempt + 1)));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Transform external API data to our standard event format
   */
  private transformAPIData(sourceId: string, apiData: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    
    try {
      switch (sourceId) {
        case 'website':
          events.push(...this.transformWebsiteData(sourceId, apiData, responseTime));
          break;
        case 'shopify':
          events.push(...this.transformShopifyData(sourceId, apiData, responseTime));
          break;
        case 'facebook_page':
          events.push(...this.transformFacebookData(sourceId, apiData, responseTime));
          break;
        case 'google_ads_tag':
          events.push(...this.transformGoogleAdsData(sourceId, apiData, responseTime));
          break;
        case 'crm_system':
          events.push(...this.transformCRMData(sourceId, apiData, responseTime));
          break;
        default:
          events.push(...this.transformGenericData(sourceId, apiData, responseTime));
      }
    } catch (error) {
      console.error(`Data transformation failed for ${sourceId}:`, error);
      // Return empty array, let fallback handle it
      return [];
    }
    
    return events;
  }

  /**
   * Transform website analytics data
   */
  private transformWebsiteData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    
    // Handle different website analytics API formats
    const pageViews = data.pageviews || data.page_views || [];
    const sessions = data.sessions || [];
    const conversions = data.conversions || [];
    
    // Transform page views
    pageViews.forEach((pv: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'page_view',
        timestamp: pv.timestamp || pv.date || new Date().toISOString(),
        userId: pv.user_id || pv.userId,
        sessionId: pv.session_id || pv.sessionId,
        data: {
          page_url: pv.page || pv.url || pv.path,
          page_title: pv.title,
          referrer: pv.referrer,
          device_type: pv.device_type || pv.device,
          browser: pv.browser,
          session_duration: pv.session_duration || pv.duration,
          bounce_rate: pv.bounce_rate || pv.bounced
        },
        metadata: {
          source_quality: 'high',
          api_endpoint: 'website_analytics_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    // Transform conversions
    conversions.forEach((conv: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'conversion',
        timestamp: conv.timestamp || conv.date || new Date().toISOString(),
        userId: conv.user_id || conv.userId,
        sessionId: conv.session_id || conv.sessionId,
        data: {
          conversion_type: conv.type || 'purchase',
          value: conv.value || conv.amount,
          currency: conv.currency || 'USD',
          conversion_path: conv.path || conv.channel
        },
        metadata: {
          source_quality: 'high',
          api_endpoint: 'website_analytics_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Transform Shopify e-commerce data
   */
  private transformShopifyData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    const orders = data.orders || [];
    
    orders.forEach((order: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'order_created',
        timestamp: order.created_at || order.timestamp || new Date().toISOString(),
        userId: order.customer?.id || order.customer_id,
        data: {
          order_id: order.id || order.order_id,
          order_number: order.order_number || order.number,
          total_price: parseFloat(order.total_price || order.total || '0'),
          currency: order.currency || 'USD',
          fulfillment_status: order.fulfillment_status,
          payment_status: order.financial_status || order.payment_status,
          items_count: order.line_items?.length || 0,
          customer_email: order.email || order.customer?.email,
          items: order.line_items?.map((item: any) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.name || item.title,
            quantity: item.quantity,
            price: parseFloat(item.price || '0')
          })) || []
        },
        metadata: {
          source_quality: 'high',
          api_endpoint: 'shopify_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Transform Facebook page data
   */
  private transformFacebookData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    const posts = data.data || data.posts || [];
    
    posts.forEach((post: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'post_published',
        timestamp: post.created_time || new Date().toISOString(),
        data: {
          post_id: post.id,
          message: post.message,
          post_type: post.type || 'status',
          likes: post.likes?.summary?.total_count || 0,
          comments: post.comments?.summary?.total_count || 0,
          shares: post.shares?.count || 0,
          reach: post.insights?.data?.find((i: any) => i.name === 'post_impressions')?.values?.[0]?.value || 0
        },
        metadata: {
          source_quality: 'medium',
          api_endpoint: 'facebook_graph_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Transform Google Ads data
   */
  private transformGoogleAdsData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    const results = data.results || data.data || [];
    
    results.forEach((result: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'ad_performance',
        timestamp: new Date().toISOString(),
        data: {
          campaign_id: result.campaign?.resource_name || result.campaign_id,
          impressions: parseInt(result.metrics?.impressions || '0'),
          clicks: parseInt(result.metrics?.clicks || '0'),
          cost_micros: parseInt(result.metrics?.cost_micros || '0'),
          conversions: parseFloat(result.metrics?.conversions || '0'),
          ctr: parseFloat(result.metrics?.ctr || '0'),
          average_cpc: parseInt(result.metrics?.average_cpc || '0')
        },
        metadata: {
          source_quality: 'high',
          api_endpoint: 'google_ads_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Transform CRM data
   */
  private transformCRMData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    const contacts = data.results || data.contacts || data.data || [];
    
    contacts.forEach((contact: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: 'contact_updated',
        timestamp: contact.updatedAt || contact.updated_at || new Date().toISOString(),
        userId: contact.id || contact.contact_id,
        data: {
          contact_id: contact.id,
          email: contact.properties?.email || contact.email,
          lifecycle_stage: contact.properties?.lifecyclestage || contact.lifecycle_stage,
          lead_score: parseInt(contact.properties?.hubspotscore || contact.lead_score || '0'),
          last_activity: contact.properties?.lastactivitydate || contact.last_activity,
          deal_stage: contact.properties?.dealstage || contact.deal_stage
        },
        metadata: {
          source_quality: 'high',
          api_endpoint: 'crm_api',
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Generic data transformation for unknown API formats
   */
  private transformGenericData(sourceId: string, data: any, responseTime: number): TransformedEvent[] {
    const events: TransformedEvent[] = [];
    
    // Try to extract events from common data structures
    const dataArray = Array.isArray(data) ? data : 
                     data.data || data.results || data.items || data.events || [data];
    
    dataArray.forEach((item: any) => {
      events.push({
        id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: sourceId,
        eventType: item.type || item.event_type || 'generic_event',
        timestamp: item.timestamp || item.created_at || item.date || new Date().toISOString(),
        userId: item.user_id || item.userId || item.customer_id,
        sessionId: item.session_id || item.sessionId,
        data: item,
        metadata: {
          source_quality: 'medium',
          api_endpoint: `${sourceId}_api`,
          response_time: responseTime,
          is_real_api: true,
          transformation_version: 'v1.0'
        }
      });
    });

    return events;
  }

  /**
   * Convert mock data to transformed event format for consistency
   */
  private async convertMockToTransformed(sourceId: string): Promise<TransformedEvent[]> {
    const mockEvents = this.mockDataGenerator.generateMockEvents({ sourceId });
    
    return mockEvents.map(event => ({
      id: event.id,
      source: event.source,
      eventType: event.eventType,
      timestamp: event.timestamp,
      userId: event.userId,
      sessionId: event.sessionId,
      data: event.data,
      metadata: {
        source_quality: 'medium' as const,
        api_endpoint: 'mock_data_generator',
        response_time: 0,
        is_real_api: false,
        transformation_version: 'v1.0'
      }
    }));
  }

  /**
   * Fallback to mock data when real API fails
   */
  private async fallbackToMockData(sourceId: string, reason: string): Promise<TransformedEvent[]> {
    console.log(`Falling back to mock data for ${sourceId}: ${reason}`);
    
    const mockEvents = await this.convertMockToTransformed(sourceId);
    
    // Add fallback metadata
    mockEvents.forEach(event => {
      event.metadata = {
        ...event.metadata,
        api_fallback: true,
        fallback_reason: reason,
        fallback_timestamp: new Date().toISOString()
      };
    });
    
    return mockEvents;
  }

  /**
   * Track API failures for circuit breaker pattern
   */
  private trackAPIFailure(sourceId: string): void {
    const current = this.failureTracker.get(sourceId) || { count: 0, lastFailure: new Date() };
    current.count++;
    current.lastFailure = new Date();
    this.failureTracker.set(sourceId, current);
    
    console.warn(`API failure count for ${sourceId}: ${current.count}/${this.MAX_FAILURES}`);
  }

  /**
   * Check if API should be temporarily disabled due to failures
   */
  private isAPITemporarilyDisabled(sourceId: string): boolean {
    const failure = this.failureTracker.get(sourceId);
    if (!failure) return false;
    
    // Reset failure count if enough time has passed
    if (Date.now() - failure.lastFailure.getTime() > this.FAILURE_RESET_TIME) {
      this.failureTracker.delete(sourceId);
      return false;
    }
    
    return failure.count >= this.MAX_FAILURES;
  }

  /**
   * Get API health status for all configured sources
   */
  public getAPIHealthStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    const sources = this.dataSourcesService.getAllSources();
    
    sources.forEach(source => {
      const config = this.dataSourcesService.getSourceConfig(source.id);
      const failure = this.failureTracker.get(source.id);
      
      status[source.id] = {
        configured_type: config?.type || 'unknown',
        enabled: config?.enabled || false,
        has_api_config: !!(config?.apiConfig?.endpoint),
        failure_count: failure?.count || 0,
        last_failure: failure?.lastFailure || null,
        temporarily_disabled: this.isAPITemporarilyDisabled(source.id),
        health_status: this.getSourceHealthStatus(source.id)
      };
    });
    
    return status;
  }

  /**
   * Get health status for a specific source
   */
  private getSourceHealthStatus(sourceId: string): 'healthy' | 'degraded' | 'unavailable' {
    if (this.isAPITemporarilyDisabled(sourceId)) {
      return 'unavailable';
    }
    
    const failure = this.failureTracker.get(sourceId);
    if (failure && failure.count > 0) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Reset failure tracking for a specific source
   */
  public resetAPIFailures(sourceId: string): void {
    this.failureTracker.delete(sourceId);
    console.log(`Reset failure tracking for ${sourceId}`);
  }

  /**
   * Test API connection for a specific source
   */
  public async testAPIConnection(sourceId: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    const startTime = Date.now();
    
    try {
      const events = await this.fetchRealAPIData(sourceId);
      const responseTime = Date.now() - startTime;
      
      if (events.length > 0 && events[0].metadata.is_real_api) {
        return {
          success: true,
          message: `Successfully connected to ${sourceId} API and fetched ${events.length} events`,
          responseTime
        };
      } else {
        return {
          success: false,
          message: `Connected but using mock data for ${sourceId} (API may be configured incorrectly)`,
          responseTime
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to connect to ${sourceId} API: ${error.message}`,
        responseTime: Date.now() - startTime
      };
    }
  }
}
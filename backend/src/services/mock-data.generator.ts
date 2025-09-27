/**
 * MockDataGenerator - Comprehensive mock data generation for all data sources
 * Provides realistic event simulation with proper data structures and validation
 */

export interface MockEvent {
  id: string;
  timestamp: string;
  source: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MockDataConfig {
  sourceId: string;
  eventCount?: number;
  timeSpanHours?: number;
  userPool?: number;
  includeHistoricalData?: boolean;
}

export class MockDataGenerator {
  private userIdPool: string[] = [];
  private sessionIdPool: string[] = [];
  private productCatalog: any[] = [];
  private customerData: Map<string, any> = new Map();

  constructor() {
    this.initializeDataPools();
  }

  /**
   * Initialize common data pools for consistent mock data
   */
  private initializeDataPools(): void {
    // Generate user IDs
    for (let i = 0; i < 1000; i++) {
      this.userIdPool.push(`user_${i.toString().padStart(4, '0')}`);
    }

    // Generate session IDs
    for (let i = 0; i < 5000; i++) {
      this.sessionIdPool.push(`session_${Date.now()}_${i}`);
    }

    // Initialize product catalog
    this.productCatalog = [
      { id: 'prod_001', name: 'Wireless Headphones', price: 199.99, category: 'Electronics' },
      { id: 'prod_002', name: 'Smart Watch', price: 299.99, category: 'Electronics' },
      { id: 'prod_003', name: 'Running Shoes', price: 129.99, category: 'Sportswear' },
      { id: 'prod_004', name: 'Coffee Maker', price: 89.99, category: 'Home & Kitchen' },
      { id: 'prod_005', name: 'Yoga Mat', price: 29.99, category: 'Fitness' },
      { id: 'prod_006', name: 'Backpack', price: 79.99, category: 'Travel' },
      { id: 'prod_007', name: 'Smartphone Case', price: 24.99, category: 'Accessories' },
      { id: 'prod_008', name: 'Bluetooth Speaker', price: 149.99, category: 'Electronics' },
      { id: 'prod_009', name: 'Desk Lamp', price: 59.99, category: 'Home & Office' },
      { id: 'prod_010', name: 'Water Bottle', price: 19.99, category: 'Lifestyle' }
    ];

    // Initialize customer data
    this.userIdPool.slice(0, 100).forEach(userId => {
      this.customerData.set(userId, {
        firstName: this.getRandomName(),
        email: `${userId}@example.com`,
        tier: this.getRandomElement(['bronze', 'silver', 'gold', 'platinum']),
        registrationDate: this.getRandomDate(365),
        totalOrders: Math.floor(Math.random() * 20),
        lifetimeValue: Math.floor(Math.random() * 2000) + 100,
        location: this.getRandomLocation()
      });
    });
  }

  /**
   * Generate mock events for a specific data source
   */
  public generateMockEvents(config: MockDataConfig): MockEvent[] {
    const events: MockEvent[] = [];
    const eventCount = config.eventCount || Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < eventCount; i++) {
      const event = this.generateEventForSource(config.sourceId, config);
      if (event) {
        events.push(event);
      }
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Generate a single event for a specific data source
   */
  private generateEventForSource(sourceId: string, config: MockDataConfig): MockEvent | null {
    const baseEvent = {
      id: this.generateEventId(),
      timestamp: this.getRandomRecentTimestamp(config.timeSpanHours || 24),
      source: sourceId,
      userId: this.getRandomUserId(),
      sessionId: this.getRandomSessionId()
    };

    switch (sourceId) {
      case 'website':
        return this.generateWebsiteEvent(baseEvent);
      case 'shopify':
        return this.generateShopifyEvent(baseEvent);
      case 'facebook_page':
        return this.generateFacebookPageEvent(baseEvent);
      case 'google_tag_manager':
        return this.generateGTMEvent(baseEvent);
      case 'google_ads_tag':
        return this.generateGoogleAdsEvent(baseEvent);
      case 'facebook_pixel':
        return this.generateFacebookPixelEvent(baseEvent);
      case 'crm_system':
        return this.generateCRMEvent(baseEvent);
      case 'twitter_page':
        return this.generateTwitterEvent(baseEvent);
      case 'review_sites':
        return this.generateReviewEvent(baseEvent);
      case 'ad_managers':
        return this.generateAdManagerEvent(baseEvent);
      default:
        return null;
    }
  }

  /**
   * Generate website analytics events
   */
  private generateWebsiteEvent(base: any): MockEvent {
    const eventTypes = ['page_view', 'session_start', 'conversion', 'cart_abandonment', 'search', 'scroll_depth'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      page_url: this.getRandomPageUrl(),
      referrer: this.getRandomReferrer(),
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip_address: this.getRandomIP()
    };

    switch (eventType) {
      case 'page_view':
        data = {
          ...data,
          page_title: this.getRandomPageTitle(),
          session_duration: Math.floor(Math.random() * 600) + 30,
          bounce_rate: Math.random() < 0.3
        };
        break;
      case 'session_start':
        data = {
          ...data,
          is_new_visitor: Math.random() < 0.4,
          device_type: this.getRandomElement(['desktop', 'mobile', 'tablet']),
          browser: this.getRandomElement(['Chrome', 'Firefox', 'Safari', 'Edge'])
        };
        break;
      case 'conversion':
        data = {
          ...data,
          conversion_type: this.getRandomElement(['purchase', 'signup', 'download']),
          value: Math.floor(Math.random() * 500) + 50,
          currency: 'USD'
        };
        break;
      case 'cart_abandonment':
        const cart = this.generateRandomCart();
        data = {
          ...data,
          cart_value: cart.total,
          items_count: cart.items.length,
          items: cart.items,
          abandonment_reason: this.getRandomElement(['price_concern', 'comparison_shopping', 'distraction', 'checkout_complexity'])
        };
        break;
      case 'search':
        data = {
          ...data,
          search_query: this.getRandomSearchQuery(),
          results_count: Math.floor(Math.random() * 100) + 1,
          clicked_result: Math.random() < 0.7
        };
        break;
      case 'scroll_depth':
        data = {
          ...data,
          max_scroll_percentage: Math.floor(Math.random() * 100) + 1,
          time_on_page: Math.floor(Math.random() * 300) + 10
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        source_quality: 'high',
        data_freshness: 'real_time',
        confidence_score: 0.9 + Math.random() * 0.1
      }
    };
  }

  /**
   * Generate Shopify e-commerce events
   */
  private generateShopifyEvent(base: any): MockEvent {
    const eventTypes = ['order_created', 'order_cancelled', 'customer_created', 'product_viewed', 'inventory_updated'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      store_id: 'store_12345',
      store_name: 'Demo Store'
    };

    switch (eventType) {
      case 'order_created':
        const order = this.generateRandomOrder();
        data = {
          ...data,
          order_id: `order_${Date.now()}`,
          order_number: Math.floor(Math.random() * 10000) + 1000,
          total_price: order.total,
          currency: 'USD',
          items: order.items,
          customer_email: `${base.userId}@example.com`,
          billing_address: this.getRandomAddress(),
          shipping_address: this.getRandomAddress(),
          fulfillment_status: 'unfulfilled',
          payment_status: 'paid'
        };
        break;
      case 'order_cancelled':
        data = {
          ...data,
          order_id: `order_${Date.now() - Math.floor(Math.random() * 86400000)}`,
          cancellation_reason: this.getRandomElement(['customer_request', 'fraud_detected', 'inventory_shortage']),
          refund_amount: Math.floor(Math.random() * 300) + 50
        };
        break;
      case 'customer_created':
        const customer = this.customerData.get(base.userId) || {};
        data = {
          ...data,
          customer_id: base.userId,
          email: customer.email,
          first_name: customer.firstName,
          accepts_marketing: Math.random() < 0.6,
          total_spent: 0,
          orders_count: 0
        };
        break;
      case 'product_viewed':
        const product = this.getRandomElement(this.productCatalog);
        data = {
          ...data,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_category: product.category,
          variant_id: `variant_${Math.floor(Math.random() * 100)}`,
          inventory_quantity: Math.floor(Math.random() * 100) + 1
        };
        break;
      case 'inventory_updated':
        const invProduct = this.getRandomElement(this.productCatalog);
        data = {
          ...data,
          product_id: invProduct.id,
          old_quantity: Math.floor(Math.random() * 50) + 10,
          new_quantity: Math.floor(Math.random() * 100) + 1,
          location: 'main_warehouse'
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        api_version: '2023-01',
        webhook_verified: true,
        source_quality: 'high'
      }
    };
  }

  /**
   * Generate Facebook Page social media events
   */
  private generateFacebookPageEvent(base: any): MockEvent {
    const eventTypes = ['post_published', 'comment_received', 'message_received', 'follower_gained', 'page_view'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      page_id: '1234567890123456',
      page_name: 'Demo Business Page'
    };

    switch (eventType) {
      case 'post_published':
        data = {
          ...data,
          post_id: `post_${Date.now()}`,
          post_type: this.getRandomElement(['status', 'photo', 'video', 'link']),
          message: this.getRandomPostMessage(),
          reach: Math.floor(Math.random() * 5000) + 100,
          engagement: Math.floor(Math.random() * 500) + 10,
          likes: Math.floor(Math.random() * 200) + 5,
          comments: Math.floor(Math.random() * 50) + 1,
          shares: Math.floor(Math.random() * 30) + 1
        };
        break;
      case 'comment_received':
        data = {
          ...data,
          comment_id: `comment_${Date.now()}`,
          post_id: `post_${Date.now() - Math.floor(Math.random() * 86400000)}`,
          message: this.getRandomComment(),
          sentiment: this.getRandomElement(['positive', 'negative', 'neutral']),
          parent_comment_id: Math.random() < 0.3 ? `comment_${Date.now() - 1000}` : null
        };
        break;
      case 'message_received':
        data = {
          ...data,
          conversation_id: `conv_${Date.now()}`,
          message_id: `msg_${Date.now()}`,
          message_text: this.getRandomDirectMessage(),
          sender_id: base.userId,
          is_echo: false,
          quick_reply: null
        };
        break;
      case 'follower_gained':
        data = {
          ...data,
          follower_id: base.userId,
          total_followers: Math.floor(Math.random() * 10000) + 1000,
          source: this.getRandomElement(['organic', 'paid', 'invite'])
        };
        break;
      case 'page_view':
        data = {
          ...data,
          view_type: this.getRandomElement(['page', 'post', 'photo', 'video']),
          referrer: this.getRandomSocialReferrer(),
          device_type: this.getRandomElement(['mobile', 'desktop'])
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        platform: 'facebook',
        api_version: 'v18.0',
        source_quality: 'medium'
      }
    };
  }

  /**
   * Generate Google Tag Manager events
   */
  private generateGTMEvent(base: any): MockEvent {
    const eventTypes = ['custom_event', 'enhanced_ecommerce', 'goal_completion', 'form_submission', 'video_play'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      gtm_id: 'GTM-XXXXXXX',
      container_version: '123'
    };

    switch (eventType) {
      case 'custom_event':
        data = {
          ...data,
          event_name: this.getRandomElement(['button_click', 'file_download', 'external_link', 'scroll_milestone']),
          event_category: this.getRandomElement(['engagement', 'download', 'navigation']),
          event_action: this.getRandomElement(['click', 'download', 'view']),
          event_label: 'custom_tracking',
          value: Math.floor(Math.random() * 100) + 1
        };
        break;
      case 'enhanced_ecommerce':
        const ecommProduct = this.getRandomElement(this.productCatalog);
        data = {
          ...data,
          event_name: 'purchase',
          transaction_id: `txn_${Date.now()}`,
          value: ecommProduct.price,
          currency: 'USD',
          items: [{
            item_id: ecommProduct.id,
            item_name: ecommProduct.name,
            item_category: ecommProduct.category,
            price: ecommProduct.price,
            quantity: Math.floor(Math.random() * 3) + 1
          }]
        };
        break;
      case 'goal_completion':
        data = {
          ...data,
          goal_id: Math.floor(Math.random() * 10) + 1,
          goal_name: this.getRandomElement(['newsletter_signup', 'contact_form', 'product_demo']),
          goal_value: Math.floor(Math.random() * 50) + 5,
          conversion_rate: Math.random() * 0.1 + 0.05
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        tag_manager_version: 'v2',
        tracking_id: 'UA-XXXXXXXX-1',
        source_quality: 'high'
      }
    };
  }

  /**
   * Generate Google Ads events
   */
  private generateGoogleAdsEvent(base: any): MockEvent {
    const eventTypes = ['ad_click', 'conversion', 'impression', 'cost_data', 'keyword_performance'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      account_id: '1234567890',
      campaign_id: `campaign_${Math.floor(Math.random() * 1000) + 1}`,
      ad_group_id: `adgroup_${Math.floor(Math.random() * 100) + 1}`
    };

    switch (eventType) {
      case 'ad_click':
        data = {
          ...data,
          ad_id: `ad_${Math.floor(Math.random() * 1000) + 1}`,
          keyword: this.getRandomKeyword(),
          match_type: this.getRandomElement(['exact', 'phrase', 'broad']),
          quality_score: Math.floor(Math.random() * 10) + 1,
          cpc: Math.round((Math.random() * 5 + 0.5) * 100) / 100,
          position: Math.floor(Math.random() * 4) + 1
        };
        break;
      case 'conversion':
        data = {
          ...data,
          conversion_action: this.getRandomElement(['purchase', 'signup', 'call']),
          conversion_value: Math.floor(Math.random() * 200) + 20,
          currency: 'USD',
          attribution_model: 'last_click'
        };
        break;
      case 'impression':
        data = {
          ...data,
          ad_id: `ad_${Math.floor(Math.random() * 1000) + 1}`,
          impressions: Math.floor(Math.random() * 1000) + 100,
          ctr: Math.round((Math.random() * 0.1 + 0.01) * 10000) / 10000,
          avg_position: Math.round((Math.random() * 3 + 1) * 10) / 10
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        api_version: 'v13',
        account_currency: 'USD',
        source_quality: 'high'
      }
    };
  }

  /**
   * Generate Facebook Pixel events
   */
  private generateFacebookPixelEvent(base: any): MockEvent {
    const eventTypes = ['pixel_fired', 'conversion', 'custom_event', 'audience_match', 'page_view'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      pixel_id: '1234567890123456',
      event_source_url: this.getRandomPageUrl()
    };

    switch (eventType) {
      case 'pixel_fired':
        data = {
          ...data,
          standard_event: this.getRandomElement(['ViewContent', 'AddToCart', 'Purchase', 'Lead']),
          custom_data: {
            value: Math.floor(Math.random() * 100) + 10,
            currency: 'USD',
            content_ids: [this.getRandomElement(this.productCatalog).id]
          }
        };
        break;
      case 'conversion':
        data = {
          ...data,
          conversion_event: 'Purchase',
          conversion_value: Math.floor(Math.random() * 300) + 50,
          currency: 'USD',
          order_id: `order_${Date.now()}`
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        pixel_version: 'v15.0',
        browser_id: base.sessionId,
        source_quality: 'medium'
      }
    };
  }

  /**
   * Generate CRM system events
   */
  private generateCRMEvent(base: any): MockEvent {
    const eventTypes = ['contact_created', 'deal_updated', 'activity_logged', 'lifecycle_stage_change', 'note_added'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      crm_id: 'crm_12345'
    };

    switch (eventType) {
      case 'contact_created':
        const contact = this.customerData.get(base.userId) || {};
        data = {
          ...data,
          contact_id: base.userId,
          email: contact.email,
          first_name: contact.firstName,
          lifecycle_stage: 'lead',
          lead_source: this.getRandomElement(['website', 'social_media', 'referral', 'advertisement']),
          lead_score: Math.floor(Math.random() * 100) + 1
        };
        break;
      case 'deal_updated':
        data = {
          ...data,
          deal_id: `deal_${Date.now()}`,
          deal_name: 'New Business Opportunity',
          deal_stage: this.getRandomElement(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
          deal_value: Math.floor(Math.random() * 10000) + 1000,
          probability: Math.floor(Math.random() * 100) + 1,
          close_date: this.getFutureDate(90)
        };
        break;
      case 'activity_logged':
        data = {
          ...data,
          activity_id: `activity_${Date.now()}`,
          activity_type: this.getRandomElement(['call', 'email', 'meeting', 'task']),
          subject: 'Follow up with prospect',
          outcome: this.getRandomElement(['completed', 'no_answer', 'scheduled_followup'])
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        crm_version: 'v3.0',
        sync_status: 'synced',
        source_quality: 'high'
      }
    };
  }

  /**
   * Generate Twitter events
   */
  private generateTwitterEvent(base: any): MockEvent {
    const eventTypes = ['tweet_published', 'mention_received', 'follower_gained', 'engagement_event', 'direct_message'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      account_id: '@demobusiness',
      account_name: 'Demo Business'
    };

    switch (eventType) {
      case 'tweet_published':
        data = {
          ...data,
          tweet_id: `tweet_${Date.now()}`,
          text: this.getRandomTweet(),
          retweets: Math.floor(Math.random() * 100) + 1,
          likes: Math.floor(Math.random() * 500) + 10,
          replies: Math.floor(Math.random() * 50) + 1,
          hashtags: this.getRandomHashtags()
        };
        break;
      case 'mention_received':
        data = {
          ...data,
          mention_id: `mention_${Date.now()}`,
          author: `@user_${Math.floor(Math.random() * 1000)}`,
          text: `Great product from @demobusiness! ${this.getRandomEmoji()}`,
          sentiment: this.getRandomElement(['positive', 'negative', 'neutral'])
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        api_version: 'v2',
        platform: 'twitter',
        source_quality: 'medium'
      }
    };
  }

  /**
   * Generate review site events
   */
  private generateReviewEvent(base: any): MockEvent {
    const eventTypes = ['review_received', 'rating_updated', 'response_posted'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      platform: this.getRandomElement(['google', 'yelp', 'trustpilot', 'facebook'])
    };

    switch (eventType) {
      case 'review_received':
        const rating = Math.floor(Math.random() * 5) + 1;
        data = {
          ...data,
          review_id: `review_${Date.now()}`,
          rating: rating,
          review_text: this.getRandomReviewText(rating),
          reviewer_name: this.getRandomName(),
          sentiment: rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral',
          verified_purchase: Math.random() < 0.7
        };
        break;
      case 'rating_updated':
        data = {
          ...data,
          average_rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          total_reviews: Math.floor(Math.random() * 1000) + 50,
          rating_distribution: this.generateRatingDistribution()
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        aggregated_from: ['google', 'yelp', 'facebook'],
        last_sync: new Date().toISOString(),
        source_quality: 'medium'
      }
    };
  }

  /**
   * Generate ad manager events
   */
  private generateAdManagerEvent(base: any): MockEvent {
    const eventTypes = ['campaign_started', 'performance_update', 'budget_alert', 'audience_insight'];
    const eventType = this.getRandomElement(eventTypes);

    let data: any = {
      platform: this.getRandomElement(['google_ads', 'facebook_ads', 'linkedin_ads', 'twitter_ads']),
      campaign_id: `campaign_${Math.floor(Math.random() * 1000) + 1}`
    };

    switch (eventType) {
      case 'campaign_started':
        data = {
          ...data,
          campaign_name: this.getRandomCampaignName(),
          budget: Math.floor(Math.random() * 5000) + 500,
          target_audience: this.getRandomAudience(),
          start_date: new Date().toISOString(),
          end_date: this.getFutureDate(30)
        };
        break;
      case 'performance_update':
        data = {
          ...data,
          impressions: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 500) + 50,
          ctr: Math.round((Math.random() * 0.1 + 0.01) * 10000) / 10000,
          cost: Math.round((Math.random() * 100 + 10) * 100) / 100,
          conversions: Math.floor(Math.random() * 20) + 1
        };
        break;
      case 'budget_alert':
        data = {
          ...data,
          alert_type: this.getRandomElement(['budget_exhausted', 'underspending', 'overspending']),
          current_spend: Math.floor(Math.random() * 1000) + 100,
          budget_limit: Math.floor(Math.random() * 2000) + 500,
          remaining_budget: Math.floor(Math.random() * 500) + 50
        };
        break;
    }

    return {
      ...base,
      eventType,
      data,
      metadata: {
        ad_platform_version: 'v1.0',
        reporting_accuracy: 'high',
        source_quality: 'high'
      }
    };
  }

  // Helper methods for generating realistic data
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getRandomUserId(): string {
    return this.getRandomElement(this.userIdPool);
  }

  private getRandomSessionId(): string {
    return this.getRandomElement(this.sessionIdPool);
  }

  private getRandomRecentTimestamp(hoursBack: number = 24): string {
    const now = Date.now();
    const randomTime = now - Math.floor(Math.random() * hoursBack * 60 * 60 * 1000);
    return new Date(randomTime).toISOString();
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomPageUrl(): string {
    const paths = ['/home', '/products', '/about', '/contact', '/cart', '/checkout', '/product/123', '/category/electronics'];
    return `https://example.com${this.getRandomElement(paths)}`;
  }

  private getRandomReferrer(): string {
    const referrers = ['https://google.com', 'https://facebook.com', 'direct', 'https://twitter.com', 'https://linkedin.com'];
    return this.getRandomElement(referrers);
  }

  private getRandomIP(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  private getRandomPageTitle(): string {
    const titles = ['Home Page', 'Product Catalog', 'About Us', 'Contact', 'Shopping Cart', 'Checkout'];
    return this.getRandomElement(titles);
  }

  private getRandomSearchQuery(): string {
    const queries = ['wireless headphones', 'smart watch', 'running shoes', 'coffee maker', 'laptop', 'phone case'];
    return this.getRandomElement(queries);
  }

  private generateRandomCart(): { items: any[], total: number } {
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let total = 0;

    for (let i = 0; i < itemCount; i++) {
      const product = this.getRandomElement(this.productCatalog);
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = product.price * quantity;
      
      items.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: itemTotal
      });
      
      total += itemTotal;
    }

    return { items, total: Math.round(total * 100) / 100 };
  }

  private generateRandomOrder(): { items: any[], total: number } {
    return this.generateRandomCart(); // Same structure for orders
  }

  private getRandomAddress(): any {
    return {
      street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      city: this.getRandomElement(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']),
      state: this.getRandomElement(['NY', 'CA', 'IL', 'TX', 'AZ']),
      zip: String(Math.floor(Math.random() * 90000) + 10000),
      country: 'US'
    };
  }

  private getRandomName(): string {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return `${this.getRandomElement(firstNames)} ${this.getRandomElement(lastNames)}`;
  }

  private getRandomLocation(): string {
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
    return this.getRandomElement(locations);
  }

  private getRandomDate(daysBack: number): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString();
  }

  private getFutureDate(daysForward: number): string {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysForward));
    return date.toISOString();
  }

  private getRandomPostMessage(): string {
    const messages = [
      'Exciting news! Check out our latest product launch 🚀',
      'Thanks to all our customers for your continued support! ❤️',
      'Behind the scenes look at our team working hard 💪',
      'Customer spotlight: Amazing review from @customer123! ⭐'
    ];
    return this.getRandomElement(messages);
  }

  private getRandomComment(): string {
    const comments = [
      'Love this product!',
      'When will this be available?',
      'Great customer service experience',
      'Can you help me with my order?'
    ];
    return this.getRandomElement(comments);
  }

  private getRandomDirectMessage(): string {
    const messages = [
      'Hi, I have a question about your product',
      'Can you help me track my order?',
      'I\'d like to know more about your services',
      'Thank you for the quick response!'
    ];
    return this.getRandomElement(messages);
  }

  private getRandomSocialReferrer(): string {
    const referrers = ['facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'pinterest.com'];
    return `https://${this.getRandomElement(referrers)}`;
  }

  private getRandomKeyword(): string {
    const keywords = ['buy headphones', 'best smart watch', 'wireless earbuds', 'fitness tracker', 'bluetooth speaker'];
    return this.getRandomElement(keywords);
  }

  private getRandomTweet(): string {
    const tweets = [
      'Just launched our newest product! Check it out 🎉',
      'Customer service is our top priority 📞',
      'Innovation meets quality in everything we do ⚡',
      'Thank you for choosing us! #CustomerFirst'
    ];
    return this.getRandomElement(tweets);
  }

  private getRandomHashtags(): string[] {
    const hashtags = ['#innovation', '#quality', '#customer', '#technology', '#business'];
    return [this.getRandomElement(hashtags), this.getRandomElement(hashtags)];
  }

  private getRandomEmoji(): string {
    const emojis = ['🎉', '❤️', '🚀', '💪', '⭐', '🔥', '👍', '✨'];
    return this.getRandomElement(emojis);
  }

  private getRandomReviewText(rating: number): string {
    if (rating >= 4) {
      const positive = [
        'Excellent product! Highly recommend.',
        'Great quality and fast shipping.',
        'Exceeded my expectations!',
        'Outstanding customer service.'
      ];
      return this.getRandomElement(positive);
    } else if (rating <= 2) {
      const negative = [
        'Product didn\'t meet expectations.',
        'Poor quality for the price.',
        'Slow shipping and response.',
        'Would not recommend.'
      ];
      return this.getRandomElement(negative);
    } else {
      const neutral = [
        'Decent product, could be better.',
        'Average quality, nothing special.',
        'Okay for the price point.',
        'Mixed experience overall.'
      ];
      return this.getRandomElement(neutral);
    }
  }

  private generateRatingDistribution(): any {
    const total = Math.floor(Math.random() * 1000) + 100;
    return {
      5: Math.floor(total * 0.4),
      4: Math.floor(total * 0.3),
      3: Math.floor(total * 0.2),
      2: Math.floor(total * 0.07),
      1: Math.floor(total * 0.03)
    };
  }

  private getRandomCampaignName(): string {
    const names = [
      'Summer Sale Campaign',
      'New Product Launch',
      'Holiday Special Offers',
      'Brand Awareness Drive',
      'Customer Retention Campaign'
    ];
    return this.getRandomElement(names);
  }

  private getRandomAudience(): any {
    return {
      age_range: this.getRandomElement(['18-24', '25-34', '35-44', '45-54', '55+']),
      interests: this.getRandomElement([['technology'], ['fitness'], ['fashion'], ['travel']]),
      location: this.getRandomElement(['United States', 'Canada', 'United Kingdom'])
    };
  }
}
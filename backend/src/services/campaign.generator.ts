import { v4 as uuidv4 } from 'uuid';
import { CampaignRecommendation, CampaignChannelPlan, SimulationConfig } from '../types/campaign';

export class CampaignGenerator {
  private audienceSegments = [
    {
      segment_id: 'high-value-customers',
      name: 'High-Value Repeat Customers',
      filters: { purchase_frequency: '>= 3', lifetime_value: '>= 500', last_purchase_days: '<= 30' }
    },
    {
      segment_id: 'cart-abandoners',
      name: 'Recent Cart Abandoners',
      filters: { cart_status: 'abandoned', abandonment_time: '<= 24h', cart_value: '>= 100' }
    },
    {
      segment_id: 'new-subscribers',
      name: 'New Email Subscribers',
      filters: { subscription_date: '<= 7d', engagement_score: '>= 0.5' }
    },
    {
      segment_id: 'inactive-users',
      name: 'Inactive Users',
      filters: { last_activity: '>= 30d', previous_purchases: '>= 1' }
    },
    {
      segment_id: 'birthday-customers',
      name: 'Birthday Campaign Targets',
      filters: { birthday_month: 'current', email_consent: true }
    },
    {
      segment_id: 'seasonal-buyers',
      name: 'Seasonal Product Buyers',
      filters: { seasonal_purchase_history: true, current_season: 'match' }
    }
  ];

  private signalTemplates = [
    'Recent cart abandonment detected',
    'High engagement with email campaigns',
    'Previous positive response to discount offers',
    'Increased website session duration',
    'Social media engagement spike',
    'Product browsing behavior indicates interest',
    'Competitor price comparison activity',
    'Seasonal purchase pattern alignment',
    'Customer support interaction indicates buying intent',
    'Mobile app usage increased',
    'Push notification click-through rate above average',
    'Email open rate significantly higher than average'
  ];

  private channelTemplates: Record<string, any> = {
    Email: {
      subjects: [
        'Complete Your Purchase - 15% Off Inside!',
        'Don\'t Miss Out - Your Cart is Waiting!',
        'Exclusive Offer Just for You',
        'Limited Time: Save Big on Your Favorites',
        'Welcome Back! Here\'s Something Special'
      ],
      bodies: [
        'We noticed you left something in your cart. Complete your purchase now and save 15%!',
        'Your selected items are still available. Don\'t let them get away!',
        'As a valued customer, enjoy this exclusive discount on your next purchase.',
        'This offer won\'t last long. Shop now and save!',
        'We\'ve missed you! Come back and discover what\'s new.'
      ]
    },
    Push: {
      titles: [
        'Don\'t Miss Out!',
        'Limited Time Offer',
        'Your Cart Awaits',
        'Special Deal Inside',
        'Come Back & Save'
      ],
      bodies: [
        'Your items are waiting. Get 15% off now!',
        'Flash sale ends soon. Shop now!',
        'Complete your purchase in just one tap.',
        'Exclusive discount available for 24 hours.',
        'Return now and enjoy special savings.'
      ]
    },
    SMS: {
      messages: [
        'Your cart is waiting! Complete purchase & save 15%. Link: store.com/cart',
        'Flash sale: 20% off your favorites ends in 2hrs. Shop now: store.com/sale',
        'Hi! Your exclusive discount code is SAVE15. Valid 24hrs: store.com',
        'Reminder: Your selected items may sell out soon. Secure them: store.com/cart'
      ]
    },
    WhatsApp: {
      messages: [
        'Hi! We noticed you were interested in some products. Would you like help completing your purchase? 💝',
        'Your cart is ready to go! Complete your order now and get 15% off. 🛍️',
        'Special offer just for you! Use code SAVE20 for instant discount. ⚡',
        'Your favorite items are back in stock! Don\'t miss out this time. 🔥'
      ]
    },
    Voice: {
      scripts: [
        'Hello! This is a friendly reminder about the items in your shopping cart.',
        'Hi there! We have a special offer available for you today.',
        'Greetings! Your selected products are waiting for you.',
        'Hello! Don\'t forget about your exclusive discount offer.'
      ]
    },
    Messenger: {
      messages: [
        'Hey! 👋 Saw you were browsing our store. Need help with anything?',
        'Your cart looks great! Ready to complete your purchase? 🛒',
        'We have a special surprise for you! Check your exclusive offer 🎁',
        'Don\'t let your favorites get away! They\'re still available 💨'
      ]
    },
    Ads: {
      headlines: [
        'Complete Your Purchase Today',
        'Don\'t Miss Your Special Offer',
        'Your Favorites Are Waiting',
        'Limited Time Discount Available'
      ],
      descriptions: [
        'Return to your cart and save 15% on your selected items.',
        'Exclusive offer expires soon. Shop now and save big!',
        'Your chosen products are still available. Complete purchase now.',
        'Special discount just for you. Valid for limited time only.'
      ]
    }
  };

  private sourceSnapshots = [
    {
      website: { cart_items: 3, session_duration: 420, page_views: 12 },
      email: { last_opened: '2024-01-15T10:30:00Z', engagement_score: 0.75 }
    },
    {
      shopify: { order_history: 5, avg_order_value: 275, last_purchase: '2024-01-10T14:20:00Z' },
      facebook_pixel: { ad_clicks: 3, conversion_rate: 0.12 }
    },
    {
      crm: { customer_tier: 'gold', support_tickets: 0, satisfaction_score: 4.8 },
      google_ads: { impressions: 1250, click_through_rate: 0.08 }
    }
  ];

  public generateRecommendation(config?: SimulationConfig): CampaignRecommendation {
    const audience = this.getRandomElement(this.audienceSegments);
    const signals = this.getRandomElements(this.signalTemplates, 3);
    const score = Math.random() * 0.4 + 0.6; // Score between 0.6 and 1.0
    
    // Use selected channels from config, or random selection
    const availableChannels = config?.selectedChannels || ['Email', 'Push', 'SMS', 'WhatsApp'];
    const channelCount = Math.min(availableChannels.length, Math.floor(Math.random() * 3) + 1);
    const selectedChannels = this.getRandomElements(availableChannels, channelCount);
    
    const channelPlan = selectedChannels.map((channel, index) => 
      this.generateChannelPlan(channel, index + 1)
    );

    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      audience: audience,
      reasoning: {
        signals: signals,
        score: Math.round(score * 100) / 100,
        explain: this.generateExplanation(audience.name, signals, score)
      },
      channel_plan: channelPlan,
      campaign_meta: {
        source_snapshot: this.getRandomElement(this.sourceSnapshots),
        engine_version: 'v0.1-demo',
        confidence: Math.round(score * 100) / 100
      }
    };
  }

  private generateChannelPlan(channel: string, priority: number): CampaignChannelPlan {
    const sendDelay = Math.floor(Math.random() * 30 + 5); // 5-35 minutes from now
    const sendAt = new Date(Date.now() + sendDelay * 60000).toISOString();

    let payload: any = {};
    let delivery_instructions: any = {
      retry_policy: priority === 1 ? 'exponential_backoff' : 'linear',
      timeout_sec: Math.floor(Math.random() * 20 + 15) // 15-35 seconds
    };

    switch (channel) {
      case 'Email':
        payload = {
          subject: this.getRandomElement(this.channelTemplates.Email.subjects),
          body: this.getRandomElement(this.channelTemplates.Email.bodies),
          cta: { text: 'Complete Purchase', url: 'https://store.com/checkout' },
          metadata: { campaign_type: 'cart_abandonment', discount_percent: 15 }
        };
        break;

      case 'Push':
        payload = {
          title: this.getRandomElement(this.channelTemplates.Push.titles),
          body: this.getRandomElement(this.channelTemplates.Push.bodies),
          cta: { action: 'open_app', deep_link: '/checkout' },
          metadata: { badge_count: 1, sound: 'default' }
        };
        break;

      case 'SMS':
        payload = {
          body: this.getRandomElement(this.channelTemplates.SMS.messages),
          cta: { type: 'link', url: 'https://store.com/cart' },
          metadata: { sender_id: 'STORE', message_type: 'promotional' }
        };
        break;

      case 'WhatsApp':
        payload = {
          body: this.getRandomElement(this.channelTemplates.WhatsApp.messages),
          cta: { type: 'quick_reply', options: ['View Cart', 'Shop Now', 'Call Support'] },
          metadata: { template_name: 'cart_recovery', language: 'en' }
        };
        break;

      case 'Voice':
        payload = {
          script: this.getRandomElement(this.channelTemplates.Voice.scripts),
          body: 'Automated voice message for cart recovery',
          cta: { type: 'callback', number: '+1-800-STORE' },
          metadata: { voice_type: 'female', language: 'en-US' }
        };
        break;

      case 'Messenger':
        payload = {
          body: this.getRandomElement(this.channelTemplates.Messenger.messages),
          cta: { type: 'postback', payload: 'VIEW_CART' },
          metadata: { platform: 'facebook', message_type: 'interactive' }
        };
        break;

      case 'Ads':
        payload = {
          headline: this.getRandomElement(this.channelTemplates.Ads.headlines),
          body: this.getRandomElement(this.channelTemplates.Ads.descriptions),
          cta: { text: 'Shop Now', url: 'https://store.com/offers' },
          metadata: { ad_type: 'retargeting', budget: 50, duration_hours: 24 }
        };
        delivery_instructions.timeout_sec = 3600; // 1 hour for ads
        break;

      default:
        payload = {
          body: `Generic ${channel} message content`,
          cta: { type: 'link', url: 'https://store.com' },
          metadata: { channel_type: channel }
        };
    }

    return {
      channel: channel as any,
      send_at: sendAt,
      priority: priority,
      payload: payload,
      delivery_instructions: delivery_instructions
    };
  }

  private generateExplanation(audienceName: string, signals: string[], score: number): string {
    const confidence = score > 0.8 ? 'high' : score > 0.6 ? 'moderate' : 'low';
    const explanations = [
      `${audienceName} shows strong engagement patterns with a ${confidence} likelihood to convert.`,
      `Based on recent signals including ${signals[0].toLowerCase()}, this audience segment presents a valuable opportunity.`,
      `The combination of ${signals.length} positive signals indicates ${confidence} conversion potential for ${audienceName.toLowerCase()}.`,
      `${audienceName} demonstrates behavior consistent with previous successful campaigns, warranting immediate attention.`
    ];
    
    return this.getRandomElement(explanations);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  public generateBatchRecommendations(count: number, config?: SimulationConfig): CampaignRecommendation[] {
    const recommendations: CampaignRecommendation[] = [];
    
    for (let i = 0; i < count; i++) {
      recommendations.push(this.generateRecommendation(config));
    }
    
    return recommendations;
  }
}
import { CampaignRecommendation, CampaignChannelPlan, SimulationConfig } from '../types/campaign';
import { CampaignGenerator } from './campaign.generator';
import { DataSourcesService } from './datasources.service';

// Event signal interfaces for type safety
export interface EventSignal {
  id: string;
  source: string;
  type: string;
  timestamp: string;
  data: Record<string, any>;
  weight: number;
  confidence: number;
}

export interface AggregatedSignals {
  signals: EventSignal[];
  totalWeight: number;
  averageConfidence: number;
  primaryTriggers: string[];
  audienceScore: number;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface ChannelRule {
  id: string;
  name: string;
  condition: string;
  priority: number;
  channels: string[];
  messageTemplate?: string;
  enabled: boolean;
}

export interface DecisionRules {
  channelRules: ChannelRule[];
  audienceRules: Record<string, any>;
  priorityRules: Record<string, number>;
  timingRules: Record<string, any>;
}

export class DecisionEngine {
  private campaignGenerator: CampaignGenerator;
  private dataSourcesService: DataSourcesService;
  private rules: DecisionRules;

  constructor(dataSourcesService: DataSourcesService) {
    this.campaignGenerator = new CampaignGenerator();
    this.dataSourcesService = dataSourcesService;
    this.initializeDefaultRules();
  }

  /**
   * Main entry point for generating campaign recommendations
   * Aggregates signals from multiple data sources and applies decision rules
   */
  public async generateRecommendation(config: SimulationConfig): Promise<CampaignRecommendation> {
    try {
      // Step 1: Collect and aggregate signals from configured data sources
      const aggregatedSignals = await this.aggregateSignals(config.selectedSources);
      
      // Step 2: Analyze audience based on aggregated signals
      const audienceSegment = this.analyzeAudience(aggregatedSignals);
      
      // Step 3: Generate reasoning based on signals and confidence
      const reasoning = this.generateReasoning(aggregatedSignals);
      
      // Step 4: Apply channel prioritization rules
      const channelPlan = this.generateChannelPlan(
        config.selectedChannels,
        aggregatedSignals,
        audienceSegment
      );
      
      // Step 5: Create campaign metadata
      const campaignMeta = this.generateCampaignMeta(aggregatedSignals, config);
      
      const recommendation: CampaignRecommendation = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        audience: audienceSegment,
        reasoning: reasoning,
        channel_plan: channelPlan,
        campaign_meta: campaignMeta
      };

      // Step 6: Enhance with Groq AI (simulated for now)
      return await this.enhanceWithGroqAI(recommendation, aggregatedSignals);
      
    } catch (error) {
      console.error('Decision Engine error:', error);
      // Fallback to basic campaign generation
      return this.campaignGenerator.generateRecommendation(config);
    }
  }

  /**
   * Aggregates event signals from multiple configured data sources
   */
  private async aggregateSignals(selectedSources: string[]): Promise<AggregatedSignals> {
    const allSignals: EventSignal[] = [];
    
    for (const sourceId of selectedSources) {
      const sourceConfig = this.dataSourcesService.getSourceConfig(sourceId);
      const source = this.dataSourcesService.getSourceById(sourceId);
      
      if (!source || !sourceConfig?.enabled) continue;
      
      // Generate signals based on source type (mocked vs real API)
      const sourceSignals = sourceConfig.type === 'mocked' 
        ? await this.generateMockedSignals(sourceId, source)
        : await this.fetchRealAPISignals(sourceId, sourceConfig);
      
      allSignals.push(...sourceSignals);
    }
    
    return this.processAggregatedSignals(allSignals);
  }

  /**
   * Generates mocked signals for development/testing
   */
  private async generateMockedSignals(sourceId: string, source: any): Promise<EventSignal[]> {
    const signalTemplates = this.getMockedSignalTemplates(sourceId);
    const signalCount = Math.floor(Math.random() * 3) + 1; // 1-3 signals per source
    
    return signalTemplates.slice(0, signalCount).map(template => ({
      id: this.generateId(),
      source: sourceId,
      type: template.type,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
      data: template.data,
      weight: template.weight,
      confidence: Math.random() * 0.4 + 0.6 // 0.6-1.0
    }));
  }

  /**
   * Fetches signals from real API endpoints (placeholder for real implementation)
   */
  private async fetchRealAPISignals(sourceId: string, config: any): Promise<EventSignal[]> {
    // TODO: Implement real API fetching based on config.apiConfig
    // For now, return mocked data with a flag indicating it should be real
    const mockedSignals = await this.generateMockedSignals(sourceId, null);
    
    return mockedSignals.map(signal => ({
      ...signal,
      data: { ...signal.data, isRealAPI: true, endpoint: config.apiConfig?.endpoint }
    }));
  }

  /**
   * Processes and analyzes aggregated signals
   */
  private processAggregatedSignals(signals: EventSignal[]): AggregatedSignals {
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const averageConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    
    // Identify primary triggers (high weight/confidence signals)
    const primaryTriggers = signals
      .filter(s => s.weight > 0.7 && s.confidence > 0.8)
      .map(s => s.type);
    
    // Calculate audience score based on signal strength
    const audienceScore = Math.min((totalWeight / signals.length) * averageConfidence, 1.0);
    
    // Determine urgency level
    const urgencyLevel = this.calculateUrgencyLevel(signals);
    
    return {
      signals,
      totalWeight,
      averageConfidence,
      primaryTriggers,
      audienceScore,
      urgencyLevel
    };
  }

  /**
   * Analyzes aggregated signals to determine audience segment
   */
  private analyzeAudience(aggregated: AggregatedSignals): any {
    // Apply audience analysis rules based on signals
    const audienceSegments = [
      {
        segment_id: 'high-intent-customers',
        name: 'High Intent Customers',
        filters: { intent_score: '>= 0.8', recent_activity: '<= 1h' },
        trigger_types: ['cart_abandonment', 'product_view', 'price_check']
      },
      {
        segment_id: 'engaged-browsers',
        name: 'Engaged Product Browsers',
        filters: { engagement_score: '>= 0.6', session_duration: '>= 300s' },
        trigger_types: ['session_extension', 'multiple_products', 'category_browse']
      },
      {
        segment_id: 'returning-customers',
        name: 'Returning Customers',
        filters: { previous_purchases: '>= 1', last_purchase: '<= 90d' },
        trigger_types: ['login_event', 'account_activity', 'loyalty_trigger']
      }
    ];
    
    // Find best matching segment based on primary triggers
    for (const segment of audienceSegments) {
      const matchingTriggers = aggregated.primaryTriggers.filter(trigger => 
        segment.trigger_types.includes(trigger)
      );
      
      if (matchingTriggers.length > 0 || aggregated.audienceScore >= 0.8) {
        return segment;
      }
    }
    
    // Default fallback segment
    return {
      segment_id: 'general-audience',
      name: 'General Audience',
      filters: { active_user: true }
    };
  }

  /**
   * Generates reasoning based on aggregated signals
   */
  private generateReasoning(aggregated: AggregatedSignals): any {
    const signalDescriptions = aggregated.signals.map(s => this.getSignalDescription(s));
    const topSignals = signalDescriptions.slice(0, 4); // Top 4 signals
    
    const explanationTemplates = [
      `Customer demonstrates ${aggregated.urgencyLevel} urgency with ${aggregated.signals.length} positive signals indicating strong conversion potential.`,
      `Analysis of recent user behavior reveals ${aggregated.primaryTriggers.length} high-confidence triggers warranting immediate engagement.`,
      `Signal aggregation shows ${Math.round(aggregated.averageConfidence * 100)}% confidence with weighted score of ${aggregated.totalWeight.toFixed(2)}.`
    ];
    
    return {
      signals: topSignals,
      score: Math.round(aggregated.audienceScore * 100) / 100,
      explain: explanationTemplates[Math.floor(Math.random() * explanationTemplates.length)]
    };
  }

  /**
   * Generates channel plan using configurable rules
   */
  private generateChannelPlan(
    selectedChannels: string[],
    aggregated: AggregatedSignals,
    audience: any
  ): CampaignChannelPlan[] {
    // Apply channel prioritization rules
    const channelPriorities = this.calculateChannelPriorities(selectedChannels, aggregated, audience);
    
    // Generate channel plans based on priorities and rules
    return channelPriorities.map((channelData, index) => 
      this.generateChannelPlanForChannel(channelData, index + 1, aggregated)
    );
  }

  /**
   * Calculates channel priorities based on rules and signals
   */
  private calculateChannelPriorities(
    selectedChannels: string[],
    aggregated: AggregatedSignals,
    audience: any
  ): Array<{ channel: string; priority: number; reasoning: string }> {
    const channelScores: Array<{ channel: string; score: number; reasoning: string }> = [];
    
    for (const channel of selectedChannels) {
      let score = 0.5; // Base score
      let reasoning = `Base priority for ${channel}`;
      
      // Apply channel-specific rules
      const applicableRules = this.rules.channelRules.filter(rule => 
        rule.enabled && rule.channels.includes(channel)
      );
      
      for (const rule of applicableRules) {
        if (this.evaluateRuleCondition(rule.condition, aggregated, audience)) {
          score += rule.priority * 0.2; // Boost score based on rule priority
          reasoning = `${rule.name} rule applied`;
          break;
        }
      }
      
      // Apply urgency-based scoring
      if (aggregated.urgencyLevel === 'high') {
        if (['SMS', 'Push', 'WhatsApp'].includes(channel)) {
          score += 0.3;
          reasoning += ' + high urgency boost';
        }
      }
      
      // Apply audience-based scoring
      if (audience.segment_id === 'high-intent-customers') {
        if (['Email', 'WhatsApp'].includes(channel)) {
          score += 0.2;
          reasoning += ' + high-intent boost';
        }
      }
      
      channelScores.push({ channel, score, reasoning });
    }
    
    // Sort by score descending and return with priorities
    return channelScores
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        channel: item.channel,
        priority: index + 1,
        reasoning: item.reasoning
      }));
  }

  /**
   * Generates individual channel plan
   */
  private generateChannelPlanForChannel(
    channelData: { channel: string; priority: number; reasoning: string },
    priority: number,
    aggregated: AggregatedSignals
  ): CampaignChannelPlan {
    // Calculate send timing based on urgency and priority
    const urgencyDelay = {
      'high': [1, 5, 15], // 1, 5, 15 minutes
      'medium': [5, 15, 45], // 5, 15, 45 minutes  
      'low': [15, 60, 180] // 15, 60, 180 minutes
    };
    
    const delays = urgencyDelay[aggregated.urgencyLevel];
    const sendDelay = delays[Math.min(priority - 1, delays.length - 1)];
    const sendAt = new Date(Date.now() + sendDelay * 60000).toISOString();
    
    // Use existing campaign generator for payload creation
    return this.campaignGenerator['generateChannelPlan'](channelData.channel, priority);
  }

  /**
   * Generates campaign metadata with enhanced context
   */
  private generateCampaignMeta(aggregated: AggregatedSignals, config: SimulationConfig): any {
    const sourceSnapshot: Record<string, any> = {};
    
    // Build source snapshot from aggregated signals
    for (const signal of aggregated.signals) {
      if (!sourceSnapshot[signal.source]) {
        sourceSnapshot[signal.source] = {};
      }
      sourceSnapshot[signal.source][signal.type] = signal.data;
    }
    
    return {
      source_snapshot: sourceSnapshot,
      engine_version: 'v1.0-decision-engine',
      confidence: aggregated.audienceScore,
      signal_count: aggregated.signals.length,
      urgency_level: aggregated.urgencyLevel,
      processing_time: Date.now()
    };
  }

  /**
   * Enhances recommendation using Groq AI (simulated)
   */
  private async enhanceWithGroqAI(
    recommendation: CampaignRecommendation,
    aggregated: AggregatedSignals
  ): Promise<CampaignRecommendation> {
    // TODO: Integrate with actual Groq AI API
    // For now, simulate AI enhancement by improving explanations and personalizing messages
    
    try {
      // Simulated AI enhancement
      const aiEnhancedExplanation = this.simulateGroqAIEnhancement(
        recommendation.reasoning.explain,
        aggregated
      );
      
      return {
        ...recommendation,
        reasoning: {
          ...recommendation.reasoning,
          explain: aiEnhancedExplanation
        },
        campaign_meta: {
          ...recommendation.campaign_meta,
          ai_enhanced: true,
          ai_confidence: 0.85 + Math.random() * 0.10 // 0.85-0.95
        }
      };
    } catch (error) {
      console.error('Groq AI enhancement failed:', error);
      return recommendation; // Return original if AI enhancement fails
    }
  }

  /**
   * Simulates Groq AI enhancement (placeholder for real implementation)
   */
  private simulateGroqAIEnhancement(originalExplanation: string, aggregated: AggregatedSignals): string {
    const aiTemplates = [
      `Advanced behavioral analysis indicates ${aggregated.urgencyLevel} conversion probability based on ${aggregated.signals.length} correlated signals across multiple touchpoints.`,
      `Machine learning models predict optimal engagement window with ${Math.round(aggregated.averageConfidence * 100)}% confidence using multi-source signal aggregation.`,
      `AI-powered customer journey analysis reveals strong intent signals with recommended immediate multi-channel engagement strategy.`
    ];
    
    return aiTemplates[Math.floor(Math.random() * aiTemplates.length)];
  }

  /**
   * Initialize default decision rules
   */
  private initializeDefaultRules(): void {
    this.rules = {
      channelRules: [
        {
          id: 'high-urgency-immediate',
          name: 'High Urgency Immediate Contact',
          condition: 'urgency_level === "high" && signals.includes("cart_abandonment")',
          priority: 10,
          channels: ['SMS', 'Push', 'WhatsApp'],
          enabled: true
        },
        {
          id: 'engaged-browser-email',
          name: 'Engaged Browser Email Priority',
          condition: 'audience.segment_id === "engaged-browsers"',
          priority: 8,
          channels: ['Email', 'Messenger'],
          enabled: true
        },
        {
          id: 'returning-customer-personal',
          name: 'Returning Customer Personal Touch',
          condition: 'audience.segment_id === "returning-customers"',
          priority: 7,
          channels: ['WhatsApp', 'Voice', 'Email'],
          enabled: true
        },
        {
          id: 'low-urgency-nurture',
          name: 'Low Urgency Nurture Campaign',
          condition: 'urgency_level === "low"',
          priority: 5,
          channels: ['Email', 'Ads'],
          enabled: true
        }
      ],
      audienceRules: {},
      priorityRules: {},
      timingRules: {}
    };
  }

  // Helper methods
  private calculateUrgencyLevel(signals: EventSignal[]): 'low' | 'medium' | 'high' {
    const highUrgencyTypes = ['cart_abandonment', 'checkout_start', 'payment_attempt'];
    const mediumUrgencyTypes = ['product_view', 'category_browse', 'search_activity'];
    
    const highUrgencyCount = signals.filter(s => highUrgencyTypes.includes(s.type)).length;
    const mediumUrgencyCount = signals.filter(s => mediumUrgencyTypes.includes(s.type)).length;
    
    if (highUrgencyCount > 0) return 'high';
    if (mediumUrgencyCount > 1) return 'medium';
    return 'low';
  }

  private getMockedSignalTemplates(sourceId: string): Array<{type: string; data: any; weight: number}> {
    const templates: Record<string, Array<{type: string; data: any; weight: number}>> = {
      website: [
        { type: 'cart_abandonment', data: { cart_value: 150, items_count: 3 }, weight: 0.9 },
        { type: 'product_view', data: { product_id: 'prod_123', category: 'electronics' }, weight: 0.6 },
        { type: 'session_extension', data: { duration: 420, pages: 12 }, weight: 0.5 }
      ],
      shopify: [
        { type: 'order_history', data: { total_orders: 5, avg_value: 275 }, weight: 0.8 },
        { type: 'wishlist_activity', data: { items_added: 2, last_added: '2024-01-15' }, weight: 0.6 }
      ],
      crm_system: [
        { type: 'customer_tier_upgrade', data: { new_tier: 'gold', previous: 'silver' }, weight: 0.7 },
        { type: 'support_interaction', data: { satisfaction: 4.8, topic: 'product_inquiry' }, weight: 0.5 }
      ]
    };
    
    return templates[sourceId] || [
      { type: 'generic_activity', data: { source: sourceId }, weight: 0.4 }
    ];
  }

  private getSignalDescription(signal: EventSignal): string {
    const descriptions: Record<string, string> = {
      cart_abandonment: 'Recent cart abandonment detected',
      product_view: 'High product engagement activity',
      session_extension: 'Extended browsing session indicates interest',
      order_history: 'Strong purchase history patterns',
      customer_tier_upgrade: 'Customer loyalty tier advancement',
      support_interaction: 'Positive customer support engagement'
    };
    
    return descriptions[signal.type] || `${signal.type} signal detected from ${signal.source}`;
  }

  private evaluateRuleCondition(condition: string, aggregated: AggregatedSignals, audience: any): boolean {
    // Simple rule evaluation - in production, use a proper expression evaluator
    try {
      const context = {
        urgency_level: aggregated.urgencyLevel,
        signals: aggregated.primaryTriggers,
        audience: audience,
        confidence: aggregated.averageConfidence,
        signal_count: aggregated.signals.length
      };
      
      // Basic condition evaluation (simplified)
      if (condition.includes('urgency_level === "high"')) {
        return aggregated.urgencyLevel === 'high';
      }
      if (condition.includes('audience.segment_id === "engaged-browsers"')) {
        return audience.segment_id === 'engaged-browsers';
      }
      if (condition.includes('audience.segment_id === "returning-customers"')) {
        return audience.segment_id === 'returning-customers';
      }
      if (condition.includes('urgency_level === "low"')) {
        return aggregated.urgencyLevel === 'low';
      }
      
      return false;
    } catch (error) {
      console.error('Rule evaluation error:', error);
      return false;
    }
  }

  private generateId(): string {
    return `de_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for configuration management
  public updateRules(newRules: Partial<DecisionRules>): void {
    this.rules = { ...this.rules, ...newRules };
  }

  public getRules(): DecisionRules {
    return { ...this.rules };
  }

  public addChannelRule(rule: ChannelRule): void {
    this.rules.channelRules.push(rule);
  }

  public removeChannelRule(ruleId: string): void {
    this.rules.channelRules = this.rules.channelRules.filter(rule => rule.id !== ruleId);
  }
}
// Campaign Recommendation Types based on JSON Output Schema from PRD

export interface CampaignAudience {
  segment_id: string;
  name: string;
  filters: Record<string, any>;
}

export interface CampaignReasoning {
  signals: string[];
  score: number;
  explain: string;
}

export interface CampaignChannelPlan {
  channel: 'Email' | 'Push' | 'WhatsApp' | 'Ads' | 'SMS' | 'Messenger' | 'Voice';
  send_at: string; // ISO8601 timestamp
  priority: number;
  payload: {
    subject?: string;
    title?: string;
    body: string;
    cta: Record<string, any>;
    metadata: Record<string, any>;
  };
  delivery_instructions: {
    retry_policy: string;
    timeout_sec: number;
  };
}

export interface CampaignMeta {
  source_snapshot: Record<string, any>;
  engine_version: string;
  confidence: number;
}

export interface CampaignRecommendation {
  id: string;
  timestamp: string; // ISO8601 timestamp
  audience: CampaignAudience;
  reasoning: CampaignReasoning;
  channel_plan: CampaignChannelPlan[];
  campaign_meta: CampaignMeta;
}

export interface SimulationConfig {
  selectedSources: string[];
  selectedChannels: string[];
  interval?: number; // milliseconds between recommendations
  duration?: number; // total simulation duration in milliseconds
}

export interface ClientConnection {
  id: string;
  ws: any; // WebSocket instance
  isActive: boolean;
  connectedAt: Date;
  lastActivity: Date;
  simulationConfig?: SimulationConfig;
}

export interface StreamingMessage {
  type: 'campaign_recommendation' | 'system_message' | 'error';
  data: CampaignRecommendation | string | any;
  timestamp: string;
}
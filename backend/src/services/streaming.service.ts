import { WebSocketService } from './websocket.service';
import { CampaignGenerator } from './campaign.generator';
import { SimulationConfig, StreamingMessage } from '../types/campaign';

export class StreamingService {
  private wsService: WebSocketService;
  private campaignGenerator: CampaignGenerator;
  private activeStreams: Map<string, NodeJS.Timeout> = new Map();
  private globalStreamInterval: NodeJS.Timeout | null = null;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    this.campaignGenerator = new CampaignGenerator();
  }

  public startGlobalStreaming(config: {
    interval?: number;
    batchSize?: number;
    channels?: string[];
    sources?: string[];
  } = {}) {
    if (this.globalStreamInterval) {
      console.log('Global streaming already active');
      return;
    }

    const streamConfig = {
      interval: config.interval || 5000, // 5 seconds default
      batchSize: config.batchSize || 1,
      channels: config.channels || ['Email', 'Push', 'SMS', 'WhatsApp'],
      sources: config.sources || ['website', 'shopify', 'crm']
    };

    console.log('Starting global campaign streaming...', streamConfig);

    this.globalStreamInterval = setInterval(() => {
      const activeSimulations = this.wsService.getActiveSimulations();
      
      if (activeSimulations.length > 0) {
        // Generate recommendations for active simulations
        for (let i = 0; i < streamConfig.batchSize; i++) {
          const recommendation = this.campaignGenerator.generateRecommendation({
            selectedChannels: streamConfig.channels,
            selectedSources: streamConfig.sources
          });

          const message: StreamingMessage = {
            type: 'campaign_recommendation',
            data: recommendation,
            timestamp: new Date().toISOString()
          };

          const sentCount = this.wsService.broadcastToActiveSimulations(message);
          console.log(`Broadcasted campaign recommendation to ${sentCount} active simulations`);
        }
      } else {
        console.log('No active simulations, skipping broadcast');
      }
    }, streamConfig.interval);

    // Send notification to all connected clients
    this.wsService.broadcastMessage({
      type: 'system_message',
      data: 'Global campaign streaming started',
      timestamp: new Date().toISOString()
    });
  }

  public stopGlobalStreaming() {
    if (this.globalStreamInterval) {
      clearInterval(this.globalStreamInterval);
      this.globalStreamInterval = null;
      
      console.log('Global campaign streaming stopped');
      
      this.wsService.broadcastMessage({
        type: 'system_message',
        data: 'Global campaign streaming stopped',
        timestamp: new Date().toISOString()
      });
    }
  }

  public startClientSpecificStream(clientId: string, config: SimulationConfig) {
    // Stop any existing stream for this client
    this.stopClientSpecificStream(clientId);

    const interval = config.interval || 3000; // 3 seconds default
    const duration = config.duration || 300000; // 5 minutes default

    console.log(`Starting client-specific stream for ${clientId}:`, config);

    let recommendationCount = 0;
    const maxRecommendations = Math.floor(duration / interval);

    const streamInterval = setInterval(() => {
      if (recommendationCount >= maxRecommendations) {
        this.stopClientSpecificStream(clientId);
        return;
      }

      const recommendation = this.campaignGenerator.generateRecommendation(config);
      
      const message: StreamingMessage = {
        type: 'campaign_recommendation',
        data: recommendation,
        timestamp: new Date().toISOString()
      };

      const sent = this.wsService.sendMessage(clientId, message);
      if (sent) {
        recommendationCount++;
        console.log(`Sent recommendation ${recommendationCount}/${maxRecommendations} to client ${clientId}`);
      } else {
        console.log(`Failed to send to client ${clientId}, stopping stream`);
        this.stopClientSpecificStream(clientId);
      }
    }, interval);

    this.activeStreams.set(clientId, streamInterval);

    // Send start notification
    this.wsService.sendMessage(clientId, {
      type: 'system_message',
      data: `Personalized streaming started: ${maxRecommendations} recommendations over ${duration/1000}s`,
      timestamp: new Date().toISOString()
    });

    // Auto-stop after duration
    setTimeout(() => {
      this.stopClientSpecificStream(clientId);
    }, duration);
  }

  public stopClientSpecificStream(clientId: string) {
    const streamInterval = this.activeStreams.get(clientId);
    if (streamInterval) {
      clearInterval(streamInterval);
      this.activeStreams.delete(clientId);
      
      console.log(`Stopped client-specific stream for ${clientId}`);
      
      this.wsService.sendMessage(clientId, {
        type: 'system_message',
        data: 'Personalized streaming stopped',
        timestamp: new Date().toISOString()
      });
    }
  }

  public generateSingleRecommendation(config?: SimulationConfig) {
    return this.campaignGenerator.generateRecommendation(config);
  }

  public generateBatchRecommendations(count: number, config?: SimulationConfig) {
    return this.campaignGenerator.generateBatchRecommendations(count, config);
  }

  public sendTestRecommendation(clientId?: string) {
    const testRecommendation = this.campaignGenerator.generateRecommendation({
      selectedChannels: ['Email', 'Push'],
      selectedSources: ['website', 'shopify']
    });

    const message: StreamingMessage = {
      type: 'campaign_recommendation',
      data: testRecommendation,
      timestamp: new Date().toISOString()
    };

    if (clientId) {
      return this.wsService.sendMessage(clientId, message);
    } else {
      return this.wsService.broadcastMessage(message);
    }
  }

  public getStreamingStats() {
    return {
      totalClients: this.wsService.getClientCount(),
      activeClients: this.wsService.getActiveClients().length,
      activeSimulations: this.wsService.getActiveSimulations().length,
      clientSpecificStreams: this.activeStreams.size,
      globalStreamingActive: this.globalStreamInterval !== null
    };
  }

  public shutdown() {
    console.log('Shutting down streaming service...');
    
    // Stop global streaming
    this.stopGlobalStreaming();
    
    // Stop all client-specific streams
    this.activeStreams.forEach((interval, clientId) => {
      this.stopClientSpecificStream(clientId);
    });
    
    console.log('Streaming service shutdown complete');
  }
}
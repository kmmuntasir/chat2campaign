import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketService } from './services/websocket.service';
import { StreamingService } from './services/streaming.service';
import { DataSourcesService } from './services/datasources.service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Initialize services
const wsService = new WebSocketService();
const dataSourcesService = new DataSourcesService();
const streamingService = new StreamingService(wsService);

// Initialize WebSocket handling
wsService.initialize(wss);

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Chat2Campaign Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/sources', (req, res) => {
  try {
    const { category, enabled_only, include_stats } = req.query;
    
    let sources;
    
    if (category) {
      sources = dataSourcesService.getSourcesByCategory(category as string);
    } else if (enabled_only === 'true') {
      sources = dataSourcesService.getEnabledSources();
    } else {
      sources = dataSourcesService.getAllSources();
    }
    
    const response: any = {
      sources: sources,
      total: sources.length
    };
    
    if (include_stats === 'true') {
      response.stats = dataSourcesService.getSourceStats();
      response.categories = dataSourcesService.getAvailableCategories();
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching data sources:', error);
    res.status(500).json({ error: 'Failed to fetch data sources' });
  }
});

app.post('/api/start', (req, res) => {
  try {
    const { selectedSources, selectedChannels, interval, duration } = req.body;
    
    if (!selectedSources || !selectedChannels) {
      return res.status(400).json({ 
        error: 'selectedSources and selectedChannels are required' 
      });
    }

    // Start global streaming for all connected clients
    streamingService.startGlobalStreaming({
      interval: interval || 5000,
      channels: selectedChannels,
      sources: selectedSources
    });

    const sessionId = `sim-${Date.now()}`;
    
    res.json({ 
      message: 'Campaign simulation started successfully.',
      sessionId: sessionId,
      config: {
        sources: selectedSources,
        channels: selectedChannels,
        interval: interval || 5000
      }
    });
    
  } catch (error) {
    console.error('Error starting campaign simulation:', error);
    res.status(500).json({ error: 'Failed to start campaign simulation' });
  }
});

app.post('/api/stop', (req, res) => {
  try {
    streamingService.stopGlobalStreaming();
    res.json({ message: 'Campaign simulation stopped successfully.' });
  } catch (error) {
    console.error('Error stopping campaign simulation:', error);
    res.status(500).json({ error: 'Failed to stop campaign simulation' });
  }
});

app.get('/api/config', (req, res) => {
  const config = {
    availableChannels: ['Email', 'SMS', 'Push', 'WhatsApp', 'Voice', 'Messenger', 'Ads'],
    availableSources: ['website', 'shopify', 'facebook_page', 'google_tag_manager', 'google_ads_tag', 'facebook_pixel', 'crm_system', 'twitter_page', 'review_sites', 'ad_managers'],
    defaults: {
      interval: 5000,
      maxSources: 3,
      maxChannels: 4,
      simulationDuration: 300000
    }
  };
  
  res.json(config);
});

app.post('/api/config', (req, res) => {
  // For now, just return success - could store in database later
  res.json({ message: 'Configuration updated successfully.' });
});

// Data source configuration endpoints
app.get('/api/sources/:sourceId', (req, res) => {
  try {
    const source = dataSourcesService.getSourceById(req.params.sourceId);
    if (!source) {
      return res.status(404).json({ error: 'Data source not found' });
    }
    
    const config = dataSourcesService.getSourceConfig(req.params.sourceId);
    
    res.json({ source, config });
  } catch (error) {
    console.error('Error fetching data source:', error);
    res.status(500).json({ error: 'Failed to fetch data source' });
  }
});

app.post('/api/sources/:sourceId/config', (req, res) => {
  try {
    const { type, enabled, apiConfig } = req.body;
    
    const updated = dataSourcesService.updateSourceConfig(req.params.sourceId, {
      type,
      enabled,
      apiConfig
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Data source not found' });
    }
    
    res.json({ 
      message: 'Data source configuration updated successfully',
      sourceId: req.params.sourceId,
      config: dataSourcesService.getSourceConfig(req.params.sourceId)
    });
  } catch (error) {
    console.error('Error updating data source config:', error);
    res.status(500).json({ error: 'Failed to update data source configuration' });
  }
});

app.post('/api/sources/validate-selection', (req, res) => {
  try {
    const { selectedSources } = req.body;
    
    if (!selectedSources || !Array.isArray(selectedSources)) {
      return res.status(400).json({ error: 'selectedSources array is required' });
    }
    
    const validation = dataSourcesService.validateSourceSelection(selectedSources);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Invalid source selection',
        details: validation.errors
      });
    }
    
    const selectedSourceDetails = selectedSources.map(id => 
      dataSourcesService.getSourceById(id)
    ).filter(Boolean);
    
    res.json({ 
      valid: true,
      selectedSources: selectedSourceDetails,
      count: selectedSources.length
    });
  } catch (error) {
    console.error('Error validating source selection:', error);
    res.status(500).json({ error: 'Failed to validate source selection' });
  }
});

app.post('/api/sources/set-global-type', (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type || (type !== 'mocked' && type !== 'real_api')) {
      return res.status(400).json({ error: 'Invalid type. Must be "mocked" or "real_api"' });
    }
    
    dataSourcesService.setGlobalType(type);
    
    res.json({ 
      message: `All data sources set to ${type} mode`,
      stats: dataSourcesService.getSourceStats()
    });
  } catch (error) {
    console.error('Error setting global type:', error);
    res.status(500).json({ error: 'Failed to set global type' });
  }
});

// Streaming status and control endpoints
app.get('/api/streaming/status', (req, res) => {
  const stats = streamingService.getStreamingStats();
  res.json(stats);
});

app.post('/api/streaming/test', (req, res) => {
  try {
    const sent = streamingService.sendTestRecommendation();
    res.json({ 
      message: 'Test recommendation sent',
      clientsReached: sent ? 'broadcast' : 'none'
    });
  } catch (error) {
    console.error('Error sending test recommendation:', error);
    res.status(500).json({ error: 'Failed to send test recommendation' });
  }
});

app.post('/api/streaming/generate', (req, res) => {
  try {
    const { count = 1, config } = req.body;
    const recommendations = streamingService.generateBatchRecommendations(count, config);
    res.json({ 
      count: recommendations.length,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Chat2Campaign Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🎯 Campaign streaming service initialized`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/sources - Get available data sources`);
  console.log(`   POST /api/start - Start campaign simulation`);
  console.log(`   POST /api/stop - Stop campaign simulation`);
  console.log(`   GET  /api/config - Get configuration`);
  console.log(`   GET  /api/streaming/status - Get streaming status`);
  console.log(`   POST /api/streaming/test - Send test recommendation`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('🔄 Stopping streaming services...');
  streamingService.shutdown();
  
  console.log('🔄 Closing WebSocket connections...');
  wsService.shutdown();
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

export default app;

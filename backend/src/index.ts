import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { WebSocketService } from './services/websocket.service';
import { StreamingService } from './services/streaming.service';
import { DataSourcesService } from './services/datasources.service';
import { DecisionEngine } from './services/decision.engine';
import { MockDataGenerator } from './services/mock-data.generator';

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
const mockDataGenerator = new MockDataGenerator();
const decisionEngine = new DecisionEngine(dataSourcesService);
const streamingService = new StreamingService(wsService, dataSourcesService);

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
  try {
    const dataSourcesConfig = dataSourcesService.getAllConfigs();
    const availableSources = dataSourcesService.getAllSources();
    
    const config = {
      availableChannels: ['Email', 'SMS', 'Push', 'WhatsApp', 'Voice', 'Messenger', 'Ads'],
      dataSources: availableSources.map(source => ({
        ...source,
        config: dataSourcesConfig[source.id] || { type: 'mocked', enabled: true }
      })),
      defaults: {
        interval: 5000,
        maxSources: 3,
        maxChannels: 4,
        simulationDuration: 300000
      },
      stats: dataSourcesService.getSourceStats()
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

app.post('/api/config', (req, res) => {
  try {
    const { sourceId, type, enabled, apiConfig } = req.body;
    
    if (!sourceId) {
      return res.status(400).json({ error: 'sourceId is required' });
    }
    
    if (type && type !== 'mocked' && type !== 'real_api') {
      return res.status(400).json({ error: 'Invalid type. Must be "mocked" or "real_api"' });
    }
    
    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (enabled !== undefined) updateData.enabled = enabled;
    if (apiConfig !== undefined) updateData.apiConfig = apiConfig;
    
    const updated = dataSourcesService.updateSourceConfig(sourceId, updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'Data source not found' });
    }
    
    const updatedConfig = dataSourcesService.getSourceConfig(sourceId);
    const source = dataSourcesService.getSourceById(sourceId);
    
    res.json({ 
      message: 'Configuration updated successfully.',
      sourceId,
      source,
      config: updatedConfig
    });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
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

// Mock Data endpoints
app.get('/api/mock-data/generate/:sourceId', (req, res) => {
  try {
    const { sourceId } = req.params;
    const { eventCount, timeSpanHours } = req.query;
    
    const config = {
      sourceId: sourceId,
      eventCount: eventCount ? parseInt(eventCount as string) : undefined,
      timeSpanHours: timeSpanHours ? parseInt(timeSpanHours as string) : undefined
    };
    
    const mockEvents = mockDataGenerator.generateMockEvents(config);
    
    res.json({
      message: `Generated ${mockEvents.length} mock events for ${sourceId}`,
      sourceId: sourceId,
      eventCount: mockEvents.length,
      events: mockEvents
    });
  } catch (error) {
    console.error('Error generating mock data:', error);
    res.status(500).json({ error: 'Failed to generate mock data' });
  }
});

app.post('/api/mock-data/batch-generate', (req, res) => {
  try {
    const { sources } = req.body;
    
    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: 'sources array is required' });
    }
    
    const results: any = {};
    let totalEvents = 0;
    
    for (const sourceConfig of sources) {
      const events = mockDataGenerator.generateMockEvents(sourceConfig);
      results[sourceConfig.sourceId] = events;
      totalEvents += events.length;
    }
    
    res.json({
      message: `Generated mock data for ${sources.length} sources`,
      totalEvents: totalEvents,
      sources: Object.keys(results),
      data: results
    });
  } catch (error) {
    console.error('Error generating batch mock data:', error);
    res.status(500).json({ error: 'Failed to generate batch mock data' });
  }
});

app.get('/api/mock-data/sample/:sourceId/:eventType', (req, res) => {
  try {
    const { sourceId, eventType } = req.params;
    
    // Generate a single event and filter by type if specified
    const config = { sourceId: sourceId, eventCount: 10 };
    const events = mockDataGenerator.generateMockEvents(config);
    
    const filteredEvents = events.filter(event => 
      eventType === 'all' || event.eventType === eventType
    );
    
    if (filteredEvents.length === 0) {
      return res.status(404).json({ 
        error: `No events found for ${sourceId} with eventType ${eventType}` 
      });
    }
    
    res.json({
      message: `Sample ${eventType} event from ${sourceId}`,
      sourceId: sourceId,
      eventType: eventType,
      sample: filteredEvents[0],
      availableEvents: events.map(e => e.eventType).filter((v, i, a) => a.indexOf(v) === i)
    });
  } catch (error) {
    console.error('Error generating sample mock data:', error);
    res.status(500).json({ error: 'Failed to generate sample mock data' });
  }
});

// Decision Engine endpoints
app.get('/api/decision-engine/rules', (req, res) => {
  try {
    const rules = decisionEngine.getRules();
    res.json(rules);
  } catch (error) {
    console.error('Error fetching decision engine rules:', error);
    res.status(500).json({ error: 'Failed to fetch decision engine rules' });
  }
});

app.post('/api/decision-engine/rules', (req, res) => {
  try {
    const { rules } = req.body;
    decisionEngine.updateRules(rules);
    res.json({ message: 'Decision engine rules updated successfully' });
  } catch (error) {
    console.error('Error updating decision engine rules:', error);
    res.status(500).json({ error: 'Failed to update decision engine rules' });
  }
});

app.post('/api/decision-engine/generate', async (req, res) => {
  try {
    const { selectedSources, selectedChannels } = req.body;
    
    if (!selectedSources || !selectedChannels) {
      return res.status(400).json({ 
        error: 'selectedSources and selectedChannels are required' 
      });
    }
    
    const recommendation = await decisionEngine.generateRecommendation({
      selectedSources,
      selectedChannels
    });
    
    res.json({
      message: 'Recommendation generated successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error generating decision engine recommendation:', error);
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

// Schema Validation endpoints
app.get('/api/schema/stats', (req, res) => {
  try {
    const stats = decisionEngine.getSchemaValidationStats();
    res.json({
      message: 'Schema validation statistics retrieved successfully',
      validation_stats: stats
    });
  } catch (error) {
    console.error('Error fetching schema validation stats:', error);
    res.status(500).json({ error: 'Failed to fetch schema validation statistics' });
  }
});

app.post('/api/schema/reset-stats', (req, res) => {
  try {
    decisionEngine.resetSchemaValidationStats();
    res.json({ 
      message: 'Schema validation statistics reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting schema validation stats:', error);
    res.status(500).json({ error: 'Failed to reset schema validation statistics' });
  }
});

app.post('/api/schema/validate', (req, res) => {
  try {
    const { recommendation } = req.body;
    if (!recommendation) {
      return res.status(400).json({
        error: 'Missing recommendation in request body',
        expected: 'JSON object with recommendation field containing campaign recommendation data'
      });
    }
    
    const validationResult = decisionEngine.validateRecommendation(recommendation);
    res.json({
      message: 'Schema validation completed',
      validation: validationResult
    });
  } catch (error) {
    console.error('Error validating recommendation schema:', error);
    res.status(500).json({
      error: 'Schema validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/schema/validate-batch', (req, res) => {
  try {
    const { recommendations } = req.body;
    if (!Array.isArray(recommendations)) {
      return res.status(400).json({
        error: 'Missing or invalid recommendations array in request body',
        expected: 'JSON object with recommendations field containing array of campaign recommendations'
      });
    }
    
    const batchResult = decisionEngine.validateRecommendationBatch(recommendations);
    res.json({
      message: `Batch schema validation completed for ${recommendations.length} recommendations`,
      batch_validation: batchResult
    });
  } catch (error) {
    console.error('Error validating recommendation batch:', error);
    res.status(500).json({
      error: 'Batch schema validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/schema/sample', (req, res) => {
  try {
    const sampleRecommendation = decisionEngine.generateSampleValidRecommendation();
    res.json({
      message: 'Sample valid recommendation generated successfully',
      sample_recommendation: sampleRecommendation
    });
  } catch (error) {
    console.error('Error generating sample recommendation:', error);
    res.status(500).json({
      error: 'Failed to generate sample recommendation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Real API Integration endpoints
app.get('/api/real-api/health', (req, res) => {
  try {
    const healthStatus = decisionEngine.getAPIHealthStatus();
    
    res.json({
      message: 'API health status retrieved successfully',
      timestamp: new Date().toISOString(),
      health_status: healthStatus
    });
  } catch (error) {
    console.error('Error getting API health status:', error);
    res.status(500).json({ error: 'Failed to get API health status' });
  }
});

app.post('/api/real-api/test/:sourceId', async (req, res) => {
  try {
    const { sourceId } = req.params;
    
    const testResult = await decisionEngine.testAPIConnection(sourceId);
    
    res.json({
      message: `API connection test for ${sourceId}`,
      sourceId: sourceId,
      ...testResult
    });
  } catch (error) {
    console.error(`Error testing API connection for ${req.params.sourceId}:`, error);
    res.status(500).json({ error: 'Failed to test API connection' });
  }
});

app.post('/api/real-api/reset-failures/:sourceId', (req, res) => {
  try {
    const { sourceId } = req.params;
    
    decisionEngine.resetAPIFailures(sourceId);
    
    res.json({
      message: `Reset API failure tracking for ${sourceId}`,
      sourceId: sourceId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error resetting API failures for ${req.params.sourceId}:`, error);
    res.status(500).json({ error: 'Failed to reset API failures' });
  }
});

app.post('/api/real-api/test-all', async (req, res) => {
  try {
    const sources = dataSourcesService.getAllSources()
      .filter(source => {
        const config = dataSourcesService.getSourceConfig(source.id);
        return config?.type === 'real_api' && config?.enabled;
      });
    
    const results: any = {};
    
    for (const source of sources) {
      try {
        const testResult = await decisionEngine.testAPIConnection(source.id);
        results[source.id] = testResult;
      } catch (error) {
        results[source.id] = {
          success: false,
          message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          responseTime: 0
        };
      }
    }
    
    const totalSources = Object.keys(results).length;
    const successfulSources = Object.values(results).filter((r: any) => r.success).length;
    
    res.json({
      message: `Tested ${totalSources} real API sources`,
      summary: {
        total_tested: totalSources,
        successful: successfulSources,
        failed: totalSources - successfulSources,
        success_rate: totalSources > 0 ? Math.round((successfulSources / totalSources) * 100) : 0
      },
      results: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing all real API connections:', error);
    res.status(500).json({ error: 'Failed to test real API connections' });
  }
});

// Streaming status and control endpoints
app.get('/api/streaming/status', (req, res) => {
  const stats = streamingService.getStreamingStats();
  res.json(stats);
});

app.post('/api/streaming/test', async (req, res) => {
  try {
    const sent = await streamingService.sendTestRecommendation();
    res.json({ 
      message: 'Test recommendation sent',
      clientsReached: sent ? 'broadcast' : 'none'
    });
  } catch (error) {
    console.error('Error sending test recommendation:', error);
    res.status(500).json({ error: 'Failed to send test recommendation' });
  }
});

app.post('/api/streaming/generate', async (req, res) => {
  try {
    const { selectedSources, selectedChannels } = req.body;
    
    if (!selectedSources || !selectedChannels) {
      return res.status(400).json({ 
        error: 'selectedSources and selectedChannels are required' 
      });
    }
    
    const recommendation = await decisionEngine.generateRecommendation({
      selectedSources,
      selectedChannels
    });
    
    res.json({ 
      message: 'Single recommendation generated',
      recommendation
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

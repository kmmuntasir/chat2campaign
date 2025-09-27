import { useState, useEffect } from 'react'
import './App.css'
import { ApiService, WebSocketService } from './services/api'
import { ChatInterface } from './components/ChatInterface'
import type { ChatMessageData } from './components/ChatMessage'
import { DataSourceSelector } from './components/DataSourceSelector'
import { ChannelSelector } from './components/ChannelSelector'
import { ConfigurationPanel } from './components/ConfigurationPanel'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')
  const [apiResponse, setApiResponse] = useState<string>('')
  const [wsStatus, setWsStatus] = useState<string>('Disconnected')
  const [wsService] = useState(() => new WebSocketService())
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false)

  useEffect(() => {
    // Test backend connection on component mount
    testBackendConnection()
  }, [])

  const testBackendConnection = async () => {
    try {
      // Test health endpoint
      const healthResult = await ApiService.healthCheck()
      if (healthResult.error) {
        setBackendStatus('❌ Backend Offline')
        setApiResponse(`Error: ${healthResult.error}`)
      } else {
        setBackendStatus('✅ Backend Online')
        setApiResponse(`Health Check: ${JSON.stringify(healthResult.data, null, 2)}`)
      }
    } catch (error) {
      setBackendStatus('❌ Backend Connection Failed')
      setApiResponse(`Error: ${error}`)
    }
  }

  const testWebSocket = async () => {
    try {
      await wsService.connect()
      setWsStatus('✅ WebSocket Connected')
      setIsConnected(true)
      
      // Add system message for connection
      addChatMessage({
        id: `system-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        content: 'WebSocket connected successfully. Ready to receive campaign recommendations.',
        isJson: false
      })
      
      wsService.onMessage((data) => {
        console.log('Received WebSocket message:', data)
        // Add received message to chat
        addChatMessage({
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'campaign',
          content: data,
          isJson: true
        })
      })
      
      // Send test message
      wsService.send({ type: 'test', message: 'Hello from frontend!' })
    } catch (error) {
      setWsStatus('❌ WebSocket Connection Failed')
      setIsConnected(false)
      console.error('WebSocket error:', error)
      
      addChatMessage({
        id: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        content: `WebSocket connection failed: ${error}`,
        isJson: false
      })
    }
  }

  const testApiEndpoints = async () => {
    try {
      const sourcesResult = await ApiService.getSources()
      const configResult = await ApiService.getConfig()
      
      setApiResponse(`
Sources: ${JSON.stringify(sourcesResult.data, null, 2)}

Config: ${JSON.stringify(configResult.data, null, 2)}`)
      
      // Add API test results to chat
      if (sourcesResult.data) {
        addChatMessage({
          id: `api-sources-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: sourcesResult.data,
          isJson: true
        })
      }
    } catch (error) {
      setApiResponse(`API Test Error: ${error}`)
    }
  }

  const addChatMessage = (message: ChatMessageData) => {
    setChatMessages(prev => [...prev, message])
  }

  const clearChatMessages = () => {
    setChatMessages([])
  }

  const openConfigPanel = () => {
    setShowConfigPanel(true)
  }

  const closeConfigPanel = () => {
    setShowConfigPanel(false)
  }

  const handleConfigUpdate = (sourceId: string, config: any) => {
    addChatMessage({
      id: `config-update-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'system',
      content: `Configuration updated for ${sourceId}: ${config.type} mode ${config.enabled ? 'enabled' : 'disabled'}`,
      isJson: false
    })
  }

  const startCampaignSimulation = async () => {
    try {
      // Validate selections first
      if (selectedSources.length === 0) {
        addChatMessage({
          id: `error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: 'Please select at least 1 data source before starting simulation.',
          isJson: false
        })
        return
      }

      if (selectedChannels.length === 0) {
        addChatMessage({
          id: `error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: 'Please select at least 1 communication channel before starting simulation.',
          isJson: false
        })
        return
      }

      // Ensure WebSocket is connected
      if (!isConnected) {
        addChatMessage({
          id: `error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: 'Please connect WebSocket before starting campaign simulation.',
          isJson: false
        })
        return
      }

      setIsSimulationRunning(true)
      
      const result = await ApiService.startCampaign({
        selectedSources,
        selectedChannels
      })

      if (result.error) {
        addChatMessage({
          id: `error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: `Failed to start campaign simulation: ${result.error}`,
          isJson: false
        })
        setIsSimulationRunning(false)
      } else {
        setSessionId(result.data?.sessionId || '')
        addChatMessage({
          id: `success-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: `✅ Campaign simulation started successfully! Session: ${result.data?.sessionId}`,
          isJson: false
        })
        
        // Add configuration details
        addChatMessage({
          id: `config-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: result.data?.config || result.data,
          isJson: true
        })
      }
    } catch (error) {
      console.error('Error starting campaign simulation:', error)
      addChatMessage({
        id: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        content: `Campaign simulation error: ${error}`,
        isJson: false
      })
      setIsSimulationRunning(false)
    }
  }

  const stopCampaignSimulation = async () => {
    try {
      setIsSimulationRunning(false)
      
      const result = await ApiService.stopCampaign()

      if (result.error) {
        addChatMessage({
          id: `error-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: `Failed to stop campaign simulation: ${result.error}`,
          isJson: false
        })
      } else {
        setSessionId('')
        addChatMessage({
          id: `success-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'system',
          content: '⏹️ Campaign simulation stopped successfully.',
          isJson: false
        })
      }
    } catch (error) {
      console.error('Error stopping campaign simulation:', error)
      addChatMessage({
        id: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'system',
        content: `Stop simulation error: ${error}`,
        isJson: false
      })
    }
  }

  const simulateCampaignRecommendation = () => {
    // Simulate a campaign recommendation JSON
    const sampleRecommendation = {
      id: `campaign-${Date.now()}`,
      timestamp: new Date().toISOString(),
      audience: {
        segment_id: "high-value-customers",
        name: "High-Value Repeat Customers",
        filters: {
          purchase_frequency: ">= 3",
          lifetime_value: ">= 500",
          last_purchase_days: "<= 30"
        }
      },
      reasoning: {
        signals: [
          "Recent cart abandonment detected",
          "High engagement with email campaigns",
          "Previous positive response to discount offers"
        ],
        score: 0.87,
        explain: "Customer shows strong engagement patterns and is likely to convert with targeted messaging."
      },
      channel_plan: [
        {
          channel: "Email",
          send_at: new Date(Date.now() + 5 * 60000).toISOString(),
          priority: 1,
          payload: {
            subject: "Complete Your Purchase - 15% Off Inside!",
            body: "We noticed you left something in your cart. Complete your purchase now and save 15%!",
            cta: { text: "Complete Purchase", url: "https://store.com/checkout" },
            metadata: { campaign_type: "cart_abandonment", discount_percent: 15 }
          },
          delivery_instructions: { retry_policy: "exponential_backoff", timeout_sec: 30 }
        },
        {
          channel: "Push",
          send_at: new Date(Date.now() + 15 * 60000).toISOString(),
          priority: 2,
          payload: {
            title: "Don't Miss Out!",
            body: "Your items are waiting. Get 15% off now!",
            cta: { action: "open_app", deep_link: "/checkout" },
            metadata: { badge_count: 1 }
          },
          delivery_instructions: { retry_policy: "none", timeout_sec: 15 }
        }
      ],
      campaign_meta: {
        source_snapshot: {
          website: { cart_items: 3, session_duration: 420 },
          email: { last_opened: "2024-01-15T10:30:00Z", engagement_score: 0.75 }
        },
        engine_version: "v0.1-demo",
        confidence: 0.87
      }
    }

    addChatMessage({
      id: `campaign-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'campaign',
      content: sampleRecommendation,
      isJson: true
    })
  }

  return (
    <div className="App">
      <div className="app-layout">
        <div className="chat-section">
          <ChatInterface 
            messages={chatMessages}
            isConnected={isConnected}
            onClearMessages={clearChatMessages}
          />
        </div>
        
        <div className="controls-section">
          <div className="controls-panel">
            <h3>Campaign Configuration</h3>
            
            <div className="data-source-section">
              <DataSourceSelector 
                onSelectionChange={setSelectedSources}
                maxSelections={3}
                initialSelection={selectedSources}
              />
            </div>
            
            <div className="channel-section">
              <ChannelSelector 
                onSelectionChange={setSelectedChannels}
                maxSelections={4}
                initialSelection={selectedChannels}
              />
            </div>
            
            <div className="status-section">
              <div className="status-item">
                <strong>Backend:</strong> {backendStatus}
              </div>
              <div className="status-item">
                <strong>WebSocket:</strong> {wsStatus}
              </div>
              <div className="status-item">
                <strong>Selected Sources:</strong> {selectedSources.length}/3
              </div>
              <div className="status-item">
                <strong>Selected Channels:</strong> {selectedChannels.length}/4
              </div>
              <div className="status-item">
                <strong>Simulation:</strong> {isSimulationRunning ? 
                  <span style={{color: '#28a745'}}>🟢 Running {sessionId && `(${sessionId})`}</span> : 
                  <span style={{color: '#6c757d'}}>⚫ Stopped</span>
                }
              </div>
            </div>

            <div className="button-group">
              <button onClick={testBackendConnection} className="control-btn primary">
                Test Backend
              </button>
              <button onClick={testWebSocket} className="control-btn primary">
                Connect WebSocket
              </button>
              <button onClick={testApiEndpoints} className="control-btn secondary">
                Test API
              </button>
              <button onClick={openConfigPanel} className="control-btn secondary">
                🔧 Configuration
              </button>
            </div>
            
            <div className="campaign-controls">
              <h4>Campaign Simulation</h4>
              <div className="button-group">
                <button 
                  onClick={startCampaignSimulation} 
                  className="control-btn success" 
                  disabled={isSimulationRunning || selectedSources.length === 0 || selectedChannels.length === 0 || !isConnected}
                  title={!isConnected ? 'Connect WebSocket first' : selectedSources.length === 0 ? 'Select at least 1 data source' : selectedChannels.length === 0 ? 'Select at least 1 channel' : ''}
                >
                  ▶️ Start Campaign Simulation
                </button>
                <button 
                  onClick={stopCampaignSimulation} 
                  className="control-btn danger" 
                  disabled={!isSimulationRunning}
                >
                  ⏹️ Stop Campaign Simulation
                </button>
              </div>
              
              <div className="button-group">
                <button onClick={simulateCampaignRecommendation} className="control-btn secondary">
                  Test Sample Recommendation
                </button>
              </div>
            </div>

            <div className="debug-section">
              <h4>Debug Information</h4>
              <div className="debug-response">
                <pre>{apiResponse || 'No API response yet'}</pre>
              </div>
            </div>
            
            <div className="help-text">
              <p><strong>Quick Start:</strong></p>
              <ol>
                <li>Select up to 3 data sources above</li>
                <li>Select up to 4 communication channels</li>
                <li>Click "Test Backend" to verify connection</li>
                <li>Click "Connect WebSocket" for real-time communication</li>
                <li>Click "Start Campaign Simulation" to begin streaming recommendations</li>
                <li>Monitor real-time recommendations in the chat interface</li>
                <li>Click "Stop Campaign Simulation" to halt streaming</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <ConfigurationPanel 
        isVisible={showConfigPanel}
        onClose={closeConfigPanel}
        onConfigUpdate={handleConfigUpdate}
      />
    </div>
  )
}

export default App

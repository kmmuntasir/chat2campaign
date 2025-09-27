import { useState, useEffect } from 'react'
import './App.css'
import { ApiService, WebSocketService } from './services/api'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')
  const [apiResponse, setApiResponse] = useState<string>('')
  const [wsStatus, setWsStatus] = useState<string>('Disconnected')
  const [wsService] = useState(() => new WebSocketService())

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
      
      wsService.onMessage((data) => {
        console.log('Received WebSocket message:', data)
      })
      
      // Send test message
      wsService.send({ type: 'test', message: 'Hello from frontend!' })
    } catch (error) {
      setWsStatus('❌ WebSocket Connection Failed')
      console.error('WebSocket error:', error)
    }
  }

  const testApiEndpoints = async () => {
    try {
      const sourcesResult = await ApiService.getSources()
      const configResult = await ApiService.getConfig()
      
      setApiResponse(`
Sources: ${JSON.stringify(sourcesResult.data, null, 2)}

Config: ${JSON.stringify(configResult.data, null, 2)}`)
    } catch (error) {
      setApiResponse(`API Test Error: ${error}`)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat2Campaign - Local Development Test</h1>
        
        <div style={{ margin: '20px 0' }}>
          <h2>Backend Integration Status</h2>
          <p><strong>Backend Status:</strong> {backendStatus}</p>
          <p><strong>WebSocket Status:</strong> {wsStatus}</p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <button onClick={testBackendConnection} style={{ margin: '5px' }}>
            Test Backend Health
          </button>
          <button onClick={testWebSocket} style={{ margin: '5px' }}>
            Test WebSocket
          </button>
          <button onClick={testApiEndpoints} style={{ margin: '5px' }}>
            Test API Endpoints
          </button>
        </div>

        <div style={{ margin: '20px 0', textAlign: 'left' }}>
          <h3>API Response:</h3>
          <pre style={{ 
            background: '#f4f4f4', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {apiResponse || 'No response yet'}
          </pre>
        </div>
        
        <p style={{ fontSize: '14px', color: '#666' }}>
          This is a development integration test page.
          Both frontend (React) and backend (Express) should be running.
        </p>
      </header>
    </div>
  )
}

export default App

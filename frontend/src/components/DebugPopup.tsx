import { useState } from 'react'
import './DebugPopup.css'

interface DebugPopupProps {
  apiResponse: string
  backendStatus: string
  wsStatus: string
  isConnected: boolean
  selectedSources: string[]
  selectedChannels: string[]
  isSimulationRunning: boolean
  sessionId: string
  onTestBackend: () => void
  onTestApi: () => void
}

export const DebugPopup: React.FC<DebugPopupProps> = ({
  apiResponse,
  backendStatus,
  wsStatus,
  selectedSources,
  selectedChannels,
  isSimulationRunning,
  sessionId,
  onTestBackend,
  onTestApi
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  const closePopup = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Debug Button */}
      <button 
        className="debug-floating-btn"
        onClick={togglePopup}
        title="Open Debug Information"
      >
        🐛
      </button>

      {/* Debug Popup Overlay */}
      {isOpen && (
        <div className="debug-popup-overlay" onClick={closePopup}>
          <div className="debug-popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="debug-popup-header">
              <h3>Debug Information</h3>
              <button className="debug-popup-close" onClick={closePopup} aria-label="Close debug popup">
              </button>
            </div>

            <div className="debug-popup-content">
              {/* Status Section */}
              <div className="debug-section">
                <h4>Connection Status</h4>
                <div className="debug-status-grid">
                  <div className="debug-status-item">
                    <strong>Backend:</strong> 
                    <span className={backendStatus.includes('✅') ? 'status-success' : 'status-error'}>
                      {backendStatus}
                    </span>
                  </div>
                  <div className="debug-status-item">
                    <strong>WebSocket:</strong>
                    <span className={wsStatus.includes('✅') ? 'status-success' : 'status-error'}>
                      {wsStatus}
                    </span>
                  </div>
                  <div className="debug-status-item">
                    <strong>Sources:</strong> {selectedSources.length}/3
                  </div>
                  <div className="debug-status-item">
                    <strong>Channels:</strong> {selectedChannels.length}/4
                  </div>
                  <div className="debug-status-item">
                    <strong>Simulation:</strong> 
                    <span className={isSimulationRunning ? 'status-running' : 'status-stopped'}>
                      {isSimulationRunning ? `🟢 Running ${sessionId ? `(${sessionId})` : ''}` : '⚫ Stopped'}
                    </span>
                  </div>
                </div>
              </div>

              {/* API Response Section */}
              <div className="debug-section">
                <h4>API Response</h4>
                <div className="debug-response">
                  <pre>{apiResponse || 'No API response yet'}</pre>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="debug-section">
                <h4>Quick Actions</h4>
                <div className="debug-actions">
                  <button onClick={onTestBackend} className="debug-btn primary">
                    Test Backend
                  </button>
                  <button onClick={onTestApi} className="debug-btn secondary">
                    Test API
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="debug-section">
                <h4>Quick Start Guide</h4>
                <div className="debug-help">
                  <ol>
                    <li>Select up to 3 data sources</li>
                    <li>Select up to 4 communication channels</li>
                    <li>Click "Test Backend" to verify connection</li>
                    <li>Click "Connect WebSocket" for real-time communication</li>
                    <li>Click "Start Campaign Simulation" to begin streaming</li>
                    <li>Monitor recommendations in the chat interface</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
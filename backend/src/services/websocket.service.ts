import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { ClientConnection, StreamingMessage, SimulationConfig } from '../types/campaign';

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ClientConnection> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start heartbeat to check client connections
    this.startHeartbeat();
  }

  initialize(wss: WebSocketServer) {
    this.wss = wss;
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = uuidv4();
      const clientInfo: ClientConnection = {
        id: clientId,
        ws: ws,
        isActive: true,
        connectedAt: new Date(),
        lastActivity: new Date(),
      };

      this.clients.set(clientId, clientInfo);
      console.log(`Client connected: ${clientId} (Total clients: ${this.clients.size})`);

      // Send welcome message
      this.sendMessage(clientId, {
        type: 'system_message',
        data: 'Connected to Chat2Campaign streaming service',
        timestamp: new Date().toISOString()
      });

      // Handle incoming messages
      ws.on('message', (message: Buffer) => {
        this.handleClientMessage(clientId, message);
      });

      // Handle connection close
      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });

      // Handle pong responses for heartbeat
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastActivity = new Date();
        }
      });
    });
  }

  private handleClientMessage(clientId: string, message: Buffer) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const parsedMessage = JSON.parse(message.toString());
      client.lastActivity = new Date();

      console.log(`Message from ${clientId}:`, parsedMessage);

      // Handle different message types
      switch (parsedMessage.type) {
        case 'ping':
          this.sendMessage(clientId, {
            type: 'system_message',
            data: 'pong',
            timestamp: new Date().toISOString()
          });
          break;

        case 'start_simulation':
          this.handleStartSimulation(clientId, parsedMessage.config);
          break;

        case 'stop_simulation':
          this.handleStopSimulation(clientId);
          break;

        default:
          console.log(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error(`Error parsing message from ${clientId}:`, error);
      this.sendMessage(clientId, {
        type: 'error',
        data: 'Invalid message format',
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleClientDisconnect(clientId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.isActive = false;
      this.clients.delete(clientId);
      console.log(`Client disconnected: ${clientId} (Total clients: ${this.clients.size})`);
    }
  }

  private handleStartSimulation(clientId: string, config: SimulationConfig) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.simulationConfig = {
      ...config,
      interval: config.interval || 3000, // default 3 seconds
      duration: config.duration || 60000  // default 1 minute
    };

    this.sendMessage(clientId, {
      type: 'system_message',
      data: `Simulation started with ${config.selectedSources.length} sources and ${config.selectedChannels.length} channels`,
      timestamp: new Date().toISOString()
    });

    console.log(`Simulation started for client ${clientId}:`, client.simulationConfig);
  }

  private handleStopSimulation(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.simulationConfig = undefined;

    this.sendMessage(clientId, {
      type: 'system_message',
      data: 'Simulation stopped',
      timestamp: new Date().toISOString()
    });

    console.log(`Simulation stopped for client ${clientId}`);
  }

  public sendMessage(clientId: string, message: StreamingMessage): boolean {
    const client = this.clients.get(clientId);
    if (!client || !client.isActive) {
      return false;
    }

    try {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        return true;
      } else {
        // Connection is not ready, mark as inactive
        client.isActive = false;
        return false;
      }
    } catch (error) {
      console.error(`Error sending message to ${clientId}:`, error);
      client.isActive = false;
      return false;
    }
  }

  public broadcastMessage(message: StreamingMessage): number {
    let sentCount = 0;
    
    this.clients.forEach((client, clientId) => {
      if (this.sendMessage(clientId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  public broadcastToActiveSimulations(message: StreamingMessage): number {
    let sentCount = 0;
    
    this.clients.forEach((client, clientId) => {
      if (client.simulationConfig && this.sendMessage(clientId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  public getActiveClients(): ClientConnection[] {
    return Array.from(this.clients.values()).filter(client => client.isActive);
  }

  public getClientCount(): number {
    return this.clients.size;
  }

  public getActiveSimulations(): ClientConnection[] {
    return Array.from(this.clients.values()).filter(
      client => client.isActive && client.simulationConfig
    );
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const timeout = 30000; // 30 seconds

      this.clients.forEach((client, clientId) => {
        if (client.isActive) {
          // Check if client is still responsive
          const timeSinceActivity = now.getTime() - client.lastActivity.getTime();
          
          if (timeSinceActivity > timeout) {
            console.log(`Client ${clientId} timed out, removing...`);
            this.handleClientDisconnect(clientId);
          } else {
            // Send ping to check if client is still alive
            try {
              if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.ping();
              }
            } catch (error) {
              console.error(`Error pinging client ${clientId}:`, error);
              this.handleClientDisconnect(clientId);
            }
          }
        }
      });
    }, 10000); // Check every 10 seconds
  }

  public shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all client connections
    this.clients.forEach((client, clientId) => {
      try {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.close(1000, 'Server shutting down');
        }
      } catch (error) {
        console.error(`Error closing connection for ${clientId}:`, error);
      }
    });

    this.clients.clear();
  }
}
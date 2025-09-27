// API service for communicating with backend
const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Health check
  static async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Get data sources
  static async getSources(options?: {
    category?: string;
    enabledOnly?: boolean;
    includeStats?: boolean;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams();
    
    if (options?.category) {
      params.append('category', options.category);
    }
    if (options?.enabledOnly) {
      params.append('enabled_only', 'true');
    }
    if (options?.includeStats) {
      params.append('include_stats', 'true');
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/sources?${queryString}` : '/sources';
    
    return this.request(endpoint);
  }

  // Validate data source selection
  static async validateSourceSelection(selectedSources: string[]): Promise<ApiResponse> {
    return this.request('/sources/validate-selection', {
      method: 'POST',
      body: JSON.stringify({ selectedSources }),
    });
  }

  // Start campaign simulation
  static async startCampaign(payload: {
    selectedSources: string[];
    selectedChannels: string[];
  }): Promise<ApiResponse> {
    return this.request('/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Get configuration
  static async getConfig(): Promise<ApiResponse> {
    return this.request('/config');
  }

  // Set configuration
  static async setConfig(config: any): Promise<ApiResponse> {
    return this.request('/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }
}

// WebSocket service for real-time communication
export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string = 'ws://localhost:5173/ws') {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  onMessage(callback: (data: any) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
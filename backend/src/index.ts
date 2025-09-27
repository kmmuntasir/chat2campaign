import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

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

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Chat2Campaign Backend API is running!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes placeholder
app.get('/api/sources', (req, res) => {
  res.json({ message: 'Data sources endpoint - to be implemented' });
});

app.post('/api/start', (req, res) => {
  res.json({ message: 'Campaign simulation endpoint - to be implemented' });
});

app.get('/api/config', (req, res) => {
  res.json({ message: 'Configuration endpoint - to be implemented' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

export default app;
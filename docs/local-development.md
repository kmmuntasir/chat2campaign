# Local Development Guide

This guide provides detailed instructions for setting up and working with the Chat2Campaign project in your local development environment.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with TypeScript extensions

## Initial Setup

### 1. Repository Setup
```bash
git clone <repository-url>
cd chat2campaign
```

### 2. Install All Dependencies
```bash
npm run install:all
```

This command will:
- Install root-level dependencies (concurrently)
- Install frontend dependencies (React, Vite, TypeScript, etc.)
- Install backend dependencies (Express, WebSocket, TypeScript, etc.)

### 3. Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the .env file with your configurations
# PORT=5000
# NODE_ENV=development
# Add your API keys as needed
```

## Development Workflow

### Starting the Development Environment

**Option 1: Start Both Services (Recommended)**
```bash
npm run dev
```
This starts:
- Backend server at `http://localhost:5000`
- Frontend dev server at `http://localhost:5173`
- WebSocket server for real-time communication

**Option 2: Start Services Individually**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### Development URLs
- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`
- **API Base**: `http://localhost:5000/api`

## Project Structure Deep Dive

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/          # React components (to be created)
│   ├── services/           # API and WebSocket services
│   │   └── api.ts          # Backend communication layer
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── App.css             # Styling
├── public/                 # Static assets
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration with proxy setup
└── tsconfig.json           # TypeScript configuration
```

### Backend (`/backend`)
```
backend/
├── src/
│   └── index.ts            # Main server file
├── package.json            # Backend dependencies
├── tsconfig.json           # TypeScript configuration
└── .env.example            # Environment variables template
```

## API Integration

### Frontend-Backend Communication

The frontend communicates with the backend through:

1. **HTTP Requests**: Using the `ApiService` class
2. **WebSocket**: Real-time streaming via `WebSocketService` class

### Vite Proxy Configuration
The frontend Vite server proxies requests to avoid CORS issues:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    },
    '/ws': {
      target: 'ws://localhost:5000',
      ws: true,
      changeOrigin: true,
    }
  }
}
```

### Testing Integration

The application includes built-in integration tests:

1. **Backend Health Check**: Verifies API connectivity
2. **WebSocket Test**: Tests real-time communication
3. **API Endpoints Test**: Tests all available API routes

Access these tests by running the application and using the test buttons on the main page.

## Common Development Tasks

### Adding New API Endpoints

1. **Backend** (`backend/src/index.ts`):
```typescript
app.get('/api/new-endpoint', (req, res) => {
  res.json({ message: 'New endpoint response' });
});
```

2. **Frontend** (`frontend/src/services/api.ts`):
```typescript
static async newEndpoint(): Promise<ApiResponse> {
  return this.request('/new-endpoint');
}
```

### Adding New React Components

1. Create component in `frontend/src/components/`
2. Import and use in `App.tsx` or other components
3. Add TypeScript interfaces if needed

### WebSocket Message Handling

**Backend**:
```typescript
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle incoming messages
    const data = JSON.parse(message.toString());
    // Process and respond
    ws.send(JSON.stringify({ response: 'data' }));
  });
});
```

**Frontend**:
```typescript
const wsService = new WebSocketService();
await wsService.connect();

wsService.onMessage((data) => {
  // Handle incoming messages
  console.log('Received:', data);
});

// Send messages
wsService.send({ type: 'test', payload: 'data' });
```

## Build and Production

### Building the Project
```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Running Tests
```bash
# Run all tests
npm run test

# Run individual tests
npm run test:frontend
npm run test:backend
```

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Check what's using port 5000 or 5173
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill processes if needed
taskkill /PID <process_id> /F
```

**TypeScript Compilation Errors**:
- Check `tsconfig.json` files
- Ensure all type definitions are installed
- Run `npm install` in the respective directories

**Proxy Issues**:
- Verify backend is running on port 5000
- Check Vite proxy configuration in `vite.config.ts`
- Ensure no conflicting proxy settings

**WebSocket Connection Issues**:
- Confirm backend WebSocket server is running
- Check browser console for connection errors
- Verify proxy configuration for WebSocket

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reloading
2. **Debugging**: Use browser DevTools for frontend, VS Code debugger for backend
3. **Logging**: Check both browser console and terminal output
4. **API Testing**: Use the built-in test interface or tools like Postman

## Next Steps

After setting up local development:

1. **Review Documentation**: Read `docs/PRD.md` for project requirements
2. **Check Todo List**: See `docs/todo.md` for current development status
3. **Start Development**: Begin with feature implementation tasks
4. **Follow Git Workflow**: Make commits following the established patterns

## Environment Variables Reference

```env
# Backend (.env)
PORT=5000                    # Backend server port
NODE_ENV=development         # Environment mode

# Future API integrations
GROQ_API_KEY=your_key_here   # For AI decision engine
SHOPIFY_API_KEY=your_key     # For Shopify data source
FACEBOOK_API_KEY=your_key    # For Facebook data source
```

Remember to never commit actual API keys to the repository!
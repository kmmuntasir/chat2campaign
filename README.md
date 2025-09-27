# Chat2Campaign

A chat-based campaign simulator for omnichannel marketing decisions. This demo project allows users to interact with multiple marketing data sources and simulate real-time campaign recommendations through a Perplexity-style chat interface.

## 🚀 Quick Start

### Prerequisites
- Node.js (>= 18.0.0)
- npm

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd chat2campaign
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server at `http://localhost:5000`
   - Frontend development server at `http://localhost:5173`
   - WebSocket server for real-time communication

3. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application

## 📁 Project Structure

```
chat2campaign/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── services/        # API and WebSocket services
│   │   ├── components/      # React components
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts       # Vite configuration with proxy
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   └── index.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── docs/                    # Project documentation
├── package.json             # Root package.json for dev scripts
└── ai-changelog.md         # Development activity log
```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only frontend development server |
| `npm run dev:backend` | Start only backend development server |
| `npm run install:all` | Install dependencies for all projects |
| `npm run build` | Build both frontend and backend |
| `npm run test` | Run tests for both projects |

## 🏗️ Architecture

### Frontend (React + Vite + TypeScript)
- **Port:** 5173 (development)
- **API Communication:** Configured with Vite proxy to backend
- **WebSocket:** Real-time communication for streaming campaign data
- **UI Framework:** Basic CSS (no external UI library)

### Backend (Node.js + Express + TypeScript)
- **Port:** 5000
- **API Endpoints:** RESTful API for campaign simulation
- **WebSocket Server:** Real-time streaming of campaign recommendations
- **Decision Engine:** Core logic for campaign decision making

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api/sources` | Get available data sources |
| POST | `/api/start` | Start campaign simulation |
| GET/POST | `/api/config` | Get/set configuration |

## 🔧 Configuration

### Environment Variables
Copy `backend/.env.example` to `backend/.env` and configure:

```env
PORT=5000
NODE_ENV=development
# Add your API keys here
```

### Vite Proxy Configuration
The frontend is configured to proxy API requests to the backend:
- `/api/*` → `http://localhost:5000/api/*`
- `/ws` → WebSocket connection to backend

## 🧪 Integration Testing

The application includes a built-in integration test page that verifies:
- ✅ Backend API connectivity
- ✅ WebSocket communication
- ✅ All API endpoints functionality

Access the test page by running the application and checking the main page.

## 📝 Development Workflow

1. **Start development environment:** `npm run dev`
2. **Make changes** to frontend or backend code
3. **Hot reload** will automatically reflect changes
4. **Test integration** using the built-in test interface
5. **Commit changes** following the project's git workflow

## 🚢 Future Deployment

- **CI/CD:** GitHub Actions (planned)
- **Frontend:** Vercel/Netlify deployment ready
- **Backend:** Docker containerization for cloud deployment

## 📚 Documentation

For detailed documentation, see the `docs/` directory:
- `docs/PRD.md` - Product Requirements Document
- `docs/api_docs.md` - API specifications
- `docs/todo.md` - Development progress tracking

## 🤝 Contributing

1. Follow the established code structure
2. Update `ai-changelog.md` for significant changes
3. Test integration before committing
4. Follow existing TypeScript and coding conventions

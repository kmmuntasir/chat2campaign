# 💬 Chat2Campaign

<div align="center">

**A Production-Ready Chat-Based Campaign Simulator for Omnichannel Marketing Decisions**

*Inspired by Perplexity-style interfaces, merging multiple data sources to generate AI-powered campaign recommendations in real-time*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-green)](https://expressjs.com/)
[![Testing](https://img.shields.io/badge/Tests-Passing-brightgreen)]()

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**Chat2Campaign** is a sophisticated web application that simulates omnichannel marketing campaign decisions through an intuitive chat interface. The system aggregates event signals from multiple marketing data sources, uses AI-powered decision making, and generates structured campaign recommendations with audience targeting, multi-channel strategies, and delivery optimization.

### Key Capabilities
- **🔄 Real-time Campaign Simulation**: WebSocket-powered streaming of campaign recommendations
- **🎯 Multi-Source Data Integration**: Support for 10+ marketing data sources (Website, Shopify, CRM, Social Media)
- **🤖 AI-Powered Decision Engine**: Advanced signal aggregation with Groq AI integration
- **📱 Omnichannel Strategy**: Support for 7 communication channels (Email, SMS, Push, WhatsApp, Voice, Messenger, Ads)
- **⚡ Flexible Data Modes**: Toggle between mocked data and real API integrations
- **🛡️ Schema Validation**: JSON schema compliance with automatic error correction
- **🎨 Enhanced UI**: Collapsible JSON display with validation indicators

## 🎆 Features

### 📊 Core Functionality

| Feature | Description | Status |
|---------|-------------|---------|
| **Chat Interface** | Perplexity-style streaming JSON display with collapsible blocks | ✅ Complete |
| **Data Source Selector** | Choose up to 3 from 10 available marketing data sources | ✅ Complete |
| **Channel Selector** | Select up to 4 from 7 communication channels | ✅ Complete |
| **Campaign Simulation** | Real-time streaming campaign recommendations | ✅ Complete |
| **Configuration Panel** | Toggle mock/real APIs with credential management | ✅ Complete |
| **Decision Engine** | Advanced signal aggregation and AI-powered decisions | ✅ Complete |
| **Schema Validation** | JSON schema compliance with error correction | ✅ Complete |

### 📋 Data Sources

- **🌐 Website Analytics**: Google Analytics, Adobe Analytics, Custom APIs
- **🛍️ E-commerce**: Shopify, WooCommerce, Custom stores
- **📱 Social Media**: Facebook Pages, Twitter, Instagram
- **🏷️ Tag Management**: Google Tag Manager, Adobe Launch
- **📊 Advertising**: Google Ads, Facebook Ads, LinkedIn Ads
- **🔍 CRM Systems**: HubSpot, Salesforce, Custom CRM
- **⭐ Review Platforms**: Trustpilot, Google Reviews, Yelp
- **🔍 Ad Managers**: Meta Ads Manager, Google Ads Manager

### 📱 Communication Channels

- **📧 Email**: Automated email campaigns with personalization
- **📱 SMS**: Text message marketing with delivery tracking
- **🔔 Push Notifications**: Mobile and web push notifications
- **📲 WhatsApp**: Business messaging and customer engagement
- **📞 Voice**: Automated voice campaigns and IVR
- **💬 Messenger**: Facebook/Instagram messaging integration
- **🎯 Ads**: Display and social media advertising

## 🎥 Demo

### Application Preview

> 🚧 **Demo GIF Coming Soon!** 🚧
> 
> A comprehensive demo showing the full workflow from data source selection to campaign generation will be added here.

### Live Features Demo

1. **Data Source Selection**: Choose Website, Shopify, and CRM
2. **Channel Configuration**: Select Email, SMS, and Push notifications
3. **Real-time Streaming**: Watch AI-generated campaign recommendations appear
4. **JSON Schema Validation**: See automatic validation and error correction
5. **Configuration Toggle**: Switch between mock and real API data

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** for version control
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### ⚡ One-Minute Setup

```bash
# Clone the repository
git clone https://github.com/kmmuntasir/chat2campaign.git
cd chat2campaign

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

**That's it!** 🎉

- 🔗 Frontend: [http://localhost:5173](http://localhost:5173)
- 🔗 Backend API: [http://localhost:5000](http://localhost:5000)
- 🔗 Health Check: [http://localhost:5000/health](http://localhost:5000/health)

## 🔧 Detailed Setup

### Step-by-Step Installation

#### 1. **Clone Repository**
```bash
git clone https://github.com/kmmuntasir/chat2campaign.git
cd chat2campaign
```

#### 2. **Install Dependencies**
```bash
# Install all project dependencies
npm run install:all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

#### 3. **Environment Configuration**
```bash
# Copy environment template (optional)
cp backend/.env.example backend/.env
```

#### 4. **Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 5000)
```

#### 5. **Verification**
- ✅ Frontend: [http://localhost:5173](http://localhost:5173)
- ✅ Backend Health: [http://localhost:5000/health](http://localhost:5000/health)
- ✅ API Endpoints: [http://localhost:5000/api/sources](http://localhost:5000/api/sources)

## ⚙️ Configuration

### 🔄 Mock vs Real API Toggle

**Chat2Campaign** supports two data modes:

1. **🎭 Mock Data Mode** (Default)
   - Uses realistic simulated data
   - Perfect for development and demos
   - No external API dependencies
   - Instant setup and testing

2. **🌐 Real API Mode**
   - Connects to actual marketing platforms
   - Requires API credentials
   - Live data integration
   - Production-ready functionality

### 🔧 Configuration Methods

#### Via Web Interface (Recommended)
1. Open the application at [http://localhost:5173](http://localhost:5173)
2. Click on **"Configuration Panel"**
3. Toggle each data source between **Mock** and **Real API**
4. For Real API sources, provide:
   - **API URL**: The endpoint for your data source
   - **Auth Token**: API key, OAuth token, or authentication header

#### Via API Endpoints
```bash
# Get current configuration
curl http://localhost:5000/api/config

# Update data source configuration
curl -X POST http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "source": "shopify",
    "type": "real_api",
    "enabled": true,
    "apiConfig": {
      "apiUrl": "https://your-shop.myshopify.com/admin/api/2024-01",
      "authToken": "your-shopify-access-token"
    }
  }'
```

#### Via Configuration Files
```bash
# backend/.env
NODE_ENV=development
PORT=5000

# Optional: Set global data source type
GLOBAL_DATA_SOURCE_TYPE=mocked  # or 'real_api'

# Real API credentials (when needed)
SHOPIFY_API_URL=https://your-shop.myshopify.com/admin/api/2024-01
SHOPIFY_ACCESS_TOKEN=your-access-token
GOOGLE_ANALYTICS_API_KEY=your-ga-api-key
HUBSPOT_API_KEY=your-hubspot-key
```

### 🛡️ Security Configuration

- **API Credentials**: Stored securely, never committed to repository
- **Environment Variables**: Used for sensitive configuration
- **CORS**: Configured for local development
- **Rate Limiting**: Built-in protection for API endpoints

## 📡 API Documentation

### 🎯 Core API Endpoints

#### Campaign Simulation

| Method | Endpoint | Description | Response |
|--------|----------|-------------|---------|
| `POST` | `/api/start` | Start campaign simulation | WebSocket stream |
| `POST` | `/api/stop` | Stop active simulation | Success message |
| `GET` | `/api/streaming/status` | Get streaming status | Stream statistics |

**Example: Start Simulation**
```bash
curl -X POST http://localhost:5000/api/start \
  -H "Content-Type: application/json" \
  -d '{
    "selectedSources": ["website", "shopify", "crm_system"],
    "selectedChannels": ["Email", "SMS", "Push"]
  }'
```

#### Data Sources Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sources` | List all available data sources |
| `GET` | `/api/sources/:sourceId` | Get specific source details |
| `POST` | `/api/sources/:sourceId/config` | Update source configuration |
| `POST` | `/api/sources/validate-selection` | Validate source selection |
| `POST` | `/api/sources/set-global-type` | Set global mock/real mode |

**Example Response: Data Sources**
```json
[
  {
    "id": "website",
    "name": "Website Analytics",
    "type": "mocked",
    "enabled": true,
    "description": "Website visitor behavior and conversion events",
    "eventTypes": ["page_view", "cart_abandonment", "conversion"]
  },
  {
    "id": "shopify",
    "name": "Shopify E-commerce",
    "type": "real_api",
    "enabled": true,
    "description": "E-commerce orders, customers, and product data",
    "eventTypes": ["order_created", "customer_created", "inventory_updated"]
  }
]
```

#### Configuration Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/config` | Get current configuration |
| `POST` | `/api/config` | Update configuration |

#### Decision Engine

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/decision-engine/rules` | Get current decision rules |
| `POST` | `/api/decision-engine/rules` | Update decision rules |
| `POST` | `/api/decision-engine/generate` | Generate single recommendation |

#### Mock Data Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/mock-data/generate/:sourceId` | Generate mock events |
| `POST` | `/api/mock-data/batch-generate` | Generate batch mock data |
| `GET` | `/api/mock-data/sample/:sourceId/:eventType` | Get sample event |

#### Real API Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/real-api/health` | Check API health status |
| `POST` | `/api/real-api/test/:sourceId` | Test individual API connection |
| `POST` | `/api/real-api/test-all` | Test all configured APIs |
| `POST` | `/api/real-api/reset-failures/:sourceId` | Reset failure tracking |

#### Schema Validation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schema/stats` | Get validation statistics |
| `POST` | `/api/schema/validate` | Validate single recommendation |
| `POST` | `/api/schema/validate-batch` | Batch validate recommendations |
| `GET` | `/api/schema/sample` | Generate valid sample |
| `POST` | `/api/schema/reset-stats` | Reset validation statistics |

### 📄 JSON Output Schema

**Campaign Recommendation Structure:**
```json
{
  "id": "de_1727398234567_abc123def",
  "timestamp": "2024-09-27T01:30:34.567Z",
  "audience": {
    "segment_id": "high-intent-customers",
    "name": "High Intent Customers",
    "filters": {
      "intent_score": ">= 0.8",
      "recent_activity": "<= 1h"
    }
  },
  "reasoning": {
    "signals": [
      "Recent cart abandonment detected",
      "High product engagement activity",
      "Extended browsing session indicates interest"
    ],
    "score": 0.85,
    "explain": "Customer demonstrates high urgency with 3 positive signals indicating strong conversion potential."
  },
  "channel_plan": [
    {
      "channel": "Email",
      "send_at": "2024-09-27T01:35:34.567Z",
      "priority": 1,
      "payload": {
        "subject": "Complete your purchase - Limited time offer!",
        "title": "Don't miss out!",
        "body": "You left some great items in your cart. Complete your purchase now and get 10% off!",
        "cta": {
          "text": "Complete Purchase",
          "url": "https://example.com/checkout",
          "action": "checkout"
        },
        "metadata": {
          "campaign_type": "cart_abandonment",
          "discount_code": "SAVE10"
        }
      },
      "delivery_instructions": {
        "retry_policy": "exponential_backoff",
        "timeout_sec": 30
      }
    }
  ],
  "campaign_meta": {
    "source_snapshot": {
      "website": {
        "cart_abandonment": {
          "cart_value": 150,
          "items_count": 3
        }
      }
    },
    "engine_version": "v1.0-decision-engine",
    "confidence": 0.87
  }
}
```

## 📚 Usage Guide

### 🎥 Basic Workflow

1. **🔗 Access Application**
   - Open [http://localhost:5173](http://localhost:5173)
   - Verify backend connectivity (green connection indicator)

2. **🎨 Configure Data Sources**
   - Click "Configuration Panel"
   - Toggle between Mock/Real API for each source
   - Add API credentials for Real API sources
   - Save configuration

3. **🎯 Select Campaign Parameters**
   - **Data Sources**: Choose up to 3 sources (e.g., Website, Shopify, CRM)
   - **Channels**: Select up to 4 channels (e.g., Email, SMS, Push, WhatsApp)

4. **🚀 Start Campaign Simulation**
   - Click "Start Campaign Simulation"
   - Watch real-time recommendations stream in chat interface
   - Observe JSON schema validation indicators

5. **🗒️ Analyze Results**
   - **Collapsed View**: Quick summary with key metrics
   - **Expanded View**: Detailed structured display
   - **Raw JSON**: Complete technical data
   - **Validation Status**: Schema compliance indicators

### 🔍 Advanced Features

#### Real API Integration
```bash
# Test API connectivity
curl -X POST http://localhost:5000/api/real-api/test/shopify

# Check overall API health
curl http://localhost:5000/api/real-api/health
```

#### Custom Decision Rules
```bash
# Get current rules
curl http://localhost:5000/api/decision-engine/rules

# Update channel prioritization
curl -X POST http://localhost:5000/api/decision-engine/rules \
  -H "Content-Type: application/json" \
  -d '{
    "channelRules": [
      {
        "id": "high-value-email-priority",
        "name": "High Value Customer Email Priority",
        "condition": "audience.segment_id === \"high-value-customers\"",
        "priority": 10,
        "channels": ["Email", "WhatsApp"],
        "enabled": true
      }
    ]
  }'
```

#### Schema Validation Testing
```bash
# Validate custom recommendation
curl -X POST http://localhost:5000/api/schema/validate \
  -H "Content-Type: application/json" \
  -d '{
    "recommendation": {
      "id": "test_123",
      "timestamp": "2024-09-27T01:30:00.000Z",
      "audience": {
        "segment_id": "test-segment",
        "name": "Test Audience",
        "filters": {}
      },
      "reasoning": {
        "signals": ["Test signal"],
        "score": 0.5,
        "explain": "Test recommendation"
      },
      "channel_plan": [],
      "campaign_meta": {
        "source_snapshot": {},
        "engine_version": "v1.0",
        "confidence": 0.5
      }
    }
  }'
```

## 📋 Project Structure

```
chat2campaign/
├── 📦 frontend/                     # React + Vite + TypeScript
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── __tests__/            # Component tests
│   │   │   ├── ChatInterface.tsx     # Main chat UI
│   │   │   ├── ChatMessage.tsx       # Enhanced JSON display
│   │   │   ├── DataSourceSelector.tsx # Data source selection
│   │   │   ├── ChannelSelector.tsx   # Channel selection
│   │   │   └── ConfigurationPanel.tsx # Configuration UI
│   │   ├── services/                 # API and WebSocket services
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── App.tsx                   # Main application
│   │   └── main.tsx                  # Application entry point
│   ├── jest.config.js               # Jest testing configuration
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.ts               # Vite configuration with proxy
├── ⚙️ backend/                      # Node.js + Express + TypeScript
│   ├── __tests__/                   # Backend tests
│   │   └── schema-validator.test.ts  # Schema validation tests
│   ├── src/
│   │   ├── schemas/                  # JSON schemas
│   │   │   └── campaign-recommendation.schema.json
│   │   ├── services/                 # Core business logic
│   │   │   ├── decision.engine.ts     # AI-powered decision engine
│   │   │   ├── schema-validator.service.ts # Schema validation
│   │   │   ├── mock-data.generator.ts # Mock data generation
│   │   │   ├── real-api.service.ts    # Real API integration
│   │   │   ├── streaming.service.ts   # WebSocket streaming
│   │   │   └── datasources.service.ts # Data source management
│   │   ├── types/                    # TypeScript interfaces
│   │   │   └── campaign.ts            # Campaign recommendation types
│   │   └── index.ts                  # Express server and API routes
│   ├── jest.config.js               # Jest testing configuration
│   ├── package.json                 # Backend dependencies
│   └── tsconfig.json                # TypeScript configuration
├── 📚 docs/                         # Project documentation
│   ├── PRD.md                       # Product Requirements Document
│   ├── todo.md                      # Development progress tracking
│   ├── feature_list.md              # Complete feature list
│   └── tasks_list/                  # Detailed task specifications
├── package.json                     # Root package.json for dev scripts
├── ai-changelog.md                  # Comprehensive development log
├── LICENSE                          # MIT License
└── README.md                        # This comprehensive guide
```

## 🔧 Development

### 🔄 Development Scripts

| Command | Description | Details |
|---------|-------------|----------|
| `npm run dev` | Start both frontend and backend | Concurrent development servers |
| `npm run dev:frontend` | Start only frontend (port 5173) | React + Vite hot reload |
| `npm run dev:backend` | Start only backend (port 5000) | Express + TypeScript with nodemon |
| `npm run install:all` | Install all project dependencies | Frontend + Backend + Root |
| `npm run build` | Build both projects for production | Optimized builds |
| `npm run test` | Run all test suites | Backend + Frontend tests |
| `npm run test:backend` | Run backend tests only | Jest + TypeScript |
| `npm run test:frontend` | Run frontend tests only | Jest + React Testing Library |
| `npm run lint` | Run linting for all projects | ESLint + TypeScript |

### 🔄 Development Workflow

1. **🌱 Environment Setup**
   ```bash
   # Clone and setup
   git clone https://github.com/kmmuntasir/chat2campaign.git
   cd chat2campaign
   npm run install:all
   ```

2. **🎨 Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name
   
   # Start development servers
   npm run dev
   
   # Make your changes...
   # Frontend: http://localhost:5173
   # Backend: http://localhost:5000
   ```

3. **✅ Testing & Validation**
   ```bash
   # Run all tests
   npm run test
   
   # Run specific test suites
   npm run test:backend   # Schema validation, API tests
   npm run test:frontend  # Component tests, UI tests
   
   # Lint code
   npm run lint
   ```

4. **📝 Documentation**
   ```bash
   # Update ai-changelog.md with your changes
   # Follow existing format with timestamps and detailed descriptions
   ```

5. **🔀 Integration Testing**
   - Test WebSocket connections
   - Verify API endpoint functionality
   - Test mock/real API toggle
   - Validate JSON schema compliance

### 🎨 Code Style Guidelines

- **TypeScript**: Strict typing for all new code
- **ESLint**: Follow existing linting rules
- **Naming**: Use descriptive names for components and functions
- **Comments**: Document complex business logic
- **Testing**: Write tests for new features

### 🔍 Debugging

#### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev:backend

# Check backend health
curl http://localhost:5000/health

# View real-time logs
tail -f backend/logs/app.log  # if logging is configured
```

#### Frontend Debugging
```bash
# React Developer Tools
# Install browser extension

# Vite dev server logs
npm run dev:frontend

# Check WebSocket connection
# Open browser dev tools > Network > WS
```

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

## 🧪 Testing

### 🔄 Test Suites

**Chat2Campaign** includes comprehensive testing at multiple levels:

#### Backend Testing (Jest + TypeScript)
```bash
cd backend
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Test Coverage:**
- ✅ **Schema Validation Tests** (19 tests): Complete JSON schema validation coverage
- ✅ **API Endpoint Tests**: All REST API endpoints
- ✅ **Decision Engine Tests**: Core business logic
- ✅ **Mock Data Generation**: Data generation algorithms
- ✅ **Real API Integration**: API connectivity and fallback logic

#### Frontend Testing (Jest + React Testing Library)
```bash
cd frontend
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Test Coverage:**
- ✅ **Component Testing**: All React components with user interactions
- ✅ **JSON Parsing**: Enhanced ChatMessage component validation
- ✅ **Schema Validation UI**: Frontend validation feedback
- ✅ **Error Handling**: Graceful error handling scenarios
- ✅ **Performance Testing**: Large JSON object rendering

### 🧩 Integration Testing

#### Built-in Test Interface
The application includes real-time integration testing:
- ✅ Backend API connectivity verification
- ✅ WebSocket communication testing
- ✅ End-to-end campaign simulation
- ✅ Mock/Real API toggle functionality

#### Manual Testing Checklist
1. **🔗 Connectivity**
   - [ ] Frontend loads at http://localhost:5173
   - [ ] Backend health check responds at http://localhost:5000/health
   - [ ] WebSocket connection establishes successfully

2. **🎨 User Interface**
   - [ ] Data source selection (up to 3 sources)
   - [ ] Channel selection (up to 4 channels)
   - [ ] Configuration panel toggle functionality
   - [ ] Campaign start/stop controls

3. **📄 Data Flow**
   - [ ] Mock data generation works
   - [ ] Real API integration (if configured)
   - [ ] JSON schema validation displays correctly
   - [ ] Streaming recommendations appear in chat

### 🤖 Automated Testing

```bash
# Run all tests
npm run test

# Generate coverage reports
npm run test:coverage

# Performance benchmarking
npm run test:performance  # if configured
```

## 🚀 Deployment

### 🏠 Local Production Build

```bash
# Build all projects
npm run build

# Start production servers
npm run start:prod  # if configured
```

### ☁️ Cloud Deployment Options

#### Frontend Deployment

**Vercel** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Netlify**
```bash
# Build frontend
cd frontend
npm run build

# Deploy dist/ folder to Netlify
```

#### Backend Deployment

**Docker Containerization**
```dockerfile
# Dockerfile (create in backend/)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Heroku Deployment**
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Deploy backend
git subtree push --prefix backend heroku main
```

**Railway/Render**
- Connect GitHub repository
- Configure build command: `npm run build`
- Configure start command: `npm start`
- Set environment variables

### 🌐 Environment Configuration

#### Production Environment Variables
```bash
# Backend production .env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com

# Real API credentials
SHOPIFY_API_URL=https://your-shop.myshopify.com/admin/api/2024-01
SHOPIFY_ACCESS_TOKEN=your-production-token
GOOGLE_ANALYTICS_API_KEY=your-ga-production-key
HUBSPOT_API_KEY=your-hubspot-production-key

# Security
ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_REQUESTS_PER_MINUTE=100
```

#### Frontend Production Configuration
```bash
# Frontend .env.production
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_WS_URL=wss://your-backend-domain.com
VITE_APP_ENV=production
```

### 🔍 CI/CD Pipeline

**GitHub Actions** (Recommended)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run test
      - run: npm run build
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

## 🔧 Troubleshooting

### 🚨 Common Issues

#### Port Conflicts
**Problem**: "Port 5000 is already in use"
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=5001 npm run dev:backend
```

#### WebSocket Connection Failed
**Problem**: "WebSocket connection failed"
```bash
# Check backend is running
curl http://localhost:5000/health

# Verify WebSocket endpoint
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://localhost:5000/ws
```

#### Schema Validation Errors
**Problem**: "Schema validation failed"
```bash
# Test schema validation
curl -X GET http://localhost:5000/api/schema/sample

# Check validation statistics
curl http://localhost:5000/api/schema/stats

# Reset validation stats
curl -X POST http://localhost:5000/api/schema/reset-stats
```

#### Mock Data Not Generating
**Problem**: "No mock events generated"
```bash
# Test mock data generation
curl http://localhost:5000/api/mock-data/generate/website

# Check data source configuration
curl http://localhost:5000/api/sources

# Reset to mock mode
curl -X POST http://localhost:5000/api/sources/set-global-type \
  -H "Content-Type: application/json" \
  -d '{"type": "mocked"}'
```

#### Real API Integration Issues
**Problem**: "Real API connection failed"
```bash
# Test specific API connection
curl -X POST http://localhost:5000/api/real-api/test/shopify

# Check API health status
curl http://localhost:5000/api/real-api/health

# Reset API failure tracking
curl -X POST http://localhost:5000/api/real-api/reset-failures/shopify
```

### 📈 Performance Issues

#### Slow JSON Rendering
```bash
# Check if large JSON objects are causing issues
# Reduce eventCount in mock data generation
curl "http://localhost:5000/api/mock-data/generate/website?eventCount=5"
```

#### High Memory Usage
```bash
# Monitor Node.js memory usage
node --inspect backend/dist/index.js

# Use Chrome DevTools to analyze memory
# Open chrome://inspect
```

### 🔄 Reset to Clean State

```bash
# Reset all configurations
curl -X POST http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d '{"reset": true}'

# Clear validation statistics
curl -X POST http://localhost:5000/api/schema/reset-stats

# Reset API failure tracking
curl -X POST http://localhost:5000/api/real-api/reset-failures/all

# Restart development servers
npm run dev
```

### 📞 Support

If you encounter issues not covered here:
1. Check the [GitHub Issues](https://github.com/kmmuntasir/chat2campaign/issues)
2. Review the `ai-changelog.md` for recent changes
3. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, browser)
   - Console logs and error messages

## 🤝 Contributing

### 🎆 How to Contribute

1. **🍴 Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/chat2campaign.git
   cd chat2campaign
   ```

2. **🌱 Set Up Development Environment**
   ```bash
   npm run install:all
   npm run dev
   ```

3. **🎨 Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **⚙️ Develop & Test**
   ```bash
   # Make your changes
   # Add tests for new functionality
   npm run test
   npm run lint
   ```

5. **📋 Update Documentation**
   ```bash
   # Update ai-changelog.md with your changes
   # Follow existing format:
   ### YYYY-MM-DD HH:mm:ss
   **Feature:** [Feature Name]
   **Description:** Detailed description of changes
   **Files Modified:** List of modified files
   ```

6. **📎 Submit Pull Request**
   - Clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

### 📋 Development Guidelines

#### Code Standards
- **TypeScript**: Use strict typing
- **ESLint**: Follow existing configuration
- **Prettier**: Code formatting (if configured)
- **Testing**: Add tests for new features
- **Documentation**: Update README for significant changes

#### Commit Message Format
```bash
# Format: [Type]: Brief description
# Examples:
feat: Add real-time validation indicators to chat interface
fix: Resolve WebSocket connection timeout issues
docs: Update API documentation with new endpoints
test: Add comprehensive schema validation tests
refactor: Improve decision engine performance
```

#### Pull Request Checklist
- [ ] Code follows existing style guidelines
- [ ] Tests pass locally (`npm run test`)
- [ ] New features include appropriate tests
- [ ] Documentation updated if needed
- [ ] `ai-changelog.md` updated with changes
- [ ] No merge conflicts with main branch
- [ ] PR description clearly explains changes

### 🎯 Areas for Contribution

**High Priority**
- 🔄 Additional data source integrations (LinkedIn, TikTok, etc.)
- 🌐 Real API connectors for popular platforms
- 🔒 Enhanced security features
- ⚡ Performance optimizations

**Medium Priority**
- 🎨 UI/UX improvements
- 📈 Analytics and reporting features
- 🤖 Advanced AI decision rules
- 📱 Mobile responsiveness improvements

**Documentation & Testing**
- 📚 Comprehensive API documentation
- 🧪 Additional test coverage
- 🎥 Demo videos and tutorials
- 🌐 Internationalization (i18n)

## 📜 License

**Chat2Campaign** is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2024 Chat2Campaign

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**💬 Chat2Campaign** - *Transforming Marketing Decisions Through AI-Powered Campaign Simulation*

[🔗 Repository](https://github.com/kmmuntasir/chat2campaign) • 
[📧 Issues](https://github.com/kmmuntasir/chat2campaign/issues) • 
[📚 Documentation](docs/) • 
[🔄 Changelog](ai-changelog.md)

**Built with ❤️ for marketers, developers, and AI enthusiasts**

*Star ⭐ this project if it helps you!*

</div>

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

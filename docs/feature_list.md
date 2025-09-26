# Feature List

## 1. Chat Interface for Campaign Recommendations
### FE Tasks
- Implement a chat-style UI to display streaming messages.
- Develop functionality to display real-time JSON payloads.
- Implement collapsible JSON blocks.
- Implement formatted view for JSON blocks.

### BE Tasks
- Implement WebSocket/SSE streaming to send JSON payloads to the frontend.
- Ensure WebSocket/SSE supports multiple simultaneous users.

## 2. Data Source Selector
### FE Tasks
- Display a list of available data sources (e.g., Website, Shopify, Facebook Page, GTM, Google Ads Tag, Facebook Pixel, CRMs, Twitter Page, Review Sites, Ad Managers).
- Implement selection mechanism for up to 3 data sources per session.

### BE Tasks
- Create `/api/sources` endpoint to return a list of available data sources.
- Implement logic for configurable mocked/real data sources for the `/api/sources` endpoint.

## 3. Channel Selector
### FE Tasks
- Display a list of available channels (e.g., Email, SMS, Push, WhatsApp, Voice, Messenger, Ads).
- Implement selection mechanism for up to 4 channels per session.

### BE Tasks
- No specific BE tasks for channel selection list, as channels are defined by the FE and used in the `/api/start` endpoint.

## 4. Campaign Simulation Controls (Start/Stop)
### FE Tasks
- Implement a "Start Campaign Simulation" button to trigger the simulation.
- Implement a "Stop Campaign Simulation" button to halt streaming.

### BE Tasks
- Create `/api/start` endpoint to initiate campaign simulation based on selected sources and channels.
- Implement logic to stop the streaming process when requested.

## 5. Configuration Panel
### FE Tasks
- Create a UI for a Configuration Panel.
- Implement toggle functionality for mocked vs. real API endpoints per data source.
- Provide input fields to configure API URLs and authentication tokens.

### BE Tasks
- Create `/api/config` endpoint to get and set endpoint configurations (mock vs. real API).
- Implement persistence for endpoint configurations (e.g., JSON file or `.env`).

## 6. Decision Engine Development
### FE Tasks
- No specific FE tasks, as the decision engine is a backend component.

### BE Tasks
- Develop the core Decision Engine to aggregate signals from selected data sources.
- Integrate Groq AI to power real-time decision-making and recommendation generation within the engine.
- Implement logic to generate structured JSON payloads with audience segments, reasoning, scoring, channel plans, and campaign meta.
- Implement configurable rules to prioritize channels and messages.
- Ensure the decision engine is modular and extendable.

## 7. Data Source Integration (Mocked Data)
### FE Tasks
- No specific FE tasks, as this is a backend data concern.

### BE Tasks
- Implement local JSON files or generators to simulate events for each data source (e.g., cart abandonment, page views).

## 8. Data Source Integration (Real API)
### FE Tasks
- No specific FE tasks, as this is a backend data concern, except displaying API configuration in the UI.

### BE Tasks
- Implement configurable API endpoints to fetch events using API keys, OAuth, or REST/GraphQL.
- Implement graceful fallback to mock data if a real API is unavailable.

## 9. JSON Output Schema Adherence
### FE Tasks
- Ensure the frontend can parse and display JSON payloads according to the defined schema.

### BE Tasks
- Ensure the Decision Engine generates JSON payloads that strictly adhere to the defined schema.

## 10. Initial Project Setup & Documentation
### FE Tasks
- Ensure the React frontend can be run with `npm install && npm run dev`.

### BE Tasks
- Ensure the Node.js + Express backend can be run with `npm install && npm run dev`.

### General Tasks
- Create a comprehensive README with clear instructions for setup and usage.

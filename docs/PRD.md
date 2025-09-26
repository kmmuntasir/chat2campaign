PRD: Chat-Based Campaign Simulator
==================================

### Project Overview

The **Chat-Based Campaign Simulator** is a web application that allows users to interact with multiple marketing data sources and simulate omnichannel campaign decisions. Inspired by Perplexity-style chat interfaces, it merges event data from multiple sources and generates streaming JSON outputs representing the "right time, right channel, right message, for the right audience."

This demo project is designed for rapid evaluation and integration with either **mocked local endpoints** or **real external APIs**, providing flexibility during development and testing.

* * * * *

Goals
-----

1.  Build a **chat-style UI** that displays streaming campaign recommendations in JSON format.

2.  Allow the user to **select data sources** (3 sources per session) and **channels** (4 channels per session).

3.  Provide **configurable endpoints** to toggle between mocked JSON and real API data for each data source.

4.  Simulate **real-time campaign decision-making** with an extendable engine.

5.  Ensure the system is **modular** and **scalable** for future integration with production systems.

* * * * *

Features
--------

### 1. User Interface

-   **Chat Interface**

    -   Displays real-time JSON payloads as streaming messages.

    -   Supports collapsible JSON blocks and formatted view.

-   **Data Source Selector**

    -   List of available data sources: Website, Shopify, Facebook Page, GTM, Google Ads Tag, Facebook Pixel, CRMs, Twitter Page, Review Sites, Ad Managers.

    -   Allow selecting up to 3 sources per session.

-   **Channel Selector**

    -   Channels: Email, SMS, Push, WhatsApp, Voice, Messenger, Ads.

    -   Allow selecting up to 4 channels per session.

-   **Start / Stop Campaign Simulation**

    -   Start button triggers campaign simulation.

    -   Stop button halts streaming.

-   **Configuration Panel**

    -   Toggle between **mocked** and **real API** endpoints per data source.

    -   Configure API URLs, auth tokens, or local mocks.

### 2. Backend

-   **Endpoints**

    -   `/api/sources`: Returns list of available sources (configurable mocked/real).

    -   `/api/start`: Starts campaign simulation for selected sources and channels.

    -   `/api/config`: Get/set endpoint configuration (mock vs real API).

-   **WebSocket / SSE Streaming**

    -   Streams JSON payloads in real-time to the frontend.

    -   Supports multiple simultaneous users.

-   **Decision Engine**

    -   Aggregates signals from selected data sources.

    -   Generates structured JSON payloads with:

        -   Audience segments

        -   Reasoning & scoring

        -   Channel plans (send_at, priority, payload, delivery instructions)

        -   Campaign meta (source snapshot, engine version, confidence)

    -   Configurable rules to prioritize channels and messages.

### 3. Data Sources Integration

-   **Mocked Data**

    -   Each data source has a local JSON file or generator simulating events.

    -   Examples: cart_abandonment, page views, social engagement, orders.

-   **Real API**

    -   Configurable API endpoints.

    -   Fetch events using API keys, OAuth, or REST/GraphQL.

    -   System should gracefully fallback to mock if real API is unavailable.

### 4. JSON Output Schema

-   **Payload Structure**
```json
{
  "id": "string",
  "timestamp": "ISO8601 string",
  "audience": { "segment_id": "string", "name": "string", "filters": {} },
  "reasoning": { "signals": [], "score": 0.0, "explain": "string" },
  "channel_plan": [
    {
      "channel": "Email|Push|WhatsApp|Ads|SMS|Messenger|Voice",
      "send_at": "ISO8601",
      "priority": 1,
      "payload": { "subject": "string", "body": "string", "cta": {}, "metadata": {} },
      "delivery_instructions": { "retry_policy": "string", "timeout_sec": 30 }
    }
  ],
  "campaign_meta": { "source_snapshot": {}, "engine_version": "v0.1-demo", "confidence": 0.87 }
}
```

* * * * *

Non-Functional Requirements
---------------------------

1.  **Modularity**

    -   Easily add/remove data sources or channels.

    -   Decision engine should be replaceable or extendable.

2.  **Configurability**

    -   Toggle between mocked and real endpoints per source.

    -   Store endpoint configurations in JSON or `.env`.

3.  **Performance**

    -   Streaming interval: 1--5 seconds per decision payload.

    -   Support up to 5 concurrent simulated users in demo.

4.  **Security**

    -   No sensitive credentials should be committed in repo.

    -   Mocked data should be safe for public demo.

5.  **Usability**

    -   Minimal setup: `npm install && npm run dev` for frontend & backend.

    -   Clear instructions in README.

* * * * *

Tech Stack (Demo)
-----------------

| Layer | Technology / Library | Notes |
| --- | --- | --- |
| Frontend | React + Vite + TypeScript | Modern SPA for chat UI |
| UI Library | Basic CSS (No Tailwind CSS) | For layout & styling |
| Backend | Node.js + Express | API and WebSocket server |
| Real-time | ws (WebSocket) or SSE | Streaming JSON payloads |
| Data Layer | Local JSON / API fetch | Mocked vs real endpoints |
| Hosting | GitHub repo + optional Vercel/Render | Demo presentation |

* * * * *

User Stories
------------

1.  **As a user**, I want to select 3 data sources and 4 channels, so that I can see campaign recommendations.

2.  **As a user**, I want to toggle between mocked and real API endpoints, so I can test locally or with real data.

3.  **As a developer**, I want a modular decision engine, so I can easily extend rules or integrate AI.

* * * * *

Milestones
----------

| Milestone | Deliverable |
| --- | --- |
| M1 | Backend REST API + WebSocket streaming + mock data |
| M2 | React frontend with chat interface, source & channel selection |
| M3 | Configurable endpoint system (mock/real toggle) |
| M4 | Decision engine generates structured JSON payloads |
| M5 | README, demo GIF, sample payloads, instructions |
| M6 | Optional: deploy demo on Render/Vercel, host public repo |

* * * * *

Success Metrics
---------------

1.  System streams structured JSON payloads for selected sources/channels.

2.  Frontend shows live updates in chat interface with proper formatting.

3.  Decision engine correctly merges mock/real events into logical outputs.

4.  Configuration system works: toggling between mock and real APIs does not break the app.

5.  Repo is self-contained and can be run with minimal setup.
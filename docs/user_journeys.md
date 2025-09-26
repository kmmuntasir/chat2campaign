## User Journeys

### User Journey 1: Simulating a Campaign with Mocked Data

**Persona:** Marketing Analyst

1.  **Access Application:** The user navigates to the Chat-Based Campaign Simulator web application.
2.  **Select Data Sources:** The user selects up to 3 marketing data sources (e.g., Website, Shopify, Facebook Page) from the Data Source Selector.
3.  **Select Channels:** The user selects up to 4 communication channels (e.g., Email, SMS, Push) from the Channel Selector.
4.  **Configure Endpoints (Mocked):** The user goes to the Configuration Panel and ensures that the selected data sources are set to use "mocked" endpoints.
5.  **Start Simulation:** The user clicks the "Start Campaign Simulation" button.
6.  **Observe Streaming Recommendations:** The chat interface displays real-time JSON payloads representing campaign recommendations. The user can collapse and format the JSON blocks for better readability.
7.  **Stop Simulation:** The user clicks the "Stop Campaign Simulation" button to halt the streaming.

### User Journey 2: Simulating a Campaign with Real API Data

**Persona:** Marketing Analyst / Developer

1.  **Access Application:** The user navigates to the Chat-Based Campaign Simulator web application.
2.  **Select Data Sources:** The user selects up to 3 marketing data sources.
3.  **Select Channels:** The user selects up to 4 communication channels.
4.  **Configure Endpoints (Real API):** The user goes to the Configuration Panel and toggles selected data sources to use "real API" endpoints. They configure the API URLs and authentication tokens as needed.
5.  **Start Simulation:** The user clicks the "Start Campaign Simulation" button.
6.  **Observe Streaming Recommendations:** The chat interface displays real-time JSON payloads based on real data. If a real API is unavailable, the system gracefully falls back to mocked data.
7.  **Stop Simulation:** The user clicks the "Stop Campaign Simulation" button.

### User Journey 3: Developer Extending the Decision Engine

**Persona:** Developer

1.  **Set up Project:** The developer clones the repository and runs `npm install && npm run dev` for minimal setup.
2.  **Understand Current Engine:** The developer examines the existing modular decision engine to understand its aggregation and generation logic.
3.  **Implement New Rules/AI:** The developer extends or replaces parts of the decision engine to incorporate new rules or integrate an AI model for advanced campaign decision-making.
4.  **Test Integration:** The developer tests the modified decision engine by simulating campaigns with both mocked and real data, verifying that the new logic correctly influences the streaming JSON outputs.
5.  **Document Changes:** The developer updates the README and other relevant documentation to reflect the changes and additions to the decision engine.

# Feature List Test Cases

## 1. Chat Interface for Campaign Recommendations

### Test Case 01: Chat-Style UI Rendering
- **Description:** Verify that the chat-style UI component renders correctly and is responsive.
- **Steps:**
    1. Navigate to the application's main interface.
- **Expected Result:**
    - A responsive chat message display area is visible.
    - Basic styling for chat bubbles/messages is applied.

### Test Case 02: Real-Time JSON Payload Display
- **Description:** Verify that the chat UI can receive and display streaming JSON payloads in real-time.
- **Steps:**
    1. Start a campaign simulation from the backend (e.g., via `/api/start`).
    2. Observe the chat interface.
- **Expected Result:**
    - JSON data received from the WebSocket/SSE stream appears as new chat messages in real-time.

### Test Case 03: Collapsible JSON Blocks Functionality
- **Description:** Verify that JSON payloads within the chat interface can be collapsed and expanded.
- **Steps:**
    1. Receive a JSON payload in the chat interface.
    2. Click on the JSON block.
- **Expected Result:**
    - The JSON block toggles between a collapsed summary view and an expanded full view.

### Test Case 04: Formatted JSON View
- **Description:** Verify that JSON payloads are displayed in a human-readable, formatted (pretty-printed) way.
- **Steps:**
    1. Receive a JSON payload in the chat interface.
    2. Observe the displayed JSON.
- **Expected Result:**
    - JSON content is automatically pretty-printed within chat messages.

### Test Case 05: WebSocket/SSE Streaming Instantiation
- **Description:** Verify the backend WebSocket/SSE server instantiates and can send messages.
- **Steps:**
    1. Start the backend server.
    2. Attempt to connect a client to the `/ws` or `/sse` endpoint.
- **Expected Result:**
    - Client successfully connects.
    - Backend can push a test JSON payload to the connected client.

### Test Case 06: Multiple Simultaneous Users Support
- **Description:** Verify that the streaming mechanism handles multiple concurrent client connections without performance degradation.
- **Steps:**
    1. Connect multiple clients (e.g., 5) to the WebSocket/SSE endpoint simultaneously.
    2. Start a campaign simulation.
- **Expected Result:**
    - All connected clients receive relevant streaming data without noticeable delays or errors.

## 2. Data Source Selector

### Test Case 07: Display Available Data Sources
- **Description:** Verify that the UI component lists all available marketing data sources dynamically.
- **Steps:**
    1. Navigate to the Data Source Selector section of the application.
- **Expected Result:**
    - A visual component displays data sources fetched from the `/api/sources` endpoint.
    - The list includes `id`, `name`, and `type` for each source.

### Test Case 08: Data Source Selection Limit (Up to 3)
- **Description:** Verify that users can select a maximum of 3 data sources.
- **Steps:**
    1. Attempt to select more than 3 data sources.
- **Expected Result:**
    - The system prevents the selection of more than 3 data sources.
    - Visual feedback indicates the selection limit.

### Test Case 09: Configurable Mocked/Real Data Logic for Sources
- **Description:** Verify that the `/api/sources` endpoint reflects the configured type (mocked/real_api) for each data source.
- **Steps:**
    1. Configure a data source (e.g., "website") to `mocked` via `/api/config`.
    2. Send a GET request to `/api/sources`.
    3. Configure another data source (e.g., "shopify") to `real_api` via `/api/config`.
    4. Send a GET request to `/api/sources` again.
- **Expected Result:**
    - The `type` field for "website" is `mocked`.
    - The `type` field for "shopify" is `real_api`.

## 3. Channel Selector

### Test Case 10: Display Available Channels
- **Description:** Verify that the UI component lists all predefined communication channels.
- **Steps:**
    1. Navigate to the Channel Selector section of the application.
- **Expected Result:**
    - A visual component displays all defined channels (Email, SMS, Push, WhatsApp, Voice, Messenger, Ads).

### Test Case 11: Channel Selection Limit (Up to 4)
- **Description:** Verify that users can select a maximum of 4 channels.
- **Steps:**
    1. Attempt to select more than 4 channels.
- **Expected Result:**
    - The system prevents the selection of more than 4 channels.
    - Visual feedback indicates the selection limit.

## 4. Campaign Simulation Controls (Start/Stop)

### Test Case 12: "Start Campaign Simulation" Button Functionality
- **Description:** Verify that the "Start Campaign Simulation" button initiates the simulation and updates its state.
- **Steps:**
    1. Select valid data sources and channels.
    2. Click the "Start Campaign Simulation" button.
- **Expected Result:**
    - A POST request is sent to `/api/start` with the selected sources and channels.
    - The button's state changes (e.g., becomes disabled, or changes text to "Simulating...").
    - The chat interface begins receiving streaming recommendations.

### Test Case 13: "Stop Campaign Simulation" Button Functionality
- **Description:** Verify that the "Stop Campaign Simulation" button halts the streaming and updates its state.
- **Steps:**
    1. Start a campaign simulation.
    2. Click the "Stop Campaign Simulation" button.
- **Expected Result:**
    - The streaming of recommendations halts.
    - The button's state changes appropriately (e.g., becomes enabled again, or changes text to "Stopped").
    - Backend resources associated with the simulation are cleaned up.

## 5. Configuration Panel

### Test Case 14: Configuration Panel UI Rendering
- **Description:** Verify that the configuration panel UI renders correctly and provides options for managing data source types and API details.
- **Steps:**
    1. Access the Configuration Panel.
- **Expected Result:**
    - A dedicated section or modal for configuration is visible.
    - Options to toggle between mocked/real API and input fields for API details are displayed.

### Test Case 15: Persistence of Endpoint Configurations
- **Description:** Verify that endpoint configurations are stored persistently and loaded on application startup.
- **Steps:**
    1. Update a data source configuration via `/api/config` (e.g., change `website` to `real_api`).
    2. Restart the backend application.
    3. Send a GET request to `/api/config`.
- **Expected Result:**
    - The updated configuration is retrieved, demonstrating persistence.
    - Sensitive credentials are not exposed in the repository.

### Test Case 16: Toggle Mocked vs. Real API Functionality
- **Description:** Verify that toggling a data source between mocked and real API modes updates the backend and affects subsequent data fetching.
- **Steps:**
    1. In the Configuration Panel, toggle a data source from "Mocked" to "Real API".
    2. Send a POST request to `/api/config` with the new setting.
    3. Start a simulation using this data source.
- **Expected Result:**
    - The backend correctly registers the change.
    - The decision engine attempts to fetch data from the real API (if configured) or uses mock data accordingly.

### Test Case 17: API URL and Auth Token Input Fields
- **Description:** Verify that input fields for `apiUrl` and `authToken` appear when "Real API" is selected and values are sent to the backend.
- **Steps:**
    1. In the Configuration Panel, select "Real API" for a data source.
    2. Enter values into the `apiUrl` and `authToken` input fields.
    3. Trigger a configuration update (e.g., by saving).
- **Expected Result:**
    - Input fields for `apiUrl` and `authToken` become visible.
    - The entered values are correctly sent to the backend via `/api/config`.

## 6. Decision Engine Development

### Test Case 18: Signal Aggregation from Multiple Sources
- **Description:** Verify that the Decision Engine can aggregate event signals from multiple selected data sources and utilize Groq AI.
- **Steps:**
    1. Configure two different data sources (one mocked, one real API).
    2. Start a campaign simulation with both sources selected.
- **Expected Result:**
    - The decision engine receives events from both sources.
    - Signals are combined and processed, with Groq AI integration functioning as expected.

### Test Case 19: Structured JSON Payload Generation
- **Description:** Verify that the decision engine generates JSON recommendation payloads strictly adhering to the defined `JSON Output Schema`.
- **Steps:**
    1. Start a campaign simulation.
    2. Capture a streaming JSON payload from the backend.
- **Expected Result:**
    - The generated JSON payload includes `audience`, `reasoning`, `channel_plan`, and `campaign_meta` fields.
    - The payload structure and data types conform to the `JSON Output Schema`.

### Test Case 20: Configurable Channel and Message Prioritization Rules
- **Description:** Verify that configurable rules correctly influence channel prioritization and message tailoring in the generated `channel_plan`.
- **Steps:**
    1. Define a rule (e.g., prioritize Email for a specific audience segment).
    2. Start a simulation that triggers this rule.
- **Expected Result:**
    - The `channel_plan` in the output JSON reflects the prioritization rule (e.g., Email has higher priority or is the only channel).

## 7. Data Source Integration (Mocked Data)

### Test Case 21: Mocked Event Generation
- **Description:** Verify that local JSON files or generators can simulate realistic events for mocked data sources.
- **Steps:**
    1. Configure a data source to `mocked`.
    2. Start a simulation with this source.
- **Expected Result:**
    - The decision engine receives simulated events (e.g., cart abandonment, page views) from the mock data source.
    - Mock data is valid and structured as expected.

## 8. Data Source Integration (Real API)

### Test Case 22: Fetching Data from Real API Endpoints
- **Description:** Verify that the backend can connect to and fetch data from configured real external APIs.
- **Steps:**
    1. Configure a data source to `real_api` with valid `apiUrl` and `authToken`.
    2. Start a simulation with this source.
- **Expected Result:**
    - The backend successfully makes authenticated requests to the external API.
    - Data from the real API is transformed and used by the decision engine.

### Test Case 23: Graceful Fallback to Mock Data
- **Description:** Verify that the system gracefully falls back to mocked data if a configured real API is unavailable or returns errors.
- **Steps:**
    1. Configure a data source to `real_api` with an invalid `apiUrl` or `authToken` to simulate failure.
    2. Start a simulation with this source.
- **Expected Result:**
    - The system logs the API failure.
    - The simulation continues without interruption, using the corresponding mock data for that source.

## 9. JSON Output Schema Adherence

### Test Case 24: Backend Schema Validation
- **Description:** Verify that all JSON payloads generated by the decision engine strictly adhere to the defined `JSON Output Schema`.
- **Steps:**
    1. Start multiple campaign simulations.
    2. Validate generated JSON payloads against the `JSON Output Schema`.
- **Expected Result:**
    - Every generated JSON payload passes schema validation.
    - No missing or malformed fields are present.

### Test Case 25: Frontend Schema Parsing and Display
- **Description:** Verify that the frontend can robustly parse and correctly display all fields of the schema-compliant JSON payloads.
- **Steps:**
    1. Start a campaign simulation.
    2. Observe the displayed JSON payloads in the chat interface.
- **Expected Result:**
    - All fields of the JSON output schema are correctly rendered.
    - No parsing errors occur in the frontend.

## 10. Initial Project Setup & Documentation

### Test Case 26: Comprehensive README and Setup
- **Description:** Verify that the README provides clear instructions and the project can be set up and run with minimal steps.
- **Steps:**
    1. Follow the setup and running instructions in the README.
- **Expected Result:**
    - Both frontend and backend applications start successfully with `npm install && npm run dev`.
    - The README clearly explains project overview, configuration, and API usage.
    - The README explains how to toggle between mock and real APIs.

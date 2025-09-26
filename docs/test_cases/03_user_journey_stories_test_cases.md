# User Journey Test Cases

## User Journey 1: Simulating a Campaign with Mocked Data

### Test Case 01: Full Mocked Data Simulation Flow
- **Description:** Verify the complete user journey for simulating a campaign using mocked data.
- **Steps:**
    1. Access the application.
    2. Select 3 data sources.
    3. Select 4 communication channels.
    4. Go to Configuration Panel and ensure all selected sources are set to "mocked" endpoints.
    5. Click "Start Campaign Simulation".
    6. Observe streaming JSON payloads in the chat interface.
    7. Verify collapsible and formatted JSON blocks.
    8. Click "Stop Campaign Simulation".
- **Expected Result:**
    - Application loads successfully.
    - Data sources and channels can be selected within limits.
    - Configuration Panel accurately reflects and allows setting sources to mocked.
    - Simulation starts, streaming mocked JSON payloads appear in real-time.
    - JSON blocks are collapsible and well-formatted.
    - Simulation stops, and streaming halts.

## User Journey 2: Simulating a Campaign with Real API Data

### Test Case 02: Full Real API Data Simulation Flow with Successful Connection
- **Description:** Verify the complete user journey for simulating a campaign using real API data with successful API connections.
- **Steps:**
    1. Access the application.
    2. Select 3 data sources.
    3. Select 4 communication channels.
    4. Go to Configuration Panel, toggle selected data sources to "real API", and configure valid API URLs and authentication tokens.
    5. Click "Start Campaign Simulation".
    6. Observe streaming JSON payloads in the chat interface.
    7. Click "Stop Campaign Simulation".
- **Expected Result:**
    - Application loads successfully.
    - Data sources and channels can be selected within limits.
    - Configuration Panel allows setting sources to real API with valid credentials.
    - Simulation starts, streaming real data-driven JSON payloads appear in real-time.
    - Simulation stops, and streaming halts.

### Test Case 03: Real API Data Simulation Flow with Graceful Fallback
- **Description:** Verify that the system gracefully falls back to mocked data if a configured real API is unavailable during a simulation.
- **Steps:**
    1. Access the application.
    2. Select 1 data source.
    3. Select 1 communication channel.
    4. Go to Configuration Panel, toggle the selected data source to "real API", and configure invalid API URL or authentication token.
    5. Click "Start Campaign Simulation".
    6. Observe streaming JSON payloads in the chat interface.
- **Expected Result:**
    - Simulation starts.
    - The system detects the real API unavailability and logs an error.
    - Streaming continues using mocked data for the failed real API source.

## User Journey 3: Developer Extending the Decision Engine

### Test Case 04: Project Setup and Initial Run
- **Description:** Verify that a developer can set up the project and run it with minimal steps.
- **Steps:**
    1. Clone the repository.
    2. Run `npm install && npm run dev`.
- **Expected Result:**
    - All dependencies are installed successfully.
    - Both frontend and backend applications start without errors and are accessible.
    - `ai-changelog.md` file is present and has an initial entry.

### Test Case 05: Decision Engine Modularity and Extension
- **Description:** Verify that the decision engine can be easily extended with new rules or AI integrations, and the changes reflect in the simulation.
- **Steps:**
    1. As a developer, modify the decision engine (e.g., add a new prioritization rule or a placeholder AI integration).
    2. Run the application.
    3. Start a campaign simulation that would trigger the modified logic.
    4. Observe the streaming JSON outputs.
- **Expected Result:**
    - The new rules or AI integration are applied by the decision engine.
    - The streaming JSON outputs reflect the changes made to the decision engine (e.g., different channel priorities, new reasoning in payload).

### Test Case 06: Documentation Update for Developer Changes
- **Description:** Verify that developers update relevant documentation (README, etc.) after making changes to the decision engine or other core components.
- **Steps:**
    1. Make a significant change to the decision engine.
    2. Check `README.md` and other relevant `docs` files.
- **Expected Result:**
    - `README.md` and other relevant documentation (e.g., `api_docs.md`, `feature_list.md`) are updated to reflect the changes, including any new configurations, behaviors, or dependencies.

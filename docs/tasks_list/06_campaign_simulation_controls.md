### 4. Campaign Simulation Controls (Start/Stop)

#### [CTOC-0021][FE] Implement "Start Campaign Simulation" Button
- **Description:** Create and integrate a button to initiate the campaign simulation.
- **Acceptance Criteria:**
    - A clickable "Start Simulation" button is visible.
    - Clicking the button sends a POST request to `/api/start` with selected sources and channels.
    - The button's state changes (e.g., disabled) after starting the simulation.
    - **Unit Tests:** Verify button click handler and state changes.
    - **Integration Tests:** Verify correct payload sent to `/api/start`.
- **Dependencies:**
    - [CTOC-0016][FE] Implement Data Source Selection Mechanism (Up to 3)
    - [CTOC-0020][FE] Implement Channel Selection Mechanism (Up to 4)
    - [CTOC-0023][BE] Create `/api/start` Endpoint (Initiation)
- **Subtasks:**
    - None

#### [CTOC-0022][FE] Implement "Stop Campaign Simulation" Button
- **Description:** Create and integrate a button to halt the streaming campaign simulation.
- **Acceptance Criteria:**
    - A clickable "Stop Simulation" button is visible when a simulation is active.
    - Clicking the button sends a request to stop the streaming (e.g., closing WebSocket).
    - The button's state changes (e.g., enabled/disabled) appropriately.
    - **Unit Tests:** Verify button click handler and state changes.
    - **Integration Tests:** Verify stopping the simulation halts streaming from the backend.
- **Dependencies:**
    - [CTOC-0021][FE] Implement "Start Campaign Simulation" Button
    - [CTOC-0024][BE] Implement Logic to Stop Streaming
- **Subtasks:**
    - None

#### [CTOC-0023][BE] Create `/api/start` Endpoint (Initiation)
- **Description:** Develop the backend endpoint to receive selected data sources and channels and initiate the decision engine and streaming.
- **Acceptance Criteria:**
    - `POST /api/start` accepts `selectedSources` and `selectedChannels` in the request body.
    - Returns `200 OK` with a `sessionId` upon successful initiation.
    - Triggers the decision engine to start processing and streaming.
    - **Unit Tests:** Test endpoint validation for request body.
    - **Integration Tests:** Verify endpoint correctly starts the simulation flow.
- **Dependencies:**
    - [CTOC-0013][BE] Implement WebSocket/SSE Streaming
    - [CTOC-0027][BE] Develop Core Decision Engine
- **Subtasks:**
    - None

#### [CTOC-0024][BE] Implement Logic to Stop Streaming
- **Description:** Add backend logic to gracefully stop the streaming of campaign recommendations.
- **Acceptance Criteria:**
    - The backend can stop pushing messages to a specific client or all clients.
    - Resources associated with the simulation are properly cleaned up.
    - **Unit Tests:** Test the stop logic and resource cleanup.
    - **Integration Tests:** Verify that after a stop command, no more messages are received by the frontend.
- **Dependencies:** [CTOC-0013][BE] Implement WebSocket/SSE Streaming
- **Subtasks:**
    - None

### 5. Configuration Panel

#### [CTOC-0025][FE] Create UI for Configuration Panel
- **Description:** Design and implement the visual layout for the configuration panel.
- **Acceptance Criteria:**
    - A dedicated section or modal for configuration is accessible.
    - Displays options to manage data source types (mocked/real) and API details.
    - **Unit Tests:** Verify configuration panel component renders correctly.
- **Dependencies:** None
- **Subtasks:**
    - None

#### [CTOC-0026][BE] Implement Persistence for Endpoint Configurations
- **Description:** Develop mechanisms to store and retrieve endpoint configurations (mock vs. real API, API URLs, auth tokens).
- **Acceptance Criteria:**
    - Configurations are stored persistently (e.g., JSON file, `.env` or simple in-memory store for demo).
    - Configurations can be loaded on application startup.
    - Sensitive credentials are not committed to the repository.
    - **Unit Tests:** Test configuration save and load functions.
- **Dependencies:** None
- **Subtasks:**
    - None

#### [CTOC-0027][BE] Create `/api/config` Endpoint (GET/SET)
- **Description:** Implement backend endpoints to retrieve and update data source configurations.
- **Acceptance Criteria:**
    - `GET /api/config` returns all current data source configurations.
    - `POST /api/config` updates a specific data source's configuration.
    - Request body for POST includes `sourceId`, `type`, and optionally `config` (apiUrl, authToken).
    - Returns `200 OK` on successful update.
    - Handles invalid configuration data with `400 Bad Request`.
    - **Unit Tests:** Test GET and POST operations, including validation and error handling.
    - **Integration Tests:** Verify frontend can fetch and update configurations.
- **Dependencies:** [CTOC-0026][BE] Implement Persistence for Endpoint Configurations
- **Subtasks:**
    - None

#### [CTOC-0028][FE] Implement Toggle Functionality for Mocked vs. Real API per Data Source
- **Description:** Add interactive controls within the Configuration Panel to switch a data source between mocked and real API modes.
- **Acceptance Criteria:**
    - Each data source listed in the Configuration Panel has a toggle or radio buttons for "Mocked" / "Real API".
    - Changing the toggle immediately updates the backend via `/api/config`.
    - **Unit Tests:** Test toggle state changes and associated API calls.
- **Dependencies:**
    - [CTOC-0025][FE] Create UI for Configuration Panel
    - [CTOC-0027][BE] Create `/api/config` Endpoint (GET/SET)
- **Subtasks:**
    - None

#### [CTOC-0029][FE] Provide Input Fields to Configure API URLs and Auth Tokens
- **Description:** Develop input fields in the Configuration Panel for users to enter API URLs and authentication tokens when a real API is selected.
- **Acceptance Criteria:**
    - When "Real API" is selected for a data source, input fields for `apiUrl` and `authToken` appear.
    - Input values are sent to the backend via `/api/config` upon saving or change.
    - **Unit Tests:** Test input field behavior and data capture.
- **Dependencies:** [CTOC-0028][FE] Implement Toggle Functionality for Mocked vs. Real API per Data Source
- **Subtasks:**
    - None

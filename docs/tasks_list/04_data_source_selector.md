### 2. Data Source Selector

#### [CTOC-0015][FE] Display List of Available Data Sources
- **Description:** Create a UI component to list all predefined marketing data sources.
- **Acceptance Criteria:**
    - A visual component (e.g., dropdown, checkboxes) displays all data sources from the backend `/api/sources` endpoint.
    - Data sources are dynamically loaded.
    - **Unit Tests:** Verify the data source list component renders correctly with mock data.
- **Dependencies:** [CTOC-0017][BE] Implement `/api/sources` Endpoint
- **Subtasks:**
    - None

#### [CTOC-0016][FE] Implement Data Source Selection Mechanism (Up to 3)
- **Description:** Allow users to select up to 3 data sources from the displayed list.
- **Acceptance Criteria:**
    - User can select/deselect data sources.
    - A maximum of 3 data sources can be selected at any given time.
    - Visual feedback is provided for selected sources.
    - **Unit Tests:** Test selection limits and state management.
- **Dependencies:** [CTOC-0015][FE] Display List of Available Data Sources
- **Subtasks:**
    - None

#### [CTOC-0017][BE] Implement `/api/sources` Endpoint
- **Description:** Create a backend endpoint to return a list of available data sources.
- **Acceptance Criteria:**
    - `GET /api/sources` returns a JSON array of data sources.
    - Each source object includes `id`, `name`, and `type` (mocked/real_api).
    - **Unit Tests:** Test the `/api/sources` endpoint to ensure it returns the correct structure and data.
    - **Integration Tests:** Verify frontend can fetch sources from this endpoint.
- **Dependencies:** None
- **Subtasks:**
    - None

#### [CTOC-0018][BE] Implement Configurable Mocked/Real Data Logic for `/api/sources`
- **Description:** Extend the `/api/sources` endpoint to toggle between mocked and real data sources based on configuration.
- **Acceptance Criteria:**
    - The `type` field in the response accurately reflects whether a source is mocked or real.
    - When configured for mocked data, the backend uses internal mock definitions.
    - When configured for real data, the backend indicates it's ready for API integration.
    - **Unit Tests:** Test different configurations for data source types.
- **Dependencies:**
    - [CTOC-0017][BE] Implement `/api/sources` Endpoint
    - [CTOC-0026][BE] Implement Persistence for Endpoint Configurations
- **Subtasks:**
    - None

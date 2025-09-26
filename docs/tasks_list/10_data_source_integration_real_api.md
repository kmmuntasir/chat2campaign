### 8. Data Source Integration (Real API)

#### [CTOC-0034][BE] Implement Configurable API Endpoints for Fetching
- **Description:** Develop the backend logic to connect to and fetch data from real external APIs for configured data sources.
- **Acceptance Criteria:**
    - The backend can make authenticated requests to external APIs using configured URLs and tokens.
    - Data from real APIs is transformed into a format usable by the decision engine.
    - **Unit Tests:** Test API client components with mock API responses.
    - **Integration Tests:** Test connection to a live (test) external API if available.
- **Dependencies:**
    - [CTOC-0027][BE] Create `/api/config` Endpoint (GET/SET)
    - [CTOC-0026][BE] Implement Persistence for Endpoint Configurations
- **Subtasks:**
    - None

#### [CTOC-0035][BE] Implement Graceful Fallback to Mock Data if Real API Unavailable
- **Description:** Ensure the system can automatically switch to using mocked data if a configured real API becomes unreachable or returns errors.
- **Acceptance Criteria:**
    - If a real API fails (e.g., network error, auth error), the system logs the error and switches to its corresponding mock data.
    - The simulation continues without interruption using mock data.
    - **Integration Tests:** Simulate API failure scenarios and verify fallback to mock data.
- **Dependencies:**
    - [CTOC-0034][BE] Implement Configurable API Endpoints for Fetching
    - [CTOC-0033][BE] Implement Local JSON/Generator for Mocked Events
- **Subtasks:**
    - None

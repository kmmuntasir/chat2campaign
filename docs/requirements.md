# AI Agent Project Requirements

This document outlines the requirements for an AI agent to successfully complete the Chat-Based Campaign Simulator project.

## 1. Project Understanding & Analysis
- **Requirement:** The AI agent must be able to understand and synthesize information from various documentation files.
  - **Reference:** All files within `docs/` folder (e.g., `docs/PRD.md`, `docs/feature_list.md`, `docs/api_docs.md`).

## 2. Core Feature Implementation (Frontend & Backend)

### 2.1. Chat Interface for Campaign Recommendations
- **Requirement:** Implement a chat-style UI to display real-time, streaming JSON payloads.
  - **Frontend Details:** [CTOC-0009][FE], [CTOC-0010][FE], [CTOC-0011][FE], [CTOC-0012][FE] in `docs/tasks_list/03_chat_interface_recommendations.md`.
  - **Backend Details:** [CTOC-0013][BE], [CTOC-0014][BE] in `docs/tasks_list/03_chat_interface_recommendations.md`.
  - **API Specs:** `/api/start` streaming output in `docs/api_docs.md`.

### 2.2. Data Source Selector
- **Requirement:** Implement a UI for selecting up to 3 data sources and backend endpoint to provide available sources with configurable mocked/real data logic.
  - **Frontend Details:** [CTOC-0015][FE], [CTOC-0016][FE] in `docs/tasks_list/04_data_source_selector.md`.
  - **Backend Details:** [CTOC-0017][BE], [CTOC-0018][BE] in `docs/tasks_list/04_data_source_selector.md`.
  - **API Specs:** `/api/sources` in `docs/api_docs.md`.

### 2.3. Channel Selector
- **Requirement:** Implement a UI for selecting up to 4 communication channels.
  - **Frontend Details:** [CTOC-0019][FE], [CTOC-0020][FE] in `docs/tasks_list/05_channel_selector.md`.

### 2.4. Campaign Simulation Controls (Start/Stop)
- **Requirement:** Implement buttons to start and stop campaign simulations, interacting with backend endpoints.
  - **Frontend Details:** [CTOC-0021][FE], [CTOC-0022][FE] in `docs/tasks_list/06_campaign_simulation_controls.md`.
  - **Backend Details:** [CTOC-0023][BE], [CTOC-0024][BE] in `docs/tasks_list/06_campaign_simulation_controls.md`.
  - **API Specs:** `/api/start` in `docs/api_docs.md`.

### 2.5. Configuration Panel
- **Requirement:** Implement a UI to toggle between mocked and real API endpoints per data source, with persistence for configurations.
  - **Frontend Details:** [CTOC-0025][FE], [CTOC-0028][FE], [CTOC-0029][FE] in `docs/tasks_list/07_configuration_panel.md`.
  - **Backend Details:** [CTOC-0026][BE], [CTOC-0027][BE] in `docs/tasks_list/07_configuration_panel.md`.
  - **API Specs:** `/api/config` in `docs/api_docs.md`.

### 2.6. Decision Engine Development
- **Requirement:** Develop a core decision engine that aggregates signals, generates structured JSON payloads, and prioritizes channels/messages.
  - **Backend Details:** [CTOC-0030][BE], [CTOC-0031][BE], [CTOC-0032][BE] in `docs/tasks_list/08_decision_engine_development.md`.
  - **PRD Details:** Section 2.2 "Decision Engine" in `docs/PRD.md`.

### 2.7. Data Source Integration (Mocked Data)
- **Requirement:** Implement local JSON files or generators for mocked events.
  - **Backend Details:** [CTOC-0033][BE] in `docs/tasks_list/09_data_source_integration_mocked_data.md`.

### 2.8. Data Source Integration (Real API)
- **Requirement:** Implement configurable API endpoints for fetching real data and graceful fallback to mock data.
  - **Backend Details:** [CTOC-0034][BE], [CTOC-0035][BE] in `docs/tasks_list/10_data_source_integration_real_api.md`.

### 2.9. JSON Output Schema Adherence
- **Requirement:** Ensure all generated JSON payloads strictly adhere to the defined schema and frontend can parse/display it.
  - **Backend Details:** [CTOC-0036][BE] in `docs/tasks_list/11_json_output_schema_adherence.md`.
  - **Frontend Details:** [CTOC-0037][FE] in `docs/tasks_list/11_json_output_schema_adherence.md`.
  - **Schema:** Section 4 "JSON Output Schema" in `docs/PRD.md` and `docs/api_docs.md`.

### 2.10. Initial Project Setup & Documentation
- **Requirement:** Create a comprehensive README and ensure minimal setup for the project.
  - **General Details:** [CTOC-0038][Gen] in `docs/tasks_list/12_initial_project_setup_documentation.md`.
  - **NFRs:** Section 5 "Usability" in `docs/PRD.md`.

## 3. Testing & Validation
- **Requirement:** The AI agent must be able to verify successful implementation through unit, integration, and user journey tests.
  - **Test Cases:** `docs/test_cases/01_api_test_cases.md`, `docs/test_cases/02_feature_prd_test_cases.md`, `docs/test_cases/03_user_journey_stories_test_cases.md`.

## 4. Documentation & Logging
- **Requirement:** The AI agent must maintain an `ai-changelog.md` file to log all activities and create/update relevant documentation.
  - **Reference:** User Rule: "Log all activity in 'ai-changelog.md'. If it doesn't exist, create it."

## 5. Adherence to Instructions & Constraints
- **Requirement:** The AI agent must strictly follow all user instructions, rules, and project constraints.
  - **Reference:** All rules provided in the initial prompt.

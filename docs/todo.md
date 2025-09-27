# Project Todo List

## I. Project Setup & Infrastructure
- [x] Initialize Project Repository ([CTOC-0001][DevOps] - docs/tasks_list/01_project_setup_infrastructure.md)
- [x] Setup Frontend Project with React, Vite, TypeScript ([CTOC-0002][DevOps] - docs/tasks_list/01_project_setup_infrastructure.md)
- [x] Setup Backend Project with Node.js and Express ([CTOC-0003][DevOps] - docs/tasks_list/01_project_setup_infrastructure.md)

## II. Deployment & CI/CD
- [x] Local Development Environment Setup ([CTOC-0005][DevOps] - docs/tasks_list/02_deployment_ci_cd.md)
- [~] ~~Basic Deployment to GitHub Pages / Vercel (Frontend)~~ ([CTOC-0006][DevOps] - SKIPPED: Using GitHub Actions later)
- [~] ~~Basic Deployment to Render / Heroku (Backend)~~ ([CTOC-0007][DevOps] - SKIPPED: Using GitHub Actions later)
- [~] ~~Configure CI/CD Pipeline for Linting and Testing~~ ([CTOC-0008][DevOps] - SKIPPED: Using GitHub Actions later)

## III. Feature-Specific Tasks

### 1. Chat Interface for Campaign Recommendations
- [x] Implement Chat-Style UI ([CTOC-0009][FE] - docs/tasks_list/03_chat_interface_recommendations.md)
- [x] Display Real-Time JSON Payloads ([CTOC-0010][FE] - docs/tasks_list/03_chat_interface_recommendations.md)
- [x] Implement Collapsible JSON Blocks ([CTOC-0011][FE] - docs/tasks_list/03_chat_interface_recommendations.md)
- [x] Implement Formatted View for JSON Blocks ([CTOC-0012][FE] - docs/tasks_list/03_chat_interface_recommendations.md)
- [x] Implement WebSocket/SSE Streaming ([CTOC-0013][BE] - docs/tasks_list/03_chat_interface_recommendations.md)
- [x] Ensure WebSocket/SSE Supports Multiple Simultaneous Users ([CTOC-0014][BE] - docs/tasks_list/03_chat_interface_recommendations.md)

### 2. Data Source Selector
- [x] Display List of Available Data Sources ([CTOC-0015][FE] - docs/tasks_list/04_data_source_selector.md)
- [x] Implement Data Source Selection Mechanism (Up to 3) ([CTOC-0016][FE] - docs/tasks_list/04_data_source_selector.md)
- [x] Implement `/api/sources` Endpoint ([CTOC-0017][BE] - docs/tasks_list/04_data_source_selector.md)
- [x] Implement Configurable Mocked/Real Data Logic for `/api/sources` ([CTOC-0018][BE] - docs/tasks_list/04_data_source_selector.md)

### 3. Channel Selector
- [ ] Display List of Available Channels ([CTOC-0019][FE] - docs/tasks_list/05_channel_selector.md)
- [ ] Implement Channel Selection Mechanism (Up to 4) ([CTOC-0020][FE] - docs/tasks_list/05_channel_selector.md)

### 4. Campaign Simulation Controls (Start/Stop)
- [ ] Implement "Start Campaign Simulation" Button ([CTOC-0021][FE] - docs/tasks_list/06_campaign_simulation_controls.md)
- [ ] Implement "Stop Campaign Simulation" Button ([CTOC-0022][FE] - docs/tasks_list/06_campaign_simulation_controls.md)
- [ ] Create `/api/start` Endpoint (Initiation) ([CTOC-0023][BE] - docs/tasks_list/06_campaign_simulation_controls.md)
- [ ] Implement Logic to Stop Streaming ([CTOC-0024][BE] - docs/tasks_list/06_campaign_simulation_controls.md)

### 5. Configuration Panel
- [ ] Create UI for Configuration Panel ([CTOC-0025][FE] - docs/tasks_list/07_configuration_panel.md)
- [ ] Implement Persistence for Endpoint Configurations ([CTOC-0026][BE] - docs/tasks_list/07_configuration_panel.md)
- [ ] Create `/api/config` Endpoint (GET/SET) ([CTOC-0027][BE] - docs/tasks_list/07_configuration_panel.md)
- [ ] Implement Toggle Functionality for Mocked vs. Real API per Data Source ([CTOC-0028][FE] - docs/tasks_list/07_configuration_panel.md)
- [ ] Provide Input Fields to Configure API URLs and Auth Tokens ([CTOC-0029][FE] - docs/tasks_list/07_configuration_panel.md)

### 6. Decision Engine Development
- [ ] Develop Core Decision Engine (Signal Aggregation) ([CTOC-0030][BE] - docs/tasks_list/08_decision_engine_development.md)
- [ ] Implement Logic to Generate Structured JSON Payloads ([CTOC-0031][BE] - docs/tasks_list/08_decision_engine_development.md)
- [ ] Implement Configurable Rules to Prioritize Channels and Messages ([CTOC-0032][BE] - docs/tasks_list/08_decision_engine_development.md)

### 7. Data Source Integration (Mocked Data)
- [ ] Implement Local JSON/Generator for Mocked Events ([CTOC-0033][BE] - docs/tasks_list/09_data_source_integration_mocked_data.md)

### 8. Data Source Integration (Real API)
- [ ] Implement Configurable API Endpoints for Fetching ([CTOC-0034][BE] - docs/tasks_list/10_data_source_integration_real_api.md)
- [ ] Implement Graceful Fallback to Mock Data if Real API Unavailable ([CTOC-0035][BE] - docs/tasks_list/10_data_source_integration_real_api.md)

### 9. JSON Output Schema Adherence
- [ ] Ensure Decision Engine Generates Schema-Compliant JSON ([CTOC-0036][BE] - docs/tasks_list/11_json_output_schema_adherence.md)
- [ ] Ensure Frontend Can Parse and Display Schema-Compliant JSON ([CTOC-0037][FE] - docs/tasks_list/11_json_output_schema_adherence.md)

### 10. Initial Project Setup & Documentation
- [ ] Create Comprehensive README ([CTOC-0038][Gen] - docs/tasks_list/12_initial_project_setup_documentation.md)

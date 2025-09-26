# API Test Cases

## 1. Get Available Data Sources (`GET /api/sources`)

### Test Case 01: Successful Retrieval of Data Sources
- **Description:** Verify that the `/api/sources` endpoint returns a 200 OK response with a list of data sources in the correct format.
- **Steps:**
    1. Send a GET request to `/api/sources`.
- **Expected Result:**
    - Status Code: `200 OK`
    - Response Body: An array of JSON objects, each with `id`, `name`, and `type` fields (e.g., `mocked` or `real_api`).
    - Example:
      ```json
      [
        { "id": "website", "name": "Website Events", "type": "mocked" },
        { "id": "shopify", "name": "Shopify Store", "type": "real_api" }
      ]
      ```

### Test Case 02: Internal Server Error
- **Description:** Verify that the `/api/sources` endpoint handles internal server errors gracefully.
- **Steps:**
    1. Simulate an internal server error on the backend for `/api/sources`.
    2. Send a GET request to `/api/sources`.
- **Expected Result:**
    - Status Code: `500 Internal Server Error`
    - Response Body: A JSON object with an `error` field (e.g., `{ "error": "Failed to retrieve data sources" }`).

## 2. Start Campaign Simulation (`POST /api/start`)

### Test Case 03: Successful Campaign Simulation Start
- **Description:** Verify that the `/api/start` endpoint successfully initiates a campaign simulation with valid inputs.
- **Steps:**
    1. Prepare a request body with valid `selectedSources` and `selectedChannels`.
    2. Send a POST request to `/api/start` with the prepared body.
- **Expected Result:**
    - Status Code: `200 OK`
    - Response Body: A JSON object with a `message` and `sessionId` (e.g., `{ "message": "Campaign simulation started successfully.", "sessionId": "unique-simulation-id" }`).
    - A WebSocket/SSE stream is initiated to the frontend with campaign recommendations conforming to the `JSON Output Schema`.

### Test Case 04: Invalid Input - Missing Sources or Channels
- **Description:** Verify that the `/api/start` endpoint returns a 400 Bad Request for invalid input (e.g., missing selected sources or channels).
- **Steps:**
    1. Send a POST request to `/api/start` with an empty `selectedSources` array.
    2. Send a POST request to `/api/start` with an empty `selectedChannels` array.
- **Expected Result:**
    - Status Code: `400 Bad Request`
    - Response Body: A JSON object with an `error` field (e.g., `{ "error": "Invalid input: Please select at least one source and one channel." }`).

### Test Case 05: Streaming Output Conformance
- **Description:** Verify that the streaming output from `/api/start` adheres to the defined JSON Output Schema.
- **Steps:**
    1. Start a campaign simulation with valid inputs.
    2. Monitor the WebSocket/SSE stream for incoming JSON payloads.
- **Expected Result:**
    - Each received JSON payload conforms to the `JSON Output Schema` defined in the PRD, including fields like `id`, `timestamp`, `audience`, `reasoning`, `channel_plan`, and `campaign_meta`.

## 3. Get/Set Endpoint Configuration (`GET /api/config`, `POST /api/config`)

### Test Case 06: Successful Retrieval of Configuration (`GET`)
- **Description:** Verify that the `/api/config` endpoint (GET) returns the current configuration for all data sources.
- **Steps:**
    1. Send a GET request to `/api/config`.
- **Expected Result:**
    - Status Code: `200 OK`
    - Response Body: A JSON object where keys are `sourceId` and values are configuration objects (e.g., `{ "website": { "type": "mocked" }, "shopify": { "type": "real_api", "config": { "apiUrl": "...", "authToken": "..." } } }`).

### Test Case 07: Successful Update of Configuration (`POST`)
- **Description:** Verify that the `/api/config` endpoint (POST) successfully updates a data source's configuration.
- **Steps:**
    1. Prepare a request body to update a source (e.g., set `shopify` to `real_api` with `apiUrl` and `authToken`).
    2. Send a POST request to `/api/config` with the prepared body.
- **Expected Result:**
    - Status Code: `200 OK`
    - Response Body: A JSON object with a success message (e.g., `{ "message": "Configuration updated successfully." }`).
    - Subsequent GET request to `/api/config` should reflect the updated configuration.

### Test Case 08: Invalid Configuration Details (`POST`)
- **Description:** Verify that the `/api/config` endpoint (POST) returns a 400 Bad Request for invalid configuration details.
- **Steps:**
    1. Send a POST request to `/api/config` with a malformed or incomplete `config` object.
- **Expected Result:**
    - Status Code: `400 Bad Request`
    - Response Body: A JSON object with an `error` field (e.g., `{ "error": "Invalid configuration details provided." }`).

### Test Case 09: Internal Server Error during Configuration Update (`POST`)
- **Description:** Verify that the `/api/config` endpoint (POST) handles internal server errors during configuration updates.
- **Steps:**
    1. Simulate an internal server error on the backend for `/api/config` during a POST request.
    2. Send a valid POST request to `/api/config`.
- **Expected Result:**
    - Status Code: `500 Internal Server Error`
    - Response Body: A JSON object with an `error` field (e.g., `{ "error": "Failed to update configuration due to server error." }`).

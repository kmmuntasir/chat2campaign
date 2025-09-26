# API Documentation

This document provides detailed API specifications for the Chat-Based Campaign Simulator.

## 1. Get Available Data Sources

### Endpoint: `/api/sources`
- **Method:** `GET`
- **Description:** Retrieves a list of available marketing data sources. This endpoint can be configured to return either mocked data or data from real external APIs.

### Request Body:
- None

### Success Response: `200 OK`
```json
[
  {
    "id": "website",
    "name": "Website Events",
    "type": "mocked" // or "real_api"
  },
  {
    "id": "shopify",
    "name": "Shopify Store",
    "type": "real_api"
  },
  // ... more data sources
]
```

### Failure Response: `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve data sources"
}
```

## 2. Start Campaign Simulation

### Endpoint: `/api/start`
- **Method:** `POST`
- **Description:** Initiates a real-time campaign simulation based on selected data sources and channels. This endpoint will trigger a WebSocket/SSE stream to the frontend with campaign recommendations.

### Request Body:
```json
{
  "selectedSources": [
    "website",
    "shopify"
  ],
  "selectedChannels": [
    "Email",
    "Push",
    "WhatsApp"
  ]
}
```

### Success Response: `200 OK`
```json
{
  "message": "Campaign simulation started successfully.",
  "sessionId": "unique-simulation-id"
}
```

### Failure Response: `400 Bad Request`
```json
{
  "error": "Invalid input: Please select at least one source and one channel."
}
```

### Streaming Output (WebSocket/SSE):
After a successful `/api/start` request, the frontend will receive streaming JSON payloads conforming to the `JSON Output Schema` defined in the PRD:
```json
{
  "id": "string",
  "timestamp": "ISO8601 string",
  "audience": { "segment_id": "string", "name": "string", "filters": {} },
  "reasoning": { "signals": [], "score": 0.0, "explain": "string" },
  "channel_plan": [
    {
      "channel": "Email|Push|WhatsApp|Ads|SMS|Messenger|Voice",
      "send_at": "ISO8601",
      "priority": 1,
      "payload": { "subject": "string", "body": "string", "cta": {}, "metadata": {} },
      "delivery_instructions": { "retry_policy": "string", "timeout_sec": 30 }
    }
  ],
  "campaign_meta": { "source_snapshot": {}, "engine_version": "v0.1-demo", "confidence": 0.87 }
}
```

## 3. Get/Set Endpoint Configuration

### Endpoint: `/api/config`
- **Method:** `GET` / `POST`
- **Description:** Allows retrieval and modification of endpoint configurations for data sources, specifying whether they use mocked data or real API data, and providing details for real API connections.

### Request Body (`POST`):
```json
{
  "sourceId": "shopify",
  "type": "real_api", // or "mocked"
  "config": {
    "apiUrl": "https://api.shopify.com/events",
    "authToken": "your_shopify_auth_token"
  }
}
```

### Success Response (`GET`): `200 OK`
```json
{
  "website": {
    "type": "mocked"
  },
  "shopify": {
    "type": "real_api",
    "config": {
      "apiUrl": "https://api.shopify.com/events",
      "authToken": "your_shopify_auth_token"
    }
  }
}
```

### Success Response (`POST`): `200 OK`
```json
{
  "message": "Configuration updated successfully."
}
```

### Failure Response: `400 Bad Request`
```json
{
  "error": "Invalid configuration details provided."
}
```

### Failure Response: `500 Internal Server Error`
```json
{
  "error": "Failed to update configuration due to server error."
}
```

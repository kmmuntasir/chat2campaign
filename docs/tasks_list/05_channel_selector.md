### 3. Channel Selector

#### [CTOC-0019][FE] Display List of Available Channels
- **Description:** Create a UI component to list all predefined communication channels.
- **Acceptance Criteria:**
    - A visual component (e.g., checkboxes) displays all defined channels (Email, SMS, Push, WhatsApp, Voice, Messenger, Ads).
    - Channels are static or loaded from a local configuration.
    - **Unit Tests:** Verify the channel list component renders correctly.
- **Dependencies:** None
- **Subtasks:**
    - None

#### [CTOC-0020][FE] Implement Channel Selection Mechanism (Up to 4)
- **Description:** Allow users to select up to 4 channels from the displayed list.
- **Acceptance Criteria:**
    - User can select/deselect channels.
    - A maximum of 4 channels can be selected at any given time.
    - Visual feedback is provided for selected channels.
    - **Unit Tests:** Test selection limits and state management for channels.
- **Dependencies:** [CTOC-0019][FE] Display List of Available Channels
- **Subtasks:**
    - None

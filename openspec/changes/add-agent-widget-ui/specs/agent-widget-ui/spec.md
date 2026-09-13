## Purpose

Provides a floating chat window on the portfolio frontend that lets visitors converse with the digital-self agent through the backend proxy, including a graceful, non-error experience when no API credits remain.

## ADDED Requirements

### Requirement: Floating Chat Window
The system SHALL present a floating, toggleable chat window on the portfolio site that visitors can open and close without navigating away from the current tab/section.

#### Scenario: Visitor opens the widget
- **WHEN** a visitor activates the floating widget control
- **THEN** the chat window opens and remains usable while the visitor is on any resume/project tab

#### Scenario: Visitor closes the widget
- **WHEN** a visitor closes the chat window
- **THEN** the window collapses back to its toggleable control without losing the current tab's content underneath

### Requirement: Message Exchange via Backend Proxy
The system SHALL send visitor messages to the backend proxy endpoint and display the returned reply in the chat window, without calling any LLM API directly from the browser.

#### Scenario: Visitor sends a message
- **WHEN** a visitor submits a message in the chat window
- **THEN** the system sends it to the backend proxy and displays the proxy's reply in the conversation history

#### Scenario: No direct LLM calls from the browser
- **WHEN** the network traffic from the frontend is inspected during a chat interaction
- **THEN** all agent-related requests go only to the backend proxy endpoint, never directly to an LLM provider

### Requirement: Graceful No-Credit Messaging
The system SHALL display a backend "no credits" response as a normal chat message with a simple apology, not as an error banner, broken UI state, or technical error text.

#### Scenario: Backend reports exhausted credits
- **WHEN** the backend proxy returns its no-credit apology response
- **THEN** the widget displays it inline in the conversation as a normal agent message, with no error styling or console-facing error surfaced to the visitor

### Requirement: Conversational Loading State
The system SHALL indicate to the visitor that a reply is pending after a message is sent and before the response arrives.

#### Scenario: Awaiting a reply
- **WHEN** a visitor has sent a message and the backend has not yet responded
- **THEN** the widget shows a loading/typing indicator until the reply (or apology) arrives

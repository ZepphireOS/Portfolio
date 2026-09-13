## Purpose

Provides a minimal backend HTTP endpoint that gates and proxies chat requests to the digital-self agent, holding the Gemini API key server-side and preventing any API usage when account credits are exhausted.

## ADDED Requirements

### Requirement: Chat Request Proxying
The system SHALL expose an HTTP endpoint that accepts a visitor chat message and returns the digital-self agent's reply, without exposing any API key to the caller.

#### Scenario: Normal chat request with credits available
- **WHEN** a caller sends a chat message to the endpoint and the Gemini API account has remaining credit
- **THEN** the system invokes the agent and returns its reply to the caller

### Requirement: Pre-Call Credit Check
The system SHALL check the Gemini API account's remaining credit/quota before invoking the agent or making any LLM call.

#### Scenario: Credit check precedes invocation
- **WHEN** a chat request is received
- **THEN** the system determines credit availability before any agent or LLM call is made

### Requirement: Zero-Usage Apology on Exhausted Credits
The system SHALL, when credits are exhausted, return a plain, apologetic, non-error chat-style response to the caller and SHALL NOT invoke the agent or make any LLM API call in that case.

#### Scenario: No credits available
- **WHEN** a chat request is received and the credit check determines no credit remains
- **THEN** the system responds with a simple apologetic message (not an HTTP error status, stack trace, or technical error body) and makes no call to the agent or the Gemini API

#### Scenario: No usage recorded when exhausted
- **WHEN** the system has just returned the zero-credit apology response
- **THEN** no corresponding LLM API call or token usage is attributable to that request

### Requirement: Server-Side Secret Handling
The system SHALL hold the Gemini API key exclusively server-side (e.g., function environment/secret configuration) and SHALL NOT transmit it to the frontend or any client.

#### Scenario: Inspecting client-visible traffic and assets
- **WHEN** the frontend application's network traffic and bundled assets are inspected
- **THEN** the Gemini API key does not appear anywhere in them

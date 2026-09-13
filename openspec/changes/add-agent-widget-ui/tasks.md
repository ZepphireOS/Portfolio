## 1. Widget Shell

- [ ] 1.1 Build the floating toggle control and chat window shell inside the `AgentWidgetSlot` from `build-portfolio-frontend`, verified by opening/closing the widget over each portfolio tab
- [ ] 1.2 Style the widget using existing shadcn/ui primitives consistent with the rest of the site, verified by visual review alongside the existing template

## 2. Message Exchange

- [ ] 2.1 Implement sending a visitor's message to a configurable backend-proxy endpoint URL, verified against a local mock endpoint returning a sample reply shape
- [ ] 2.2 Render conversation history (visitor and agent messages) in the widget, verified by a multi-turn mock conversation displaying correctly
- [ ] 2.3 Implement the loading/typing indicator between send and reply, verified by observing it during a delayed mock response

## 3. Graceful No-Credit Handling

- [ ] 3.1 Render the backend's no-credit apology response as a normal chat message with no error styling, verified against a mocked no-credit response payload

## 4. Live Integration

- [ ] 4.1 Point the widget at the real `add-agent-backend-proxy` endpoint once deployed, verified by an end-to-end message/reply exchange
- [ ] 4.2 Confirm no direct network calls to any LLM provider originate from the browser, verified by inspecting network traffic during a live chat interaction

## 5. Final Verification

- [ ] 5.1 Review against `specs/agent-widget-ui/spec.md` scenario-by-scenario, verified by each scenario passing manual inspection

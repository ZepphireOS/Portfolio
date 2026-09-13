## Purpose

Defines an ADK-format conversational agent that represents the user in first person, answering visitor questions about the user's background honestly and only from supplied resume/project content.

## ADDED Requirements

### Requirement: First-Person, Grounded Responses
The agent SHALL respond to questions about the user's background, experience, skills, and projects in first person, using only information grounded in the resume and project content supplied to it.

#### Scenario: Question answerable from supplied content
- **WHEN** a visitor asks about an experience, skill, or project present in the supplied content
- **THEN** the agent responds in first person with an answer consistent with that content

#### Scenario: Question not answerable from supplied content
- **WHEN** a visitor asks something not covered by the supplied resume/project content (e.g., an unrelated personal opinion or fabricated credential)
- **THEN** the agent declines or redirects rather than inventing an answer

### Requirement: Honest, Non-Fabricating Behavior
The agent SHALL NOT claim credentials, experience, employers, or accomplishments that are not present in the supplied content.

#### Scenario: Visitor asks a leading or flattering question
- **WHEN** a visitor asks a question phrased to elicit an exaggerated or unverifiable claim
- **THEN** the agent's response stays within what the supplied content actually supports

### Requirement: Defined Input/Output Contract
The agent SHALL expose a stable input (a visitor message plus any needed conversation context) and output (a text reply) contract that a calling service can invoke without depending on ADK-internal implementation details.

#### Scenario: External caller invokes the agent
- **WHEN** a caller sends a well-formed input (message and context) to the agent's defined entry point
- **THEN** the agent returns a text reply in the defined output shape

### Requirement: No Transport or Credential Concerns
The agent module SHALL NOT itself manage HTTP transport, API key storage, or credit/quota checking — those are the responsibility of the calling backend.

#### Scenario: Agent module invoked standalone
- **WHEN** the agent's module is invoked directly with a sample message, outside of any HTTP handler or credit-check logic
- **THEN** it still produces a valid grounded reply, proving it has no hidden dependency on transport or credential logic

### Requirement: Retrieval-Grounded Context
The agent SHALL retrieve the most relevant precomputed content chunks for a given visitor message via similarity search, and SHALL include only those retrieved chunks — not the entire knowledge base — in the generation request.

#### Scenario: Relevant chunks retrieved
- **WHEN** a visitor asks about a specific project or experience
- **THEN** the agent's generation request includes chunks relevant to that topic rather than the full knowledge base

#### Scenario: Irrelevant chunks excluded
- **WHEN** a visitor asks about a narrow topic covered by only one or two knowledge chunks
- **THEN** the agent's generation request does not include unrelated chunks from other sections

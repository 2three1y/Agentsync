# AgentSync Development Roadmap

## Phase 1: Agent-First Local Daemon Core
* Build the "Shadow Interceptor" loop to intercept secure command prefixes (like `/set`, `/allow`) locally before prompts ever reach Hermes, OpenClaw, or other models.
* Establish a headless JSON-RPC terminal protocol over local websockets for instantaneous, zero-latency communication.
* Integrate a read-only configuration layer (like `settings.json`) that is completely sandboxed from direct AI write manipulation.

## Phase 2: Sandboxed Storage & Cryptographic Memory
* Define the local database schema for structured memory blocks (categorized by CONFIG, INSTRUCTION, and RAW_CODE).
* Implement temporal and transactional leases for local workspace directories with automatic expiration routines.
* Secure memory-sharing files with local encryption signatures linked to your Nostr identity keys.

## Phase 3: Accessible Terminal OS Proxy Interface
* Embed parenthetical pitch-shifting labels (like `Name (like Josh)`) directly into the template renderer for VoiceOver and JAWS clarity.
* Program an auto-collapsing accordion navigation matrix where expanding any parent category automatically collapses all other open blocks.
* Build a robust dialog model that captures the user's active focus before an alert, allows quick key-bound interactions (like `Allow (1 of 2)`), and restores focus flawlessly to the preceding element.
# AgentSync Roadmap: Web-First Strategy

## Phase 1: Web-UI Integration
- Redesign plugin management: Implement a URL-based fetch mechanism for `manifest.json` directly from the browser.
- Validation: Move validation logic from local file-based checks to client-side schema validation of remote JSON objects.

## Phase 2: Browser Storage & Persistence
- IndexedDB Integration: Implement local storage for agent state and plugin manifests to support "zero-clone" architecture.
- Performance: Enable local caching of fetched remote manifests to reduce network overhead.

## Phase 3: Dynamic Runtime
- Remote Module Loading: Adapt `plugins/loader.js` to load JavaScript modules via `import()` using validated, cross-origin-safe URLs.
- Security: Maintain sandbox wrappers around dynamically fetched code to ensure execution isolation.

## Technical Strategy
- Transition to Browser-Only: Remove dependencies on local filesystem cloning.
- Persistence Layer: Use IndexedDB for all persistent storage (states, manifests).
- Network: Fetch all plugins/manifests from trusted sources via secure, validated URLs.
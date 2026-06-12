import TokenVault from '../storage/TokenVault.js';

/**
 * ConnectorController manages the lifecycle of external service connectors.
 * It handles registration, token retrieval via TokenVault, and state broadcasting.
 */
class ConnectorController {
  constructor(messagingBus) {
    this.messagingBus = messagingBus;
    this.vault = new TokenVault();
    this.connectors = new Map(); // Store active connector configurations
  }

  /**
   * Initializes the controller and the underlying TokenVault.
   */
  async init() {
    await this.vault.init();
    console.log('ConnectorController initialized.');
  }

  /**
   * Registers a new connector and secures its credentials.
   * @param {Object} config - Connector configuration (id, scope, token, etc.)
   */
  async registerConnector(config) {
    const { id, scope, token, keyAlias } = config;

    if (!id || !token) {
      throw new Error('Connector ID and token are required for registration.');
    }

    // Secure the token in the vault
    await this.vault.storeToken(id, token, scope, keyAlias);

    // Track connector state
    const connectorState = {
      id,
      scope,
      status: 'registered',
      registeredAt: new Date().toISOString()
    };
    
    this.connectors.set(id, connectorState);

    // Broadcast change to Messaging Bus
    this.broadcastStateChange(id, 'REGISTERED', connectorState);

    return connectorState;
  }

  /**
   * Fetches a decrypted token for a specific connector.
   * @param {string} id - The connector ID.
   * @returns {Promise<string>} The decrypted token.
   */
  async getConnectorToken(id) {
    const tokenData = await this.vault.getToken(id);
    if (!tokenData) {
      throw new Error(`No token found for connector: ${id}`);
    }

    this.broadcastStateChange(id, 'TOKEN_ACCESSED', { lastAccessedAt: new Date().toISOString() });
    
    return tokenData;
  }

  /**
   * Updates the status of a connector and broadcasts the change.
   * @param {string} id - The connector ID.
   * @param {string} status - New status (e.g., 'active', 'error', 'disconnected').
   */
  async updateStatus(id, status) {
    if (this.connectors.has(id)) {
      const state = this.connectors.get(id);
      state.status = status;
      state.lastUpdatedAt = new Date().toISOString();
      this.connectors.set(id, state);

      this.broadcastStateChange(id, 'STATUS_UPDATED', state);
    }
  }

  /**
   * Broadcasts events to the Messaging Bus.
   * @param {string} connectorId - Target connector.
   * @param {string} type - Event type.
   * @param {Object} payload - Data to broadcast.
   */
  broadcastStateChange(connectorId, type, payload) {
    if (this.messagingBus && typeof this.messagingBus.publish === 'function') {
      this.messagingBus.publish('connector.state_change', {
        connectorId,
        type,
        payload,
        timestamp: Date.now()
      });
    } else {
      console.warn(`Messaging Bus not available. Skipped broadcasting ${type} for ${connectorId}`);
    }
  }
}

export default ConnectorController;

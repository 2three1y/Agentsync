/**
 * MessagingBus handles the communication between the system controllers,
 * the UI, and registered agents.
 */
class MessagingBus {
  constructor() {
    this.subscribers = new Map();
    this.history = [];
    this.config = {
      context_mode: 'standalone' // Default mode: local memory only
    };
  }

  /**
   * Update the internal configuration.
   * @param {string} key 
   * @param {any} value 
   */
  setConfig(key, value) {
    this.config[key] = value;
    this.publish('CONFIG_UPDATE', { key, value });
  }

  /**
   * Retrieve a configuration value.
   * @param {string} key 
   * @returns {any}
   */
  getConfig(key) {
    return this.config[key];
  }

  /**
   * Register a callback for a specific event type.
   * @param {string} eventType 
   * @param {Function} callback 
   */
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
  }

  /**
   * Broadcast an event to all subscribers.
   * @param {string} eventType 
   * @param {Object} payload 
   */
  publish(eventType, payload) {
    const event = {
      type: eventType,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
        originId: window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
      }
    };

    this.history.push(event);

    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).forEach(callback => {
        try {
          callback(event.payload);
        } catch (error) {
          console.error(`Error in MessagingBus subscriber for ${eventType}:`, error);
        }
      });
    }

    // Accessibility: Log to console for auditability and trigger potential live region updates
    console.log(`[MessagingBus] Event Published: ${eventType}`, event.payload);
  }

  /**
   * CONTEXT_PUSH handler: Broadcasts workspace state to registered agents.
   * Logic is kept clean and structured for VoiceOver auditability.
   * @param {Object} workspaceState 
   */
  handleContextPush(workspaceState) {
    this.publish('CONTEXT_PUSH', {
      state: workspaceState,
      description: 'Workspace context synchronization update'
    });
  }
}

export const messagingBus = new MessagingBus();

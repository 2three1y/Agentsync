/**
 * MemoryManager handles memory queries and respects the context_mode flag.
 * Modes:
 * - 'standalone': Queries local memory only.
 * - 'integrated': Queries cross-service/bus context.
 */
import { messagingBus } from '../bus/MessagingBus.js';

class MemoryManager {
  constructor() {
    this.localStore = new Map();
  }

  /**
   * Query memory based on the current context_mode.
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async query(query) {
    const mode = messagingBus.getConfig('context_mode') || 'standalone';
    
    if (mode === 'integrated') {
      return this._queryIntegrated(query);
    }
    return this._queryStandalone(query);
  }

  _queryStandalone(query) {
    console.log(`[MemoryManager] Standalone query: ${query}`);
    // Implementation for local search logic
    return Array.from(this.localStore.values()).filter(item => 
      JSON.stringify(item).includes(query)
    );
  }

  async _queryIntegrated(query) {
    console.log(`[MemoryManager] Integrated query: ${query}`);
    // Implementation for broadcasting query to the bus or cross-service search
    return new Promise((resolve) => {
      messagingBus.publish('MEMORY_QUERY', {
        query,
        onResult: (results) => resolve(results)
      });
      
      // Fallback to local if no external results within timeout
      setTimeout(() => resolve(this._queryStandalone(query)), 500);
    });
  }

  store(key, value) {
    this.localStore.set(key, value);
  }
}

export const memoryManager = new MemoryManager();

/**
 * TokenVault Class
 * 
 * Secure storage for sensitive tokens using IndexedDB for persistence
 * and Web Crypto API (AES-GCM-256) for encryption.
 */
class TokenVault {
  constructor() {
    this.dbName = 'AgentSync_Vault';
    this.storeName = 'tokens';
    this.db = null;
    this.encryptionKey = null;

    // Internal properties matching schema
    this.id = null;
    this.tokenEncrypted = null;
    this.algorithm = 'AES-GCM';
    this.iv = null;
    this.keyAlias = null;
    this.scope = null;
    this.createdAt = null;
    this.lastAccessedAt = null;
    this.isLocked = true;
  }

  /**
   * Initializes the IndexedDB storage.
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  /**
   * Generates or derives an encryption key and "unlocks" the vault.
   * @param {string} password - User password to derive the key from.
   */
  async unlock(password) {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // In a production environment, use PBKDF2 to derive the key.
    // For this implementation, we'll import a raw key for demonstration.
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    this.encryptionKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.isLocked = false;
  }

  /**
   * Seals the vault by clearing the encryption key from memory.
   */
  seal() {
    this.encryptionKey = null;
    this.isLocked = true;
  }

  /**
   * Encrypts and stores a token.
   */
  async storeToken(id, plainToken, scope, keyAlias) {
    if (this.isLocked || !this.encryptionKey) {
      throw new Error('Vault is locked. Unlock before storing.');
    }

    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.encryptionKey,
      encoder.encode(plainToken)
    );

    const entry = {
      id: id,
      tokenEncrypted: encryptedData,
      algorithm: this.algorithm,
      iv: iv,
      keyAlias: keyAlias,
      scope: scope,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      isLocked: false
    };

    return this._saveToDB(entry);
  }

  /**
   * Retrieves and decrypts a token.
   */
  async getToken(id) {
    if (this.isLocked || !this.encryptionKey) {
      throw new Error('Vault is locked. Unlock before retrieving.');
    }

    const entry = await this._getFromDB(id);
    if (!entry) throw new Error('Token not found.');

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: entry.iv },
      this.encryptionKey,
      entry.tokenEncrypted
    );

    const decoder = new TextDecoder();
    
    // Update last accessed
    entry.lastAccessedAt = new Date().toISOString();
    await this._saveToDB(entry);

    return decoder.decode(decryptedData);
  }

  _saveToDB(entry) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  _getFromDB(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

export default TokenVault;

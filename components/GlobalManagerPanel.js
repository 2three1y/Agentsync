import React, { useState } from 'react';

/**
 * GlobalManagerPanel component
 * Includes a high-contrast BETA indicator banner and ARIA-live regions for accessibility.
 * Updated to accept NSEC signature and public key inputs for workspace transitions.
 */
const GlobalManagerPanel = () => {
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [status, setStatus] = useState('Ready for workspace transition');

  const handleTransition = () => {
    if (!signature || !publicKey) {
      setStatus('Error: Signature and Public Key are required.');
      return;
    }
    setStatus('Validating NSEC signature...');
    // Logic for transition would go here
  };

  return (
    <section 
      aria-label="Global Manager Panel" 
      role="region" 
      id="Global_Manager_Panel"
      style={{ 
        padding: '24px', 
        backgroundColor: '#0f172a', // slate-900
        color: '#f8fafc', // slate-50
        borderRadius: '8px',
        border: '1px solid #1e293b' // slate-800
      }}
    >
      {/* High-contrast BETA indicator banner */}
      <div 
        role="banner"
        style={{
          backgroundColor: '#000',
          color: '#0ea5e9', // sky-blue
          padding: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
          border: '2px solid #0ea5e9',
          borderRadius: '4px'
        }}
      >
        BETA VERSION - SECURE TRANSITIONS ACTIVE
      </div>

      {/* ARIA-live region for accessibility notifications */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {status}
      </div>

      <header>
        <h2 style={{ color: '#0ea5e9' }}>Global Manager Panel</h2>
        <p style={{ color: '#94a3b8' }}>Manage your workspace and security settings here.</p>
      </header>

      <main 
        style={{ 
          marginTop: '24px', 
          backgroundColor: '#1e293b', // slate-800
          padding: '20px', 
          borderRadius: '6px' 
        }}
      >
        <h3 style={{ marginBottom: '16px' }}>Workspace Transition</h3>
        
        <div style={{ marginBottom: '16px' }}>
          <label 
            htmlFor="nsec-public-key" 
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            NSEC Public Key
          </label>
          <input
            id="nsec-public-key"
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter public key"
            aria-required="true"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="nsec-signature" 
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            NSEC Signature
          </label>
          <input
            id="nsec-signature"
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Enter signature"
            aria-required="true"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff'
            }}
          />
        </div>

        <button
          onClick={handleTransition}
          aria-controls="Global_Manager_Panel"
          style={{
            backgroundColor: '#0ea5e9',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Initiate Transition
        </button>

        <p 
          style={{ 
            marginTop: '16px', 
            fontSize: '0.9rem', 
            color: status.includes('Error') ? '#ef4444' : '#38bdf8' 
          }}
        >
          Status: {status}
        </p>
      </main>
    </section>
  );
};

export default GlobalManagerPanel;

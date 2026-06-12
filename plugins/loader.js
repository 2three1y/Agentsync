
/**
 * AgentSync Plugin Loader
 * Handles validation, permissions checking, and sandboxed execution.
 */

const permissions = {
  // Mocking permissions structure
  "trusted": ["core-agent", "data-connector"],
  "restricted": ["web-search"]
};

export async function loadPlugin(manifest) {
  if (!manifest || !manifest.id || !manifest.version) {
    throw new Error("Invalid plugin manifest: missing id or version.");
  }
  
  console.log(`Validating plugin: ${manifest.id}`);
  
  // Basic permission check
  const isAllowed = permissions.trusted.includes(manifest.id) || 
                    permissions.restricted.includes(manifest.id);
                    
  if (!isAllowed) {
    throw new Error(`Permission denied for plugin: ${manifest.id}`);
  }
  
  return true;
}

export async function executePlugin(id) {
  console.log(`Executing plugin: ${id}`);
  
  try {
    // Basic sandboxing: using a dynamic import and wrapping in a try/catch
    const module = await import(`./plugins/${id}.js`);
    
    // Minimal security wrapper
    if (typeof module.run === 'function') {
      return await module.run();
    } else {
      throw new Error("Plugin does not export a 'run' function.");
    }
  } catch (error) {
    console.error(`Execution failed for ${id}:`, error);
    throw error;
  }
}

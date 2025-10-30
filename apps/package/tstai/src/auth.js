import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for the custom API
const API_CONFIG = {
  baseUrl: process.env.TSTAI_API_URL || 'https://api.tstai.dev',
  endpoints: {
    parse: '/v1/parse',
    whoami: '/v1/whoami'
  }
};

// Path to store the API key
const CONFIG_DIR = path.join(os.homedir(), '.tstai');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Ensure the config directory exists
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load configuration from file
 */
export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load config:', error.message);
  }
  return {};
}

/**
 * Save configuration to file
 */
export function saveConfig(config) {
  try {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    throw new Error(`Failed to save config: ${error.message}`);
  }
}

/**
 * Get the current API key
 * Priority: Environment variable > Stored config > null
 */
export function getApiKey() {
  // First priority: Environment variable (CI/CD friendly)
  if (process.env.TSTAI_API_KEY) {
    return process.env.TSTAI_API_KEY;
  }
  
  // Second priority: Stored config (CLI friendly)
  const config = loadConfig();
  return config.apiKey || null;
}

/**
 * Get the authentication method being used
 */
export function getAuthMethod() {
  if (process.env.TSTAI_API_KEY) {
    return 'environment';
  }
  
  const config = loadConfig();
  if (config.apiKey) {
    return 'config';
  }
  
  return 'none';
}

/**
 * Set the API key
 */
export function setApiKey(apiKey) {
  const config = loadConfig();
  config.apiKey = apiKey;
  saveConfig(config);
}

/**
 * Clear the stored API key
 */
export function clearApiKey() {
  const config = loadConfig();
  delete config.apiKey;
  saveConfig(config);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getApiKey();
}

/**
 * Get authentication status with method information
 */
export function getAuthStatus() {
  const apiKey = getApiKey();
  const method = getAuthMethod();
  
  return {
    authenticated: !!apiKey,
    method: method,
    hasEnvironmentKey: !!process.env.TSTAI_API_KEY,
    hasConfigKey: !!loadConfig().apiKey
  };
}

/**
 * Get user information from the API
 */
export async function whoami() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Not authenticated. Please run "tstai login" first.');
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.whoami}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please run "tstai login" again.');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Failed to connect to TSTAI API. Please check your internet connection.');
    }
    throw error;
  }
}


/**
 * Logout and clear stored credentials
 */
export function logout() {
  clearApiKey();
}

/**
 * Get API configuration
 */
export function getApiConfig() {
  return API_CONFIG;
}

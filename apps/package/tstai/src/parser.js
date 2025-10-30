import { getApiKey, getApiConfig } from "./auth.js";

export async function parseInstruction(instruction) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Not authenticated. Please run "tstai login" first.');
  }

  const config = getApiConfig();
  
  try {
    const response = await fetch(`${config.baseUrl}${config.endpoints.parse}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instruction: instruction
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please run "tstai login" again.');
      }
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data.method || !data.endpoint || !data.expected_status) {
      throw new Error('Invalid response format from API');
    }
    
    return {
      method: data.method,
      endpoint: data.endpoint,
      payload: data.payload || {},
      expected_status: data.expected_status
    };
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Failed to connect to TSTAI API. Please check your internet connection.');
    }
    throw error;
  }
}

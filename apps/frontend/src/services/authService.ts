/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including:
 * - User registration
 * - User login/logout
 * - API key management
 * - Local storage operations for user data
 * - HTTP requests to the backend API
 * 
 * Note: In React (client-side only), we don't need to check for 'window' object
 * like we did in Next.js which has both server and client rendering.
 */

// Get API base URL from environment variables
// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/v1'

/**
 * Helper function to add timeout to fetch requests
 * This prevents requests from hanging indefinitely
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body, etc.)
 * @param timeoutMs - Timeout in milliseconds (default: 10 seconds)
 * @returns Promise<Response>
 */
async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 10000
): Promise<Response> {
    // Create an AbortController to cancel the request if it times out
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        })
        clearTimeout(timeoutId)
        return response
    } catch (error: any) {
        clearTimeout(timeoutId)
        // Check if the error was caused by timeout
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection')
        }
        throw error
    }
}

/**
 * Register a new user
 * 
 * @param email - User's email address
 * @param password - User's password
 * @param name - User's full name
 * @returns Promise with user data
 */
export async function register(email: string, password: string, name: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            name,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
    }

    return response.json()
}

/**
 * Login with email and password
 * Stores user data in localStorage on successful login
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with user data including token
 */
export async function login(email: string, password: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
    }

    const data = await response.json()

    // Store user data in localStorage for persistence across page refreshes
    localStorage.setItem('user', JSON.stringify(data))

    return data
}

/**
 * Logout the current user
 * Removes user data from localStorage
 */
export function logout() {
    localStorage.removeItem('user')
}

/**
 * Get the currently logged-in user from localStorage
 * 
 * @returns User object or null if not logged in
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
}

/**
 * Check if a user is currently authenticated
 * 
 * @returns true if user is logged in, false otherwise
 */
export function isAuthenticated(): boolean {
    return getCurrentUser() !== null
}

/**
 * Create a new API key for the user
 * 
 * @param email - User's email address
 * @param password - User's password (for verification)
 * @returns Promise with the newly created API key data
 */
export async function createApi(email: string, password: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/createapi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
    }

    return response.json()
}

/**
 * Get all API keys for a user
 * 
 * @param email - User's email address
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise with array of API keys
 */
export async function getApiKeys(email: string, signal?: AbortSignal) {
    const response = await fetchWithTimeout(
        `${API_BASE_URL}/auth/apikeys?email=${encodeURIComponent(email)}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal,
        }
    )

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch API keys')
    }

    return response.json()
}

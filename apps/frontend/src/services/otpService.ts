/**
 * OTP Service
 * 
 * This service handles all OTP-related operations including:
 * - Sending OTP to email (for signup or password reset)
 * - Verifying OTP
 * - HTTP requests to the backend API
 */

// Get API base URL from environment variables
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
 * Send OTP to email
 * 
 * @param email - User's email address
 * @param purpose - Purpose of OTP ('signup' or 'reset-password') - REQUIRED
 * @returns Promise with success message
 */
export async function sendOtp(email: string, purpose: 'signup' | 'reset-password') {
    const response = await fetchWithTimeout(`${API_BASE_URL}/otp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            purpose,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send OTP')
    }

    return response.json()
}

/**
 * Verify OTP
 * 
 * @param email - User's email address
 * @param otp - OTP code to verify
 * @param purpose - Purpose of OTP ('signup' or 'reset-password') - REQUIRED
 * @returns Promise with verification result
 */
export async function verifyOtp(email: string, otp: string, purpose: 'signup' | 'reset-password') {
    const response = await fetchWithTimeout(`${API_BASE_URL}/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            otp,
            purpose,
        }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'OTP verification failed')
    }

    return response.json()
}

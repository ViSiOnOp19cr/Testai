const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/v1';

// Helper function to add timeout to fetch requests
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please check your connection');
        }
        throw error;
    }
}

export async function register(email: string, password: string, name: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            name
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }

    return response.json();
}

export async function login(email: string, password: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();

    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
}

export function getCurrentUser() {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
}

export function isAuthenticated() {
    return getCurrentUser() !== null;
}

export async function createApi(email: string, password: string) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/createapi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create API key');
    }

    return response.json();
}

export async function getApiKeys(email: string, signal?: AbortSignal) {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/apikeys?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch API keys');
    }

    return response.json();
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006/v1';

export async function register(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    
    // Store user data in localStorage
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
    const response = await fetch(`${API_BASE_URL}/auth/createapi`, {
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
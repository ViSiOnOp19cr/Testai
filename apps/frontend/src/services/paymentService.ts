// API service for payment operations
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create checkout session
export async function createCheckout(planType: 'pro' | 'ultra') {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/v1/payment/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planType }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
    }

    return response.json();
}

// Get subscription status
export async function getSubscription() {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/v1/payment/subscription`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get subscription');
    }

    return response.json();
}

// Cancel subscription
export async function cancelSubscription() {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/v1/payment/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
    }

    return response.json();
}

// Get usage stats
export async function getUsage() {
    const token = getAuthToken();

    const response = await fetch(`${API_URL}/v1/payment/usage`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get usage');
    }

    return response.json();
}

export const PLANS = {
    free: {
        name: "Free",
        monthlyRequests: 10,
        price: 0,
        currency: 'INR'
    },
    pro: {
        name: "Pro",
        monthlyRequests: 100,
        price: 199,
        currency: 'INR'
    },
    ultra: {
        name: "Ultra",
        monthlyRequests: 250,
        price: 499,
        currency: 'INR'
    }
} as const;

export type PlanType = keyof typeof PLANS;
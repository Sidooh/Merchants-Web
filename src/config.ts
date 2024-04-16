export const CONFIG = {
    app: {
        name: 'Merchants App',
        version: 1.0,
        session_timeout: import.meta.env.VITE_SESSION_TIMEOUT || 60_000,
    },
    services: {
        accounts: {
            api: {
                url: import.meta.env.VITE_ACCOUNTS_API_URL,
            },
        },
        merchants: {
            api: {
                url: import.meta.env.VITE_MERCHANTS_API_URL,
            },
        },
        payments: {
            api: {
                url: import.meta.env.VITE_PAYMENTS_API_URL,
            },
        },
        savings: {
            api: {
                url: import.meta.env.VITE_SAVINGS_API_URL,
            },
        },
    },
    tagline: 'Sidooh, Makes You Money with Every Purchase!',
};

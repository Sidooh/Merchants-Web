export const CONFIG = {
    app: {
        name: "Merchant's Float",
        version: 1.0,
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
        notify: {
            api: {
                url: import.meta.env.VITE_NOTIFY_API_URL,
            },
        },
    },
    tagline: 'Sidooh, Makes You Money with Every Purchase!',
};

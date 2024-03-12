export const CONFIG = {
    app: {
        name: 'Merchants',
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
        notify: {
            dashboard: {
                url: import.meta.env.VITE_NOTIFY_DASHBOARD_URL,
            },
        },
    },
    tagline: 'Sidooh, Makes You Money with Every Purchase!',
};

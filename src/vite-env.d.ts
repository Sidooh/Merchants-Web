/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SESSION_TIMEOUT: number;

    readonly VITE_ACCOUNTS_API_URL: string;
    readonly VITE_MERCHANTS_API_URL: string;
    readonly VITE_NOTIFY_API_URL: string;
    readonly VITE_PAYMENTS_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

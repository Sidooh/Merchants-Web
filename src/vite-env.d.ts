/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_SESSION_TIMEOUT: number;

    readonly VITE_ACCOUNTS_API_URL: string;
    readonly VITE_MERCHANTS_API_URL: string;
    readonly VITE_PAYMENTS_API_URL: string;
    readonly VITE_SAVINGS_API_URL: string;
    readonly VITE_USSD_API_URL: string;

    readonly VITE_OTP_RESEND_TIMEOUT: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

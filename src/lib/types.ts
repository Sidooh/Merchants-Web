import { ComponentType } from 'react';
import { MerchantProduct, MerchantType, PaymentMethod, Status } from '@/lib/enums.ts';

export interface ApiResponse<T> {
    result: 1 | 0;
    status: string;
    data: T;
    errors: object[];
}

export type LoginRequest = {
    phone: string;
    store_no: string;
    is_refresh_token?: boolean;
};

export type OTPRequest = {
    pin: string;
};

export type LoginResponse = { access_token: string };

export type Model = {
    id: number;
    created_at: Date | string;
    updated_at: Date | string;
};

export type Account = Model & {
    id: number;
    phone: number;
    active: boolean;
};

export type Merchant = Model & {
    account_id: number;
    float_account_id: number;
    location_id: number;

    first_name: string;
    last_name: string;
    id_number: string;
    phone: string;

    business_name: string;
    code: string;
    land_mark: string;
};

export type MpesaStore = Model & {
    merchant_id: number;

    agent: string;
    store: string;
    name: string;
};

export type FloatAccount = Model & {
    id: number;

    balance: number;
};

export type Payment = Model & {
    amount: number;
    charge: number;
    status: Status;
    description: string;
    destination: { agent: string; store: string; merchant_type: MerchantType };
};

export type Transaction = Model & {
    amount: number;
    status: Status;
    description: string;
    destination: string;
    merchant: number | Merchant;
    product: string;
    payment?: Payment;
};

export type FacetedFilterType = {
    column_id: string;
    title: string;
    options: {
        label: string;
        value: string;
        icon?: ComponentType<{ className?: string }>;
    }[];
};

export type MpesaFloatPurchaseRequest = {
    merchant_id: number;
    agent: string;
    store: string;
    amount: number;
    method: PaymentMethod;
    debit_account?: string;
};

export type MpesaFloatPurchaseResponse = {
    id: number;
    merchant_id: number;
    description: string;
    destination: string;
    amount: number;
    payment: Payment;
    product: MerchantProduct;
    status: Status;
};

export type PinConfirmationRequest = {
    account_id: number;
    pin: string;
};

export type NotifyRequest = {
    channel: string;
    destination: number | number[];
    event_type?: string;
    content: string;
};

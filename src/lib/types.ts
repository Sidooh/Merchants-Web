import { ComponentType } from 'react';
import { MerchantProduct, PaymentMethod, Status } from '@/lib/enums.ts';

export interface ApiResponse<T> {
    result: 1 | 0;
    status: string;
    data: T;
    errors: object[];
}

export type LoginRequest = {
    phone: string;
    store_no: string;
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
    code: number;
    land_mark: string;
};

export type MpesaStore = Model & {
    merchant_id: number;

    agent: string;
    store: string;
    name: string;
};

export type Payment = Model & {
    amount: number;
    charge: number;
    status: Status;
    description: string;
    destination: { [key: string]: string };
};

export type Transaction = Model & {
    amount: number;
    status: Status;
    description: string;
    destination: string;
    merchant: number | Merchant;
    product: string;
    payment: Payment;
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
    debit_account: number;
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

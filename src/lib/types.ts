import { ComponentType } from 'react';
import { MerchantProduct, MerchantType, PaymentMethod, Status } from '@/lib/enums.ts';
import { To } from 'react-router-dom';
import { IconType } from 'react-icons';

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

export type UpdateKybRequest = {
    business_name: string;
    landmark: string;
};

export type CreateMerchantRequest = {
    first_name: string;
    last_name: string;
    id_number: string;
    account_id: number;
};

export type OTPRequest = {
    phone: string;
    otp: number;
};

export type LoginResponse = { access_token: string };

export type RouteChildType = {
    name: string;
    active?: boolean;
    icon: IconType;
    to: To;
    disabled?: boolean;
};

export type RouteType = {
    label: string;
    children: RouteChildType[];
};

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
    product: MerchantProduct;
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

export type MpesaFloatPurchaseResponse = Transaction & {
    merchant_id: number;
};

export type VoucherPurchaseRequest = {
    merchant_id: number;
    amount: number;
    phone: string;
};

export type VoucherPurchaseResponse = Transaction & {
    merchant_id: number;
};

export type PinConfirmationRequest = {
    account_id: number;
    pin: string;
};

export type Charge = { min: number; max: number; charge: number };

export type GenerateOTPRequest = {
    phone: string;
};
export type VerifyOTPRequest = {
    phone: string;
    otp: number | string;
};

export type CreateAccountRequest = {
    phone: string;
    invite_code: string;
};

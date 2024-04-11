export enum Status {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED',
    FAILED = 'FAILED',
    INACTIVE = 'INACTIVE',
    PAID = 'PAID',
    PENDING = 'PENDING',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
    FLOAT = 'FLOAT',
    MPESA = 'MPESA',
    VOUCHER = 'VOUCHER',
}

export enum MerchantProduct {
    MPESA_FLOAT = 'MPESA_FLOAT',
    FLOAT_PURCHASE = 'FLOAT_PURCHASE',
}

export enum MerchantType {
    MPESA_STORE = 'MPESA_STORE',
}

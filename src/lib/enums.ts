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

export enum OnboardingStage {
    PHONE_VERIFICATION = 'PHONE_VERIFICATION',
    INVITE_CODE = 'INVITE_CODE',
    KYC = 'KYC',
}

export enum VoucherType {
    SIDOOH = 'SIDOOH',
}

export enum MerchantEarningAccountType {
    CASHBACK = 'CASHBACK',
    COMMISSION = 'COMMISSION',
}

export enum SavingsEarningAccountType {
    CURRENT = 'CURRENT',
    LOCKED = 'LOCKED',
    MERCHANT = 'MERCHANT',
    MERCHANT_CASHBACK = 'MERCHANT_CASHBACK',
    MERCHANT_COMMISSION = 'MERCHANT_COMMISSION',
}

import { Model } from '@/lib/types.ts';
import { MerchantEarningAccountType, SavingsEarningAccountType, Status, VoucherType } from '@/lib/enums.ts';

export type Voucher = Model & {
    type: VoucherType;
    balance: number;
    status: Status;
    account_id: number;
    voucher_type_id: number;
};

export type MerchantEarningAccount = Model & {
    type: MerchantEarningAccountType;
    amount: number;
};

export type SavingsEarningAccount = Model & {
    type: SavingsEarningAccountType;
    balance: number;
    interest: number;
    status: Status;
    account_id: number;
};

export type USSDSetting = Model & {
    name: string;
    value: string;
};

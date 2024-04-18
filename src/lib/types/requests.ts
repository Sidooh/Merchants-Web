import { EarningsWithdrawalDestination, EarningsWithdrawalSource } from '@/lib/enums.ts';

export type EarningsWithdrawalRequest = {
    merchant_id: number;
    source: EarningsWithdrawalSource;
    destination: EarningsWithdrawalDestination;
    account?: string;
    amount: number;
};

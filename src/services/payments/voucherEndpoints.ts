import { ApiResponse } from '@/lib/types.ts';
import { paymentsApi } from '@/services/payments/paymentsApi.ts';
import { Voucher } from '@/lib/types/models.ts';
import { providesList } from '@/lib/utils.ts';

const voucherEndpoints = paymentsApi.injectEndpoints({
    endpoints: (build) => ({
        getVouchers: build.query<Voucher[], { account_id?: number; voucher_type_id?: number }>({
            keepUnusedDataFor: 60 * 3,
            query: (params) => ({ url: `/vouchers`, params }),
            transformResponse: (val: ApiResponse<Voucher[]>) => val.data,
            providesTags: (result) => providesList(result, 'Voucher'),
        }),
    }),
});

export const { useGetVouchersQuery } = voucherEndpoints;

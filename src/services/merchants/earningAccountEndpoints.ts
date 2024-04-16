import { ApiResponse } from '@/lib/types';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { providesList } from '@/lib/utils.ts';
import { MerchantEarningAccount } from '@/lib/types/models.ts';

const earningAccountEndpoints = merchantsApi.injectEndpoints({
    endpoints: (build) => ({
        getMerchantEarningAccounts: build.query<MerchantEarningAccount[], { merchant_id: number }>({
            keepUnusedDataFor: 60 * 3,
            query: ({ merchant_id }) => `/earning-accounts/merchant/${merchant_id}`,
            transformResponse: (val: ApiResponse<MerchantEarningAccount[]>) => val.data,
            providesTags: (result) => providesList(result, 'EarningAccount'),
        }),
    }),
});

export const { useGetMerchantEarningAccountsQuery } = earningAccountEndpoints;

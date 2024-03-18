import { ApiResponse, FloatAccount } from '@/lib/types.ts';
import { paymentsApi } from '@/services/payments/paymentsApi.ts';

const floatEndpoints = paymentsApi.injectEndpoints({
    endpoints: (build) => ({
        getFloatBalance: build.query<FloatAccount, number>({
            query: (id) => `/float-accounts/${id}`,
            transformResponse: (val: ApiResponse<FloatAccount>) => val.data,
            // providesTags: (result) => providesList(result, 'FloatAccount'),
        }),
    }),
});

export const { useGetFloatBalanceQuery } = floatEndpoints;

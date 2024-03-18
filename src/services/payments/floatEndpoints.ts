import { ApiResponse, FloatAccount } from '@/lib/types.ts';
import { paymentsApi } from '@/services/payments/paymentsApi.ts';

const floatEndpoints = paymentsApi.injectEndpoints({
    endpoints: (build) => ({
        getFloatAccount: build.query<FloatAccount, number>({
            query: (id) => `/float-accounts/${id}`,
            transformResponse: (val: ApiResponse<FloatAccount>) => val.data,
            providesTags: (_, __, id) => [{ type: 'FloatAccount', id }],
        }),
    }),
});

export const { useGetFloatAccountQuery } = floatEndpoints;

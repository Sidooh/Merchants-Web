import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { getAuthToken } from '@/lib/utils.ts';
import { ApiResponse } from '@/lib/types.ts';
import { SavingsEarningAccount } from '@/lib/types/models.ts';

export const savingsApi = createApi({
    reducerPath: 'savingsApi',
    tagTypes: ['EarningAccount'],
    keepUnusedDataFor: 60 * 60 * 60, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.savings.api.url,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: (build) => ({
        getEarningAccounts: build.query<SavingsEarningAccount[], number>({
            query: (accountId) => `/accounts/${accountId}/earnings`,
            transformResponse: (val: ApiResponse<SavingsEarningAccount[]>) => val.data,
        }),
    }),
});

export const { useGetEarningAccountsQuery } = savingsApi;

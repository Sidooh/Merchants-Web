import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { getAuthToken } from '@/lib/utils.ts';

export const merchantsApi = createApi({
    reducerPath: 'merchantsApi',
    tagTypes: ['Merchant', 'Transaction', 'MpesaStore', 'EarningAccount'],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.merchants.api.url,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: () => ({}),
});

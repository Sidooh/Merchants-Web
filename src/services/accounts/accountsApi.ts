import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config.ts';
import { getAuthToken } from '@/lib/utils.ts';

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    tagTypes: ['Account'],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.services.accounts.api.url}`,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: () => ({}),
});

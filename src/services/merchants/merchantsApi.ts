import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { RootState } from '@/app/store';

export const merchantsApi = createApi({
    reducerPath: 'merchantsApi',
    tagTypes: ['Merchant', 'Transaction'],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.merchants.api.url,
        prepareHeaders: (headers, { getState }) => {
            const { user } = (getState() as RootState)?.auth;

            if (user?.token) headers.set('Authorization', `Bearer ${user?.token}`);

            return headers;
        },
    }),
    endpoints: () => ({}),
});

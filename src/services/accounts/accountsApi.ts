import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config.ts';
import { RootState } from '@/app/store.ts';

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    tagTypes: [],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.services.accounts.api.url}/accounts`,
        prepareHeaders: (headers, { getState }) => {
            const { user } = (getState() as RootState)?.auth;

            if (user?.token) headers.set('Authorization', `Bearer ${user?.token}`);

            return headers;
        },
    }),
    endpoints: () => ({}),
});

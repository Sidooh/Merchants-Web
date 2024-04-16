import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { getAuthToken } from '@/lib/utils.ts';
import { ApiResponse, Charge } from '@/lib/types.ts';

export const notifyApi = createApi({
    reducerPath: 'notifyApi',
    tagTypes: ['FloatAccount'],
    keepUnusedDataFor: 60 * 60 * 60, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.notify.api.url,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: (build) => ({
        sendSms: build.query<Charge[], void>({
            query: () => '/charges/buy-goods',
            transformResponse: (val: ApiResponse<Charge[]>) => val.data,
        }),
    }),
});

export const { useSendSmsQuery } = notifyApi;

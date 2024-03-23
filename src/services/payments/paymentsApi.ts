import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { getAuthToken, providesList } from '@/lib/utils.ts';
import { ApiResponse, Charge } from '@/lib/types.ts';

export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    tagTypes: ['FloatAccount', 'Charge'],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.payments.api.url,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: (build) => ({
        getFloatCharges: build.query<Charge[], void>({
            query: () => '/charges/mpesa-float',
            transformResponse: (val: ApiResponse<Charge[]>) => val.data,
            providesTags: (result) =>
                providesList(
                    result?.map((r, i) => ({ ...r, id: i })),
                    'Charge'
                ),
        }),
    }),
});

export const { useGetFloatChargesQuery } = paymentsApi;

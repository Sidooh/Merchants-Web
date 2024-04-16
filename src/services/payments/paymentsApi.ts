import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { getAuthToken, providesList } from '@/lib/utils.ts';
import { ApiResponse, Charge } from '@/lib/types.ts';

export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    tagTypes: ['FloatAccount', 'FloatCharge', 'PayBillCharge', 'BuyGoodsCharge', 'Voucher'],
    keepUnusedDataFor: 60 * 60 * 60, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.services.payments.api.url,
        prepareHeaders: async (headers) => {
            const token = await getAuthToken();

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        },
    }),
    endpoints: (build) => ({
        getBuyGoodsCharges: build.query<Charge[], void>({
            query: () => '/charges/buy-goods',
            transformResponse: (val: ApiResponse<Charge[]>) => val.data,
            providesTags: (result) =>
                providesList(
                    result?.map((r, i) => ({ ...r, id: i })),
                    'BuyGoodsCharge'
                ),
        }),
        getFloatCharges: build.query<Charge[], void>({
            query: () => '/charges/mpesa-float',
            transformResponse: (val: ApiResponse<Charge[]>) => val.data,
            providesTags: (result) =>
                providesList(
                    result?.map((r, i) => ({ ...r, id: i })),
                    'FloatCharge'
                ),
        }),
        getPayBillCharges: build.query<Charge[], void>({
            query: () => '/charges/pay-bill',
            transformResponse: (val: ApiResponse<Charge[]>) => val.data,
            providesTags: (result) =>
                providesList(
                    result?.map((r, i) => ({ ...r, id: i })),
                    'PayBillCharge'
                ),
        }),
    }),
});

export const { useGetBuyGoodsChargesQuery, useGetFloatChargesQuery, useGetPayBillChargesQuery } = paymentsApi;

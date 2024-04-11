import {
    ApiResponse,
    MpesaFloatPurchaseRequest,
    MpesaFloatPurchaseResponse,
    MpesaStore, VoucherPurchaseRequest,
    VoucherPurchaseResponse,
} from '@/lib/types.ts';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { providesList } from '@/lib/utils.ts';

const merchantsEndpoints = merchantsApi.injectEndpoints({
    endpoints: (build) => ({
        buyMpesaFloat: build.mutation<MpesaFloatPurchaseResponse, MpesaFloatPurchaseRequest>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/buy-mpesa-float`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<MpesaFloatPurchaseResponse>) => val.data,
            invalidatesTags: [
                { type: 'MpesaStore', id: 'LIST' },
                { type: 'Transaction', id: 'LIST' },
            ],
        }),
        topUpFloat: build.mutation<VoucherPurchaseResponse, VoucherPurchaseRequest>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/float-top-up`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<MpesaFloatPurchaseResponse>) => val.data,
            invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
        }),
        getMpesaStores: build.query<MpesaStore[], number>({
            query: (id) => `/merchants/${id}/mpesa-store-accounts`,
            transformResponse: (val: ApiResponse<MpesaStore[]>) => val.data,
            providesTags: (result) => providesList(result, 'MpesaStore'),
        }),
    }),
});

export const { useGetMpesaStoresQuery, useBuyMpesaFloatMutation, useTopUpFloatMutation } = merchantsEndpoints;

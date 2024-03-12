import { coreApi } from '@/services/coreApi';
import { ApiResponse, MpesaFloatPurchaseRequest, MpesaFloatPurchaseResponse, MpesaStore } from '@/lib/types';

const merchantsApi = coreApi.injectEndpoints({
    endpoints: (build) => ({
        buyMpesaFloat: build.mutation<any, MpesaFloatPurchaseRequest>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/buy-mpesa-float`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<MpesaFloatPurchaseResponse>) => val.data,
        }),
        getMpesaStores: build.query<MpesaStore[], number>({
            query: (id) => `/merchants/${id}/mpesa-store-accounts`,
            transformResponse: (val: ApiResponse<MpesaStore[]>) => val.data,
        }),
    }),
});

export const { useGetMpesaStoresQuery, useBuyMpesaFloatMutation } = merchantsApi;

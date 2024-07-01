import {
    ApiResponse,
    CreateMerchantRequest,
    Merchant,
    MpesaFloatPurchaseRequest,
    MpesaFloatPurchaseResponse,
    MpesaStore,
    Transaction,
    UpdateKybRequest,
    VoucherPurchaseRequest,
    VoucherPurchaseResponse,
} from '@/lib/types.ts';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { providesList } from '@/lib/utils.ts';
import { EarningsWithdrawalRequest } from '@/lib/types/requests.ts';

const merchantsEndpoints = merchantsApi.injectEndpoints({
    endpoints: (build) => ({
        createMerchant: build.mutation<Merchant, CreateMerchantRequest>({
            query: (body) => ({
                url: `/merchants`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<Merchant>) => val.data,
        }),
        updateKyb: build.mutation<Merchant, UpdateKybRequest & { merchant_id: number }>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/kyb`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<Merchant>) => val.data,
        }),
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
            transformResponse: (val: ApiResponse<VoucherPurchaseResponse>) => val.data,
            invalidatesTags: [{ type: 'Transaction', id: 'LIST' }],
        }),
        withdrawEarnings: build.mutation<Transaction, EarningsWithdrawalRequest>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/earnings/withdraw`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<Transaction>) => val.data,
            invalidatesTags: [
                { type: 'EarningAccount', id: 'LIST' },
                { type: 'Transaction', id: 'LIST' },
            ],
        }),

        withdrawSavings: build.mutation<Transaction, EarningsWithdrawalRequest>({
            query: ({ merchant_id, ...body }) => ({
                url: `/merchants/${merchant_id}/savings/withdraw`,
                method: 'POST',
                body,
            }),
            transformResponse: (val: ApiResponse<Transaction>) => val.data,
            invalidatesTags: [
                { type: 'EarningAccount', id: 'LIST' },
                { type: 'Transaction', id: 'LIST' },
            ],
        }),

        getMerchantByAccount: build.query<Merchant, number>({
            query: (id) => `/merchants/account/${id}`,
            transformResponse: (val: ApiResponse<Merchant>) => val.data,
            providesTags: (_, __, id) => [{ type: 'Merchant', id }],
        }),
        getMpesaStores: build.query<MpesaStore[], number>({
            query: (id) => `/merchants/${id}/mpesa-store-accounts`,
            transformResponse: (val: ApiResponse<MpesaStore[]>) => val.data,
            providesTags: (result) => providesList(result, 'MpesaStore'),
        }),
    }),
});

export const {
    useBuyMpesaFloatMutation,
    useCreateMerchantMutation,
    useGetMpesaStoresQuery,
    useLazyGetMerchantByAccountQuery,
    useTopUpFloatMutation,
    useUpdateKybMutation,
    useWithdrawEarningsMutation,
    useWithdrawSavingsMutation,
} = merchantsEndpoints;

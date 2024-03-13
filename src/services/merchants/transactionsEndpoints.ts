import { ApiResponse, Transaction } from '@/lib/types';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { providesList } from '@/lib/utils.ts';

const transactionsApi = merchantsApi.injectEndpoints({
    endpoints: (build) => ({
        getTransactions: build.query({
            query: ({ days, merchants }: { days?: number; merchants?: number }) => ({
                url: '/transactions',
                params: { days, merchants },
            }),
            transformResponse: (val: ApiResponse<Transaction[]>) => val.data,
            providesTags: (result) => providesList(result, 'Transaction'),
        }),
        getTransaction: build.query({
            query: (id: number) => `/transactions/${id}`,
            transformResponse: (val: ApiResponse<Transaction>) => val.data,
            providesTags: (_, __, id) => [{ type: 'Transaction', id }],
        }),
    }),
});

export const { useGetTransactionsQuery, useGetTransactionQuery } = transactionsApi;

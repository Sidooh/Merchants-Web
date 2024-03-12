import { ApiResponse, Transaction } from '@/lib/types';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';

const transactionsApi = merchantsApi.injectEndpoints({
    endpoints: (build) => ({
        getTransactions: build.query({
            query: ({ days, merchants }: { days?: number; merchants?: number }) => ({
                url: '/transactions',
                params: { days, merchants },
            }),
            transformResponse: (val: ApiResponse<Transaction[]>) => val.data,
            providesTags: ['Transaction'],
        }),
        getTransaction: build.query({
            query: (id: number) => `/transactions/${id}`,
            transformResponse: (val: ApiResponse<Transaction>) => val.data,
            providesTags: ['Transaction'],
        }),
    }),
});

export const { useGetTransactionsQuery, useGetTransactionQuery } = transactionsApi;

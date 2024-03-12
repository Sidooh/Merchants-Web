import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG } from '@/config';
import { RootState } from '@/app/store';
import { ApiResponse, PinConfirmationRequest } from '@/lib/types.ts';

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    tagTypes: [],
    keepUnusedDataFor: 60 * 7, //  Seven Minutes
    baseQuery: fetchBaseQuery({
        baseUrl: `${CONFIG.services.accounts.api.url}/accounts`,
        prepareHeaders: (headers, { getState }) => {
            const { user } = (getState() as RootState)?.auth;

            if (user.token) headers.set('Authorization', `Bearer ${user.token}`);

            return headers;
        },
    }),
    endpoints: (build) => ({
        checkPin: build.mutation<boolean, PinConfirmationRequest>({
            query: ({ account_id, ...body }) => ({
                url: `/${6}/check-pin`,
                method: 'POST',
                body,
            }),
            transformResponse: (res: ApiResponse<boolean>) => res.data,
        }),
    }),
});

export const { useCheckPinMutation } = accountsApi;

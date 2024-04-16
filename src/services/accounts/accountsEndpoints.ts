import { Account, ApiResponse, CreateAccountRequest, PinConfirmationRequest } from '@/lib/types';
import { accountsApi } from '@/services/accounts/accountsApi.ts';

const accountsEndpoints = accountsApi.injectEndpoints({
    endpoints: (build) => ({
        createAccount: build.mutation<Account, CreateAccountRequest>({
            query: (body) => ({
                url: `/accounts`,
                method: 'POST',
                body,
            }),
            transformResponse: (res: ApiResponse<Account>) => res.data,
            invalidatesTags: [{ type: 'Account', id: 'LIST' }],
        }),
        getAccountByPhone: build.query({
            query: (phone: string) => `/accounts/phone/${phone}`,
            transformResponse: (val: ApiResponse<Account>) => val.data,
            providesTags: (_, __, id) => [{ type: 'Account', id }],
        }),

        checkPin: build.mutation<boolean, PinConfirmationRequest>({
            query: ({ account_id, ...body }) => ({
                url: `/accounts/${account_id}/check-pin`,
                method: 'POST',
                body,
            }),
            transformResponse: (res: ApiResponse<boolean>) => res.data,
        }),
    }),
});

export const {
    useCheckPinMutation,
    useCreateAccountMutation,
    useGetAccountByPhoneQuery,
    useLazyGetAccountByPhoneQuery,
} = accountsEndpoints;

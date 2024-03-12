import { ApiResponse, PinConfirmationRequest } from '@/lib/types';
import { accountsApi } from '@/services/accounts/accountsApi.ts';

const accountsEdnpoints = accountsApi.injectEndpoints({
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

export const { useCheckPinMutation } = accountsEdnpoints;

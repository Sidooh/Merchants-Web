import { ApiResponse, GenerateOTPRequest, VerifyOTPRequest } from '@/lib/types';
import { accountsApi } from '@/services/accounts/accountsApi.ts';

const authEndpoints = accountsApi.injectEndpoints({
    endpoints: (build) => ({
        generateOTP: build.mutation<boolean, GenerateOTPRequest>({
            query: (body) => ({
                url: `/otp/generate`,
                method: 'POST',
                body,
            }),
            transformResponse: (res: ApiResponse<boolean>) => res.data,
        }),
        verifyOTP: build.mutation<boolean, VerifyOTPRequest>({
            query: (body) => ({
                url: `/otp/verify`,
                method: 'POST',
                body,
            }),
            transformResponse: (res: ApiResponse<boolean>) => res.data,
        }),
    }),
});

export const { useGenerateOTPMutation, useVerifyOTPMutation } = authEndpoints;

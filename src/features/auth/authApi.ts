import { CONFIG } from '@/config';
import axios, { AxiosResponse } from 'axios';
import { Account, ApiResponse, LoginRequest, LoginResponse, Merchant } from '@/lib/types';
import { AuthState } from '@/features/auth/authSlice.ts';
import { USSDSetting } from '@/lib/types/models.ts';
import secureLocalStorage from 'react-secure-storage';

export const authApi = {
    authenticateService: async (): Promise<string | undefined> => {
        try {
            const {
                data: { access_token: token },
            } = await axios.post<LoginResponse>(`${CONFIG.services.accounts.api.url}/users/signin`, {
                email: 'aa@a.a',
                password: '12345678',
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            secureLocalStorage.setItem('token', JSON.stringify(token));

            return token;
        } catch (e: unknown) {
            console.error(e);

            return undefined;
        }
    },
    async fetchMerchantByAccountId(accountId: number): Promise<Merchant | undefined> {
        try {
            const {
                data: { data: merchant },
            } = await axios.get(`${CONFIG.services.merchants.api.url}/merchants/account/${accountId}`);

            return merchant;
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 404 && e.response.data) {
                    throw new Error("You aren't yet a Sidooh Merchant. Click 'Onboard' to become one.");
                }
            }
        }
    },
    login: async (data: LoginRequest) => {
        try {
            await authApi.authenticateService();

            const {
                data: { data: account },
            } = await axios.get<ApiResponse<Account>>(
                `${CONFIG.services.accounts.api.url}/accounts/phone/${data.phone}`
            );

            if (!account) throw new Error('Invalid credentials!');

            const merchant = await authApi.fetchMerchantByAccountId(account.id);

            if (merchant?.code !== data.store_no) throw new Error('Invalid credentials!');

            const { data: ussdSettings } = await axios.get<any, AxiosResponse<USSDSetting[]>>(
                `${CONFIG.services.ussd.api.url}/settings`
            );

            const user: AuthState['user'] = {
                account_id: account.id,
                business_name: merchant.business_name,
                merchant_id: merchant.id,
                name: `${merchant.first_name} ${merchant.last_name}`,
                phone: account.phone,
                store_no: merchant.code,
                float_account_id: merchant.float_account_id,
                is_whitelisted: Boolean(
                    ussdSettings
                        .find((s: USSDSetting) => s.name === 'MERCHANT_BETA_ACCOUNTS')
                        ?.value.split(',')
                        .includes(String(account.id))
                ),
            };

            secureLocalStorage.setItem('user', JSON.stringify(user));

            return user;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status && [400, 422].includes(err.response?.status) && Boolean(err.response?.data)) {
                    if (Array.isArray(err.response?.data.errors)) throw new Error(err.response?.data.errors[0].message);

                    throw new Error(err.response?.data.errors.message);
                } else if (err.response?.status === 401 && err.response.data) {
                    throw new Error('Invalid credentials!');
                } else if (err.response?.status === 429) {
                    throw new Error('Sorry! We failed to sign you in. Please try again in a few minutes.');
                } else if (err.code === 'ERR_NETWORK') {
                    throw new Error('Network Error! Service unavailable.');
                } else {
                    throw new Error('Something went wrong!');
                }
            } else if (err instanceof Error) {
                throw new Error(err.message);
            } else {
                throw new Error('Something went wrong!');
            }
        }
    },
};

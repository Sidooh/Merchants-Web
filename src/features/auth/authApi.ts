import { CONFIG } from '@/config';
import axios from 'axios';
import { Account, ApiResponse, LoginRequest, LoginResponse } from '@/lib/types';

export const authAPI = {
    login: async (data: LoginRequest) => {
        try {
            const {
                data: { access_token: token },
            } = await axios.post<LoginResponse>(`${CONFIG.services.accounts.api.url}/users/signin`, {
                email: 'aa@a.a',
                password: '12345678',
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const {
                data: { data: account },
            } = await axios.get<ApiResponse<Account>>(
                `${CONFIG.services.accounts.api.url}/accounts/phone/${data.phone}`
            );

            if (!account) throw new Error('Invalid credentials!');

            const {
                data: { data: merchant },
            } = await axios.get(`${CONFIG.services.merchants.api.url}/merchants/account/${account.id}`);

            if (merchant.code !== data.store_no) throw new Error('Invalid credentials!');

            const user = {
                token: token,
                account_id: account.id,
                merchant_id: merchant.id,
                phone: account.phone,
                store_no: merchant.code,
            };

            localStorage.setItem('user', JSON.stringify(user));

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
            } else {
                throw new Error(err.message);
                console.error('Unexpected errors:', err);
            }
        }
    },
    logout: () => localStorage.removeItem('user'),
};

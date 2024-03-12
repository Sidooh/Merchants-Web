import { CONFIG } from '@/config';
import axios from 'axios';
import { Account, ApiResponse, LoginRequest, LoginResponse, NotifyRequest, OTPRequest } from '@/lib/types';
import { AuthState } from '@/features/auth/authSlice.ts';

export const authApi = {
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

            const user: AuthState['user'] = {
                token: token,
                account_id: account.id,
                merchant_id: merchant.id,
                name: `${merchant.first_name} ${merchant.last_name}`,
                business_name: merchant.business_name,
                phone: account.phone,
                store_no: merchant.code,
                has_otp: data.is_refresh_token,
            };

            localStorage.setItem('user', JSON.stringify(user));

            await authApi.sendOTP(user);

            return user;
        } catch (err: any) {
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
    sendOTP: async (user: AuthState['user']) => {
        // Generate a 6-digit random number
        const otp = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0');

        // Store OTP in local storage (replace with your preferred storage mechanism)
        localStorage.setItem('otp', otp);

        // Send OTP to user via SMS
        await axios.post<any, any, NotifyRequest>(
            `${CONFIG.services.notify.api.url}/notifications`,
            {
                channel: 'SMS',
                content: `Your Sidooh verification code is ${otp}.\n`,
                destination: 254110039317,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        return otp;
    },
    verifyOTP: async (data: OTPRequest) => {
        try {
            const storedOtp = localStorage.getItem('otp');

            if (!storedOtp) throw new Error('Something went wrong!');

            // Clear OTP from local storage after verification
            localStorage.removeItem('otp');

            const has_otp = storedOtp === data.pin;
            const user: AuthState['user'] = JSON.parse(String(localStorage.getItem('user')));

            localStorage.setItem('user', JSON.stringify({ ...user, has_otp }));

            return has_otp;
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status && [400, 422].includes(err.response?.status) && Boolean(err.response?.data)) {
                    if (Array.isArray(err.response?.data.errors)) throw new Error(err.response?.data.errors[0].message);

                    throw new Error(err.response?.data.errors.message);
                } else if (err.response?.status === 401 && err.response.data) {
                    throw new Error('Invalid pin!');
                } else if (err.response?.status === 429) {
                    throw new Error('Sorry! We failed to verify your pin. Please try again in a few minutes.');
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

import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { LoginRequest } from '@/lib/types.ts';
import secureLocalStorage from 'react-secure-storage';

export type AuthState = {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    message: string;

    user?: {
        account_id: number;
        is_idle?: boolean;
        business_name: string;
        has_otp?: boolean;
        is_whitelisted: boolean;
        merchant_id: number;
        name: string;
        phone: number;
        store_no: string;
        float_account_id: number;
    };
};

const initialState: AuthState = {
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    user: JSON.parse(String(secureLocalStorage.getItem('user'))),
};

export const login = createAsyncThunk('auth/login', async (user: LoginRequest, thunkAPI) => {
    try {
        return await authApi.login(user);
    } catch (err: unknown) {
        return thunkAPI.rejectWithValue((err as { message: string }).message);
    }
});

export const logout = createAction('auth/logout');

export const idle = createAction<boolean>('auth/idle');
export const whitelisted = createAction<boolean>('auth/whitelisted');
export const hasOtp = createAction<boolean>('auth/has_otp');

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = String(action.payload);
                state.user = undefined;
            })

            .addCase(logout, (state) => {
                secureLocalStorage.removeItem('user');
                secureLocalStorage.removeItem('token');

                state.user = undefined;
            })

            .addCase(hasOtp, (state, action) => {
                const user: AuthState['user'] = JSON.parse(String(secureLocalStorage.getItem('user')));

                if (user) user['has_otp'] = action.payload;

                secureLocalStorage.setItem('user', JSON.stringify(user));

                state.user = user;
            })

            .addCase(whitelisted, (state, action) => {
                const user: AuthState['user'] = JSON.parse(String(secureLocalStorage.getItem('user')));

                if (user) user['is_whitelisted'] = action.payload;

                secureLocalStorage.setItem('user', JSON.stringify(user));

                state.user = user;
            })

            .addCase(idle, (state, action) => {
                const user: AuthState['user'] = JSON.parse(String(secureLocalStorage.getItem('user')));

                if (user) user['is_idle'] = action.payload;

                secureLocalStorage.setItem('user', JSON.stringify(user));

                state.user = user;
            });
    },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;

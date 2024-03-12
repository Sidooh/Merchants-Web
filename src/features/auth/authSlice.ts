import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { LoginRequest, OTPRequest } from '@/lib/types.ts';

export type AuthState = {
    user?: {
        token: string;
        name: string;
        business_name: string;
        account_id: number;
        merchant_id: number;
        phone: number;
        store_no: number;
        has_otp?: boolean;
    };

    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
};

const initialState: AuthState = {
    user: JSON.parse(String(localStorage.getItem('user'))),
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const login = createAsyncThunk('auth/login', async (user: LoginRequest, thunkAPI) => {
    try {
        return await authApi.login(user);
    } catch (err: unknown) {
        return thunkAPI.rejectWithValue((err as { message: string }).message);
    }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data: OTPRequest, thunkAPI) => {
    try {
        return await authApi.verifyOTP(data);
    } catch (err: unknown) {
        return thunkAPI.rejectWithValue((err as { message: string }).message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    authApi.logout();
});

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

            .addCase(verifyOTP.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                if (state.user) state.user.has_otp = Boolean(action.payload);
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = String(action.payload);
                if (state.user) state.user.has_otp = false;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = undefined;
            });
    },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;

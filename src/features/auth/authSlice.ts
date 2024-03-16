import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { LoginRequest, OTPRequest } from '@/lib/types.ts';

export type AuthState = {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    message: string;

    user?: {
        account_id: number;
        business_name: string;
        has_otp?: boolean;
        merchant_id: number;
        name: string;
        phone: number;
        store_no: string;
    };
};

const initialState: AuthState = {
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    user: JSON.parse(String(localStorage.getItem('user'))),
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

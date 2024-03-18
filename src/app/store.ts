import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountsApi } from '@/services/accounts/accountsApi.ts';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { paymentsApi } from '@/services/payments/paymentsApi.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [merchantsApi.reducerPath]: merchantsApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(accountsApi.middleware, merchantsApi.middleware, paymentsApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

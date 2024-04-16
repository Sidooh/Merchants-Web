import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountsApi } from '@/services/accounts/accountsApi.ts';
import { merchantsApi } from '@/services/merchants/merchantsApi.ts';
import { paymentsApi } from '@/services/payments/paymentsApi.ts';
import { savingsApi } from '@/services/savings/savingsApi.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [merchantsApi.reducerPath]: merchantsApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
        [savingsApi.reducerPath]: savingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountsApi.middleware,
            merchantsApi.middleware,
            paymentsApi.middleware,
            savingsApi.middleware
        ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

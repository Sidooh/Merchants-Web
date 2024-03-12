import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { coreApi } from '@/services/coreApi.ts';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accountsApi } from '@/services/accountsApi.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [coreApi.reducerPath]: coreApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coreApi.middleware, accountsApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

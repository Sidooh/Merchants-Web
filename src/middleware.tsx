import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { logout } from '@/features/auth/authSlice.ts';
import { useAppDispatch } from '@/app/store.ts';

export const Middleware = {
    Guest: ({ component }: { component: ReactNode }) => {
        const { user } = useAuth();
        const location = useLocation();

        if (user?.has_otp) {
            const urlIntended: string = location.state?.from?.pathname || '/';

            return <Navigate to={urlIntended} replace />;
        }

        if (user && location.pathname !== '/otp') return <Navigate to={'/otp'} replace />;
        if (!user && location.pathname !== '/login') return <Navigate to={'/login'} replace />;

        return component;
    },
    Auth: ({ component }: { component: ReactNode }) => {
        const { user } = useAuth();
        const location = useLocation();
        const dispatch = useAppDispatch();

        if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
        if (!user.has_otp) return <Navigate to="/otp" state={{ from: location }} replace />;

        if (!user.float_account_id) dispatch(logout());

        return component;
    },
};

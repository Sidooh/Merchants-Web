import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Middleware = {
    Guest: ({ component }: { component: JSX.Element }) => {
        const { user } = useAuth();
        const location = useLocation();

        if (user) {
            const urlIntended: string = location.state?.from?.pathname || '/';

            return <Navigate to={urlIntended} replace />;
        }

        return component;
    },
    Auth: ({ component }: { component: JSX.Element }) => {
        const { user } = useAuth();
        const location = useLocation();

        if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

        return component;
    },
};

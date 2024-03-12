import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/app/store.ts';
import { login } from '@/features/auth/authSlice.ts';
import { decodeJWT } from '@/lib/utils.ts';
import moment from 'moment';

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
        const dispatch = useAppDispatch();

        if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

        const expiresAt = moment.unix(decodeJWT(user.token).exp);
        const expiresIn = expiresAt.diff(moment(), 'minutes');

        console.info(`Session expires in: ${expiresIn} minutes`);

        if (moment().add(3, 'm').isAfter(expiresAt)) {
            dispatch(login({ phone: String(user.phone), store_no: String(user.store_no) }));

            // return <Navigate to="/login" state={{ from: location }} replace />;
        }

        return component;
    },
};

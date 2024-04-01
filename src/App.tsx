import { Route, Routes } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout.tsx';
import { Middleware } from '@/middleware';
import MainLayout from '@/layouts/MainLayout.tsx';
import Login from '@/pages/auth/Login.tsx';
import Default from '@/pages/default/Default.tsx';
import OTP from '@/pages/auth/OTP.tsx';
import NotFound from '@/pages/errors/NotFound.tsx';
import ConfirmPin from '@/pages/auth/ConfirmPin.tsx';

function App() {
    return (
        <Routes>
            <Route element={<GuestLayout />}>
                <Route path={'/login'} element={<Middleware.Guest component={<Login />} />} />
                <Route path={'/otp'} element={<Middleware.Guest component={<OTP />} />} />
                <Route path={'/pin-confirmation'} element={<Middleware.Idle component={<ConfirmPin />} />} />
            </Route>

            <Route element={<Middleware.Auth component={<MainLayout />} />}>
                <Route index element={<Default />} />
            </Route>

            <Route path={'*'} element={<NotFound />} />
        </Routes>
    );
}

export default App;

import { Route, Routes } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout.tsx';
import { Middleware } from '@/middleware';
import MainLayout from '@/layouts/MainLayout.tsx';
import Login from '@/pages/auth/Login.tsx';
import Default from '@/pages/default/Default.tsx';
import OTP from '@/pages/auth/OTP.tsx';
import NotFound from '@/pages/errors/NotFound.tsx';
import ConfirmPin from '@/pages/auth/ConfirmPin.tsx';
import MpesaFloatPurchase from '@/pages/mpesa-float/MpesaFloatPurchase.tsx';
import VoucherTopUp from '@/pages/voucher-top-up/VoucherTopUp.tsx';
import Onboarding from '@/pages/auth/Onboarding/Onboarding.tsx';

function App() {
    return (
        <Routes>
            <Route element={<GuestLayout />}>
                <Route path={'/login'} element={<Middleware.Guest component={<Login />} />} />
                <Route path={'/onboarding'} element={<Middleware.Guest component={<Onboarding />} />} />
                <Route path={'/otp'} element={<Middleware.Guest component={<OTP />} />} />
                <Route path={'/pin-confirmation'} element={<Middleware.Idle component={<ConfirmPin />} />} />
            </Route>

            <Route element={<Middleware.Auth component={<MainLayout />} />}>
                <Route index element={<Default />} />
                <Route path={'/buy-mpesa-float'} element={<MpesaFloatPurchase />} />
                <Route path={'/voucher-top-up'} element={<VoucherTopUp />} />
            </Route>

            <Route path={'*'} element={<NotFound />} />
        </Routes>
    );
}

export default App;

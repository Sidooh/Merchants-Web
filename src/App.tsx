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
import MyAccount from '@/pages/my-account/MyAccount.tsx';
import Waitlist from '@/pages/auth/Waitlist.tsx';
import StagePhone from '@/pages/auth/Onboarding/StagePhone.tsx';
import StageKYC from '@/pages/auth/Onboarding/StageKYC.tsx';
import StageInviteCode from '@/pages/auth/Onboarding/StageInviteCode.tsx';
import VoucherTransfer from '@/pages/voucher-transfer/VoucherTransfer.tsx';

function App() {
    return (
        <Routes>
            <Route element={<GuestLayout />}>
                <Route path={'/login'} element={<Middleware.Guest component={<Login />} />} />

                <Route path={'/onboarding/phone'} element={<Middleware.Guest component={<StagePhone />} />} />
                <Route path={'/onboarding/invite'} element={<Middleware.Guest component={<StageInviteCode />} />} />
                <Route path={'/onboarding/kyc'} element={<Middleware.Guest component={<StageKYC />} />} />

                <Route path={'/otp'} element={<Middleware.Guest component={<OTP />} />} />
                <Route path={'/waitlist'} element={<Middleware.Guest component={<Waitlist />} />} />
                <Route path={'/pin-confirmation'} element={<Middleware.Idle component={<ConfirmPin />} />} />
            </Route>

            <Route element={<Middleware.Auth component={<MainLayout />} />}>
                <Route index element={<Default />} />
                <Route path={'/buy-mpesa-float'} element={<MpesaFloatPurchase />} />
                <Route path={'/voucher-top-up'} element={<VoucherTopUp />} />
                <Route path={'/share-voucher'} element={<VoucherTransfer />} />
                <Route path={'/my-account'} element={<MyAccount />} />
            </Route>

            <Route path={'*'} element={<NotFound />} />
        </Routes>
    );
}

export default App;

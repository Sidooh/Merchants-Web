import { Route, Routes } from 'react-router-dom';
import GuestLayout from '@/layouts/GuestLayout.tsx';
import { Middleware } from '@/middleware';
import MainLayout from '@/layouts/MainLayout.tsx';
import Login from '@/pages/auth/Login.tsx';
import Default from '@/pages/default/Default.tsx';

function App() {
    return (
        <Routes>
            <Route element={<GuestLayout />}>
                <Route path={'/login'} element={<Middleware.Guest component={<Login />} />} />
            </Route>

            <Route element={<Middleware.Auth component={<MainLayout />} />}>
                <Route index element={<Default />} />
            </Route>
        </Routes>
    );
}

export default App;

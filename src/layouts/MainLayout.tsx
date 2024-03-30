import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import ErrorFallback from '@/components/errors/ErrorFallback';
import PageLoader from '@/components/loaders/PageLoader';
import Header from '@/layouts/components/Header.tsx';
import Footer from '@/layouts/components/Footer.tsx';
import IdleTimerAlert from '@/layouts/components/IdleTimerAlert.tsx';

const MainLayout = () => {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        setTimeout(() => {
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);

                if (element) element.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        }, 0);
    }, [hash]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col space-y-1">
            <Header />

            <div className="px-3 lg:px-0 lg:container min-h-screen relative pb-6">
                <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>

                <IdleTimerAlert />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;

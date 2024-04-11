import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import ErrorFallback from '@/components/errors/ErrorFallback';
import PageLoader from '@/components/loaders/PageLoader';
import Header from '@/layouts/components/Header.tsx';
import Footer from '@/layouts/components/Footer.tsx';
import IdleTimerAlert from '@/layouts/components/IdleTimerAlert.tsx';
import { Sidebar } from '@/layouts/components/Sidebar.tsx';

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

            <div
                className="px-3 2xl:px-0 lg:container lg:grid gap-12 md:grid-cols-[200px_1fr] flex-1 min-h-screen relative pb-6">
                <aside className={'hidden md:block'}>
                    <Sidebar />
                </aside>

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

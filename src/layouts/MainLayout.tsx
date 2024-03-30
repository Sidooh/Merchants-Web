import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import ErrorFallback from '@/components/errors/ErrorFallback';
import PageLoader from '@/components/loaders/PageLoader';
import Header from '@/layouts/components/Header.tsx';
import Footer from '@/layouts/components/Footer.tsx';
import { useIdleTimer } from 'react-idle-timer';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import PinConfirmationForm from '@/pages/default/components/PinConfirmationForm.tsx';
import { logout } from '@/features/auth/authSlice.ts';
import { useAppDispatch } from '@/app/store.ts';

const timeout = 120_000;
const promptBeforeIdle = Math.ceil(timeout / 3);

const IdleTimerAlert = () => {
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [openPinConfirmation, setOpenPinConfirmation] = useState<boolean>(false);
    const [remaining, setRemaining] = useState<number>(timeout);

    const { getRemainingTime, activate, isIdle, pause, start } = useIdleTimer({
        onActive: () => {
            setOpen(false);
            if (isIdle()) start();
        },
        onIdle: () => {
            pause();
            setOpenPinConfirmation(true);
        },
        onPrompt: () => setOpen(true),
        promptBeforeIdle,
        throttle: 500,
        timeout,
    });

    const handleSignOut = () => dispatch(logout());

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
    });

    return (
        <>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Your session is about to expire.</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sidooh enforces automatic sign out after a period of inactivity on the Merchant's web App.
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            Do you want to stay signed in?{' '}
                            <b className={'text-primary'}>
                                <u>{remaining}s</u>
                            </b>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleSignOut}>Sign out now </AlertDialogCancel>
                        <AlertDialogAction onClick={activate}>Stay signed in</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PinConfirmationForm
                open={openPinConfirmation}
                onConfirmed={() => {
                    activate();
                    setOpenPinConfirmation(false);
                }}
                canCancel={false}
            />
        </>
    );
};

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

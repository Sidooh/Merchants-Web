import { useAppDispatch } from '@/app/store.ts';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { idle, logout } from '@/features/auth/authSlice.ts';
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

const timeout = 10_000;
const promptBeforeIdle = Math.ceil(timeout / 3);

const IdleTimerAlert = () => {
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);
    const [remaining, setRemaining] = useState<number>(timeout);

    const { getRemainingTime, activate } = useIdleTimer({
        crossTab: true,
        onActive: () => setOpen(false),
        onIdle: () => dispatch(idle(true)),
        onPrompt: () => setOpen(true),
        promptBeforeIdle,
        syncTimers: 200,
        throttle: 500,
        timeout,
    });

    const handleSignOut = () => dispatch(logout());

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => clearInterval(interval);
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Your session is about to expire.</AlertDialogTitle>
                    <AlertDialogDescription>
                        Sidooh enforces automatic sign out after a period of inactivity on the Merchants web App.
                    </AlertDialogDescription>
                    <AlertDialogDescription>
                        Do you want to stay signed in?{' '}
                        <b className={'text-primary'}>
                            <u>{remaining}s</u>
                        </b>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleSignOut}>Sign out </AlertDialogCancel>
                    <AlertDialogAction onClick={activate}>Stay signed in</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default IdleTimerAlert;

import { SerializedError } from '@reduxjs/toolkit';
import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { cn, isErrorWithMessage, isFetchBaseQueryError } from '@/lib/utils';
import { MdError } from 'react-icons/md';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

interface ServerErrorProps extends HTMLAttributes<HTMLButtonElement> {
    error?: FetchBaseQueryError | SerializedError | string;
}

const AlertError = forwardRef<HTMLDivElement, ServerErrorProps>(({ error, className }, ref) => {
    const [message, setMessage] = useState('...na sina fom shida ni gani🤡');

    useEffect(() => {
        if (error) {
            if (isFetchBaseQueryError(error)) {
                if ('data' in error) {
                    if ('message' in (error.data as object)) {
                        setMessage((error as { data: { message: string } }).data.message);
                    }
                }
                if (error.status === 'FETCH_ERROR') {
                    setMessage('...Nikama server iko down😞 please try again later.');
                }
            } else if (typeof error === 'string') {
                setMessage(error);
            } else if (isErrorWithMessage(error)) {
                setMessage(error.message);
            } else {
                setMessage('...na sina fom shida ni gani lakini jaribu tu tena.🤡');
            }
        }
    }, [error]);

    if (!error) return <></>;

    return (
        <Alert ref={ref} className={cn('border-dashed border-red-600 p-3 mb-2', { className })}>
            <AlertTitle className={'text-red-600 flex items-center gap-1'}>
                <MdError /> Makosa ilifanyika! 🌚
            </AlertTitle>
            <AlertDescription className={'text-red-600'}>---: {message}</AlertDescription>
        </Alert>
    );
});

AlertError.displayName = 'AlertError';

export default AlertError;

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CONFIG } from '@/config';
import { useEffect, useState } from 'react';
import { USSDSetting } from '@/lib/types/models.ts';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '@/hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { whitelisted } from '@/features/auth/authSlice.ts';
import { useAppDispatch } from '@/app/store.ts';

const Waitlist = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data: ussdSettings } = await axios.get<any, AxiosResponse<USSDSetting[]>>(
                `${CONFIG.services.ussd.api.url}/settings`
            );

            const betaAccounts = ussdSettings
                .find((s: USSDSetting) => s.name === 'MERCHANT_BETA_ACCOUNTS')
                ?.value.split(',');

            if (betaAccounts?.includes(String(user?.account_id))) {
                dispatch(whitelisted(true));
                navigate('/');
            }

            setIsLoading(false);
        };

        fetchSettings();
    }, []);

    if (isLoading) return <Skeleton className={'lg:max-w-lg lg:min-w-[32rem] h-80'} />;

    return (
        <Card className={'p-5 h-full lg:max-w-lg lg:min-w-[30rem] relative shadow-xl border-0'}>
            <CardHeader>
                <CardTitle className={'text-end text-primary'}>
                    Waitlist
                    <hr className="mt-3 w-1/2 ms-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <b className={'text-lg'}>Congratulations!🎉</b>
                <p>You have joined the waiting list. </p>
                <p>
                    Please <b>stay tuned.</b> We shall inform you once you are cleared to start <b>saving</b> as a new{' '}
                    <b>Sidooh Merchant.</b>
                </p>
            </CardContent>
            <CardFooter className={'flex-col'}>
                <div className="relative mt-4 w-3/4">
                    <hr className="bg-300" />
                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">🌟</div>
                </div>
                <div className="mt-2">
                    <div className="text-center text-stone-400">
                        <i>
                            <small>{CONFIG.tagline}</small>
                        </i>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default Waitlist;

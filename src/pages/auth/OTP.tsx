import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { VerifyOTPRequest } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CONFIG } from '@/config';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp.tsx';
import { ReloadIcon } from '@radix-ui/react-icons';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { cn, toast } from '@/lib/utils.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/store.ts';
import { hasOtp, reset } from '@/features/auth/authSlice.ts';
import { BiRotateLeft } from 'react-icons/bi';
import AlertError from '@/components/errors/AlertError.tsx';
import { useGenerateOTPMutation, useVerifyOTPMutation } from '@/services/accounts/authEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';

const formSchema = yup.object({
    phone: yup.string().required('Phone is required.'),
    otp: yup.string().required('OTP is required'),
});

const OTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const [generateOtp, { isLoading: isLoadingOtp }] = useGenerateOTPMutation();
    const [verifyOTP] = useVerifyOTPMutation();

    const [phone, setPhone] = useState(location.state?.phone || user?.phone);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(3);

    const form = useForm<yup.InferType<typeof formSchema>>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            phone: phone,
        },
    });

    useEffect(() => {
        setPhone(location.state?.phone || user?.phone);

        if (!phone) navigate('/login');
    }, [location, user]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer(timer - 1);
            if (timer === 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit: SubmitHandler<VerifyOTPRequest> = async (data) => {
        data.otp = Number(data.otp);

        verifyOTP(data)
            .unwrap()
            .then(() => {
                dispatch(reset());

                if (user) {
                    dispatch(hasOtp(true));

                    navigate('/');
                } else {
                    toast({ titleText: 'Verified!' });

                    navigate(location.state.next, { state: location.state });
                }
            })
            .catch((err) => {
                if (err.status === 400) setError('Invalid OTP!');
            });
    };

    const resendOtp = () => {
        if (timer === 0) {
            form.reset();

            setTimer(60);

            generateOtp({ phone });
        }
    };

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[30rem] relative shadow-xl border-0'}>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="py-5 space-y-3">
                                        <FormLabel className={'font-semibold leading-none tracking-tight text-md'}>
                                            One-Time Password
                                        </FormLabel>
                                        <hr className="lg:my-3 w-1/2" />
                                        <FormDescription>
                                            Please enter the one-time password sent to your phone.
                                        </FormDescription>
                                        <AlertError error={error} className={'mt-4'} />
                                    </div>
                                    <FormControl>
                                        <InputOTP
                                            autoFocus
                                            onComplete={form.handleSubmit(handleSubmit)}
                                            maxLength={6}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            render={({ slots }) => (
                                                <>
                                                    <InputOTPGroup>
                                                        {slots.slice(0, 3).map((slot, index) => (
                                                            <InputOTPSlot key={index} {...slot} />
                                                        ))}{' '}
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        {slots.slice(3).map((slot, index) => (
                                                            <InputOTPSlot key={index + 3} {...slot} />
                                                        ))}
                                                    </InputOTPGroup>
                                                </>
                                            )}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className={'text-sm flex gap-1'}>
                            <small className={'text-muted-foreground'}>Didn't get the code? </small>
                            <small
                                className={cn('flex items-center gap-1 underline', {
                                    'text-gray-400': timer > 0,
                                    'cursor-pointer': timer === 0,
                                })}
                                onClick={resendOtp}
                            >
                                {isLoadingOtp ? (
                                    <>
                                        Resending... <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Resend</span>
                                        {timer > 0 ? (
                                            <span className={'text-red-500 rounded-full'}>{timer}s</span>
                                        ) : (
                                            <BiRotateLeft className="h-4 w-4" />
                                        )}
                                    </>
                                )}
                            </small>
                        </div>
                    </form>
                </Form>
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

export default OTP;

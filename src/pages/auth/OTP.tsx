import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { OTPRequest } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp.tsx';
import { ReloadIcon } from '@radix-ui/react-icons';
import { AiOutlineLogin } from 'react-icons/ai';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { toast } from '@/lib/utils.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth.ts';
import { useAppDispatch } from '@/app/store.ts';
import { reset, verifyOTP } from '@/features/auth/authSlice.ts';
import { BiRotateLeft } from 'react-icons/bi';
import { authApi } from '@/features/auth/authApi.ts';

const formSchema = yup.object({
    pin: yup.string().min(6, 'Your one-time password must be 6 digits.').required(),
});

const OTP = () => {
    const { user, isError, isSuccess, isLoading, message } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [timer, setTimer] = useState(5);
    const [isLoadingOTP, setIsLoadingOTP] = useState(false);

    const form = useForm<OTPRequest>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            pin: '',
        },
    });

    useEffect(() => {
        if (isError) toast({ titleText: message, icon: 'error' });
        if (isSuccess && user?.has_otp) {
            toast({ titleText: 'OTP Verified!', text: `Welcome back ${user?.name}` });

            navigate('/');
        }

        dispatch(reset());
    }, [isSuccess, isError]);

    const resendOTP = async () => {
        setIsLoadingOTP(true);
        setTimer(4);

        try {
            await authApi.sendOTP(user!);

            toast({ titleText: 'A new OTP has been sent to your phone.' });

            setIsLoadingOTP(false);
        } catch (err: any) {
            toast({ titleText: 'Something went wrong. Kindly contact admin.', icon: 'error' });

            setIsLoadingOTP(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer(timer - 1);
            if (timer === 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit: SubmitHandler<OTPRequest> = async (data) => dispatch(verifyOTP(data));

    return (
        <Card className={'p-5 h-full max-w-3xl min-w-[30rem] relative shadow-xl border-0'}>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="py-6">
                                        <FormLabel className={'font-semibold leading-none tracking-tight text-md'}>
                                            One-Time Password
                                        </FormLabel>
                                        <hr className="w-1/2" />
                                    </div>
                                    <FormControl>
                                        <InputOTP
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
                                    <FormDescription>
                                        Please enter the one-time password sent to your phone.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                type={'submit'}
                                disabled={isLoading || !form.formState.isValid}
                                className={'col-span-2'}
                            >
                                {isLoading ? (
                                    <>
                                        Verifying... <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Verify <AiOutlineLogin className="ms-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            <Button
                                variant={'ghost'}
                                className={'gap-2 items-center'}
                                disabled={timer > 0}
                                onClick={resendOTP}
                            >
                                {isLoadingOTP ? (
                                    <>
                                        Resending... <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Resend</span>
                                        {timer > 0 ? (
                                            <small
                                                className={
                                                    'border-s-2 border-e-2 border-red-500 p-1 w-7 h-7 rounded-full'
                                                }
                                            >
                                                {timer}s
                                            </small>
                                        ) : (
                                            <BiRotateLeft className="ms-2 h-4 w-4" />
                                        )}
                                    </>
                                )}
                            </Button>
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

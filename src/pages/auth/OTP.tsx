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
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth.ts';
import { useAppDispatch } from '@/app/store.ts';
import { reset, verifyOTP } from '@/features/auth/authSlice.ts';

const formSchema = yup.object({
    pin: yup.string().min(6, 'Your one-time password must be 6 digits.').required(),
});

const OTP = () => {
    const { user, isError, isSuccess, isLoading, message } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

                        <Button
                            type={'submit'}
                            disabled={isLoading || !form.formState.isValid}
                            className={'w-full bg-primary'}
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

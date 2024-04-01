import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PinConfirmationRequest } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CONFIG } from '@/config';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp.tsx';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useLocation, useNavigate } from 'react-router-dom';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { useCheckPinMutation } from '@/services/accounts/accountsEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { idle } from '@/features/auth/authSlice.ts';
import { useAppDispatch } from '@/app/store.ts';

const formSchema = yup.object({
    account_id: yup.number().integer().required(),
    pin: yup.string().length(4, 'Must be 4 digits').required(),
});

const ConfirmPin = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [checkPin, { isLoading }] = useCheckPinMutation();

    const form = useForm<PinConfirmationRequest>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            account_id: user?.account_id,
            pin: '',
        },
    });

    const handleSubmit: SubmitHandler<PinConfirmationRequest> = async (values) => {
        try {
            if (await checkPin(values).unwrap()) {
                dispatch(idle(false));

                navigate(location.state?.from?.pathname || '/');

                form.resetField('pin');
            }
        } catch (e) {
            form.setError('pin', { type: 'validate', message: 'Invalid PIN' });
            form.setValue('pin', '');
        }
    };

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[30rem] relative shadow-xl border-0'}>
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
                                            PIN Confirmation
                                        </FormLabel>
                                        <hr className="lg:my-3 w-1/2" />
                                        <FormDescription>Please enter your Sidooh PIN to continue.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <InputOTP
                                            autoFocus
                                            onComplete={form.handleSubmit(handleSubmit)}
                                            maxLength={4}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            render={({ slots }) => (
                                                <>
                                                    <InputOTPGroup>
                                                        {slots.map((slot, index) => (
                                                            <InputOTPSlot key={index} {...slot} />
                                                        ))}{' '}
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

                        <SubmitButton
                            disabled={isLoading || !form.formState.isValid}
                            isLoading={isLoading}
                            text={'Confirm'}
                            loadingText={'Confirming...'}
                            icon={CheckCircledIcon}
                        />
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

export default ConfirmPin;

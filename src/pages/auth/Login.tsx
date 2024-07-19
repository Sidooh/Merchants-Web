import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginRequest } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { login, reset } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';
import * as yup from 'yup';
import { AiOutlineLogin } from 'react-icons/ai';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { CONFIG } from '@/config';
import { SAFARICOM_REGEX } from '@/constants';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useGenerateOTPMutation } from '@/services/accounts/authEndpoints.ts';
import { toast } from 'sonner';

const formSchema = yup.object({
    phone: yup.string().matches(SAFARICOM_REGEX, { message: 'Invalid phone number' }).required('Phone is required.'),
    store_no: yup.string().max(20).required('Sidooh Store number is required.'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, isError, isSuccess, isLoading, message } = useAuth();

    const [generateOtp] = useGenerateOTPMutation();

    const form = useForm<LoginRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
        defaultValues: {
            phone: '',
            store_no: '',
        },
    });

    const handleSubmit: SubmitHandler<LoginRequest> = async (values) => {
        const acc = await dispatch(login(values)).unwrap();

        if (!acc.is_whitelisted) {
            navigate('/waitlist');
        } else if (acc?.account_id) {
            generateOtp({ phone: form.getValues('phone') });
        }
    };

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess) navigate('/otp');

        dispatch(reset());
    }, [user, isError, isSuccess, message]);

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[30rem] relative shadow-xl border-0'}>
            <CardHeader>
                <CardTitle className={'text-end text-primary'}>
                    Sign In
                    <hr className="mt-3 w-1/2 ms-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="grid grid-cols-1 gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter phone number"
                                            type={'tel'}
                                            {...form.register('phone')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="store_no"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Sidooh store number"
                                            type={'number'}
                                            {...form.register('store_no')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SubmitButton
                            className={'w-full'}
                            text={'Sign In'}
                            isLoading={isLoading}
                            loadingText={'Signing In...'}
                            disabled={isLoading || !form.formState.isValid}
                            icon={AiOutlineLogin}
                        />
                        <small>
                            Haven't onboarded yet?{' '}
                            <Link to={'/onboarding/phone'} className={'font-semibold text-primary underline'}>
                                Onboard
                            </Link>
                        </small>
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

export default Login;

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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from '@/lib/utils';
import { CONFIG } from '@/config';
import { SAFARICOM_REGEX } from '@/constants';
import SubmitButton from '@/components/common/SubmitButton.tsx';

const formSchema = yup.object({
    phone: yup.string().matches(SAFARICOM_REGEX, { message: 'Invalid phone number' }).required('Phone is required.'),
    store_no: yup.string().max(20).required('Sidooh Store number is required.'),
});

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useAuth();
    const form = useForm<LoginRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
        defaultValues: {
            phone: '',
            store_no: '',
        },
    });

    const handleSubmit: SubmitHandler<LoginRequest> = (values) => dispatch(login(values));

    useEffect(() => {
        if (isError) toast({ titleText: message, icon: 'error' });

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[30rem] relative shadow-xl border-0'}>
            <CardHeader>
                <CardTitle className={'text-end text-primary'}>
                    Welcome
                    <hr className="mt-3 w-1/2 ms-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-5 w-full" onSubmit={form.handleSubmit(handleSubmit)}>
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
                            disabled={isLoading || !form.formState.isValid}
                            icon={AiOutlineLogin}
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

export default Login;

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginRequest } from '@/lib/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { login, reset } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/store';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { AiOutlineLogin } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { toast } from '@/lib/utils';
import { CONFIG } from '@/config';

const formSchema = yup.object({
    phone: yup.string().max(100).required('Phone is required.'),
    store_no: yup.string().max(20).required('Store code is required.'),
});

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token, isError, isSuccess, isLoading, message } = useAuth();
    const form = useForm<LoginRequest>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            phone: '',
            store_no: '',
        },
    });

    const handleSubmit: SubmitHandler<LoginRequest> = (values) => dispatch(login(values));

    useEffect(() => {
        if (isError) toast({ titleText: message, icon: 'error' });
        if (isSuccess || token) navigate('/');

        dispatch(reset());
    }, [token, isError, isSuccess, message, navigate, dispatch]);

    return (
        <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className={'p-5 h-full max-w-3xl min-w-[30rem] relative shadow-xl border-0'}>
                    <CardHeader>
                        <CardTitle className={'text-end text-primary'}>
                            Welcome Back
                            <hr className="mt-3 w-1/2 ms-auto" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={() => (
                                    <FormItem>
                                        <Input
                                            placeholder="Enter phone number"
                                            type={'tel'}
                                            {...form.register('phone')}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="store_no"
                                render={() => (
                                    <FormItem>
                                        <Input
                                            placeholder="Enter store number"
                                            type={'number'}
                                            {...form.register('store_no')}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className={'flex-col'}>
                        <Button type={'submit'} disabled={isLoading || !form.formState.isValid}
                                className={'w-full bg-primary'}>
                            {isLoading ? (
                                <>
                                    Authenticating... <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                <>
                                    Sign In <AiOutlineLogin className="ms-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <div className={'mt-5'}>
                            <div className="relative mt-4">
                                <hr className="bg-300" />
                                <div className="divider-content-center">🌟</div>
                            </div>
                            <div className="mt-2">
                                <div className="text-center text-stone-400">
                                    <i>
                                        <small>{CONFIG.tagline}</small>
                                    </i>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default Login;

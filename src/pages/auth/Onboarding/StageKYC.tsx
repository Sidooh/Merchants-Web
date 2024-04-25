import SubmitButton from '@/components/common/SubmitButton.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { AiOutlineLogin } from 'react-icons/ai';
import { CONFIG } from '@/config.ts';
import { CreateMerchantRequest, UpdateKybRequest } from '@/lib/types.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/utils.ts';
import { useCreateMerchantMutation, useUpdateKybMutation } from '@/services/merchants/merchantsEndpoints.ts';
import { useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import AlertError from '@/components/errors/AlertError.tsx';

const formSchema = yup.object({
    account_id: yup.number().integer().required(),
    first_name: yup.string().required('First name is required.'),
    last_name: yup.string().required('Last name is required.'),
    id_number: yup.string().min(8, 'Must be at least 8 digits.').matches(/^\d+$/).required('ID number is required.'),
    business_name: yup.string().required('Business name is required.'),
    landmark: yup.string().max(20).required('Land mark is required.'),
});

const StageKYC = () => {
    const navigate = useNavigate();

    const [createMerchant, { isLoading: createLoading, error: createError }] = useCreateMerchantMutation();
    const [updateKyb, { isLoading: updateLoading, error: updateError }] = useUpdateKybMutation();

    const form = useForm<CreateMerchantRequest & UpdateKybRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
    });

    const handleSubmit: SubmitHandler<CreateMerchantRequest & UpdateKybRequest> = async (values) => {
        const merchant = await createMerchant({ ...values, id_number: String(values.id_number) }).unwrap();
        await updateKyb({ ...values, merchant_id: merchant.id }).unwrap();

        navigate('/waitlist');

        /*toast({
            title: 'Onboarding Successful!',
            text: 'We have sent you an SMS with your new Sidooh store number. Use it to sign in.',
            toast: false,
            showConfirmButton: true,
            timer: undefined,
            position: 'center',
        });*/

        toast({ titleText: 'Onboarding Successful!' });

        secureLocalStorage.removeItem('acc');
    };

    useEffect(() => {
        const id = secureLocalStorage.getItem('acc');

        if (!id) navigate('/onboarding/phone');

        form.setValue('account_id', Number(id));
    }, []);

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[35rem] relative shadow-xl border-0'}>
            <CardHeader>
                <CardTitle className={'text-end text-primary'}>
                    Onboarding
                    <hr className="mt-3 w-1/2 ms-auto" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AlertError error={createError || updateError} className={'mt-4'} />
                <Form {...form}>
                    <form className="grid grid-cols-2 gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={() => (
                                <FormItem className={'col-span-2 lg:col-span-1'}>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...form.register('first_name')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={() => (
                                <FormItem className={'col-span-2 lg:col-span-1'}>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...form.register('last_name')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="id_number"
                            render={() => (
                                <FormItem className={'col-span-2'}>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter national ID number"
                                            type={'number'}
                                            {...form.register('id_number')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="business_name"
                            render={() => (
                                <FormItem className={'col-span-2 lg:col-span-1'}>
                                    <FormControl>
                                        <Input placeholder="Enter business name" {...form.register('business_name')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="landmark"
                            render={() => (
                                <FormItem className={'col-span-2 lg:col-span-1'}>
                                    <FormControl>
                                        <Input placeholder="Enter landmark" {...form.register('landmark')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SubmitButton
                            className={'col-span-2'}
                            text={'Onboard'}
                            isLoading={createLoading || updateLoading}
                            disabled={createLoading || updateLoading || !form.formState.isValid}
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

export default StageKYC;

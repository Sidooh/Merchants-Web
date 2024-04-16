import SubmitButton from '@/components/common/SubmitButton.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SAFARICOM_REGEX } from '@/constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { CONFIG } from '@/config.ts';
import { FaCheck } from 'react-icons/fa6';
import { useLazyGetAccountByPhoneQuery } from '@/services/accounts/accountsEndpoints.ts';
import { useGenerateOTPMutation } from '@/services/accounts/authEndpoints.ts';
import { OnboardingStage } from '@/lib/enums.ts';
import { Dispatch, SetStateAction } from 'react';
import { Account } from '@/lib/types.ts';
import { useLazyGetMerchantByAccountQuery } from '@/services/merchants/merchantsEndpoints.ts';
import { toast } from '@/lib/utils.ts';

type Request = { phone: string };

type StagePhoneProps = {
    setStage: Dispatch<SetStateAction<OnboardingStage>>;
    setAccount: Dispatch<SetStateAction<Account | undefined>>;
};

const StagePhone = ({ setStage, setAccount }: StagePhoneProps) => {
    const navigate = useNavigate();

    const [getAccountByPhone, { isLoading }] = useLazyGetAccountByPhoneQuery();
    const [getMerchantByAccount, { isLoading: isLoadingMerchant }] = useLazyGetMerchantByAccountQuery();
    const [generateOtp] = useGenerateOTPMutation();

    const form = useForm<Request>({
        mode: 'onBlur',
        resolver: yupResolver(
            yup.object({
                phone: yup
                    .string()
                    .matches(SAFARICOM_REGEX, { message: 'Invalid phone number' })
                    .required('Phone is required.'),
            })
        ),
    });

    const handleSubmit: SubmitHandler<Request> = async (values) => {
        getAccountByPhone(values.phone)
            .unwrap()
            .then((acc) => {
                getMerchantByAccount(acc.id)
                    .unwrap()
                    .then(async () => {
                        toast({
                            text: 'You already have a merchant account on Sidooh. You may proceed to sign in.',
                            toast: false,
                            position: 'center',
                            showConfirmButton: true,
                        });

                        navigate('/login');
                    })
                    .catch((err) => {
                        if (err.status === 404) setAccount(acc);
                    });
            })
            .catch((err) => {
                if (err.status === 404) {
                    generateOtp(values);
                    navigate('/otp', { state: { phone: values.phone, next: '/onboarding' } });
                    setStage(OnboardingStage.INVITE_CODE);
                }
            });
    };

    return (
        <Card className={'p-5 h-full lg:max-w-3xl lg:min-w-[30rem] relative shadow-xl border-0'}>
            <CardHeader>
                <CardTitle className={'text-end text-primary'}>
                    Onboarding
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
                        <SubmitButton
                            className={'w-full'}
                            text={'Verify'}
                            isLoading={isLoading || isLoadingMerchant}
                            disabled={isLoading || isLoadingMerchant || !form.formState.isValid}
                            icon={FaCheck}
                        />
                        <small>
                            Already have an account?{' '}
                            <Link to={'/login'} className={'font-semibold text-primary underline'}>
                                Sign In
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

export default StagePhone;

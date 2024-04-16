import SubmitButton from '@/components/common/SubmitButton.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '@/config.ts';
import { AiOutlineLogin } from 'react-icons/ai';
import { OnboardingStage } from '@/lib/enums.ts';
import { useCreateAccountMutation } from '@/services/accounts/accountsEndpoints.ts';

type Request = { invite_code: string };

type StageInviteCodeProps = {
    phone: string;
    setStage: Dispatch<SetStateAction<OnboardingStage>>;
};

const StageInviteCode = ({ setStage, phone }: StageInviteCodeProps) => {
    const [createAccount, { isLoading }] = useCreateAccountMutation();

    const form = useForm<Request>({
        mode: 'onBlur',
        resolver: yupResolver(
            yup.object({
                invite_code: yup.string().required('Invite code is required.'),
            })
        ),
    });

    const handleSubmit: SubmitHandler<Request> = async (values) => {
        await createAccount({ phone, invite_code: values.invite_code }).unwrap();

        setStage(OnboardingStage.KYC);
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
                            name="invite_code"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter invite code" {...form.register('invite_code')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SubmitButton
                            className={'w-full'}
                            text={'Continue'}
                            isLoading={isLoading}
                            disabled={isLoading || !form.formState.isValid}
                            icon={AiOutlineLogin}
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

export default StageInviteCode;

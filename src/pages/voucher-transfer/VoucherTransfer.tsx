import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.tsx';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input.tsx';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/hooks/useAuth.ts';
import * as yup from 'yup';
import { SAFARICOM_REGEX } from '@/constants';
import { useTransferFloatMutation } from '@/services/merchants/merchantsEndpoints.ts';
import { useState } from 'react';
import ShareVoucherConfirmationDialogue from '@/components/confirmation-dialogues/ShareVoucherConfirmationDialogue.tsx';
import { toast } from 'sonner';
import { useGetFloatAccountQuery } from '@/services/payments/floatEndpoints.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { currencyFormat } from '@/lib/utils.ts';

const formSchema = yup.object({
    amount: yup.number().min(50).typeError('Please enter amount').required('Amount is required.'),
    phone: yup.string().matches(SAFARICOM_REGEX, { message: 'Invalid phone number' }).required('Phone is required.'),
});

export type VoucherTransferFormRequest = yup.InferType<typeof formSchema>;

const VoucherTransfer = () => {
    const [openConfirmationAlert, setOpenTransactionConfirmationAlert] = useState(false);

    const { user } = useAuth();
    const { data: floatAccount, isLoading: isLoadingFloatAccount } = useGetFloatAccountQuery(user!.float_account_id);
    const [sendTransferRequest, { isLoading }] = useTransferFloatMutation();

    const form = useForm<VoucherTransferFormRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
        defaultValues: {
            phone: '',
        },
    });

    const handleTransactionConfirmed = (destinationMerchantId: number) => {
        const data = formSchema.cast(form.getValues());

        sendTransferRequest({
            merchant_id: user!.merchant_id,
            amount: data.amount,
            account: String(destinationMerchantId),
        })
            .unwrap()
            .then(() => {
                toast.success('Transfer Initiated Successfully!');

                form.reset();
            })
            .catch(() => toast.error('Something went wrong. Please retry!'));
    };

    const handleSubmit: SubmitHandler<VoucherTransferFormRequest> = (values) => {
        if (values.phone.slice(-9) === String(user?.phone).slice(-9)) return toast.warning('Cannot share to self.🌚');
        if (values.amount > (floatAccount?.balance || 0)) return toast.warning('Insufficient voucher balance.');

        setOpenTransactionConfirmationAlert(true);
    };

    if (isLoadingFloatAccount) return <Skeleton className={'h-[20rem]'} />;

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Share Your Sidooh Voucher</CardTitle>
                            <CardDescription>
                                Enter amount and the phone number of a Sidooh Merchant to share with.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid lg:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g: 200,000"
                                                type={'number'}
                                                min={50}
                                                max={floatAccount?.balance}
                                                {...form.register('amount')}
                                            />
                                        </FormControl>
                                        <FormDescription className={'flex justify-between'}>
                                            <small>
                                                Min: <b>KES 50</b>
                                            </small>
                                            <small className={'text-yellow-700'}>
                                                <b>BALANCE: {currencyFormat(floatAccount?.balance)}</b>
                                            </small>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0712345678"
                                                type={'number'}
                                                {...form.register('phone')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="justify-end space-x-2">
                            <SubmitButton
                                disabled={isLoading || !form.formState.isValid}
                                isLoading={isLoading}
                                text={'Initiate Transfer'}
                                loadingText={'Initiating...'}
                                icon={CheckCircledIcon}
                            />
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            <ShareVoucherConfirmationDialogue
                open={openConfirmationAlert}
                values={form.getValues()}
                setOpen={setOpenTransactionConfirmationAlert}
                onConfirmed={handleTransactionConfirmed}
            />
        </>
    );
};

export default VoucherTransfer;

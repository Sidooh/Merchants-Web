import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { VoucherPurchaseRequest } from '@/lib/types.ts';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input.tsx';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/hooks/useAuth.ts';
import * as yup from 'yup';
import { SAFARICOM_REGEX } from '@/constants';
import { useTopUpFloatMutation } from '@/services/merchants/merchantsEndpoints.ts';
import { toast } from '@/lib/utils.ts';
import { MerchantProduct } from '@/lib/enums.ts';
import { Separator } from '@/components/ui/separator.tsx';
import TransactionConfirmationAlert from '@/pages/default/components/TransactionConfirmationAlert.tsx';
import { useState } from 'react';

const formSchema = yup.object({
    merchant_id: yup.number().integer().required(),
    amount: yup.number().typeError('Please enter amount').required('Amount is required.'),
    phone: yup.string().matches(SAFARICOM_REGEX, { message: 'Invalid phone number' }).required('Phone is required.'),
});

const VoucherTopUp = () => {
    const [openTransactionConfirmationAlert, setOpenTransactionConfirmationAlert] = useState(false);

    const { user } = useAuth();
    const [sendPurchaseRequest, { isLoading }] = useTopUpFloatMutation();

    const form = useForm<VoucherPurchaseRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
        defaultValues: {
            merchant_id: user?.merchant_id,
            phone: String(user?.phone),
        },
    });

    const handleTransactionConfirmed = () => {
        const values = form.getValues();
        values.amount = Number(values.amount);

        sendPurchaseRequest(values)
            .unwrap()
            .then(() => {
                toast({ titleText: 'Transaction Initiated Successfully!' });

                form.reset({ amount: undefined });
            })
            .catch(() => toast({ titleText: 'Something went wrong. Please retry!', icon: 'error' }));
    };

    const handleSubmit: SubmitHandler<VoucherPurchaseRequest> = () => setOpenTransactionConfirmationAlert(true);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Up Sidooh Voucher</CardTitle>
                            <CardDescription>Select or add store below to purchase float.</CardDescription>
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
                                                min={10}
                                                max={250000}
                                                {...form.register('amount')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>M-PESA phone number</FormLabel>
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
                                text={'Initiate Transaction'}
                                loadingText={'Initiating...'}
                                icon={CheckCircledIcon}
                            />
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            <TransactionConfirmationAlert
                product={MerchantProduct.FLOAT_PURCHASE}
                open={openTransactionConfirmationAlert}
                values={form.getValues()}
                setOpen={setOpenTransactionConfirmationAlert}
                onConfirmed={handleTransactionConfirmed}
            >
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">Payment Method</h4>
                    <p className="text-sm ">MPESA - {form.getValues('phone')}</p>
                </div>
                <Separator className="my-4" />
            </TransactionConfirmationAlert>
        </>
    );
};

export default VoucherTopUp;

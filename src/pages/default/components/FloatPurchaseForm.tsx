import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.tsx';
import { CheckCircledIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MpesaFloatPurchaseRequest, MpesaStore } from '@/lib/types.ts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useEffect, useState } from 'react';
import { useBuyMpesaFloatMutation, useGetMpesaStoresQuery } from '@/services/merchants/merchantsEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { MerchantProduct, PaymentMethod } from '@/lib/enums.ts';
import { toast } from '@/lib/utils.ts';
import { SAFARICOM_REGEX } from '@/constants';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { useGetFloatAccountQuery } from '@/services/payments/floatEndpoints.ts';
import PinConfirmationForm from '@/pages/default/components/PinConfirmationForm.tsx';
import TransactionConfirmationAlert from '@/pages/default/components/TransactionConfirmationAlert.tsx';
import { Separator } from '@/components/ui/separator.tsx';

const formSchema = yup.object({
    merchant_id: yup.number().integer().required(),
    agent: yup.string().required('Agent number is required.'),
    store: yup.string().required('Store number is required.'),
    amount: yup.number().typeError('Please enter amount').required('Amount is required.'),
    method: yup
        .string()
        .oneOf(Object.values(PaymentMethod), 'Method must be MPESA or VOUCHER')
        .required('Payment method is required.'),
    debit_account: yup
        .string()
        .matches(SAFARICOM_REGEX, { message: 'Invalid phone number' })
        .when('method', {
            is: (val: PaymentMethod) => val === PaymentMethod.MPESA,
            then: (s) => s.required('Phone number is required.'),
        }),
});

const FloatPurchaseForm = () => {
    const [selectedStore, setSelectedStore] = useState<MpesaStore>();
    const [isAddingStore, setIsAddingStore] = useState(false);
    const [openPinConfirmationForm, setOpenPinConfirmationForm] = useState(false);
    const [openTransactionConfirmationAlert, setOpenTransactionConfirmationAlert] = useState(false);

    const { user } = useAuth();
    const { data: stores, isLoading: isLoadingStores } = useGetMpesaStoresQuery(user!.merchant_id);
    const { data: floatAccount, isLoading: isLoadingFloatAccount } = useGetFloatAccountQuery(user!.float_account_id);
    const [sendPurchaseRequest, { isLoading }] = useBuyMpesaFloatMutation();

    const form = useForm<MpesaFloatPurchaseRequest>({
        mode: 'onBlur',
        resolver: yupResolver<MpesaFloatPurchaseRequest>(formSchema),
        defaultValues: {
            merchant_id: user?.merchant_id,
            method: PaymentMethod.FLOAT,
            store: '',
            debit_account: String(user?.phone),
        },
    });

    useEffect(() => {
        if (stores?.length === 0) setIsAddingStore(true);
    }, [stores]);

    const completePurchaseRequest = (values: MpesaFloatPurchaseRequest) => {
        if (openPinConfirmationForm) setOpenPinConfirmationForm(false);

        values.amount = Number(values.amount);

        if (values.method === PaymentMethod.FLOAT) delete values['debit_account'];

        sendPurchaseRequest(values)
            .unwrap()
            .then(() => {
                toast({ titleText: 'Transaction Initiated Successfully!' });

                form.reset();
            })
            .catch(() => toast({ titleText: 'Something went wrong. Please retry!', icon: 'error' }));
    };

    const handleSubmit: SubmitHandler<MpesaFloatPurchaseRequest> = async (values) => {
        if (values.method === PaymentMethod.FLOAT && values.amount > (floatAccount?.balance || 0))
            return toast({ titleText: 'Insufficient voucher balance.', icon: 'warning' });

        setOpenTransactionConfirmationAlert(true);
    };

    const handleTransactionConfirmed = () => {
        const values = form.getValues();

        if (values.method === PaymentMethod.FLOAT) {
            setOpenPinConfirmationForm(true);
        } else {
            completePurchaseRequest(values);
        }
    };

    if (isLoadingStores || isLoadingFloatAccount) return <Skeleton className={'h-[25rem]'} />;

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Buy MPESA Float</CardTitle>
                            <CardDescription>Select or add store below to purchase float.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <FormField
                                name="store"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store</FormLabel>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Select
                                                onValueChange={(v) => {
                                                    const store: MpesaStore | undefined = stores?.find(
                                                        (s) => s.store == v
                                                    );

                                                    if (store) {
                                                        setSelectedStore(store);

                                                        form.setValue('agent', store.agent);
                                                        form.setValue('store', store.store);
                                                    }
                                                }}
                                                defaultValue={field.value}
                                                value={field.value}
                                                disabled={isAddingStore}
                                            >
                                                <FormControl className={'col-span-2'}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a store" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {stores?.map((s) => (
                                                        <SelectItem key={s.id} value={s.store}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Toggle
                                                variant={'outline'}
                                                aria-label="Toggle italic"
                                                className={'text-nowrap'}
                                                onPressedChange={(pressed) => {
                                                    setIsAddingStore(pressed);

                                                    if (pressed) {
                                                        setSelectedStore(undefined);

                                                        form.resetField('store');
                                                        form.resetField('agent');
                                                    }
                                                }}
                                            >
                                                {isAddingStore ? (
                                                    <CheckIcon className="mr-2 h-4 w-4" />
                                                ) : (
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                )}
                                                {isAddingStore ? 'Select' : 'Add'}
                                            </Toggle>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isAddingStore && (
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        control={form.control}
                                        name="agent"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Agent Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="xxxxxx"
                                                        type={'number'}
                                                        {...form.register('agent')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="store"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Store Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="xxxxxx"
                                                        type={'number'}
                                                        {...form.register('store')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <div className="grid lg:grid-cols-2 gap-3">
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
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buy Using</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a payment method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={PaymentMethod.FLOAT}>
                                                        {PaymentMethod.VOUCHER}
                                                    </SelectItem>
                                                    <SelectItem value={PaymentMethod.MPESA}>
                                                        {PaymentMethod.MPESA}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {field.value === PaymentMethod.FLOAT && (
                                                <FormDescription>
                                                    Your Voucher Balance:{' '}
                                                    <b>{floatAccount?.balance.toLocaleString()}</b>
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.getValues('method') === PaymentMethod.MPESA && (
                                <FormField
                                    control={form.control}
                                    name="debit_account"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>M-PESA phone number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0712345678"
                                                    type={'number'}
                                                    {...form.register('debit_account')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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

            <PinConfirmationForm
                open={openPinConfirmationForm}
                setOpen={setOpenPinConfirmationForm}
                onConfirmed={() => completePurchaseRequest(form.getValues())}
            />

            <TransactionConfirmationAlert
                product={MerchantProduct.MPESA_FLOAT}
                open={openTransactionConfirmationAlert}
                values={form.getValues()}
                setOpen={setOpenTransactionConfirmationAlert}
                onConfirmed={handleTransactionConfirmed}
            >
                {selectedStore && (
                    <>
                        <div className="space-y-1">
                            <h4 className="text-xs text-muted-foreground font-medium leading-none">Store Name</h4>
                            <p className="text-sm ">{selectedStore.name.split('-')[1]}</p>
                        </div>
                        <Separator className="my-4" />
                    </>
                )}
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">Agent Number</h4>
                    <p className="text-sm ">{form.getValues('agent')}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">Store Number</h4>
                    <p className="text-sm ">{form.getValues('store')}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">Payment Method</h4>
                    <p className="text-sm ">
                        {form.getValues('method') === PaymentMethod.FLOAT
                            ? 'VOUCHER'
                            : `MPESA - ${form.getValues('debit_account')}`}
                    </p>
                </div>
                <Separator className="my-4" />
            </TransactionConfirmationAlert>
        </>
    );
};

export default FloatPurchaseForm;

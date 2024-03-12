import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { CheckCircledIcon, CheckIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MpesaFloatPurchaseRequest, MpesaStore, PinConfirmationRequest } from '@/lib/types.ts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toggle } from '@/components/ui/toggle.tsx';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useBuyMpesaFloatMutation, useGetMpesaStoresQuery } from '@/services/merchants/merchantsEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { PaymentMethod } from '@/lib/enums.ts';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { useCheckPinMutation } from '@/services/accounts/accountsEndpoints.ts';
import { toast } from '@/lib/utils.ts';

const formSchema = yup.object({
    merchant_id: yup.number().integer().required(),
    agent: yup.string().max(100).required('Agent number is required.'),
    store: yup.string().max(100).required('Store number is required.'),
    amount: yup.number().integer().required('Amount is required.'),
    method: yup
        .string()
        .oneOf(Object.values(PaymentMethod), 'Method must be MPESA or VOUCHER')
        .max(100)
        .required('Payment method is required.'),
    debit_account: yup
        .number()
        .integer()
        .when('method', {
            is: (val: PaymentMethod) => val === PaymentMethod.MPESA,
            then: (s) => s.required('Phone number is required.'),
        }),
});

const pinConfirmationSchema = yup.object({
    account_id: yup.number().integer().required(),
    pin: yup.string().length(4, `Pin must be ${length} digits`).required('Pin number is required.'),
});

const PinConfirmationForm = ({
    open,
    setOpen,
    onConfirmed,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirmed: Function;
}) => {
    const { user } = useAuth();
    const [checkPin, { isLoading }] = useCheckPinMutation();

    const form = useForm<PinConfirmationRequest>({
        resolver: yupResolver(pinConfirmationSchema),
        defaultValues: {
            account_id: user?.account_id,
        },
    });

    const handleSubmit: SubmitHandler<PinConfirmationRequest> = async (values) => {
        try {
            const isConfirmed = await checkPin(values).unwrap();

            if (isConfirmed) {
                onConfirmed();
            }
        } catch (e) {
            toast({ titleText: 'Invalid Pin!', icon: 'warning' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="sm:max-w-md space-y-4">
                        <DialogHeader>
                            <DialogTitle>Pin Confirmation</DialogTitle>
                            <DialogDescription>
                                Please confirm your Sidooh Pin to complete the purchase.
                            </DialogDescription>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="pin"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Pin</FormLabel>
                                    <FormControl>
                                        <Input placeholder="****" type={'password'} {...form.register('pin')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type={'submit'} disabled={isLoading || !form.formState.isValid}>
                                {isLoading ? (
                                    <>
                                        Confirming... <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Confirm <CheckCircledIcon className="ms-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

const FloatPurchaseForm = () => {
    const [isAddingStore, setIsAddingStore] = useState(false);
    const [openPinConfirmationForm, setOpenPinConfirmationForm] = useState(false);

    const { user } = useAuth();
    const { data: stores, isLoading: isLoadingStores } = useGetMpesaStoresQuery(user?.merchant_id);
    const [sendPurchaseRequest, { isLoading }] = useBuyMpesaFloatMutation();

    const form = useForm<MpesaFloatPurchaseRequest>({
        mode: 'onBlur',
        resolver: yupResolver(formSchema),
        defaultValues: {
            merchant_id: user?.merchant_id,
            method: PaymentMethod.FLOAT,
            debit_account: user?.phone,
        },
    });

    useEffect(() => {
        if (stores?.length === 0) setIsAddingStore(true);
    }, [stores]);

    const completePurchaseRequest = (values: MpesaFloatPurchaseRequest) => {
        sendPurchaseRequest(values)
            .unwrap()
            .then(() => toast({ titleText: 'Purchase Initiated Successfully!' }))
            .catch(() => toast({ titleText: 'Something went wrong. Please retry!' }));
    };

    const handleSubmit: SubmitHandler<MpesaFloatPurchaseRequest> = async (values) => {
        if (values.method === PaymentMethod.FLOAT) {
            form.setValue('amount', values.amount);

            setOpenPinConfirmationForm(true);
        } else {
            completePurchaseRequest(values);
        }
    };

    if (isLoadingStores) return <Skeleton className={'h-[25rem] w-2/5'} />;

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Buy Float</CardTitle>
                            <CardDescription>Fill in the form below to purchase float.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <FormField
                                name="store"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Store</FormLabel>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Select
                                                onValueChange={(v) => {
                                                    const store: MpesaStore | undefined = stores?.find(
                                                        (s) => s.store == v
                                                    );

                                                    if (store) {
                                                        form.setValue('agent', store.store);
                                                        form.setValue('store', store.agent);
                                                    }
                                                }}
                                                defaultValue={field.value}
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
                                                onPressedChange={setIsAddingStore}
                                            >
                                                {isAddingStore ? (
                                                    <CheckIcon className="mr-2 h-4 w-4" />
                                                ) : (
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                )}
                                                {isAddingStore ? 'Select store' : 'Add store'}
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
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
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
                                            <FormLabel>Buy using</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Button type={'submit'} disabled={isLoading || !form.formState.isValid}>
                                Purchase
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            <PinConfirmationForm
                open={openPinConfirmationForm}
                setOpen={setOpenPinConfirmationForm}
                onConfirmed={() => completePurchaseRequest(form.getValues())}
            />
        </>
    );
};

export default FloatPurchaseForm;

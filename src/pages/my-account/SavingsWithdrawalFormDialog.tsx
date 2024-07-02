import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth.ts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import AlertError from '@/components/errors/AlertError.tsx';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import { EarningsWithdrawalRequest } from '@/lib/types/requests.ts';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useWithdrawSavingsMutation } from '@/services/merchants/merchantsEndpoints.ts';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';
import {
    EarningsWithdrawalDestination,
    EarningsWithdrawalSource,
    MerchantProduct,
    PaymentMethod,
} from '@/lib/enums.ts';
import { currencyFormat, Str, toast } from '@/lib/utils.ts';
import PinConfirmationForm from '@/pages/default/components/PinConfirmationForm.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import TransactionConfirmationAlert from '@/pages/default/components/TransactionConfirmationAlert.tsx';
import { SAFARICOM_REGEX } from '@/constants';
import { SavingsEarningAccount } from '@/lib/types/models.ts';

type WithdrawalFormDialogProps = {
    account: SavingsEarningAccount;
    source?: EarningsWithdrawalSource;
    open: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
};

const formSchema = yup.object({
    merchant_id: yup.number().integer().required(),
    source: yup
        .string()
        .oneOf(
            Object.values(EarningsWithdrawalSource),
            `Source must be ${Object.values(EarningsWithdrawalSource).join(' or ')}`
        )
        .required('Source is required.'),
    destination: yup
        .string()
        .oneOf(
            Object.values(EarningsWithdrawalDestination),
            `Destination must be ${Object.values(EarningsWithdrawalDestination).join(' or ')}`
        )

        .required('Destination is required.'),
    amount: yup.number().min(20).typeError('Please enter amount').required('Amount is required.'),
    account: yup
        .string()
        .matches(SAFARICOM_REGEX, { message: 'Invalid phone number' })
        .when('method', {
            is: (val: PaymentMethod) => val === PaymentMethod.MPESA,
            then: (s) => s.required('Phone number is required.'),
        }),
});

const SavingsWithdrawalFormDialog = ({ account, source, open, setOpen }: WithdrawalFormDialogProps) => {
    const { user } = useAuth();

    const [openPinConfirmationForm, setOpenPinConfirmationForm] = useState(false);
    const [openTransactionConfirmationAlert, setOpenTransactionConfirmationAlert] = useState(false);

    const [withdrawSavings, { isLoading, error }] = useWithdrawSavingsMutation();
    const [customError, setCustomError] = useState<string>();

    const form = useForm<yup.InferType<typeof formSchema>>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            source,
            merchant_id: user?.merchant_id,
            destination: EarningsWithdrawalDestination.MPESA,
            account: String(user?.phone),
        },
    });

    const handleSubmit: SubmitHandler<EarningsWithdrawalRequest> = async () => {
        const { amount } = form.getValues();

        if (amount > account.balance) return setCustomError('Insufficient balance for the set amount.');

        setCustomError(undefined);
        setOpenTransactionConfirmationAlert(true);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) form.reset();

        setOpen?.(open);
    };

    const handleTransactionConfirmed = () => {
        setOpen?.(false);
        setOpenPinConfirmationForm(true);
    };

    const handlePinConfirmed = () => {
        const values = formSchema.cast(form.getValues());

        if (values.destination !== EarningsWithdrawalDestination.MPESA) delete values['account'];

        withdrawSavings(values)
            .unwrap()
            .then(() => {
                toast({ titleText: 'Withdrawal Initiated Successfully!' });

                form.reset();
            })
            .catch(() => toast({ titleText: 'Something went wrong. Please retry!', icon: 'error' }));
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="sm:max-w-md space-y-4">
                            <DialogHeader>
                                <DialogTitle>Withdraw Savings</DialogTitle>
                                <DialogDescription>Please fill in the form to complete withdrawal.</DialogDescription>
                                <AlertError error={error || customError} className={'mt-4'} />
                            </DialogHeader>
                            <div className="grid gap-3">
                                {!source && (
                                    <FormField
                                        control={form.control}
                                        name="source"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Select source</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex space-x-1"
                                                    >
                                                        {Object.values(EarningsWithdrawalSource).map((s) => (
                                                            <FormItem
                                                                key={s}
                                                                className="flex items-center space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <RadioGroupItem value={s} />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                    {Str.headline(s)}
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Select destination</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex space-x-1"
                                                >
                                                    {Object.values(EarningsWithdrawalDestination).map((s) => (
                                                        <FormItem
                                                            key={s}
                                                            className="flex items-center space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem value={s} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                To {Str.headline(s)}
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.getValues('destination') === EarningsWithdrawalDestination.MPESA && (
                                    <FormField
                                        control={form.control}
                                        name="account"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>M-PESA phone number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0712345678"
                                                        type={'number'}
                                                        {...form.register('account')}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoFocus
                                                    placeholder="e.g: 300"
                                                    type={'number'}
                                                    min={10}
                                                    max={250000}
                                                    {...form.register('amount')}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Min: <b>KES 20</b> -{' Max: '}
                                                <b>{currencyFormat(account?.balance)}</b>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <SubmitButton
                                    disabled={isLoading || !form.formState.isValid}
                                    isLoading={isLoading}
                                    text={'Confirm'}
                                    loadingText={'Confirming...'}
                                    icon={CheckCircledIcon}
                                />
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <TransactionConfirmationAlert
                balance={account.balance}
                product={MerchantProduct.EARNINGS_WITHDRAW}
                open={openTransactionConfirmationAlert}
                values={form.getValues()}
                setOpen={setOpenTransactionConfirmationAlert}
                onConfirmed={handleTransactionConfirmed}
            >
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">Withdrawal From</h4>
                    <p className="text-sm ">{form.getValues('source')}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                    <h4 className="text-xs text-muted-foreground font-medium leading-none">To</h4>
                    <p className="text-sm ">
                        {form.getValues('destination')}
                        {form.getValues('destination') === EarningsWithdrawalDestination.MPESA &&
                            ` - ${form.getValues('account')}`}
                    </p>
                </div>
                <Separator className="my-4" />
            </TransactionConfirmationAlert>

            <PinConfirmationForm
                open={openPinConfirmationForm}
                setOpen={setOpenPinConfirmationForm}
                onConfirmed={handlePinConfirmed}
            />
        </>
    );
};

export default SavingsWithdrawalFormDialog;

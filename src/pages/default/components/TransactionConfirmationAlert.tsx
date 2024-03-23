import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { MpesaFloatPurchaseRequest, MpesaStore } from '@/lib/types.ts';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator.tsx';
import { PaymentMethod } from '@/lib/enums.ts';
import { currencyFormat } from '@/lib/utils.ts';
import { Dispatch, SetStateAction } from 'react';
import { useGetFloatChargesQuery } from '@/services/payments/paymentsApi.ts';

type TransactionConfirmationAlertProps = {
    values: MpesaFloatPurchaseRequest;
    open: boolean;
    store?: MpesaStore;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirmed: () => void;
};

const TransactionConfirmationAlert = ({
    values,
    store,
    open,
    setOpen,
    onConfirmed,
}: TransactionConfirmationAlertProps) => {
    const { data, isLoading } = useGetFloatChargesQuery();

    const charge = data?.find((c) => c.min <= values.amount && values.amount <= c.max);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className={'max-w-xs'}>
                <AlertDialogHeader className={'text-start'}>
                    <AlertDialogTitle>CONFIRM</AlertDialogTitle>
                    {store && (
                        <>
                            <div className="space-y-1">
                                <h4 className="text-xs text-muted-foreground font-medium leading-none">Store Name</h4>
                                <p className="text-sm ">{store.name.split('-')[1]}</p>
                            </div>
                            <Separator className="my-4" />
                        </>
                    )}
                    <div className="space-y-1">
                        <h4 className="text-xs text-muted-foreground font-medium leading-none">Agent Number</h4>
                        <p className="text-sm ">{values.agent}</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                        <h4 className="text-xs text-muted-foreground font-medium leading-none">Store Number</h4>
                        <p className="text-sm ">{values.store}</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                        <h4 className="text-xs text-muted-foreground font-medium leading-none">Payment Method</h4>
                        <p className="text-sm ">
                            {values.method === PaymentMethod.FLOAT ? 'VOUCHER' : `MPESA - ${values.debit_account}`}
                        </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-1">
                        <h4 className="text-xs text-muted-foreground font-medium leading-none">Amount</h4>
                        <p className="text-sm ">{currencyFormat(values.amount)}</p>

                        <div className="text-[7pt] text-muted-foreground">
                            {isLoading ? (
                                <div className={'h-3 w-1/3 bg-slate-200 rounded'} />
                            ) : (
                                <>FEE {currencyFormat(charge?.charge)}</>
                            )}
                        </div>
                    </div>
                    <Separator className="my-4" />
                </AlertDialogHeader>
                <AlertDialogFooter className={''}>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmed}>
                        Continue <ArrowRightIcon className={'ms-1'} />
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TransactionConfirmationAlert;

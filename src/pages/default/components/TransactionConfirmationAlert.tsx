import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { Charge, MpesaFloatPurchaseRequest, VoucherPurchaseRequest } from '@/lib/types.ts';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator.tsx';
import { MerchantProduct } from '@/lib/enums.ts';
import { currencyFormat } from '@/lib/utils.ts';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useGetChargesQuery } from '@/services/payments/paymentsApi.ts';
import { EarningsWithdrawalRequest } from '@/lib/types/requests.ts';

type TransactionConfirmationAlertProps = {
    values: MpesaFloatPurchaseRequest | VoucherPurchaseRequest | EarningsWithdrawalRequest;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirmed: () => void;
    product: MerchantProduct;
    children: ReactNode;
};

const TransactionConfirmationAlert = ({
    values,
    open,
    setOpen,
    onConfirmed,
    product,
    children,
}: TransactionConfirmationAlertProps) => {
    let endpoint: string | undefined = undefined,
        tagType: string | undefined = undefined;

    if (product === MerchantProduct.EARNINGS_WITHDRAW) {
        endpoint = 'withdrawal';
        tagType = 'WithdrawalCharge';
    }
    if (product === MerchantProduct.FLOAT_PURCHASE && values.amount < 11000) {
        endpoint = `buy-goods`;
        tagType = 'BuyGoodsCharge';
    }
    if (product === MerchantProduct.FLOAT_PURCHASE && values.amount >= 11000) {
        endpoint = `pay-bill`;
        tagType = 'PayBillCharge';
    }
    if (product === MerchantProduct.MPESA_FLOAT) {
        endpoint = `mpesa-float`;
        tagType = 'FloatCharge';
    }

    const { data: charges, isLoading: isLoading } = useGetChargesQuery(
        { endpoint: endpoint!, tagType },
        { skip: !endpoint || !tagType }
    );

    const [charge, setCharge] = useState<Charge>();

    useEffect(() => {
        setCharge(charges?.find((c) => c.min <= values.amount && values.amount <= c.max));
    }, [charges, values.amount]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className={'max-w-xs'}>
                <AlertDialogHeader className={'text-start'}>
                    <AlertDialogTitle>CONFIRM</AlertDialogTitle>

                    {children}

                    <div className="space-y-1">
                        <h4 className="text-xs text-muted-foreground font-medium leading-none">Amount</h4>

                        <div>
                            <p className="text-sm ">{currencyFormat(values.amount)}</p>
                            {isLoading ? (
                                <div className={'h-3 w-1/3 bg-slate-200 rounded'} />
                            ) : (
                                <p className={'text-[7pt] text-muted-foreground font-medium'}>
                                    FEE {currencyFormat(charge?.charge)}
                                </p>
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

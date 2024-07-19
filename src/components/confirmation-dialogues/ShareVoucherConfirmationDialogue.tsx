import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator.tsx';
import { currencyFormat } from '@/lib/utils.ts';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { TiThumbsUp } from 'react-icons/ti';
import { useLazyGetAccountByPhoneQuery } from '@/services/accounts/accountsEndpoints.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useLazyGetMerchantByAccountQuery } from '@/services/merchants/merchantsEndpoints.ts';
import { toast } from 'sonner';
import { VoucherTransferFormRequest } from '@/pages/voucher-transfer/VoucherTransfer.tsx';

type TransactionConfirmationAlertProps = {
    values: VoucherTransferFormRequest;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirmed: (accountId: number) => void;
    balance?: number;
};

const TransactionConfirmationAlert = ({ values, open, setOpen, onConfirmed }: TransactionConfirmationAlertProps) => {
    const [getAccountByPhone, { isLoading }] = useLazyGetAccountByPhoneQuery();
    const [getMerchantByAccount, { data: merchant, isLoading: isLoadingMerchant }] = useLazyGetMerchantByAccountQuery();

    useEffect(() => {
        if (open) {
            getAccountByPhone(values.phone)
                .unwrap()
                .then((acc) => {
                    getMerchantByAccount(acc.id)
                        .unwrap()
                        .catch((err) => {
                            if (err.status !== 404) {
                                toast.error('Something went wrong');
                                setOpen(false);
                            }
                        });
                })
                .catch((err) => {
                    if (err.status === 404) toast.warning('Merchant does not exist');
                });
        }
    }, [open]);

    const loading = isLoading || isLoadingMerchant;

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className={'max-w-xs'}>
                <AlertDialogHeader className={'text-start'}>
                    <AlertDialogTitle>{loading ? '...' : merchant ? 'CONFIRM' : 'SORRY'}</AlertDialogTitle>
                    {loading ? (
                        <Skeleton className={'h-24'} />
                    ) : merchant ? (
                        <>
                            <div className="space-y-1">
                                <h4 className="text-xs text-muted-foreground font-medium leading-none">Share with</h4>
                                <p className="text-sm ">
                                    {values.phone} - {merchant.business_name}
                                </p>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-1">
                                <h4 className="text-xs text-muted-foreground font-medium leading-none">Amount</h4>
                                <p className="text-sm ">{currencyFormat(values.amount)}</p>
                            </div>
                            <Separator className="my-4" />
                        </>
                    ) : (
                        <AlertDialogDescription className={'text-red-700'}>
                            The phone number provided does not belong to a Sidooh Merchant.
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className={''}>
                    <AlertDialogCancel>
                        {loading || merchant ? (
                            'Cancel'
                        ) : (
                            <>
                                Okay <TiThumbsUp className={'ms-1'} />
                            </>
                        )}
                    </AlertDialogCancel>
                    {merchant && (
                        <AlertDialogAction onClick={() => onConfirmed(merchant!.id)} disabled={isLoading}>
                            Continue <ArrowRightIcon className={'ms-1'} />
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TransactionConfirmationAlert;

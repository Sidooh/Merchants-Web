import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { useGetMerchantEarningAccountsQuery } from '@/services/merchants/earningAccountEndpoints.ts';
import { Str } from '@/lib/utils.ts';
import { MerchantEarningAccount } from '@/lib/types/models.ts';
import { EarningsWithdrawalSource } from '@/lib/enums.ts';
import { useState } from 'react';
import { GiReceiveMoney } from 'react-icons/gi';
import { Button } from '@/components/ui/button.tsx';
import { BiMoneyWithdraw } from 'react-icons/bi';
import WithdrawalFormDialog from '@/pages/my-account/WithdrawalFormDialog.tsx';

type BalanceProps = { earningAccount?: MerchantEarningAccount; isLoading: boolean };

const Balance = ({ earningAccount, isLoading }: BalanceProps) => {
    const [openWithdrawalForm, setOpenWithdrawalForm] = useState(false);

    if (isLoading) return <Skeleton className={'h-32'} />;
    if (!earningAccount) return <></>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {Str.headline(String(earningAccount.type))}
                </CardTitle>
                <GiReceiveMoney />
            </CardHeader>
            <CardContent className="text-xl font-bold flex justify-between gap-2 items-center">
                <CountUp end={earningAccount.amount} prefix={'KES '} />
                <Button
                    size={'sm'}
                    variant={'secondary'}
                    className={'text-red-700'}
                    onClick={() => setOpenWithdrawalForm(true)}
                >
                    Withdraw <BiMoneyWithdraw className="ms-2" />
                </Button>
            </CardContent>

            <WithdrawalFormDialog
                open={openWithdrawalForm}
                setOpen={setOpenWithdrawalForm}
                source={earningAccount.type as unknown as EarningsWithdrawalSource}
            />
        </Card>
    );
};

const MerchantEarningBalances = () => {
    const { user } = useAuth();

    const { data: earningAccounts, isLoading } = useGetMerchantEarningAccountsQuery({ merchant_id: user!.merchant_id });

    return <>{earningAccounts?.map((a) => <Balance key={a.type} earningAccount={a} isLoading={isLoading} />)}</>;
};

export default MerchantEarningBalances;

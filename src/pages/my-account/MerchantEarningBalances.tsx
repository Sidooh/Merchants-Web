import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { FaCoins } from 'react-icons/fa6';
import { useGetMerchantEarningAccountsQuery } from '@/services/merchants/earningAccountEndpoints.ts';
import { Str } from '@/lib/utils.ts';
import { MerchantEarningAccount } from '@/lib/types/models.ts';
import { MerchantEarningAccountType } from '@/lib/enums.ts';
import { useEffect, useState } from 'react';
import CashbackBalance from '@/pages/my-account/CashbackBalance.tsx';

type BalanceProps = { earningAccount?: MerchantEarningAccount; isLoading: boolean };

const CommissionBalance = ({ earningAccount, isLoading }: BalanceProps) => {
    if (isLoading) return <Skeleton className={'h-32'} />;
    if (!earningAccount) return <></>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {Str.headline(String(earningAccount.type))}
                </CardTitle>
                <FaCoins />
            </CardHeader>
            <CardContent className="text-xl font-bold">
                <CountUp end={earningAccount.amount} prefix={'KES '} />
            </CardContent>
        </Card>
    );
};

const MerchantEarningBalances = () => {
    const { user } = useAuth();

    const { data: earningAccounts, isLoading } = useGetMerchantEarningAccountsQuery({ merchant_id: user!.merchant_id });

    const [cashback, setCashback] = useState<MerchantEarningAccount>();
    const [commission, setCommission] = useState<MerchantEarningAccount>();

    useEffect(() => {
        if (earningAccounts?.length) {
            earningAccounts.forEach((a) => {
                if (a.type === MerchantEarningAccountType.CASHBACK) setCashback(a);
                if (a.type === MerchantEarningAccountType.COMMISSION) setCommission(a);
            });
        }
    }, [earningAccounts]);

    return (
        <>
            <CashbackBalance earningAccount={cashback} isLoading={isLoading} />
            <CommissionBalance earningAccount={commission} isLoading={isLoading} />
        </>
    );
};

export default MerchantEarningBalances;

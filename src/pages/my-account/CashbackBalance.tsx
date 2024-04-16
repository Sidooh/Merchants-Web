import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { FaCoins } from 'react-icons/fa6';
import { useGetMerchantEarningAccountsQuery } from '@/services/merchants/earningAccountEndpoints.ts';
import { Str } from '@/lib/utils.ts';
import { MerchantEarningAccount } from '@/lib/types/models.ts';
import { MerchantEarningAccountType } from '@/lib/enums.ts';

type BalanceProps = { earningAccount?: MerchantEarningAccount; isLoading: boolean };

const Balance = ({ earningAccount, isLoading }: BalanceProps) => {
    if (!earningAccount || isLoading) return <Skeleton className={'h-32'} />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {Str.headline(String(earningAccount.type))}
                </CardTitle>
                <FaCoins />
            </CardHeader>
            <CardContent className="text-xl font-bold">
                <CountUp end={earningAccount.amount} prefix={'KSH '} />
            </CardContent>
        </Card>
    );
};

const CashbackBalance = () => {
    const { user } = useAuth();

    const { data: earningAccounts, isLoading } = useGetMerchantEarningAccountsQuery({ merchant_id: user!.merchant_id });

    return (
        <>
            <Balance
                earningAccount={earningAccounts?.find((a) => a.type === MerchantEarningAccountType.CASHBACK)}
                isLoading={isLoading}
            />
            <Balance
                earningAccount={earningAccounts?.find((a) => a.type === MerchantEarningAccountType.COMMISSION)}
                isLoading={isLoading}
            />
        </>
    );
};

export default CashbackBalance;

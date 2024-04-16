import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { FaMoneyBills } from 'react-icons/fa6';
import { useGetEarningAccountsQuery } from '@/services/savings/savingsApi.ts';
import { SavingsEarningAccountType } from '@/lib/enums.ts';
import { useEffect, useState } from 'react';
import { SavingsEarningAccount } from '@/lib/types/models.ts';

const CashbackBalance = () => {
    const { user } = useAuth();

    const { data: earningAccounts, isLoading } = useGetEarningAccountsQuery(user!.account_id);

    const [cashbackAccount, setCashbackAccount] = useState<SavingsEarningAccount>();
    const [commissionAccount, setCommissionAccount] = useState<SavingsEarningAccount>();

    useEffect(() => {
        if (earningAccounts?.length) {
            earningAccounts.forEach((a) => {
                if (a.type === SavingsEarningAccountType.MERCHANT_CASHBACK) setCashbackAccount(a);
                if (a.type === SavingsEarningAccountType.MERCHANT_COMMISSION) setCommissionAccount(a);
            });
        }
    }, [earningAccounts]);

    if (!earningAccounts || isLoading) return <Skeleton className={'h-80 lg:h-32 lg:col-span-3'} />;

    return (
        <Card className="grid grid-cols-1 md:grid-cols-3 divide-x">
            <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold text-primary/70">Total Balance</CardTitle>
                    <FaMoneyBills />
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    <CountUp
                        end={cashbackAccount?.balance! + commissionAccount?.balance!}
                        prefix={'KSH '}
                        className={'text-primary'}
                    />
                    <p className="text-xs text-primary/80">
                        <CountUp
                            end={commissionAccount?.interest! + commissionAccount?.interest!}
                            prefix={'+KSH '}
                            suffix={' interest'}
                        />
                    </p>
                </CardContent>
            </div>

            <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Saved Cashback</CardTitle>
                    <FaMoneyBills />
                </CardHeader>
                <CardContent className="text-xl font-bold">
                    <CountUp end={cashbackAccount?.balance!} prefix={'KSH '} />
                    <p className="text-xs text-muted-foreground">
                        <CountUp end={cashbackAccount?.interest!} prefix={'+KSH '} suffix={' interest'} />
                    </p>
                </CardContent>
            </div>

            <div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Saved Commission</CardTitle>
                    <FaMoneyBills />
                </CardHeader>
                <CardContent className="text-xl font-bold">
                    <CountUp end={commissionAccount?.balance!} prefix={'KSH '} />
                    <p className="text-xs text-muted-foreground">
                        <CountUp end={commissionAccount?.interest!} prefix={'+KSH '} suffix={' interest'} />
                    </p>
                </CardContent>
            </div>
        </Card>
    );
};

export default CashbackBalance;

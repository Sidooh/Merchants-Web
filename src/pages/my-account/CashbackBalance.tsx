import { MerchantEarningAccount } from '@/lib/types/models.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Str } from '@/lib/utils.ts';
import { GiReceiveMoney } from 'react-icons/gi';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button.tsx';
import { BiMoneyWithdraw } from 'react-icons/bi';
import WithdrawalFormDialog from '@/pages/my-account/WithdrawalFormDialog.tsx';
import { useState } from 'react';
import { EarningsWithdrawalSource } from '@/lib/enums.ts';

type BalanceProps = { earningAccount?: MerchantEarningAccount; isLoading: boolean };

const CashbackBalance = ({ earningAccount, isLoading }: BalanceProps) => {
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
                source={EarningsWithdrawalSource.CASHBACK}
            />
        </Card>
    );
};

export default CashbackBalance;

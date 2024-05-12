import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { RiCoupon2Fill } from 'react-icons/ri';
import { useGetFloatAccountQuery } from '@/services/payments/floatEndpoints.ts';

const VoucherBalance = () => {
    const { user } = useAuth();

    const { data: floatAccount, isLoading } = useGetFloatAccountQuery(user!.account_id);

    if (!floatAccount || isLoading) return <Skeleton className={'h-32 col-span-3'} />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Voucher</CardTitle>
                <RiCoupon2Fill />
            </CardHeader>
            <CardContent className="text-xl font-bold">
                <CountUp end={floatAccount.balance} prefix={'KSH '} />
            </CardContent>
        </Card>
    );
};

export default VoucherBalance;

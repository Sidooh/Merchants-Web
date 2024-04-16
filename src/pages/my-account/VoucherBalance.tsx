import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useGetVouchersQuery } from '@/services/payments/voucherEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import CountUp from 'react-countup';
import { VoucherType } from '@/lib/enums.ts';
import { RiCoupon2Fill } from 'react-icons/ri';

const VoucherBalance = () => {
    const { user } = useAuth();

    const { data: voucher, isLoading } = useGetVouchersQuery({ account_id: user!.account_id });

    if (!voucher || isLoading) return <Skeleton className={'h-32'} />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Voucher</CardTitle>
                <RiCoupon2Fill />
            </CardHeader>
            <CardContent className="text-xl font-bold">
                <CountUp end={voucher.find((v) => v.type === VoucherType.SIDOOH)!.balance} prefix={'KSH '} />
            </CardContent>
        </Card>
    );
};

export default VoucherBalance;

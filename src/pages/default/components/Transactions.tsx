import { Skeleton } from '@/components/ui/skeleton.tsx';
import TransactionsTable from '@/components/tables/transactions-table/TransactionsTable.tsx';
import { useGetTransactionsQuery } from '@/services/merchants/transactionsEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';

const Transactions = () => {
    const { user } = useAuth();
    const { data } = useGetTransactionsQuery({ merchants: user?.merchant_id, days: 1 });

    if (!data) return <Skeleton className={'h-[500px]'} />;

    return <TransactionsTable title={'Transactions, last 24hrs'} transactions={data} hideMerchantCol />;
};

export default Transactions;

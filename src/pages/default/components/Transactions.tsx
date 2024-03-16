import { Skeleton } from '@/components/ui/skeleton.tsx';
import TransactionsTable from '@/components/tables/transactions-table/TransactionsTable.tsx';
import { useGetTransactionsQuery } from '@/services/merchants/transactionsEndpoints.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { useGetMpesaStoresQuery } from '@/services/merchants/merchantsEndpoints.ts';
import { Transaction } from '@/lib/types.ts';

const Transactions = () => {
    const { user } = useAuth();
    let { data } = useGetTransactionsQuery({ merchants: user?.merchant_id, days: 1 });
    const { data: stores } = useGetMpesaStoresQuery(user!.merchant_id);

    if (!data) return <Skeleton className={'h-[500px]'} />;

    if (stores) {
        data = data.map((t) => {
            const store = stores.find(
                (s) => s.agent === t.payment?.destination?.agent && s.store === t.payment?.destination?.store
            );

            return { ...t, destination: store?.name || t.destination };
        }) as Transaction[];
    }

    return <TransactionsTable title={'Transactions, last 24hrs'} transactions={data} hideMerchantCol />;
};

export default Transactions;

import { DataTable } from '@/components/datatable/DataTable.tsx';
import { columns } from '@/components/tables/transactions-table/Columns.tsx';
import { Transaction } from '@/lib/types.ts';
import { Status } from '@/lib/enums.ts';
import { getStatusIcon, getUniquePropertyValues } from '@/lib/utils.ts';

type TransactionsTableProps = { title?: string; transactions: Transaction[]; hideMerchantCol?: boolean };

const TransactionsTable = ({
    title = 'Transactions',
    transactions,
    hideMerchantCol = false,
}: TransactionsTableProps) => {
    let cols = columns;

    if (hideMerchantCol) {
        cols = cols.filter((c) => c.header !== 'Merchant');
    }

    return (
        <DataTable
            title={title}
            columns={cols}
            data={transactions}
            facetedFilters={[
                {
                    column_id: 'status',
                    title: 'Status',
                    options: getUniquePropertyValues(transactions, 'status').map((s) => ({
                        label: s as string,
                        value: s as string,
                        icon: getStatusIcon(s as Status),
                    })),
                },
            ]}
        />
    );
};

export default TransactionsTable;

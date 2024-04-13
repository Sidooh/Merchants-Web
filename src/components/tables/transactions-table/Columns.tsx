import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/lib/types.ts';
import { currencyFormat, getRelativeDateAndTime, Str } from '@/lib/utils.ts';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/common/StatusBadge.tsx';

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'merchant',
        header: 'Merchant',
        cell: ({ row: { original: t } }) => {
            if (typeof t.merchant !== 'number') {
                return (
                    <Link to={`/merchants/${t.merchant.id}`} className={'underline'}>
                        {Str.headline(t.merchant.business_name)}
                    </Link>
                );
            }
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row: { original } }) => (
            <span>
                <p>{original.description}</p>
                <small>{original.destination}</small>
            </span>
        ),
        accessorFn: (originalRow) => `${originalRow.description} ${originalRow.destination}`,
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => currencyFormat(row.original.amount),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        filterFn: 'dateBetweenFilterFn',
        cell: ({ row: { original: t } }) => {
            const { date, time } = getRelativeDateAndTime(t.created_at);

            return (
                <>
                    <span>{time}</span>
                    <br />
                    <small className={'text-gray-600 text-[7pt]'}>{date}</small>
                </>
            );
        },
    },
];

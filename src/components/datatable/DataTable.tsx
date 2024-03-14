import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardTitle } from '@/components/ui/card.tsx';
import { useMemo, useState } from 'react';
import { DataTablePagination } from '@/components/datatable/DataTablePagination.tsx';
import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from '@radix-ui/react-icons';
import DataTableToolbar from '@/components/datatable/DataTableToolbar.tsx';
import { FacetedFilterType } from '@/lib/types.ts';
import { Input } from '@/components/ui/input.tsx';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Checkbox } from '@/components/ui/checkbox.tsx';

interface DataTableProps<TData, TValue> {
    title?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    facetedFilters?: FacetedFilterType[];
}

export function DataTable<TData, TValue>({ title, columns, data, facetedFilters }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
        // Rank the item
        const itemRank = rankItem(row.getValue(columnId), value);

        // Store the ranking info
        addMeta(itemRank);

        // Return if the item should be filtered in/out
        return itemRank.passed;
    };

    const table = useReactTable({
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },

        data,
        columns: useMemo(
            () => [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <Checkbox
                            className={'border-0 hover:border hover:border-gray-200'}
                            checked={table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
                            onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
                        />
                    ),
                    cell: ({ row }) => (
                        <div className="px-1">
                            <Checkbox
                                className={'border-0 hover:border hover:border-gray-200'}
                                checked={row.getIsSomeSelected() ? 'indeterminate' : row.getIsSelected()}
                                onCheckedChange={row.getToggleSelectedHandler()}
                            />
                        </div>
                    ),
                },
                ...columns,
            ],
            [columns]
        ),

        enableRowSelection: true,
        globalFilterFn: fuzzyFilter,

        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <Card className="rounded-md border-0 p-3 lg:p-6 space-y-3">
            {title && (
                <CardTitle className={'flex items-end flex-col'}>
                    <p className="text-xs lg:text-base lg:px-3">{title}</p>
                    <hr className={'w-1/2 lg:w-1/5 mt-1'} />
                </CardTitle>
            )}
            <DataTableToolbar
                table={table}
                facetedFilters={facetedFilters}
                globalFilter={
                    <Input
                        type={'search'}
                        placeholder={'Filter columns...'}
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                }
            />

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {!header.isPlaceholder && (
                                        <div
                                            className="flex items-center -ml-4 h-8 px-3 data-[state=open]:bg-accent text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <span className={'font-bold text-xs md:text-sm'}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </span>
                                            {header.column.getCanSort() &&
                                                ({
                                                    asc: <CaretUpIcon className="ml-2 h-4 w-4" />,
                                                    desc: <CaretDownIcon className="ml-2 h-4 w-4" />,
                                                }[header.column.getIsSorted() as string] ?? (
                                                    <CaretSortIcon className="ml-2 h-4 w-4" />
                                                ))}
                                        </div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className={'text-xs md:text-sm'}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <DataTablePagination table={table} />
        </Card>
    );
}

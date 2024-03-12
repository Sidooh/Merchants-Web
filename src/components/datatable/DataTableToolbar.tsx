import { DataTableFacetedFilter } from '@/components/datatable/DataTableFacetedFilter.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { FacetedFilterType } from '@/lib/types.ts';
import { ReactNode } from 'react';
import { DataTableViewOptions } from '@/components/datatable/DataTableViewOptions.tsx';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: ReactNode;
    facetedFilters?: FacetedFilterType[];
}

export function DataTableToolbar<TData>({ table, facetedFilters, globalFilter }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {globalFilter}

                {facetedFilters?.map(
                    (f) =>
                        table.getColumn(f.column_id) && (
                            <DataTableFacetedFilter
                                key={f.column_id}
                                column={table.getColumn(f.column_id)}
                                title={f.title}
                                options={f.options}
                            />
                        )
                )}
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}

export default DataTableToolbar;

import { DataTableFacetedFilter } from '@/components/datatable/DataTableFacetedFilter.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { FacetedFilterType } from '@/lib/types.ts';
import { DataTableViewOptions } from '@/components/datatable/DataTableViewOptions.tsx';
import { CalendarDateRangePicker } from '@/components/common/CalendarDateRangePicker.tsx';
import DebouncedInput from '@/components/common/DebouncedInput.tsx';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: string;
    onGlobalFilterChange: (value: string | number) => void;
    facetedFilters?: FacetedFilterType[];
}

export function DataTableToolbar<TData>({
    table,
    facetedFilters,
    globalFilter,
    onGlobalFilterChange,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div className="flex flex-1 items-center space-x-2">
                <DebouncedInput
                    type={'search'}
                    placeholder={'Filter columns...'}
                    value={globalFilter ?? ''}
                    onChange={(v) => onGlobalFilterChange(v)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

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
            <CalendarDateRangePicker
                onDateChange={(dateRange) =>
                    table.getColumn('created_at')?.setFilterValue(() => [dateRange?.from, dateRange?.to])
                }
            />
            <DataTableViewOptions table={table} />
        </div>
    );
}

export default DataTableToolbar;

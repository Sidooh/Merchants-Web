import * as React from 'react';
import { useEffect } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (dateRange?: DateRange) => void;
}

export function CalendarDateRangePicker({ className, onDateChange }: CalendarDateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 3),
        to: new Date(),
    });
    const [noOfMonths, setNoOfMonths] = React.useState(window.innerWidth > 900 ? 3 : 2);

    const changeNumberOfMonths = () => setNoOfMonths(window.innerWidth > 900 ? 3 : 2);

    useEffect(() => {
        window.addEventListener('resize', changeNumberOfMonths);

        return () => window.removeEventListener('resize', changeNumberOfMonths);
    }, []);

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size={'sm'}
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[260px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        selected={date}
                        onSelect={(dr) => {
                            setDate(dr);
                            onDateChange?.(dr);
                        }}
                        numberOfMonths={noOfMonths}
                        disabled={{ after: new Date(), before: new Date(2023, 9, 16) }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

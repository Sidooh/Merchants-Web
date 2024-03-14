import { Status } from '@/lib/enums.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { cn, getStatusIcon } from '@/lib/utils.ts';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

type StatusChipType = {
    status?: Status;
    bg?: boolean;
    soft?: boolean;
    className?: string;
    statuses?: Status[];
    onStatusChange?: (status: Status) => void;
};

const StatusBadge = ({ status, statuses = [], onStatusChange }: StatusChipType) => {
    if (!status) return <p>N/A</p>;

    const Icon = getStatusIcon(status);

    const BadgeEl = (
        <Badge
            className={cn('px-1.5 md:px-2.5 py-0 md:py-0.5 space-x-1 pointer-events-none rounded-full', {
                'bg-[#c1fdad] text-[#1f7503]': [Status.COMPLETED, Status.ACTIVE, Status.PAID].includes(status),
                'bg-[#ffe495] text-[#624900]': status === Status.PENDING,
                'bg-[#ffa995] text-[#621200]': [Status.FAILED, Status.INACTIVE].includes(status),
                'bg-[#d4f2ff] text-[#1978a2]': status === Status.REFUNDED,
                'bg-[#c0cfce] text-[#283434]': status === Status.EXPIRED,
            })}
        >
            {Icon && <Icon />}
            <small>{status}</small>
        </Badge>
    );

    if (statuses && statuses?.length > 0 && typeof onStatusChange === 'function') {
        statuses = statuses?.filter((s) => s !== status);

        return (
            <DropdownMenu>
                <DropdownMenuTrigger>{BadgeEl}</DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statuses.map((s) => {
                        const Icon = getStatusIcon(s);
                        return (
                            <DropdownMenuCheckboxItem
                                key={s}
                                checked={s === status}
                                className={cn('space-x-1', {
                                    'text-[rgb(100,250,50)]': [Status.COMPLETED, Status.ACTIVE, Status.PAID].includes(
                                        s
                                    ),
                                    'text-[rgb(245,183,0)]': s === Status.PENDING,
                                    'text-[rgb(244,46,0)]': [Status.FAILED, Status.INACTIVE].includes(s),
                                    'text-[rgb(49,199,249)]': s === Status.REFUNDED,
                                })}
                                onCheckedChange={(checked) => checked && onStatusChange(s)}
                            >
                                {Icon && <Icon />} <span>{s}</span>
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return BadgeEl;
};

export default StatusBadge;

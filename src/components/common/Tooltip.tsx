import { Tooltip as BaseTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { ReactNode } from 'react';

type TooltipProps = {
    children: ReactNode;
    title: ReactNode;
    asChild?: boolean;
    placement?: 'top' | 'left' | 'bottom' | 'right';
};

const Tooltip = ({ children, title, placement, asChild = false }: TooltipProps) => {
    return (
        <TooltipProvider>
            <BaseTooltip>
                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
                <TooltipContent side={placement}>{title}</TooltipContent>
            </BaseTooltip>
        </TooltipProvider>
    );
};

export default Tooltip;

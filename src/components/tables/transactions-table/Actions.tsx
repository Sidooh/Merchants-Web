import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { FaRegEye } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { Transaction } from '@/lib/types.ts';

type ActionsProps = {
    transaction: Transaction;
};

export const Actions = ({ transaction }: ActionsProps) => {
    return (
        <div className={'flex items-center gap-2'}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            to={`/transactions/${transaction.id}`}
                            className={'rounded-full p-2 h-7 w-7 hover:bg-accent hover:text-accent-foreground'}
                        >
                            <FaRegEye className="h-3 w-3" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Transaction</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

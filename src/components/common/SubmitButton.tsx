import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button.tsx';
import * as React from 'react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import { cn } from '@/lib/utils.ts';
import { IconType } from 'react-icons';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    loadingText?: string;
    isLoading: boolean;
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> | IconType;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
    ({ text, loadingText = 'Loading...', isLoading, disabled, icon: Icon, className }, ref) => (
        <Button ref={ref} type={'submit'} disabled={disabled} className={cn('bg-primary', className)}>
            {isLoading ? (
                <>
                    {loadingText} <ReloadIcon className="ms-2 h-4 w-4 animate-spin" />
                </>
            ) : (
                <>
                    {text} <Icon className="ms-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
);

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;

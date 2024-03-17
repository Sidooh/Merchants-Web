import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button.tsx';
import * as React from 'react';
import { IconProps } from '@radix-ui/react-icons/dist/types';

type LoadingButtonProps = {
    text: string;
    loadingText?: string;
    isLoading: boolean;
    disabled: boolean;
    icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
};

const SubmitButton = ({ text, loadingText = 'Loading...', isLoading, disabled, icon: Icon }: LoadingButtonProps) => {
    return (
        <Button type={'submit'} disabled={disabled}>
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
    );
};

export default SubmitButton;

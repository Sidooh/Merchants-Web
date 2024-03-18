import { Dispatch, SetStateAction } from 'react';
import { useAuth } from '@/hooks/useAuth.ts';
import { useCheckPinMutation } from '@/services/accounts/accountsEndpoints.ts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PinConfirmationRequest } from '@/lib/types.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from '@/lib/utils.ts';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import SubmitButton from '@/components/common/SubmitButton.tsx';
import * as yup from 'yup';

type PinConfirmationFormProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onConfirmed: () => void;
};

const pinConfirmationSchema = yup.object({
    account_id: yup.number().integer().required(),
    pin: yup.string().length(4, `Must be 4 digits`).required('Pin number is required.'),
});

const PinConfirmationForm = ({ open, setOpen, onConfirmed }: PinConfirmationFormProps) => {
    const { user } = useAuth();
    const [checkPin, { isLoading }] = useCheckPinMutation();

    const form = useForm<PinConfirmationRequest>({
        resolver: yupResolver(pinConfirmationSchema),
        defaultValues: {
            account_id: user?.account_id,
        },
    });

    const handleSubmit: SubmitHandler<PinConfirmationRequest> = async (values) => {
        try {
            if (await checkPin(values).unwrap()) {
                onConfirmed();

                form.resetField('pin');
            }
        } catch (e) {
            toast({ titleText: 'Invalid Pin!', icon: 'warning', position: 'top' });

            form.resetField('pin');
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) form.resetField('pin');

        setOpen(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="sm:max-w-md space-y-4">
                        <DialogHeader>
                            <DialogTitle>Pin Confirmation</DialogTitle>
                            <DialogDescription>
                                Please confirm your Sidooh Pin to complete the purchase.
                            </DialogDescription>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="pin"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Pin</FormLabel>
                                    <FormControl>
                                        <Input placeholder="****" type={'password'} {...form.register('pin')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="sm:justify-between gap-y-3">
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" className={'text-red-700'}>
                                    Cancel <CrossCircledIcon className="ms-2 h-4 w-4" />
                                </Button>
                            </DialogClose>

                            <SubmitButton
                                disabled={isLoading || !form.formState.isValid}
                                isLoading={isLoading}
                                text={'Confirm'}
                                loadingText={'Confirming...'}
                                icon={CheckCircledIcon}
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PinConfirmationForm;

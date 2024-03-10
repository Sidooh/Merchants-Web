import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { cn } from '@/lib/utils.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { CaretSortIcon, CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FloatPurchaseRequest, LoginRequest, MpesaStore } from '@/lib/types.ts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toggle } from '@/components/ui/toggle.tsx';
import { useState } from 'react';
import { useGetMpesaStoresQuery } from '@/services/merchantsApi.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { login } from '@/features/auth/authSlice.ts';
import { Method } from '@/lib/enums.ts';

const formSchema = yup.object({
    agent: yup.string().max(100).required('Agent number is required.'),
    store: yup.string().max(100).required('Store number is required.'),
    amount: yup.string().max(100).required('Amount is required.'),
    method: yup.string().oneOf(Object.values(Method), 'Method must be MPESA or VOUCHER')
        .max(100).required('Payment method is required.'),
});

const FloatPurchaseForm = () => {
    const [isAddingStore, setIsAddingStore] = useState(false);

    const { user } = useAuth();
    const { data: stores, isLoading } = useGetMpesaStoresQuery(user.merchant_id);

    const form = useForm<FloatPurchaseRequest>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            method: Method.VOUCHER,
        },
    });

    if (isLoading) return <Skeleton className={'h-[25rem] w-2/5'} />;

    const handleSubmit: SubmitHandler<LoginRequest> = (values) => {
        console.log(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Buy Float</CardTitle>
                        <CardDescription>
                            Fill in the form below to purchase float.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-3">
                            <FormField
                                name="store"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Store</FormLabel>
                                        <div className="flex gap-3">
                                            <Select onValueChange={v => {
                                                const store: MpesaStore = stores.find(s => s.store == v);

                                                form.setValue('agent', store.store);
                                                form.setValue('store', store.agent);
                                            }} defaultValue={field.value}
                                                    disabled={isAddingStore}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a store" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {stores?.map(s => (
                                                        <SelectItem key={s.id} value={s.store}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Toggle variant={'outline'} aria-label="Toggle italic"
                                                    className={'text-nowrap'} onPressedChange={setIsAddingStore}>
                                                {isAddingStore ? <CheckIcon className="mr-2 h-4 w-4" /> :
                                                    <PlusIcon className="mr-2 h-4 w-4" />}
                                                {isAddingStore ? 'Select existing store' : 'Add store no'}.
                                            </Toggle>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {isAddingStore && (
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="store"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="xxxxxx"
                                                       type={'number'} {...form.register('store')} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="agent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Agent Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="xxxxxx"
                                                       type={'number'} {...form.register('agent')} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g: 200,000"
                                                   type={'number'} {...form.register('amount')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buy using</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(Method).map(m => <SelectItem key={m}
                                                                                            value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {form.getValues('method') === Method.MPESA && (
                            <FormField
                                control={form.control}
                                name="debit_account"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0712345678"
                                                   type={'number'} {...form.register('debit_account')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {form.getValues('method') === Method.VOUCHER && (
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pin</FormLabel>
                                        <FormControl>
                                            <Input placeholder="****" type={'number'} {...form.register('pin')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>
                    <CardFooter className="justify-end space-x-2">
                        <Button type={'submit'} disabled={isLoading || !form.formState.isValid}>Purchase</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default FloatPurchaseForm;
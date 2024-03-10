import FloatPurchaseForm from '@/pages/default/components/FloatPurchaseForm.tsx';
import { useAuth } from '@/hooks/useAuth.ts';
import { useGetMpesaStoresQuery } from '@/services/merchantsApi.ts';

const Default = () => {
    return (
        <div className={'flex justify-center md:mt-20'}>
            <FloatPurchaseForm />
        </div>
    );
};

export default Default;
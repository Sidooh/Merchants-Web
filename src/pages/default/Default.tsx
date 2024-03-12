import FloatPurchaseForm from '@/pages/default/components/FloatPurchaseForm.tsx';
import Transactions from './components/Transactions';

const Default = () => {
    return (
        <div className={'grid grid-cols-3 justify-center gap-3'}>
            <FloatPurchaseForm />

            <div className="col-span-2">
                <Transactions />
            </div>
        </div>
    );
};

export default Default;

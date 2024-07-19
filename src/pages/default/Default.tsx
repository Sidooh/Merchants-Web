import Transactions from './components/Transactions';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

const Default = () => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:h-20">
                <Link to={'/buy-mpesa-float'} className={'flex flex-col'}>
                    <Button className={'flex-1 font-extrabold bg-primary'}>Buy MPESA Float</Button>
                </Link>
                <Link to={'/voucher-top-up'} className={'flex flex-col'}>
                    <Button className={'flex-1 font-extrabold bg-[#F5B700] text-primary hover:bg-[#ffd045]'}>
                        Top Up Voucher
                    </Button>
                </Link>
                <Link to={'/share-voucher'} className={'flex flex-col'}>
                    <Button className={'flex-1 font-extrabold bg-[#648381] hover:bg-[#809e9c]'}>Share Voucher</Button>
                </Link>
            </div>

            <div className="col-span-2">
                <Transactions />
            </div>
        </div>
    );
};

export default Default;

import VoucherBalance from '@/pages/my-account/VoucherBalance.tsx';
import MerchantEarningBalances from '@/pages/my-account/MerchantEarningBalances.tsx';
import SavingsAndInterestBalances from '@/pages/my-account/SavingsAndInterestBalances.tsx';

const MyAccount = () => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Balances</h2>
                    <hr />
                </div>
                <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
                    <VoucherBalance />
                    <MerchantEarningBalances />
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">Savings & Interest Earned</h2>
                <SavingsAndInterestBalances />
            </div>
        </div>
    );
};

export default MyAccount;

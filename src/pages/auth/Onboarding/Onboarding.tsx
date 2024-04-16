import { useEffect, useState } from 'react';
import StagePhone from '@/pages/auth/Onboarding/StagePhone.tsx';
import StageKYC from '@/pages/auth/Onboarding/StageKYC.tsx';
import StageInviteCode from '@/pages/auth/Onboarding/StageInviteCode.tsx';
import { OnboardingStage } from '@/lib/enums.ts';
import { useLocation } from 'react-router-dom';
import { Account } from '@/lib/types.ts';

const Onboarding = () => {
    const location = useLocation();

    const [account, setAccount] = useState<Account>();
    const [stage, setStage] = useState<OnboardingStage>(OnboardingStage.PHONE_VERIFICATION);

    useEffect(() => {
        if (account) {
            setStage(OnboardingStage.KYC);
        }
    }, [account]);

    return (
        <>
            {stage === OnboardingStage.PHONE_VERIFICATION && <StagePhone setStage={setStage} setAccount={setAccount} />}
            {stage === OnboardingStage.INVITE_CODE && (
                <StageInviteCode setStage={setStage} phone={location.state.phone} />
            )}
            {stage === OnboardingStage.KYC && account && <StageKYC account={account} />}
        </>
    );
};

export default Onboarding;

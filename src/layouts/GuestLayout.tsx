import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import PageLoader from '@/components/loaders/PageLoader';
import { CONFIG } from '@/config.ts';
import { IMAGES } from '@/constants/images';

const GuestLayout = () => (
    <div className={'flex flex-col relative items-center justify-center min-h-screen min-w-screen p-6'}>
        <div className={'flex items-center justify-center mb-4 flex-col relative'}>
            <img
                alt={''}
                className="hidden lg:block absolute end-[-8.75rem] top-[-5.125rem]"
                src={IMAGES.icons.spotIllustrations.bg_shape}
                width="250"
            />
            <img
                alt={''}
                className="hidden lg:block absolute start-[-6.75rem] bottom-[-2.4375rem]"
                src={IMAGES.icons.spotIllustrations.shape_1}
                width="150"
            />

            <img className="me-2" src={IMAGES.logos.sidooh} alt="Logo" width={120} />
            <h6 className={'font-semibold text-[10pt]'} style={{ margin: `-.48rem 0 2rem` }}>
                {CONFIG.app.name}
            </h6>

            <Suspense fallback={<PageLoader />}>
                <Outlet />
            </Suspense>
        </div>
    </div>
);

export default GuestLayout;

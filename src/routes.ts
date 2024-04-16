import { GrTransaction } from 'react-icons/gr';
import { RouteType } from '@/lib/types';
import { MdOutlineDashboard, MdSupportAgent } from 'react-icons/md';
import { RiAccountPinCircleLine } from 'react-icons/ri';

const routes: RouteType[] = [
    {
        label: 'Dashboard',
        children: [
            {
                name: 'Home',
                to: '/',
                icon: MdOutlineDashboard,
            },
        ],
    },
    {
        label: 'App',
        children: [
            {
                name: 'Buy MPESA Float',
                to: '/buy-mpesa-float',
                icon: MdSupportAgent,
            },
            {
                name: 'Voucher Top Up',
                to: '/voucher-top-up',
                icon: GrTransaction,
            },
        ],
    },
    {
        label: 'User',
        children: [
            {
                name: 'My Account',
                to: '/my-account',
                icon: RiAccountPinCircleLine,
            },
        ],
    },
];

export default routes;

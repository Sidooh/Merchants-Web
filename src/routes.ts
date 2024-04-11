import { FaChartPie } from 'react-icons/fa6';
import { GrTransaction } from 'react-icons/gr';
import { RouteType } from '@/lib/types';
import { MdSupportAgent } from 'react-icons/md';

const routes: RouteType[] = [
    {
        label: 'Dashboard',
        children: [
            {
                name: 'Home',
                to: '/',
                icon: FaChartPie,
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
];

export default routes;

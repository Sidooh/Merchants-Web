import { useAppSelector } from '@/app/store';

export const useAuth = () => {
    return useAppSelector((state) => state.auth);
};

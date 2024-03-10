import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Swal, { SweetAlertOptions } from 'sweetalert2';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const toast = async (options: SweetAlertOptions = {}) => {
    const defaultOptions: SweetAlertOptions = {
        icon: 'success',
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 7000,
    };

    await Swal.fire({ ...defaultOptions, ...options });
};
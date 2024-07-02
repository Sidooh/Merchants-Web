import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Status } from '@/lib/enums.ts';
import { IconType } from 'react-icons';
import { FaCalendarXmark, FaCheck, FaCircleExclamation, FaCircleInfo, FaHourglassStart } from 'react-icons/fa6';
import moment from 'moment';
import { authApi } from '@/features/auth/authApi.ts';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import secureLocalStorage from 'react-secure-storage';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const toast = async (options: SweetAlertOptions = {}) => {
    const defaultOptions: SweetAlertOptions = {
        icon: 'success',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 7000,
        ...options,
    };

    await Swal.fire(defaultOptions);
};

export const decodeJWT = (token: string) => {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
};

export const Str = {
    headline: (str: string) => {
        if (!str) return '';

        str = str.replaceAll('_', ' ').replaceAll('-', ' ');

        return str.replaceAll(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
    },
    ucFirst: (str: string) => {
        str = str.toLowerCase();

        return str.charAt(0).toUpperCase() + str.slice(1);
    },
};

export function getUniquePropertyValues<T>(array: T[], propertyName: keyof T): T[keyof T][] {
    const uniqueValues: Set<T[keyof T]> = new Set();

    array.forEach((item) => {
        uniqueValues.add(item[propertyName]);
    });

    return Array.from(uniqueValues);
}

export const getStatusIcon = (status: Status): IconType | undefined => {
    if ([Status.COMPLETED, Status.ACTIVE, Status.PAID].includes(status)) return FaCheck;
    if ([Status.FAILED, Status.INACTIVE].includes(status)) return FaCircleExclamation;
    if (status === Status.PENDING) return FaHourglassStart;
    if (status === Status.REFUNDED) return FaCircleInfo;
    if (status === Status.EXPIRED) return FaCalendarXmark;
};

const REFERENCE = moment();
const TODAY = REFERENCE.clone().startOf('day');
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
export const getRelativeDateAndTime = (date: string | Date) => {
    let relativeDate: string;
    const time = moment(date).format('hh:mm A');

    if (time === 'Invalid date') console.error(date);

    if (moment(date).isSame(TODAY, 'd')) {
        relativeDate = 'Today';
    } else if (moment(date).isSame(YESTERDAY, 'd')) {
        relativeDate = 'Yesterday';
    } else {
        relativeDate = moment(date).format('D.M.y');
    }

    const toString = () => `${relativeDate} @${time}`;

    return { date: relativeDate, time, toString };
};

export const currencyFormat = (number?: number, currency = 'KES', decimals = 2): string => {
    const n = Number(number);

    if (isNaN(n)) return '0';

    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
        maximumFractionDigits: decimals,
    }).format(n);
};

export const getAuthToken = async () => {
    let token = JSON.parse(String(secureLocalStorage.getItem('token')));

    if (!token) token = await authApi.authenticateService();

    const expiresAt = moment.unix(decodeJWT(token).exp);

    if (moment().add(3, 'm').isAfter(expiresAt)) {
        token = await authApi.authenticateService();
    }

    return token;
};

export function providesList<R extends { id: string | number }[], T extends string>(
    resultsWithIds: R | undefined,
    tagType: T
) {
    return resultsWithIds
        ? [{ type: tagType, id: 'LIST' }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
        : [{ type: tagType, id: 'LIST' }];
}

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string';
}

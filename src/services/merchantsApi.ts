import { coreApi } from '@/services/coreApi';
import { ApiResponse, MpesaStore } from '@/lib/types';

const merchantsApi = coreApi.injectEndpoints({
    endpoints: (build) => ({
        getMpesaStores: build.query<MpesaStore[], number>({
            query: (id) => `/merchants/${id}/mpesa-store-accounts`,
            transformResponse: (val: ApiResponse<MpesaStore[]>) => val.data,
        }),
    }),
});

export const { useGetMpesaStoresQuery } = merchantsApi;

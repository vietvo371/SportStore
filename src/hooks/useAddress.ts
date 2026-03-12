import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services/address.service';
import { AddressPayload } from '@/types/address.types';
import Cookies from 'js-cookie';

export const addressKeys = {
    all: ['addresses'] as const,
    detail: (id: number) => [...addressKeys.all, id] as const,
};

export const useAddress = () => {
    const queryClient = useQueryClient();

    const { data: addresses, isLoading, error } = useQuery({
        queryKey: addressKeys.all,
        queryFn: addressService.getAddresses,
        enabled: !!Cookies.get('token'),
    });

    const createMutation = useMutation({
        mutationFn: (payload: AddressPayload) => addressService.createAddress(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<AddressPayload> }) =>
            addressService.updateAddress(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => addressService.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: addressKeys.all });
        },
    });

    return {
        addresses,
        isLoading,
        error,
        createAddress: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateAddress: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteAddress: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
};

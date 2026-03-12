import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/wishlist.service';
import { useAuthStore } from '@/store/auth.store';
import Cookies from 'js-cookie';

export const wishlistKeys = {
    all: ['wishlist'] as const,
    list: (page: number) => [...wishlistKeys.all, 'list', page] as const,
};

export const useWishlist = (page: number = 1) => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const { data, isLoading, error } = useQuery({
        queryKey: wishlistKeys.list(page),
        queryFn: () => wishlistService.getWishlist(page),
        enabled: !!Cookies.get('token'),
    });

    const toggleMutation = useMutation({
        mutationFn: (productId: number) => wishlistService.toggleWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
        },
    });

    return {
        wishlistData: data,
        isLoading,
        error,
        toggleWishlist: toggleMutation.mutateAsync,
        isToggling: toggleMutation.isPending,
    };
};

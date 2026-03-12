import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/cart.store';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types';

export const CART_QUERY_KEY = ['cart'];

export function useCart() {
    const queryClient = useQueryClient();
    const setItemCount = useCartStore((state) => state.setItemCount);

    // Fetch Cart
    const { data: cart, isLoading, error } = useQuery({
        queryKey: CART_QUERY_KEY,
        queryFn: cartService.getCart,
        enabled: !!Cookies.get('token'),
        retry: false, // Don't retry if user is unauthenticated
        staleTime: 1000 * 60 * 5, // 5 mins
    });

    // Update global item count when cart data changes
    useEffect(() => {
        if (cart) {
            setItemCount(cart.tong_so_luong || 0);
        } else if (error) {
            setItemCount(0);
        }
    }, [cart, error, setItemCount]);

    // Add to Cart Mutation
    const addToCartMutation = useMutation({
        mutationFn: (payload: AddToCartPayload) => cartService.addItem(payload),
        onSuccess: (newCart) => {
            queryClient.setQueryData(CART_QUERY_KEY, newCart);
        },
    });

    // Update Item Quantity Mutation
    const updateItemMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateCartItemPayload }) =>
            cartService.updateItem(id, payload),
        onSuccess: (newCart) => {
            queryClient.setQueryData(CART_QUERY_KEY, newCart);
        },
    });

    // Remove Item Mutation
    const removeItemMutation = useMutation({
        mutationFn: (id: number) => cartService.removeItem(id),
        onSuccess: (newCart) => {
            queryClient.setQueryData(CART_QUERY_KEY, newCart);
        },
    });

    // Clear Cart Mutation
    const clearCartMutation = useMutation({
        mutationFn: () => cartService.clearCart(),
        onSuccess: () => {
            queryClient.setQueryData(CART_QUERY_KEY, null);
        },
    });

    return {
        cart,
        isLoading,
        addToCart: addToCartMutation.mutateAsync,
        isAdding: addToCartMutation.isPending,
        updateItem: updateItemMutation.mutateAsync,
        isUpdating: updateItemMutation.isPending,
        removeItem: removeItemMutation.mutateAsync,
        isRemoving: removeItemMutation.isPending,
        clearCart: clearCartMutation.mutateAsync,
        isClearing: clearCartMutation.isPending,
    };
}

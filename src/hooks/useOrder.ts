import { useMutation, useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { OrderPayload } from '@/types/order.types';
import Cookies from 'js-cookie';

export const orderKeys = {
    all: ['orders'] as const,
    list: (page: number) => [...orderKeys.all, { page }] as const,
    detail: (code: string) => [...orderKeys.all, code] as const,
};

export const useOrder = () => {
    const placeOrderMutation = useMutation({
        mutationFn: (payload: OrderPayload) => orderService.placeOrder(payload),
    });

    return {
        placeOrder: placeOrderMutation.mutateAsync,
        isPlacing: placeOrderMutation.isPending,
        placeOrderError: placeOrderMutation.error,
    };
};

export const useOrderHistory = (page = 1) => {
    return useQuery({
        queryKey: orderKeys.list(page),
        queryFn: () => orderService.getOrders(page),
        enabled: !!Cookies.get('token'),
    });
};

export const useOrderDetails = (code: string) => {
    return useQuery({
        queryKey: orderKeys.detail(code),
        queryFn: () => orderService.getOrderDetails(code),
        enabled: !!code && !!Cookies.get('token'),
    });
};

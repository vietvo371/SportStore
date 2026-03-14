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

    const createPaymentUrlMutation = useMutation({
        mutationFn: ({ ma_don_hang, phuong_thuc }: { ma_don_hang: string, phuong_thuc: 'vnpay' | 'momo' }) => 
            orderService.createPaymentUrl(ma_don_hang, phuong_thuc),
    });

    const verifyVNPayReturnMutation = useMutation({
        mutationFn: (params: any) => orderService.verifyVNPayReturn(params),
    });

    const verifyMomoReturnMutation = useMutation({
        mutationFn: (params: any) => orderService.verifyMomoReturn(params),
    });

    return {
        placeOrder: placeOrderMutation.mutateAsync,
        isPlacing: placeOrderMutation.isPending,
        placeOrderError: placeOrderMutation.error,
        createPaymentUrl: createPaymentUrlMutation.mutateAsync,
        isCreatingPaymentUrl: createPaymentUrlMutation.isPending,
        verifyVNPayReturn: verifyVNPayReturnMutation.mutateAsync,
        isVerifying: verifyVNPayReturnMutation.isPending,
        verifyMomoReturn: verifyMomoReturnMutation.mutateAsync,
        isVerifyingMomo: verifyMomoReturnMutation.isPending,
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

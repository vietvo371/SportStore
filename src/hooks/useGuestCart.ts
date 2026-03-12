/**
 * useGuestCart – Giỏ hàng cho người dùng chưa đăng nhập (localStorage)
 *
 * Cách hoạt động:
 * - Guest thêm/xóa sản phẩm → lưu vào localStorage
 * - Khi user đăng nhập → gọi mergeGuestCart() để hợp nhất vào DB
 */

export interface GuestCartItem {
    san_pham_id: number;
    bien_the_id: number | null;
    ten_san_pham: string;
    thong_tin_bien_the: string;
    so_luong: number;
    don_gia: number;
    anh_url: string;
}

const GUEST_CART_KEY = 'sportstore_guest_cart';

export function useGuestCart() {
    const getItems = (): GuestCartItem[] => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(GUEST_CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const saveItems = (items: GuestCartItem[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    };

    const addItem = (item: GuestCartItem) => {
        const items = getItems();
        const existing = items.findIndex(
            (i) => i.san_pham_id === item.san_pham_id && i.bien_the_id === item.bien_the_id
        );
        if (existing >= 0) {
            items[existing].so_luong += item.so_luong;
        } else {
            items.push(item);
        }
        saveItems(items);
    };

    const removeItem = (san_pham_id: number, bien_the_id: number | null) => {
        const items = getItems().filter(
            (i) => !(i.san_pham_id === san_pham_id && i.bien_the_id === bien_the_id)
        );
        saveItems(items);
    };

    const updateQuantity = (san_pham_id: number, bien_the_id: number | null, so_luong: number) => {
        const items = getItems().map((i) =>
            i.san_pham_id === san_pham_id && i.bien_the_id === bien_the_id
                ? { ...i, so_luong }
                : i
        );
        saveItems(items);
    };

    const clearCart = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(GUEST_CART_KEY);
    };

    const getTotalCount = () => getItems().reduce((sum, i) => sum + i.so_luong, 0);

    const getTotalPrice = () => getItems().reduce((sum, i) => sum + i.don_gia * i.so_luong, 0);

    return {
        getItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalCount,
        getTotalPrice,
    };
}

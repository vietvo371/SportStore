---
description: triển khai Google OAuth login, Guest Cart và Email Verify cho sportstore-client
---

# Auth Enhancement – Frontend

## Phase 1: Google OAuth Login

### Files đã tạo/sửa

| File | Mô tả |
|---|---|
| `src/app/(auth)/login/page.tsx` | Thêm nút "Tiếp tục với Google" |
| `src/app/(auth)/auth/callback/page.tsx` | Trang nhận `?code=xxx` từ Google |
| `src/services/auth.service.ts` | Thêm `getGoogleRedirectUrl()` và `loginWithGoogle()` |

### Luồng hoạt động

```
Click "Tiếp tục với Google"
 → GET /api/auth/google/redirect → nhận URL
 → window.location.href = url (redirect đến Google)
 → Google redirect về /auth/callback?code=xxx
 → /auth/callback đọc code → POST /api/auth/google/callback { code }
 → nhận { user, token } → setAuth() → redirect /admin hoặc /
```

### auth.service.ts

```typescript
getGoogleRedirectUrl: async () => {
    const res = await apiClient.get('/auth/google/redirect');
    return res.data.url;
},
loginWithGoogle: async (code: string) => {
    const res = await apiClient.post('/auth/google/callback', { code });
    return res.data;  // { user, token }
},
```

### Callback Page States

`/auth/callback` có 3 trạng thái: `loading` → `success` (redirect) | `error`

---

## Phase 2: Guest Cart (Vãn lai)

### File đã tạo

`src/hooks/useGuestCart.ts`

```typescript
const guestCart = useGuestCart();

guestCart.addItem({ san_pham_id, bien_the_id, ten_san_pham, so_luong, don_gia, anh_url });
guestCart.getItems();       // đọc localStorage
guestCart.removeItem(id, variantId);
guestCart.clearCart();      // xóa sau khi merge
guestCart.getTotalCount();
guestCart.getTotalPrice();
```

### Tích hợp merge sau khi đăng nhập

Thêm vào login success handler (cả email/password lẫn Google):

```typescript
const guestCart = useGuestCart();
const items = guestCart.getItems();
if (items.length > 0) {
    await apiClient.post('/cart/merge', { items });
    guestCart.clearCart();
}
```

### LocalStorage key

```
sportstore_guest_cart
```

---

## Phase 3: Email Verification Badge

### Files đã tạo

- `src/components/auth/EmailVerifyBanner.tsx`: Banner nhắc nhở kèm nút "Gửi lại link".
- `src/app/layout.tsx`: Đã tích hợp `<EmailVerifyBanner />` ngay trên `<main>`.

### Trạng thái hiển thị

- Chỉ hiện khi: `isAuthenticated` && `!user.xac_thuc_email_luc`.
- Tự động ẩn nếu người dùng click "Tắt tạm thời" (dismiss).

### Link xác thực từ Email

- Khi click vào link từ email, nó sẽ dẫn về Backend endpoint.
- TODO: Có thể tạo một trang frontend trung gian `/verify-email` để hiển thị UI success đẹp hơn trước khi redirect.

---

## Env Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

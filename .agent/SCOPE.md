# SCOPE — sportstore-client

## ✅ IN SCOPE (MVP pages & features)

### Auth
- Trang đăng nhập `/login`
- Trang đăng ký `/register`
- Trang profile `/profile` (xem + cập nhật)
- Quản lý địa chỉ `/profile/addresses`

### Catalog (Public)
- Trang chủ `/` — hero, featured products, categories
- Danh sách sản phẩm `/products` — filter, search, pagination
- Chi tiết sản phẩm `/products/[slug]` — gallery, variants, review
- Danh mục `/categories/[slug]`

### Giỏ hàng & Checkout
- Drawer giỏ hàng (slide-in từ phải)
- Trang checkout `/checkout`
- Trang xác nhận đơn hàng `/orders/[code]/success`
- Lịch sử đơn hàng `/orders`
- Chi tiết đơn hàng `/orders/[code]`

### AI Chatbot
- Widget chat nổi (góc dưới phải) trên mọi trang
- Lịch sử hội thoại trong session

### Wishlist
- Nút yêu thích trên ProductCard và ProductDetail
- Trang wishlist `/wishlist`

### Recommendation
- Section "Gợi ý cho bạn" trên trang chủ
- Section "Sản phẩm tương tự" trên trang detail

### Admin
- `/admin/products` — CRUD sản phẩm
- `/admin/orders` — Quản lý đơn hàng + đổi trạng thái
- `/admin/categories` — Quản lý danh mục
- `/admin/coupons` — Quản lý mã giảm giá

---

## ❌ OUT OF SCOPE

- Payment UI thật (chỉ COD + stub)
- Admin analytics dashboard
- Push notification (chỉ in-app notification list)
- Mobile app (chỉ responsive web)

## ⏳ DEFER (sau MVP)

- Dark mode
- Multi-language (i18n)
- Product comparison
- Flash sale countdown

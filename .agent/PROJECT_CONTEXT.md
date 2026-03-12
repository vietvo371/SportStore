# PROJECT CONTEXT — sportstore-client

**Cập nhật:** 03/2025
**Trạng thái:** Vừa scaffold — đang setup base files
**Dành cho:** AI Agent tiếp tục dự án

---

## 🎯 Tổng quan

**Tên:** SportStore Client (sportstore-client)
**Loại:** Next.js 14 frontend cho website bán đồ thể thao
**Framework:** Next.js 14 (App Router, TypeScript)
**Styling:** TailwindCSS + Shadcn UI
**Đề tài:** KLTN — Đại học Duy Tân 2025

> ⚠️ **QUAN TRỌNG:** Frontend này chỉ giao tiếp với `sportstore-be` (Laravel).
> Không bao giờ gọi Gemini hoặc Python AI trực tiếp.

---

## 🏗️ Kiến trúc monorepo

```
KLTN_94_NGOC/
├── sportstore-client/   ← BẠN ĐANG Ở ĐÂY (port 3000)
├── sportstore-be/       (Laravel 10 — port 8000)
└── sportstore-ai/       (FastAPI Python — port 8001)
```

**FE chỉ biết về BE:**
```
sportstore-client → POST/GET http://localhost:8000/api/v1/* → sportstore-be
```

---

## 📦 Stack & Packages

| Package | Version | Vai trò |
|---------|---------|---------|
| next | 14.x | Framework |
| react | 18.x | UI |
| typescript | 5.x | Types (strict) |
| tailwindcss | 3.x | Styling |
| axios | latest | HTTP client |
| zustand | 5.x | Client state |
| @tanstack/react-query | 5.x | Server state |
| js-cookie | 3.x | Cookie management |

---

## 📁 Key files

| File | Vai trò |
|------|---------|
| `src/lib/api.ts` | **BẮT BUỘC** dùng cho mọi API call |
| `src/types/api.types.ts` | ApiResponse, PaginatedResponse types |
| `src/store/auth.store.ts` | User state + token |
| `src/store/cart.store.ts` | Cart items + count |
| `src/services/*.service.ts` | API call functions by domain |
| `.env.local` | `NEXT_PUBLIC_API_URL` |

---

## 🔌 BE API Endpoints (phải match sportstore-be)

> Xem đầy đủ: `../sportstore-be/.agent/PROJECT_CONTEXT.md`

```
Base URL: http://localhost:8000/api/v1

Auth:
  POST /auth/register       → Đăng ký
  POST /auth/login          → Đăng nhập → trả { token, user: { ..., is_master } }
  POST /auth/logout         → Đăng xuất
  GET  /auth/me             → Profile (có cờ `is_master`)

Products:
  GET  /products            → Danh sách (filter, search, paginate)
  GET  /products/{slug}     → Chi tiết sản phẩm

Cart:
  GET  /cart                → Giỏ hàng hiện tại
  POST /cart/items          → Thêm item
  PUT  /cart/items/{id}     → Cập nhật số lượng
  DELETE /cart/items/{id}   → Xóa item

Orders:
  POST /orders              → Đặt hàng (checkout)
  GET  /orders              → Lịch sử đơn hàng
  GET  /orders/{code}       → Chi tiết đơn hàng

Chatbot:
  POST /chatbot/message     → Gửi tin nhắn → nhận reply từ Gemini

Recommendations:
  GET  /recommendations     → Danh sách gợi ý (cá nhân hóa)
  POST /behaviors           → Ghi nhận hành vi (view, click...)
```

---

## 🔐 Authentication flow

```
1. POST /auth/login → nhận { token }
2. Lưu token vào cookie (js-cookie)
3. apiClient interceptor tự đính kèm Authorization: Bearer {token}
4. 401 response → redirect /login
5. POST /auth/logout → xóa cookie
```

---

## 🌐 ENV Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=SportStore
```

---

## 🧪 Dev commands

```bash
yarn dev          # port 3000
yarn build        # production build
yarn lint         # ESLint check
```

---

## ⚠️ Critical Rules

1. ❗ Mọi HTTP call qua `src/lib/api.ts` — không dùng axios/fetch thẳng
2. ❗ Không dùng `any` — type đầy đủ từ `src/types/`
3. ❗ Server Component mặc định, `'use client'` khi cần thiết
4. ❗ Không hard-code URL — dùng `process.env.NEXT_PUBLIC_API_URL`
5. ✅ React Query cho server data, Zustand cho client state
6. ✅ Cập nhật `IMPLEMENTATION_STATUS.md` sau mỗi module
7. ✅ Kiểm tra `../sportstore-be/.agent/` khi cần biết BE response shape

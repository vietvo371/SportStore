# AGENT HANDOFF PROMPT — sportstore-client

**Copy toàn bộ nội dung dưới đây và paste vào chat với agent mới.**

---

```
Bạn đang tiếp tục dự án sportstore-client — Next.js 14 frontend cho website bán đồ thể thao (KLTN Đại học Duy Tân 2025).

## 📁 BẮT ĐẦU: Đọc các file sau theo thứ tự

1. @[.agent/PROJECT_CONTEXT.md]       ← Stack, API endpoints, auth flow, critical rules
2. @[.agent/SCOPE.md]                 ← Danh sách pages/features cần làm
3. @[.agent/ARCHITECTURE.md]          ← Folder structure, state management pattern
4. @[.agent/IMPLEMENTATION_STATUS.md] ← Tiến độ hiện tại

## ⚠️ QUAN TRỌNG: FE phải match BE

Backend context: @[../sportstore-be/.agent/PROJECT_CONTEXT.md]
- API Base URL: http://localhost:8000/api/v1
- Response format: { success, message, data, meta? }
- Auth: Sanctum Bearer Token trong cookie

## ⚠️ CRITICAL RULES

1. Mọi HTTP call qua `src/lib/api.ts` — không dùng axios/fetch thẳng
2. Không dùng `any` trong TypeScript
3. Server Component mặc định, 'use client' khi cần
4. Hard-code URL → KHÔNG — dùng env NEXT_PUBLIC_API_URL
5. Plan trước → chờ duyệt → implement sau

## 🧪 Dev

```bash
yarn dev        # port 3000
yarn build
yarn lint
```

## 🎯 Nhiệm vụ tiếp theo

Xem @[.agent/IMPLEMENTATION_STATUS.md] — ưu tiên:
1. src/lib/api.ts (Axios client)
2. src/types/ (TypeScript types match BE)
3. src/store/ (Zustand: auth, cart)
4. Layout + Header
5. Auth pages
6. Product pages

Bắt đầu bằng cách đọc .agent/PROJECT_CONTEXT.md!
```

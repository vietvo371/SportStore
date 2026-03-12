# AGENT RULESET — sportstore-client (Next.js)

## Bạn phải LUÔN:
- Đọc `.agent/` **trước** khi bắt đầu bất kỳ tác vụ nào
- Đồng bộ với `sportstore-be` — API endpoint, response shape, auth flow phải khớp 100%
- **Plan trước → chờ duyệt → implement sau**
- Dùng `apiClient` (từ `src/lib/api.ts`) cho **mọi** HTTP call — không dùng fetch/axios thẳng
- Dùng TypeScript strict — **không dùng `any`**, đặt type đầy đủ từ `src/types/`
- State server: **React Query** (`useQuery`, `useMutation`)
- State client: **Zustand** (auth, cart, UI state)
- Mỗi page/component dùng **Server Component** trừ khi cần interactivity
- Cập nhật `IMPLEMENTATION_STATUS.md` sau mỗi module hoàn thành

## Bạn phải KHÔNG BAO GIỜ:
- Gọi Gemini / Python AI trực tiếp — FE chỉ gọi `sportstore-be`
- **KHÔNG BAO GIỜ bọc/unwrap data nhiều tầng (Double-Unwrapping)**: 
  - `apiClient` (axios interceptor) ĐÃ xử lý `response.data`, do đó nó trả về trực tiếp object `ApiResponse` (chứa `success`, `message`, `data`).
  - Trong `service.ts`: CHỈ `return apiClient.get(...)`. **CẤM** dùng `return response.data` vì nó sẽ trích xuất trường `data` của BE, làm mất `success/message` và gây lỗi logic ở Hook.
  - Trong `hooks` hoặc `components`: Đây mới là nơi bạn truy cập `rolesQuery.data.data` để lấy payload thực tế.
- Import component Library không có trong `package.json`
- Hard-code URL API — chỉ dùng `NEXT_PUBLIC_API_URL` từ env
- Lưu token vào `localStorage` — chỉ dùng httpOnly cookie qua Sanctum

## Nếu không chắc:
- **Kiểm tra BE `.agent/ARCHITECTURE.md`** trước — FE phải match BE
- DỪNG và hỏi nếu vẫn không rõ

# Setup Auth Model in MockAPI

## Bước 1: Tạo Resource "auth-users" trên MockAPI

1. Vào https://mockapi.com/app/dashboard
2. Mở project `QLKS-VIO`
3. Click "+ New Endpoint"
4. Nhập tên resource: `auth-users`
5. Click "Create"

## Bước 2: Import Dữ Liệu Người Dùng

1. Tìm file [mockapi-data/auth-users.json](../../mockapi-data/auth-users.json) trong workspace
2. Copy toàn bộ nội dung file (Ctrl+A → Ctrl+C)
3. Trên dashboard MockAPI, vào resource `auth-users`
4. Tìm phần "Sample Data" hoặc "Edit"
5. Paste JSON vào
6. Click "Save"

## Bước 3: Kiểm Tra

- GET `https://api.mockapi.com/api/auth-users`
- Nếu thấy array 3 users → cài đặt thành công ✅

## Login Credentials

Sau khi import, bạn có thể dùng những tài khoản này:

- **Admin**: admin@aurelia.com / aurelia123
- **User 1**: user@aurelia.com / aurelia123  
- **User 2**: demo@vio.com / demo1234

Nếu muốn thêm user khác, edit file `auth-users.json` hoặc thêm trực tiếp trên MockAPI dashboard.

## Cách POST thêm user mới

```bash
curl -X POST https://api.mockapi.com/api/auth-users \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "usr-user-4",
    "name": "New User",
    "email": "newuser@example.com",
    "password": "pass1234",
    "role": "user"
  }'
```

## Các thay đổi trong code

- [app/api/auth/login/route.ts](../../app/api/auth/login/route.ts) - Bây giờ fetch users từ MockAPI thay vì hardcode
- Nếu MockAPI không available, route sẽ fallback và return empty array (401 Unauthorized)

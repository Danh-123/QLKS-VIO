# MockAPI Setup Guide

## Bước 1: Tạo Project trên MockAPI

1. Vào https://mockapi.com/
2. Đăng nhập/Đăng ký (GitHub hoặc Email)
3. Click "Create" → "New Project"
4. Đặt tên project: `vio-hotel`

## Bước 2: Tạo 7 Resources

Cho mỗi resource dưới đây:

1. Click "+" (Add Resource)
2. Nhập **Resource name** (chính xác như dưới)
3. Copy JSON sample từ file `MOCKAPI_SAMPLES.md`
4. Paste vào "Sample Data"
5. Click "Save"

### Resources cần tạo:

- [ ] `rooms`
- [ ] `bookings`
- [ ] `users`
- [ ] `contacts`
- [ ] `pricing_rules`
- [ ] `staff`
- [ ] `customers`

## Bước 3: Lấy Base URL

Sau khi tạo project, sao chép **Base URL** từ dashboard:
```
https://YOUR-PROJECT.mockapi.com/api
```

Ví dụ: `https://6xyz1234.mockapi.com/api`

## Bước 3.1: Lấy API Key nếu project yêu cầu

1. Vào `Settings` → `API Keys`
2. Tạo hoặc copy key hiện có
3. Dán key vào `.env.local`

```env
MOCKAPI_API_KEY=YOUR_API_KEY_HERE
```

## Bước 4: Cập nhật .env.local

1. Mở file `.env.local` trong project
2. Cập nhật:
```env
NEXT_PUBLIC_MOCKAPI_BASE_URL=https://YOUR-PROJECT.mockapi.com/api
MOCKAPI_API_KEY=YOUR_API_KEY_HERE
```

## Bước 5: Restart Dev Server

```bash
npm run dev
```

## API Endpoints

Sau khi setup, tất cả endpoints sẽ tự động available:

```
# Rooms
GET    /api/rooms
GET    /api/rooms/:id
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id

# Bookings
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id

# Users
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

# Contacts
GET    /api/contacts
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id

# Pricing Rules
GET    /api/pricing_rules
POST   /api/pricing_rules
PUT    /api/pricing_rules/:id
DELETE /api/pricing_rules/:id

# Staff
GET    /api/staff
POST   /api/staff
PUT    /api/staff/:id
DELETE /api/staff/:id

# Customers
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

## Kiểm tra kết nối

Mở browser và test:
```
https://YOUR-PROJECT.mockapi.com/api/rooms
https://YOUR-PROJECT.mockapi.com/api/bookings
https://YOUR-PROJECT.mockapi.com/api/users
```

Nếu thấy JSON → Setup thành công ✅

## Fallback (Nếu MockAPI không available)

Nếu MockAPI down, app tự động fallback và return empty arrays (không crash).

Xem logs để debug:
```bash
# Terminal sẽ show error
Error fetching rooms from MockAPI: ...
```

## Tính năng hỗ trợ

MockAPI hỗ trợ:
- ✅ CRUD operations (GET, POST, PUT, DELETE, PATCH)
- ✅ Query params: `/api/rooms?id=1&name=Suite`
- ✅ Sorting: `/api/rooms?_sort=name&_order=asc`
- ✅ Pagination: `/api/rooms?_page=1&_limit=10`
- ✅ Delays: Headers support
- ✅ Custom validation rules

## Tài liệu MockAPI

https://mockapi.com/docs

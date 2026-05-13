# MockAPI JSON Files

7 file JSON sẵn sàng để import vào MockAPI.com

## 📂 Files

- `rooms.json` - 6 phòng
- `bookings.json` - 8 đặt phòng
- `users.json` - 5 người dùng (1 admin + 4 guests)
- `contacts.json` - 5 liên hệ
- `pricing_rules.json` - 5 quy tắc giá
- `staff.json` - 10 nhân viên
- `customers.json` - 15 khách hàng

## 🚀 Cách dùng

1. Trên MockAPI.com, tạo project mới: `vio-hotel`

2. Cho mỗi file, làm như sau:
   - Click **"+ Add Resource"**
   - Nhập tên resource (tên file, không có .json):
     - `rooms`
     - `bookings`
     - `users`
     - `contacts`
     - `pricing_rules`
     - `staff`
     - `customers`
   
3. Mở file JSON tương ứng:
   - Copy toàn bộ nội dung (Ctrl+A → Ctrl+C)
   - Paste vào MockAPI mục **"Sample Data"**
   - Click **Save**

4. MockAPI tự động generate REST API cho mỗi resource

## 🔗 URLs sau khi setup

```
https://YOUR-PROJECT-ID.mockapi.com/api/rooms
https://YOUR-PROJECT-ID.mockapi.com/api/bookings
https://YOUR-PROJECT-ID.mockapi.com/api/users
https://YOUR-PROJECT-ID.mockapi.com/api/contacts
https://YOUR-PROJECT-ID.mockapi.com/api/pricing_rules
https://YOUR-PROJECT-ID.mockapi.com/api/staff
https://YOUR-PROJECT-ID.mockapi.com/api/customers
```

## ✅ Verification

Sau khi tạo xong, test:
```bash
# Browser: https://YOUR-PROJECT-ID.mockapi.com/api/rooms
# Hoặc curl:
curl https://YOUR-PROJECT-ID.mockapi.com/api/rooms
```

Nếu thấy JSON array → Setup thành công!

## 📝 Cập nhật .env.local

```env
NEXT_PUBLIC_MOCKAPI_BASE_URL=https://YOUR-PROJECT-ID.mockapi.com/api
```

Thay `YOUR-PROJECT-ID` bằng project ID thực từ MockAPI dashboard.

## 🔄 Operations hỗ trợ

MockAPI.com hỗ trợ tất cả CRUD operations:
- GET - Lấy dữ liệu
- POST - Tạo mới
- PUT - Cập nhật toàn bộ
- PATCH - Cập nhật một phần
- DELETE - Xóa

Ví dụ:
```bash
# GET all rooms
GET /api/rooms

# GET one room
GET /api/rooms/ocean-suite

# POST new room
POST /api/rooms
Body: { "name": "...", ... }

# PATCH update
PATCH /api/rooms/ocean-suite
Body: { "status": "available" }
```

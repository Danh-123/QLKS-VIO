# MockAPI.io Sample Data

Hướng dẫn: Copy từng phần dưới đây → Tạo Resource trên MockAPI → Paste JSON vào "Sample Data" → Save

---

## 1. ROOMS

```json
[
  {
    "id": "ocean-suite",
    "name": "Suite Hướng biển",
    "description": "Ban công riêng, tông màu cát và gỗ sồi, tầm nhìn vịnh.",
    "priceFrom": "Từ 4.800.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 4800000,
    "featured": true,
    "status": "occupied",
    "size": "72 m²",
    "bed": "King",
    "maxGuests": 3,
    "view": "Toàn cảnh vịnh"
  },
  {
    "id": "garden-villa",
    "name": "Villa Vườn",
    "description": "Không gian hai phòng ngủ, hồ bơi riêng và sảnh tiếp khách.",
    "priceFrom": "Từ 8.200.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 8200000,
    "featured": true,
    "status": "occupied",
    "size": "180 m²",
    "bed": "2 King",
    "maxGuests": 6,
    "view": "Vườn & hồ bơi riêng"
  },
  {
    "id": "sky-penthouse",
    "name": "Penthouse Trời",
    "description": "Tầng cao nhất, kính toàn cảnh và phòng tắm đá cẩm thạch.",
    "priceFrom": "Từ 12.500.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 12500000,
    "featured": true,
    "status": "reserved",
    "size": "200 m²",
    "bed": "King",
    "maxGuests": 2,
    "view": "Toàn cảnh 360°"
  },
  {
    "id": "garden-deluxe",
    "name": "Deluxe Vườn",
    "description": "Yên tĩnh, lối đi riên tới khu vườn nhiệt đới.",
    "priceFrom": "Từ 3.200.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 3200000,
    "featured": false,
    "status": "available",
    "size": "48 m²",
    "bed": "Queen",
    "maxGuests": 2,
    "view": "Khu vườn"
  },
  {
    "id": "harbour",
    "name": "Phòng Cảng",
    "description": "Tầm nhìn cảng đèn, lý tưởng cho kỳ nghỉ ngắn ngày.",
    "priceFrom": "Từ 2.900.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 2900000,
    "featured": false,
    "status": "maintenance",
    "size": "42 m²",
    "bed": "Queen",
    "maxGuests": 2,
    "view": "Cảng đêm"
  },
  {
    "id": "studio",
    "name": "Studio Signature",
    "description": "Mở rộng, bếp nhỏ và bàn làm việc.",
    "priceFrom": "Từ 2.400.000 ₫ / đêm",
    "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    "basePriceVnd": 2400000,
    "featured": false,
    "status": "available",
    "size": "38 m²",
    "bed": "Twin",
    "maxGuests": 2,
    "view": "Khu vườn"
  }
]
```

---

## 2. BOOKINGS

```json
[
  {
    "id": "vio-demo-1",
    "createdAt": "2025-04-02T10:30:00Z",
    "customerId": "usr-user-1",
    "customerName": "Aurelia Guest",
    "roomId": "ocean-suite",
    "roomName": "Suite Hướng biển",
    "checkIn": "2025-05-10",
    "checkOut": "2025-05-14",
    "guests": 2,
    "adults": 2,
    "children": 0,
    "status": "confirmed",
    "totalVnd": 19200000,
    "preferencesNote": "High floor, non-smoking"
  },
  {
    "id": "vio-demo-2",
    "createdAt": "2025-05-08T14:15:00Z",
    "customerId": "usr-user-2",
    "customerName": "Mai Hương",
    "roomId": "garden-villa",
    "roomName": "Villa Vườn",
    "checkIn": "2025-05-20",
    "checkOut": "2025-05-24",
    "guests": 4,
    "adults": 2,
    "children": 2,
    "status": "confirmed",
    "totalVnd": 32800000,
    "preferencesNote": "Family package, need crib"
  },
  {
    "id": "vio-demo-3",
    "createdAt": "2025-05-11T16:45:00Z",
    "customerId": "usr-user-3",
    "customerName": "Demo User",
    "roomId": "studio",
    "roomName": "Studio Signature",
    "checkIn": "2025-05-15",
    "checkOut": "2025-05-16",
    "guests": 1,
    "adults": 1,
    "children": 0,
    "status": "pending",
    "totalVnd": 2400000,
    "preferencesNote": "Business trip, early checkin"
  },
  {
    "id": "vio-demo-4",
    "createdAt": "2025-04-13T09:20:00Z",
    "customerId": "usr-user-2",
    "customerName": "Mai Hương",
    "roomId": "harbour",
    "roomName": "Phòng Cảng",
    "checkIn": "2025-04-15",
    "checkOut": "2025-04-17",
    "guests": 2,
    "adults": 2,
    "children": 0,
    "status": "cancelled",
    "totalVnd": 5800000,
    "preferencesNote": "Cancelled due to emergency"
  },
  {
    "id": "vio-demo-5",
    "createdAt": "2025-05-05T11:30:00Z",
    "customerId": "usr-user-1",
    "customerName": "Aurelia Guest",
    "roomId": "sky-penthouse",
    "roomName": "Penthouse Trời",
    "checkIn": "2025-05-18",
    "checkOut": "2025-05-20",
    "guests": 2,
    "adults": 2,
    "children": 0,
    "status": "checked-in",
    "totalVnd": 25000000,
    "preferencesNote": "Anniversary celebration"
  },
  {
    "id": "vio-demo-6",
    "createdAt": "2025-03-15T13:00:00Z",
    "customerId": "usr-user-4",
    "customerName": "John Smith",
    "roomId": "garden-deluxe",
    "roomName": "Deluxe Vườn",
    "checkIn": "2025-03-20",
    "checkOut": "2025-03-21",
    "guests": 2,
    "adults": 1,
    "children": 1,
    "status": "no-show",
    "totalVnd": 3200000,
    "preferencesNote": null
  },
  {
    "id": "vio-demo-7",
    "createdAt": "2025-05-10T10:00:00Z",
    "customerId": "usr-user-3",
    "customerName": "Demo User",
    "roomId": "ocean-suite",
    "roomName": "Suite Hướng biển",
    "checkIn": "2025-05-25",
    "checkOut": "2025-05-28",
    "guests": 2,
    "adults": 2,
    "children": 0,
    "status": "checked-out",
    "totalVnd": 14400000,
    "preferencesNote": "Late checkout requested"
  },
  {
    "id": "vio-demo-8",
    "createdAt": "2025-05-12T15:20:00Z",
    "customerId": "usr-user-2",
    "customerName": "Mai Hương",
    "roomId": "garden-villa",
    "roomName": "Villa Vườn",
    "checkIn": "2025-06-01",
    "checkOut": "2025-06-05",
    "guests": 4,
    "adults": 2,
    "children": 2,
    "status": "pending",
    "totalVnd": 32800000,
    "preferencesNote": "Group booking"
  }
]
```

---

## 3. USERS

```json
[
  {
    "id": "usr-admin-1",
    "name": "Aurelia Admin",
    "email": "admin@aurelia.com",
    "role": "admin",
    "phone": "+84912345001",
    "tier": "Platinum",
    "createdAt": "2024-01-01T08:00:00Z"
  },
  {
    "id": "usr-user-1",
    "name": "Aurelia Guest",
    "email": "user@aurelia.com",
    "role": "user",
    "phone": "+84912345002",
    "tier": "Gold",
    "createdAt": "2024-03-15T10:30:00Z"
  },
  {
    "id": "usr-user-2",
    "name": "Mai Hương",
    "email": "mai@example.com",
    "role": "user",
    "phone": "+84912345003",
    "tier": "Silver",
    "createdAt": "2024-02-20T14:45:00Z"
  },
  {
    "id": "usr-user-3",
    "name": "Demo User",
    "email": "demo@vio.com",
    "role": "user",
    "phone": "+84912345004",
    "tier": "Silver",
    "createdAt": "2024-04-10T09:00:00Z"
  },
  {
    "id": "usr-user-4",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "user",
    "phone": "+1-555-0101",
    "tier": "Gold",
    "createdAt": "2024-05-05T11:20:00Z"
  }
]
```

---

## 4. CONTACTS

```json
[
  {
    "id": 1,
    "name": "Hoang Minh",
    "email": "hoang@example.com",
    "phone": "+84901234567",
    "message": "Tôi muốn biết thêm về Suite Hướng biển và dịch vụ spa.",
    "createdAt": "2025-05-12T14:30:00Z",
    "status": "new"
  },
  {
    "id": 2,
    "name": "Linda Chen",
    "email": "linda.chen@company.com",
    "phone": "+65-6234-5678",
    "message": "Interested in group booking for corporate retreat, 20-25 people.",
    "createdAt": "2025-05-11T10:15:00Z",
    "status": "read"
  },
  {
    "id": 3,
    "name": "Pham Ngoc",
    "email": "pham.ngoc@email.com",
    "phone": "+84938765432",
    "message": "Cần hỗ trợ thay đổi ngày đặt phòng.",
    "createdAt": "2025-05-10T16:45:00Z",
    "status": "replied"
  },
  {
    "id": 4,
    "name": "Maria Garcia",
    "email": "maria.garcia@travel.com",
    "phone": "+34-91-555-0101",
    "message": "Looking for wedding venue and planning services.",
    "createdAt": "2025-05-09T12:00:00Z",
    "status": "new"
  },
  {
    "id": 5,
    "name": "Tran Duc",
    "email": "tran.duc@business.vn",
    "phone": "+84912345678",
    "message": "Yêu cầu báo giá đặc biệt cho dự án hội nghị quốc tế.",
    "createdAt": "2025-05-08T09:30:00Z",
    "status": "read"
  }
]
```

---

## 5. PRICING_RULES

```json
[
  {
    "id": "p-1",
    "name": "Early Bird",
    "type": "Thời điểm",
    "adjustment": "-15%",
    "active": true
  },
  {
    "id": "p-2",
    "name": "Last Minute",
    "type": "Thời điểm",
    "adjustment": "-20%",
    "active": true
  },
  {
    "id": "p-3",
    "name": "Peak Season",
    "type": "Mùa",
    "adjustment": "+25%",
    "active": true
  },
  {
    "id": "p-4",
    "name": "Holiday Special",
    "type": "Sự kiện",
    "adjustment": "+30%",
    "active": true
  },
  {
    "id": "p-5",
    "name": "Extended Stay",
    "type": "Thời điểm",
    "adjustment": "-10% (7+ nights)",
    "active": true
  }
]
```

---

## 6. STAFF

```json
[
  {
    "id": "s-1",
    "name": "Tran Thanh",
    "email": "tranth@vio.com",
    "role": "Manager",
    "department": "Front Desk",
    "status": "active",
    "joinedDate": "2023-01-15"
  },
  {
    "id": "s-2",
    "name": "Nguyen Ha",
    "email": "nguyenha@vio.com",
    "role": "Front Desk",
    "department": "Front Desk",
    "status": "active",
    "joinedDate": "2023-06-20"
  },
  {
    "id": "s-3",
    "name": "Pham Linh",
    "email": "phamlinh@vio.com",
    "role": "Housekeeping",
    "department": "Housekeeping",
    "status": "active",
    "joinedDate": "2023-03-10"
  },
  {
    "id": "s-4",
    "name": "Le Duc",
    "email": "leduc@vio.com",
    "role": "Housekeeping",
    "department": "Housekeeping",
    "status": "on-leave",
    "joinedDate": "2023-04-05"
  },
  {
    "id": "s-5",
    "name": "Hoang Chi",
    "email": "hoangchi@vio.com",
    "role": "Food & Beverage",
    "department": "Restaurant",
    "status": "active",
    "joinedDate": "2023-02-14"
  },
  {
    "id": "s-6",
    "name": "Vu Minh",
    "email": "vuminh@vio.com",
    "role": "Food & Beverage",
    "department": "Bar",
    "status": "active",
    "joinedDate": "2023-05-01"
  },
  {
    "id": "s-7",
    "name": "Dao An",
    "email": "daoan@vio.com",
    "role": "Maintenance",
    "department": "Engineering",
    "status": "active",
    "joinedDate": "2022-11-20"
  },
  {
    "id": "s-8",
    "name": "Tran Khoa",
    "email": "trankhoa@vio.com",
    "role": "IT",
    "department": "IT",
    "status": "active",
    "joinedDate": "2023-07-15"
  },
  {
    "id": "s-9",
    "name": "Hoang Lan",
    "email": "hoanglan@vio.com",
    "role": "Front Desk",
    "department": "Front Desk",
    "status": "inactive",
    "joinedDate": "2023-08-01"
  },
  {
    "id": "s-10",
    "name": "Le Cuong",
    "email": "lecuong@vio.com",
    "role": "Manager",
    "department": "Housekeeping",
    "status": "active",
    "joinedDate": "2023-01-01"
  }
]
```

---

## 7. CUSTOMERS

```json
[
  {
    "id": "cust-1",
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "tier": "Gold",
    "stays": 5,
    "totalSpent": 95000000,
    "createdAt": "2024-03-20T10:00:00Z"
  },
  {
    "id": "cust-2",
    "name": "Tran Thi B",
    "email": "tranthib@example.com",
    "tier": "Platinum",
    "stays": 12,
    "totalSpent": 180000000,
    "createdAt": "2023-11-15T14:30:00Z"
  },
  {
    "id": "cust-3",
    "name": "Ho Minh C",
    "email": "hominch@example.com",
    "tier": "Silver",
    "stays": 2,
    "totalSpent": 22000000,
    "createdAt": "2024-08-10T09:15:00Z"
  },
  {
    "id": "cust-4",
    "name": "Pham Duc D",
    "email": "phamduc@example.com",
    "tier": "Gold",
    "stays": 7,
    "totalSpent": 120000000,
    "createdAt": "2024-01-05T11:45:00Z"
  },
  {
    "id": "cust-5",
    "name": "Le Thu E",
    "email": "lethu@example.com",
    "tier": "Silver",
    "stays": 1,
    "totalSpent": 8500000,
    "createdAt": "2024-09-22T15:20:00Z"
  },
  {
    "id": "cust-6",
    "name": "David Smith",
    "email": "david.smith@company.com",
    "tier": "Gold",
    "stays": 4,
    "totalSpent": 75000000,
    "createdAt": "2024-04-12T13:30:00Z"
  },
  {
    "id": "cust-7",
    "name": "Sarah Johnson",
    "email": "sarah.j@email.com",
    "tier": "Platinum",
    "stays": 8,
    "totalSpent": 145000000,
    "createdAt": "2024-02-28T10:15:00Z"
  },
  {
    "id": "cust-8",
    "name": "Li Wei",
    "email": "li.wei@company.cn",
    "tier": "Silver",
    "stays": 3,
    "totalSpent": 32000000,
    "createdAt": "2024-06-18T16:45:00Z"
  },
  {
    "id": "cust-9",
    "name": "Maria Garcia",
    "email": "maria.garcia@example.es",
    "tier": "Gold",
    "stays": 6,
    "totalSpent": 110000000,
    "createdAt": "2024-05-03T12:00:00Z"
  },
  {
    "id": "cust-10",
    "name": "Hiroshi Tanaka",
    "email": "h.tanaka@company.jp",
    "tier": "Platinum",
    "stays": 10,
    "totalSpent": 165000000,
    "createdAt": "2023-12-20T09:30:00Z"
  },
  {
    "id": "cust-11",
    "name": "Anna Mueller",
    "email": "anna.mueller@company.de",
    "tier": "Silver",
    "stays": 2,
    "totalSpent": 18500000,
    "createdAt": "2024-07-08T14:20:00Z"
  },
  {
    "id": "cust-12",
    "name": "Raj Patel",
    "email": "raj.patel@business.in",
    "tier": "Gold",
    "stays": 5,
    "totalSpent": 88000000,
    "createdAt": "2024-03-25T11:00:00Z"
  },
  {
    "id": "cust-13",
    "name": "Sophie Dubois",
    "email": "sophie.dubois@email.fr",
    "tier": "Silver",
    "stays": 1,
    "totalSpent": 10000000,
    "createdAt": "2024-10-15T15:45:00Z"
  },
  {
    "id": "cust-14",
    "name": "Marco Rossi",
    "email": "marco.rossi@company.it",
    "tier": "Gold",
    "stays": 9,
    "totalSpent": 125000000,
    "createdAt": "2024-01-30T13:15:00Z"
  },
  {
    "id": "cust-15",
    "name": "Emma Wilson",
    "email": "emma.wilson@business.uk",
    "tier": "Platinum",
    "stays": 11,
    "totalSpent": 175000000,
    "createdAt": "2023-10-12T10:45:00Z"
  }
]
```

---

## 📌 Hướng dẫn sử dụng:

1. Tạo tài khoản tại https://mockapi.com/
2. Tạo project "vio-hotel"
3. Cho mỗi resource, click "+" → tên resource:
   - `rooms`
   - `bookings`
   - `users`
   - `contacts`
   - `pricing_rules`
   - `staff`
   - `customers`
4. Copy JSON từ file này → dán vào "Sample Data" → Save
5. MockAPI tự động generate API endpoints

## 📡 API URLs sau khi tạo:

```
GET/POST https://YOUR-PROJECT.mockapi.com/api/rooms
GET/POST https://YOUR-PROJECT.mockapi.com/api/bookings
GET/POST https://YOUR-PROJECT.mockapi.com/api/users
GET/POST https://YOUR-PROJECT.mockapi.com/api/contacts
GET/POST https://YOUR-PROJECT.mockapi.com/api/pricing_rules
GET/POST https://YOUR-PROJECT.mockapi.com/api/staff
GET/POST https://YOUR-PROJECT.mockapi.com/api/customers
```

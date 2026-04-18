# BAO CAO DU AN QLKS-VIO (NEXT.JS)

## 1. Tong quan de tai

QLKS-VIO la ung dung mo phong he thong quan ly dat phong khach san. Muc tieu la xay dung giao dien quan tri va giao dien nguoi dung, ket hop voi API noi bo de xu ly nghiep vu dat phong.

Ban hien tai da duoc migration sang Next.js App Router va giu nguyen luong nghiep vu quan trong tu ban React + Vite truoc do.

## 2. Muc tieu ky thuat

- Xay dung giao dien theo huong component tai su dung.
- Dam bao responsive tren mobile va desktop.
- Quan ly du lieu co kieu ro rang bang TypeScript.
- Cung cap API route cho danh sach phong, danh sach dat phong va cap nhat trang thai dat phong.
- Tach business logic de de test, de bao tri.

## 3. Cong nghe su dung

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion

## 4. Cau truc he thong

### 4.1 Frontend

- Trang va route nam trong thu muc `app/` (App Router).
- Component dung chung nam trong `components/`.
- State duoc chia theo tung mien du lieu trong `contexts/`:
  - UserStoreContext
  - BookingStoreContext
  - RoomStoreContext
  - AppDataContext

### 4.2 Backend API (Next Route Handlers)

API noi bo duoc dat trong `app/api/`:

- GET `/api/rooms`
- GET `/api/rooms/[id]`
- GET `/api/bookings`
- POST `/api/bookings`
- PATCH `/api/bookings/[id]`
- GET `/api/users`

Tat ca API dang su dung mock data va co mo phong do tre mang de kiem thu UX loading.

### 4.3 Business logic

Business logic duoc tach rieng trong `lib/businessLogic.ts`:

- Kiem tra hop le khoang ngay dat phong
- Kiem tra giao nhau lich dat phong
- Kiem tra tinh kha dung cua phong
- Tinh tong tien (so dem, tam tinh, phi dich vu, tong)

## 5. Mo ta chi tiet cac buoc xu ly logic

### 5.1 Luong tao booking

1. Nguoi dung nhap thong tin dat phong (roomId, thong tin khach, check-in, check-out, so khach).
2. Frontend gui request den POST `/api/bookings`.
3. Server validate khoang ngay bang ham `isValidDateRange`.
4. Server tim phong theo `roomId`; neu khong co thi tra ve 404.
5. Server kiem tra trung lich bang ham `isRoomAvailable`; neu trung lich thi tra ve 409.
6. Server tinh gia bang ham `calculatePricing`.
7. Server tao booking moi, gan `status = confirmed`, luu vao mock store.
8. Server tra ve ket qua 201 va frontend cap nhat UI.

### 5.2 Luong cap nhat trang thai booking

1. Quan tri vien thao tac doi trang thai booking o man hinh admin.
2. Frontend gui PATCH `/api/bookings/[id]`.
3. Server kiem tra booking ton tai.
4. Server cap nhat trang thai moi va tra du lieu booking sau cap nhat.
5. UI danh sach booking dong bo theo du lieu moi.

### 5.3 Luong lay du lieu phong

1. Trang danh sach phong goi GET `/api/rooms`.
2. Trang chi tiet phong goi GET `/api/rooms/[id]`.
3. Du lieu tra ve duoc render theo component card/list/detail.

## 6. Ket qua dat duoc

- Da hoan tat migration tu Vite sang Next.js App Router.
- Da to chuc code theo kien truc tach lop ro rang: presentation, state, API, business logic.
- Da xay dung API route co xu ly validate va status code phu hop.
- Da khai bao kieu du lieu TypeScript cho booking, room, user.
- Da build production thanh cong bang `npm run build`.
- Da ho tro loading UX voi spinner/skeleton va xu ly truong hop rong (empty state).

## 7. Kiem thu va danh gia

Checklist da kiem tra:

1. Mo `/rooms` hien thi danh sach phong.
2. Mo `/rooms/[id]` hien thi chi tiet phong.
3. Tao booking moi tai `/bookings/create`.
4. Booking moi xuat hien trong danh sach `/bookings`.
5. Doi trang thai booking trong khu vuc admin.
6. Trang thai sau cap nhat duoc dong bo len giao dien.
7. Build production khong loi bang `npm run build`.

## 8. Huong dan chay du an

1. Cai dat thu vien:

	npm install

2. Chay moi truong phat trien:

	npm run dev

3. Truy cap:

	http://localhost:3000

4. Build production:

	npm run build

5. Chay production local:

	npm run start

## 8.1 Tai khoan demo dang nhap

- Admin:
	- Email: admin@aurelia.com
	- Password: aurelia123
- User:
	- Email: user@aurelia.com
	- Password: aurelia123

## 9. Han che hien tai

- Du lieu dang la in-memory mock data, se reset sau khi restart server.
- Chua ket noi CSDL that (MySQL/PostgreSQL/MongoDB).
- Chua tich hop xac thuc phan quyen that.

## 10. Huong phat trien tiep theo

- Ket noi CSDL that va ORM.
- Them auth + role-based access.
- Viet test tu dong cho business logic va API.
- Deploy len Vercel va bo sung giam sat runtime.

---

Bao cao nay mo ta day du qua trinh xu ly logic, kien truc, va ket qua dat duoc cua du an QLKS-VIO theo huong Next.js App Router.

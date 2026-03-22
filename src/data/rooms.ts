export type RoomListing = {
  id: string
  name: string
  description: string
  priceFrom: string
  image: string
  featured?: boolean
}

export const rooms: RoomListing[] = [
  {
    id: 'ocean-suite',
    name: 'Suite Hướng biển',
    description: 'Ban công riêng, tông màu cát và gỗ sồi, tầm nhìn vịnh.',
    priceFrom: 'Từ 4.800.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    id: 'garden-villa',
    name: 'Villa Vườn',
    description: 'Không gian hai phòng ngủ, hồ bơi riêng và sảnh tiếp khách.',
    priceFrom: 'Từ 8.200.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    id: 'sky-penthouse',
    name: 'Penthouse Trời',
    description: 'Tầng cao nhất, kính toàn cảnh và phòng tắm đá cẩm thạch.',
    priceFrom: 'Từ 12.500.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    id: 'garden-deluxe',
    name: 'Deluxe Vườn',
    description: 'Yên tĩnh, lối đi riêng tới khu vườn nhiệt đới.',
    priceFrom: 'Từ 3.200.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'harbour',
    name: 'Phòng Cảng',
    description: 'Tầm nhìn cảng đèn, lý tưởng cho kỳ nghỉ ngắn ngày.',
    priceFrom: 'Từ 2.900.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'studio',
    name: 'Studio Signature',
    description: 'Mở rộng, bếp nhỏ và bàn làm việc.',
    priceFrom: 'Từ 2.400.000 ₫ / đêm',
    image:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  },
]

export const featuredRooms = rooms.filter((r) => r.featured)

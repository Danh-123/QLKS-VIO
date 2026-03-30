import { rooms, type RoomListing } from './rooms'

export type RoomAmenity = { id: string; label: string }

export type RoomKeyFacts = {
  size: string
  bed: string
  maxGuests: number
  view: string
}

export type RoomDetail = RoomListing & {
  gallery: string[]
  story: string[]
  amenities: RoomAmenity[]
  pricePerNight: number
  tagline: string
  experienceTitle: string
  experienceBody: string
  keyFacts: RoomKeyFacts
  breakImages: string[]
  relatedRoomIds: string[]
}

const extra: Record<
  string,
  Omit<RoomDetail, keyof RoomListing | 'gallery'> & { gallery: string[] }
> = {
  'ocean-suite': {
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline:
      'Ánh sáng buổi sớm trên vịnh — không gian dành cho những kỳ nghỉ không vội.',
    experienceTitle: 'Thiết kế cho sự tĩnh lặng',
    experienceBody:
      'Mỗi chi tiết ở Suite Hướng biển được chọn để giảm tiếng ồn và tăng khoảng trống cảm giác: từ đường may linen đến tiếng sóng xa. Đây là nơi bạn có thể đọc một chương sách, nhìn mặt nước và để thời gian trôi chậm.',
    keyFacts: {
      size: '72 m²',
      bed: 'King',
      maxGuests: 3,
      view: 'Toàn cảnh vịnh',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['garden-deluxe', 'sky-penthouse', 'garden-villa'],
    story: [
      'Suite Hướng biển là không gian mà ánh bình minh len lỏi qua rèm linen, và tiếng sóng trở thành nền nhạc duy nhất bạn cần.',
      'Gỗ sồi mài mờ, đá cẩm thạch Ý và bồn tắm độc lập nhìn ra vịnh — mỗi chi tiết được chọn để tôn trọng sự riêng tư và chậm rãi.',
      'Ban công rộng với ghế bành đơn; minibar tuyển chọn; hệ thống rèm tự động. Đây là nơi VIO dành cho những kỳ nghỉ cần cả không gian lẫn thinh lặng.',
    ],
    amenities: [
      { id: '1', label: 'Ban công riêng' },
      { id: '2', label: 'Bồn tắm & vòi sen mưa' },
      { id: '3', label: 'Minibar & máy pha cà phê' },
      { id: '4', label: 'Wi‑Fi tốc độ cao' },
      { id: '5', label: 'Dịch vụ phòng 24h' },
      { id: '6', label: 'Két an toàn' },
    ],
    pricePerNight: 4_800_000,
  },
  'garden-villa': {
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline: 'Nhà riêng giữa vườn nhiệt đới — hồ bơi, bếp và không gian gia đình.',
    experienceTitle: 'Không gian mở, nhịp chậm',
    experienceBody:
      'Villa Vườn kết nối trong – ngoài bằng lối đi lát đá và mái hiên rộng. Buổi sáng bắt đầu bằng tiếng chim và cà phê từ bếp nhỏ; chiều là thời gian cho hồ bơi và trò chuyện không vội.',
    keyFacts: {
      size: '180 m²',
      bed: '2 King',
      maxGuests: 6,
      view: 'Vườn & hồ bơi riêng',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1611892440504-42a792e54d66?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['ocean-suite', 'sky-penthouse', 'garden-deluxe'],
    story: [
      'Villa Vườn mang đến nhịp sống như một ngôi nhà riêng: hai phòng ngủ, phòng khách rộng và hồ bơi viền đá nhìn ra thảm cỏ nhiệt đới.',
      'Bếp nhỏ được trang bị đầy đủ cho những bữa sáng muộn; sảnh tiếp khách với sofa linen và ánh sáng từ mái kính.',
      'Lối đi riêng từ bãi đỗ xe — lý tưởng cho gia đình hoặc nhóm bạn cần không gian và sự tách biệt nhẹ nhàng.',
    ],
    amenities: [
      { id: '1', label: 'Hồ bơi riêng' },
      { id: '2', label: '2 phòng ngủ king' },
      { id: '3', label: 'Bếp & phòng ăn' },
      { id: '4', label: 'Vườn riêng' },
      { id: '5', label: 'Butler theo yêu cầu' },
      { id: '6', label: 'Xe đưa đón nội khu' },
    ],
    pricePerNight: 8_200_000,
  },
  'sky-penthouse': {
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline: 'Tầng cao nhất — kính, ánh đèn thành phố và biển trong một tầm nhìn.',
    experienceTitle: 'Trên đỉnh thành phố, dưới trời sao',
    experienceBody:
      'Penthouse là nơi ranh giới giữa riêng tư và panorama biến mất. Tối đến, bar nhỏ và sofa sâu mời bạn ở lại thêm một ly — không cần lý do.',
    keyFacts: {
      size: '220 m²',
      bed: 'King',
      maxGuests: 4,
      view: 'Panorama biển & đô thị',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['ocean-suite', 'garden-villa', 'garden-deluxe'],
    story: [
      'Tầng cao nhất của VIO — kính từ sàn đến trần, tầm nhìn 270° ra biển và thành phố khi đêm về.',
      'Phòng tắm đá cẩm thạch Calacatta, phòng thay đồ rộng và bar riêng — nơi dành cho những kỳ nghỉ đánh dấu dấu mốc.',
    ],
    amenities: [
      { id: '1', label: 'Kính toàn cảnh' },
      { id: '2', label: 'Bar & lounge riêng' },
      { id: '3', label: 'Phòng tắm đôi spa' },
      { id: '4', label: 'Concierge ưu tiên' },
      { id: '5', label: 'Phòng thay đồ rộng' },
    ],
    pricePerNight: 12_500_000,
  },
  'garden-deluxe': {
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline: 'Cửa sổ lớn nhìn vườn — yên, sáng, đủ cho hai người và những buổi sáng muộn.',
    experienceTitle: 'Gần vườn, xa vội vã',
    experienceBody:
      'Deluxe Vườn là lựa chọn khi bạn cần tập trung làm việc nhẹ nhàng ban ngày và thả lỏng vào tối. Tiếng lá và ánh đèn vàng tạo nhịp riêng, không chen lấn.',
    keyFacts: {
      size: '42 m²',
      bed: 'Queen',
      maxGuests: 2,
      view: 'Vườn nhiệt đới',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['studio', 'harbour', 'ocean-suite'],
    story: [
      'Deluxe Vườn nằm sát lối đi lát đá tới khu vườn — cửa sổ lớn, tông kem và gỗ teak.',
      'Không gian yên tĩnh cho cặp đôi hoặc khách công tác cần tập trung và nghỉ ngơi sâu.',
    ],
    amenities: [
      { id: '1', label: 'Ban công nhỏ nhìn vườn' },
      { id: '2', label: 'Vòi sen mưa' },
      { id: '3', label: 'Bàn làm việc' },
      { id: '4', label: 'Minibar' },
    ],
    pricePerNight: 3_200_000,
  },
  harbour: {
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501dd68f7578?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline: 'Ánh đèn cảng về đêm — gọn, hiện đại, lý tưởng cho kỳ nghỉ ngắn.',
    experienceTitle: 'Nhịp cảng, cửa kính im lặng',
    experienceBody:
      'Phòng Cảng mang năng lượng của bến tàu nhưng giữ sự tĩnh bên trong nhờ cách âm kính đôi. Buổi tối là thời gian của đèn và ly nhỏ trên ban công.',
    keyFacts: {
      size: '38 m²',
      bed: 'Queen',
      maxGuests: 2,
      view: 'Cảng & thành phố',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['studio', 'garden-deluxe', 'ocean-suite'],
    story: [
      'Phòng Cảng hướng về ánh đèn cảnh và thuyền neo đêm — năng động nhưng vẫn trong lớp cách âm kính đôi.',
    ],
    amenities: [
      { id: '1', label: 'Cửa sổ panorama' },
      { id: '2', label: 'Máy pha cà phê' },
      { id: '3', label: 'Smart TV' },
    ],
    pricePerNight: 2_900_000,
  },
  studio: {
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
    ],
    tagline: 'Layout mở — làm việc, nghỉ và nấu ăn nhẹ trong cùng một ánh sáng.',
    experienceTitle: 'Ở lại lâu hơn một chút',
    experienceBody:
      'Studio phù hợp những kỳ nghỉ kéo dài: bếp nhỏ đủ cho bữa sáng, bàn làm việc rộng và giường king được tách bằng tấm gỗ tinh tế.',
    keyFacts: {
      size: '45 m²',
      bed: 'King',
      maxGuests: 2,
      view: 'Vườn / thành phố',
    },
    breakImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
    ],
    relatedRoomIds: ['garden-deluxe', 'harbour', 'ocean-suite'],
    story: [
      'Studio Signature mở rộng một cách tinh tế: khu bếp nhỏ, sofa và giường king trong cùng một nhịp ánh sáng.',
      'Phù hợp kỳ nghỉ dài ngày hoặc remote work với view vườn hoặc thành phố.',
    ],
    amenities: [
      { id: '1', label: 'Layout mở' },
      { id: '2', label: 'Bếp nhỏ đầy đủ' },
      { id: '3', label: 'Bàn làm việc lớn' },
    ],
    pricePerNight: 2_400_000,
  },
}

export function getRoomDetail(id: string): RoomDetail | undefined {
  const base = rooms.find((r) => r.id === id)
  const e = extra[id]
  if (!base || !e) return undefined
  return { ...base, ...e }
}

export function getRelatedRooms(id: string, limit = 3): RoomDetail[] {
  const r = getRoomDetail(id)
  if (!r) return []
  return r.relatedRoomIds
    .slice(0, limit)
    .map((rid) => getRoomDetail(rid))
    .filter((x): x is RoomDetail => x !== undefined)
}

export function formatVnd(n: number) {
  return `${new Intl.NumberFormat('vi-VN').format(n)} ₫`
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1
  const a = new Date(checkIn).getTime()
  const b = new Date(checkOut).getTime()
  const d = Math.ceil((b - a) / 86400000)
  return d > 0 ? d : 1
}

export type Hotel = {
  id: string
  name: string
  location: string
  description: string
  rating: number
}

export const hotels: Hotel[] = [
  {
    id: 'vio-bay',
    name: 'VIO Bay Retreat',
    location: 'Vịnh Nam',
    description: 'Khu nghỉ dưỡng sát biển với không gian tĩnh và riêng tư.',
    rating: 4.8,
  },
  {
    id: 'vio-city',
    name: 'VIO City House',
    location: 'Trung tâm thành phố',
    description: 'Khách sạn boutique gần khu ẩm thực và nghệ thuật.',
    rating: 4.6,
  },
]

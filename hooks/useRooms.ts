'use client'

import { useAppData } from '../contexts/AppDataContext'

export function useRooms() {
  const { rooms, setRoomStatus, getRoomById } = useAppData()
  return { rooms, setRoomStatus, getRoomById }
}

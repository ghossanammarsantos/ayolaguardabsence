import { GuardUser, PatrolPoint, PatrolLog, DashboardStats } from '@/types'

export const DEFAULT_GUARD: GuardUser = {
  id: 'usr_01',
  guardId: 'SATPAM01',
  name: 'Budi Santoso',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  phone: '+62 812-3456-7890',
  role: 'guard',
  shiftName: 'Shift Pagi (08:00 - 20:00 WIB)',
}

export const INITIAL_GUARDS: GuardUser[] = [
  DEFAULT_GUARD,
  {
    id: 'usr_02',
    guardId: 'SATPAM02',
    name: 'Ahmad Supriyadi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+62 813-8888-7777',
    role: 'guard',
    shiftName: 'Shift Malam (20:00 - 08:00 WIB)',
  },
  {
    id: 'usr_03',
    guardId: 'SATPAM03',
    name: 'Dedi Kurniawan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    phone: '+62 815-5555-4444',
    role: 'guard',
    shiftName: 'Shift Pagi (08:00 - 20:00 WIB)',
  },
  {
    id: 'usr_04',
    guardId: 'SATPAM04',
    name: 'Rian Hidayat',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    phone: '+62 819-1111-2222',
    role: 'guard',
    shiftName: 'Shift Malam (20:00 - 08:00 WIB)',
  },
]

// Exact GPS Coordinates for Coastarina Ocarina Peninsula, Batam Center, Kota Batam
export const INITIAL_PATROL_POINTS: PatrolPoint[] = [
  {
    id: 'pt_01',
    code: 'QR-LOBBY-01',
    name: 'Lobby Utama Ocarina',
    area: 'Gerbang Masuk Semenanjung Ocarina',
    scheduleStart: '08:00',
    scheduleEnd: '20:00',
    instructions: 'Pastikan area gerbang utama Ocarina Batam aman dan kondusif.',
    latitude: 1.153200,
    longitude: 104.052800,
    allowedRadiusMeters: 50,
    imageSample: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pt_02',
    code: 'QR-KOLAM-02',
    name: 'Waterpark Ocarina',
    area: 'Pusat Wahana Waterpark Ocarina',
    scheduleStart: '08:00',
    scheduleEnd: '20:00',
    instructions: 'Periksa kedalaman air, pagar pembatas, & kebersihan area kolam.',
    latitude: 1.154500,
    longitude: 104.054500,
    allowedRadiusMeters: 50,
    imageSample: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pt_03',
    code: 'QR-PANTAI-03',
    name: 'Area Pantai Coastarina',
    area: 'Plaza Bianglala & Pesisir Timur',
    scheduleStart: '08:00',
    scheduleEnd: '20:00',
    instructions: 'Pantau garis pantai Ocarina Batam dan penerangan malam.',
    latitude: 1.155200,
    longitude: 104.056500,
    allowedRadiusMeters: 75,
    imageSample: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pt_04',
    code: 'QR-PARKIR-04',
    name: 'Area Parkir Utama',
    area: 'Parkiran Kendaraan Utama Visitor',
    scheduleStart: '08:00',
    scheduleEnd: '20:00',
    instructions: 'Pastikan kendaraan pengunjung terkunci rapat & cek CCTV.',
    latitude: 1.152500,
    longitude: 104.053800,
    allowedRadiusMeters: 50,
    imageSample: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pt_05',
    code: 'QR-BOH-05',
    name: 'Back of House',
    area: 'Service & Ruang Genset Utara',
    scheduleStart: '08:00',
    scheduleEnd: '20:00',
    instructions: 'Periksa panel listrik utama, genset, dan pintu darurat.',
    latitude: 1.156000,
    longitude: 104.054800,
    allowedRadiusMeters: 50,
    imageSample: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
]

export const INITIAL_PATROL_LOGS: PatrolLog[] = [
  {
    id: 'log_01',
    guardId: 'SATPAM01',
    guardName: 'SATPAM01',
    guardAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    patrolPointId: 'pt_01',
    pointName: 'Lobby Utama Ocarina',
    area: 'Front Office',
    scannedAt: '2025-05-20T09:15:18+07:00',
    timeFormatted: '09:15:18 WIB',
    latitude: 1.153200,
    longitude: 104.052800,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    status: 'berhasil',
    distanceMeters: 12,
  },
  {
    id: 'log_02',
    guardId: 'SATPAM02',
    guardName: 'SATPAM02',
    guardAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    patrolPointId: 'pt_02',
    pointName: 'Waterpark Ocarina',
    area: 'Fasilitas Outdoor',
    scannedAt: '2025-05-20T09:12:44+07:00',
    timeFormatted: '09:12:44 WIB',
    latitude: 1.154500,
    longitude: 104.054500,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    status: 'berhasil',
    distanceMeters: 8,
  },
  {
    id: 'log_03',
    guardId: 'SATPAM03',
    guardName: 'SATPAM03',
    guardAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    patrolPointId: 'pt_03',
    pointName: 'Area Pantai Coastarina',
    area: 'Batas Luar Pantai',
    scannedAt: '2025-05-20T09:07:31+07:00',
    timeFormatted: '09:07:31 WIB',
    latitude: 1.155200,
    longitude: 104.056500,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    status: 'berhasil',
    distanceMeters: 25,
  },
  {
    id: 'log_04',
    guardId: 'SATPAM04',
    guardName: 'SATPAM04',
    guardAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    patrolPointId: 'pt_05',
    pointName: 'Back of House',
    area: 'Service & Generator',
    scannedAt: '2025-05-20T08:55:10+07:00',
    timeFormatted: '08:55:10 WIB',
    latitude: 1.156000,
    longitude: 104.054800,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    status: 'terlambat',
    distanceMeters: 40,
  },
]

// Helper functions for LocalStorage Persistence
const STORAGE_KEYS = {
  LOGS: 'ayola_patrol_logs',
  POINTS: 'ayola_patrol_points',
  GUARDS: 'ayola_guards_list',
  CURRENT_USER: 'ayola_current_user',
}

export function formatDisplayTime(log: PatrolLog): string {
  if (log.scannedAt) {
    try {
      const date = new Date(log.scannedAt)
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      }
    } catch (e) {}
  }
  if (log.timeFormatted) {
    const match = log.timeFormatted.match(/\d{2}:\d{2}:\d{2}/)
    if (match) return match[0] + ' WIB'
    return log.timeFormatted
  }
  return '09:15:18 WIB'
}

export function getStoredGuards(): GuardUser[] {
  if (typeof window === 'undefined') return INITIAL_GUARDS
  const data = localStorage.getItem(STORAGE_KEYS.GUARDS)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.GUARDS, JSON.stringify(INITIAL_GUARDS))
    return INITIAL_GUARDS
  }
  return JSON.parse(data)
}

export function saveGuardUser(guard: GuardUser): GuardUser[] {
  const guards = getStoredGuards()
  const index = guards.findIndex((g) => g.id === guard.id || g.guardId === guard.guardId)
  let updated: GuardUser[]
  if (index >= 0) {
    updated = [...guards]
    updated[index] = guard
  } else {
    updated = [...guards, guard]
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.GUARDS, JSON.stringify(updated))
  }
  return updated
}

export function deleteGuardUser(guardId: string): GuardUser[] {
  const guards = getStoredGuards()
  const updated = guards.filter((g) => g.guardId !== guardId && g.id !== guardId)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.GUARDS, JSON.stringify(updated))
  }
  return updated
}

export function getStoredLogs(): PatrolLog[] {
  if (typeof window === 'undefined') return INITIAL_PATROL_LOGS
  const data = localStorage.getItem(STORAGE_KEYS.LOGS)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_PATROL_LOGS))
    return INITIAL_PATROL_LOGS
  }
  const parsed: PatrolLog[] = JSON.parse(data)
  // Force migration if coordinates are not on Coastarina peninsula land mass
  if (parsed.some((l) => l.latitude < 1.150 || l.longitude > 104.057)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_PATROL_LOGS))
    return INITIAL_PATROL_LOGS
  }
  return parsed
}

export function savePatrolLog(log: Omit<PatrolLog, 'id'>): PatrolLog {
  const logs = getStoredLogs()
  const newLog: PatrolLog = {
    ...log,
    id: 'log_' + Date.now(),
  }
  const updated = [newLog, ...logs]
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated))
  }
  return newLog
}

export function deletePatrolLog(logId: string): PatrolLog[] {
  const logs = getStoredLogs()
  const updated = logs.filter((l) => l.id !== logId)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated))
  }
  return updated
}

export function getStoredPoints(): PatrolPoint[] {
  if (typeof window === 'undefined') return INITIAL_PATROL_POINTS
  const data = localStorage.getItem(STORAGE_KEYS.POINTS)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(INITIAL_PATROL_POINTS))
    return INITIAL_PATROL_POINTS
  }
  const parsed: PatrolPoint[] = JSON.parse(data)
  // Force migration if coordinates are not on Coastarina peninsula land mass
  if (parsed.some((p) => p.latitude < 1.150 || p.longitude > 104.057)) {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(INITIAL_PATROL_POINTS))
    return INITIAL_PATROL_POINTS
  }
  return parsed
}

export function savePatrolPoint(point: PatrolPoint): PatrolPoint[] {
  const points = getStoredPoints()
  const index = points.findIndex((p) => p.id === point.id)
  let updated: PatrolPoint[]
  if (index >= 0) {
    updated = [...points]
    updated[index] = point
  } else {
    updated = [...points, point]
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(updated))
  }
  return updated
}

export function deletePatrolPoint(pointId: string): PatrolPoint[] {
  const points = getStoredPoints()
  const updated = points.filter((p) => p.id !== pointId)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(updated))
  }
  return updated
}

export function computeStats(logs: PatrolLog[], points: PatrolPoint[]): DashboardStats {
  const activeGuards = new Set(logs.map((l) => l.guardId)).size || 12
  const totalPoints = points.length || 48
  const completedPatrols = logs.filter((l) => l.status === 'berhasil').length
  const latePatrols = logs.filter((l) => l.status === 'terlambat').length
  const pendingPatrols = Math.max(0, totalPoints - completedPatrols - latePatrols)

  return {
    activeGuards,
    totalPoints,
    completedPatrols,
    pendingPatrols,
    latePatrols,
  }
}

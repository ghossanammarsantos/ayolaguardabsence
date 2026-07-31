export interface GuardUser {
  id: string
  guardId: string
  name: string
  avatar: string
  phone: string
  role: 'guard' | 'admin'
  shiftName: string
}

export interface PatrolPoint {
  id: string
  code: string
  name: string
  area: string
  scheduleStart: string
  scheduleEnd: string
  instructions: string
  latitude: number
  longitude: number
  allowedRadiusMeters: number
  imageSample?: string
  qrCodeUrl?: string
}

export interface PatrolLog {
  id: string
  guardId: string
  guardName: string
  guardAvatar: string
  patrolPointId: string
  pointName: string
  area: string
  scannedAt: string
  timeFormatted: string
  latitude: number
  longitude: number
  photoUrl: string
  status: 'berhasil' | 'terlambat' | 'belum_absen'
  distanceMeters?: number
}

export interface DashboardStats {
  activeGuards: number
  totalPoints: number
  completedPatrols: number
  pendingPatrols: number
  latePatrols: number
}

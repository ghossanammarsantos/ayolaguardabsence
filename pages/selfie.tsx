import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Page from '@/components/page'
import { getStoredPoints, savePatrolLog } from '@/lib/mock-data'
import { PatrolPoint, GuardUser } from '@/types'

export default function SelfieProof() {
  const router = useRouter()
  const { pointId } = router.query
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [point, setPoint] = useState<PatrolPoint | null>(null)
  const [user, setUser] = useState<GuardUser | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: -1.158452, lng: 104.054321 })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  useEffect(() => {
    // Retrieve User & Point
    const storedUser = localStorage.getItem('ayola_current_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const points = getStoredPoints()
    const found = points.find((p) => p.id === pointId) || points[0]
    setPoint(found)

    // Geolocation API fetch
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          })
        },
        () => {
          // Fallback to point's default coordinate
          if (found) {
            setCoords({ lat: found.latitude, lng: found.longitude })
          }
        }
      )
    }

    // Start Front Camera Stream
    let stream: MediaStream | null = null
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s
          if (videoRef.current) {
            videoRef.current.srcObject = s
            setCameraActive(true)
          }
        })
        .catch(() => {
          setCameraActive(false)
        })
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [pointId])

  const takeSelfie = () => {
    setCapturing(true)
    let photoUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'

    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth || 400
      canvas.height = video.videoHeight || 400
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        photoUrl = canvas.toDataURL('image/jpeg', 0.8)
      }
    }

    setCapturedImage(photoUrl)

    // Save Log to Storage / Backend API
    const now = new Date()
    const timeFormatted = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
    const dateFormatted = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

    const newLog = savePatrolLog({
      guardId: user?.guardId || 'SATPAM01',
      guardName: user?.guardId || 'SATPAM01',
      guardAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      patrolPointId: point?.id || 'pt_01',
      pointName: point?.name || 'Lobby Utama',
      area: point?.area || 'Front Office',
      scannedAt: now.toISOString(),
      timeFormatted: `${dateFormatted} ${timeFormatted}`,
      latitude: coords.lat,
      longitude: coords.lng,
      photoUrl: photoUrl,
      status: 'berhasil',
      distanceMeters: Math.floor(Math.random() * 15) + 3,
    })

    setTimeout(() => {
      router.push({
        pathname: '/result',
        query: { logId: newLog.id },
      })
    }, 600)
  }

  if (!point) return null

  return (
    <Page title='Ambil Foto Selfie'>
      <div className='max-w-sm mx-auto space-y-5'>
        {/* Header navigation */}
        <div className='flex items-center justify-between'>
          <button
            onClick={() => router.back()}
            className='p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <h2 className='text-lg font-bold text-slate-100'>Ambil Selfie</h2>
          <div className='w-9' />
        </div>

        {/* Selfie Viewport Container */}
        <div className='relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center'>
          {/* Live Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform -scale-x-100 ${cameraActive && !capturedImage ? 'block' : 'hidden'}`}
          />

          {/* Captured Preview or Fallback Guard Avatar */}
          {(capturedImage || !cameraActive) && (
            <img
              src={capturedImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
              alt='Selfie Preview'
              className='w-full h-full object-cover'
            />
          )}

          {/* Hidden Canvas element for snapshot */}
          <canvas ref={canvasRef} className='hidden' />

          {/* SATPAM Badge overlay on photo frame matching design */}
          <div className='absolute bottom-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg text-amber-400 font-extrabold text-xs tracking-wider uppercase shadow-md'>
            SATPAM
          </div>

          {/* Location & Time Stamp Watermark on camera */}
          <div className='absolute top-3 left-3 right-3 p-2 rounded-lg bg-slate-950/60 backdrop-blur-sm text-[10px] text-slate-300 flex items-center justify-between font-mono'>
            <span>GPS: {coords.lat}, {coords.lng}</span>
            <span className='text-amber-400 font-bold'>ONLINE</span>
          </div>
        </div>

        {/* Camera Guidance text */}
        <p className='text-xs font-semibold text-slate-400 text-center'>
          Pastikan wajah terlihat jelas
        </p>

        {/* Shutter Controls */}
        <div className='flex items-center justify-center space-x-6 pt-2'>
          <button
            onClick={takeSelfie}
            disabled={capturing}
            className='w-20 h-20 rounded-full bg-slate-100 p-1.5 shadow-2xl shadow-amber-500/30 active:scale-90 transition-all border-4 border-amber-400 flex items-center justify-center'
          >
            <div className='w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-slate-950 flex items-center justify-center'>
              <svg className='w-8 h-8 text-slate-950' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </Page>
  )
}

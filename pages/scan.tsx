import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Page from '@/components/page'
import { getStoredPoints } from '@/lib/mock-data'
import { PatrolPoint } from '@/types'
// @ts-ignore
import jsQR from 'jsqr'

export default function ScanQR() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [flashlight, setFlashlight] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [points, setPoints] = useState<PatrolPoint[]>([])
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    const loadedPoints = getStoredPoints()
    setPoints(loadedPoints)

    let animId: number
    let stream: MediaStream | null = null

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        .then((s) => {
          stream = s
          if (videoRef.current) {
            videoRef.current.srcObject = s
            videoRef.current.setAttribute('playsinline', 'true')
            videoRef.current.play()
            setCameraActive(true)

            // Start QR Scanner Frame Decoding Loop
            const scanFrame = () => {
              const video = videoRef.current
              const canvas = canvasRef.current
              if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                const ctx = canvas.getContext('2d')
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  const qr = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                  })

                  if (qr && qr.data) {
                    const rawData = qr.data.trim()
                    setScannedCode(rawData)

                    // Find matching point by code or ID
                    const matchedPoint = loadedPoints.find(
                      (p) =>
                        p.code.toUpperCase() === rawData.toUpperCase() ||
                        p.id === rawData ||
                        rawData.toUpperCase().includes(p.name.toUpperCase())
                    )

                    if (matchedPoint) {
                      // Trigger haptic vibration feedback if available
                      if (navigator.vibrate) navigator.vibrate(200)
                      handleScanSuccess(matchedPoint.id)
                      return
                    }
                  }
                }
              }
              animId = requestAnimationFrame(scanFrame)
            }
            animId = requestAnimationFrame(scanFrame)
          }
        })
        .catch((err) => {
          console.warn('Camera access warning:', err)
          setCameraActive(false)
          setCameraError('Gunakan simulasi di bawah jika kamera browser diblokir.')
        })
    } else {
      setCameraError('Browser tidak mendukung kamera.')
    }

    return () => {
      if (animId) cancelAnimationFrame(animId)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleScanSuccess = (pointId: string) => {
    router.push({
      pathname: '/checkpoint',
      query: { pointId },
    })
  }

  return (
    <Page title='Scan QR Patroli'>
      <div className='flex flex-col items-center space-y-5'>
        {/* Header Title */}
        <div className='w-full flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-100 flex items-center space-x-2'>
            <svg className='w-6 h-6 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M8 8h8v8H8z' />
            </svg>
            <span>Scan QR Titik Patroli</span>
          </h2>
          <button
            onClick={() => router.back()}
            className='p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200'
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Camera Viewport Container */}
        <div className='relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center'>
          {/* Live Video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Hidden Canvas element for frame analysis */}
          <canvas ref={canvasRef} className='hidden' />

          {/* Camera Fallback Graphic if no camera hardware */}
          {!cameraActive && (
            <div className='text-center p-6 space-y-3 z-10'>
              <div className='w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400 border border-slate-700 animate-pulse'>
                <svg className='w-8 h-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                </svg>
              </div>
              <p className='text-xs text-slate-400 font-medium'>
                {cameraError || 'Kamera aktif. Dekatkan ke QR Code...'}
              </p>
            </div>
          )}

          {/* Scanning Overlay Reticle Box */}
          <div className='absolute inset-0 border-[36px] border-slate-950/70 pointer-events-none flex items-center justify-center'>
            <div className='w-full h-full border-2 border-amber-400/80 rounded-2xl relative animate-pulse'>
              {/* Corner markers */}
              <div className='absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl-sm' />
              <div className='absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr-sm' />
              <div className='absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl-sm' />
              <div className='absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br-sm' />

              {/* Center scan line */}
              <div className='w-full h-0.5 bg-amber-400/90 shadow-lg shadow-amber-400 absolute top-1/2 -translate-y-1/2' />
            </div>
          </div>

          {/* Scanned Feedback Overlay */}
          {scannedCode && (
            <div className='absolute top-4 px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg animate-bounce z-30'>
              ✓ Terdeteksi: {scannedCode}
            </div>
          )}

          {/* Flashlight toggle */}
          <button
            onClick={() => setFlashlight(!flashlight)}
            className={`absolute bottom-4 p-3 rounded-full backdrop-blur-md border transition-all z-20 ${
              flashlight
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/40'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-amber-400'
            }`}
            title='Senter / Flash'
          >
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
            </svg>
          </button>
        </div>

        {/* Guidance Text */}
        <p className='text-xs font-semibold text-slate-400 text-center tracking-wide'>
          📷 Sensor Kamera Aktif — Arahkan ke QR Code di lokasi/kertas cetak
        </p>

        {/* Simulated QR Point Picker (for testing & desktop backup) */}
        <div className='w-full max-w-sm bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 mt-2'>
          <label className='block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between'>
            <span>Atau Klik Simulasi QR Point</span>
            <span className='text-[10px] text-slate-500 font-normal'>Desktop Mode</span>
          </label>
          <div className='grid grid-cols-1 gap-2'>
            {points.map((pt) => (
              <button
                key={pt.id}
                onClick={() => handleScanSuccess(pt.id)}
                className='flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all text-left group'
              >
                <div>
                  <h4 className='text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors'>
                    {pt.name}
                  </h4>
                  <p className='text-[11px] text-slate-400'>{pt.area} • {pt.code}</p>
                </div>
                <div className='px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold'>
                  Scan
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

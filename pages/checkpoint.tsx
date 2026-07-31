import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Page from '@/components/page'
import { getStoredPoints } from '@/lib/mock-data'
import { PatrolPoint } from '@/types'

export default function CheckpointDetail() {
  const router = useRouter()
  const { pointId } = router.query
  const [point, setPoint] = useState<PatrolPoint | null>(null)

  useEffect(() => {
    const points = getStoredPoints()
    if (pointId) {
      const found = points.find((p) => p.id === pointId)
      if (found) {
        setPoint(found)
      } else {
        setPoint(points[0])
      }
    } else {
      setPoint(points[0])
    }
  }, [pointId])

  if (!point) return null

  const handleProceed = () => {
    router.push({
      pathname: '/selfie',
      query: { pointId: point.id },
    })
  }

  return (
    <Page title='Detail Titik Patroli'>
      <div className='max-w-sm mx-auto space-y-5'>
        {/* Back header navigation */}
        <div className='flex items-center space-x-3'>
          <button
            onClick={() => router.back()}
            className='p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <div>
            <h2 className='text-lg font-bold text-slate-100'>Detail Titik</h2>
            <p className='text-xs text-amber-400 font-semibold font-mono'>{point.code}</p>
          </div>
        </div>

        {/* Location Sample Image Banner */}
        <div className='relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 shadow-xl'>
          <img
            src={point.imageSample || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
            alt={point.name}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />
          <div className='absolute bottom-3 left-4 right-4'>
            <span className='px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase rounded-md tracking-wider inline-block mb-1'>
              QR POINT TERDETEKSI
            </span>
            <h3 className='text-xl font-bold text-slate-100'>{point.name}</h3>
          </div>
        </div>

        {/* Info Grid Card */}
        <div className='bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl'>
          <div className='grid grid-cols-2 gap-4 pb-4 border-b border-slate-800'>
            <div>
              <span className='block text-xs text-slate-400 font-medium'>Nama Titik</span>
              <span className='block text-sm font-bold text-slate-200 mt-0.5'>{point.name}</span>
            </div>
            <div>
              <span className='block text-xs text-slate-400 font-medium'>Area</span>
              <span className='block text-sm font-bold text-amber-400 mt-0.5'>{point.area}</span>
            </div>
          </div>

          <div className='pb-4 border-b border-slate-800'>
            <span className='block text-xs text-slate-400 font-medium'>Jadwal Patroli</span>
            <div className='flex items-center space-x-2 mt-1'>
              <svg className='w-4 h-4 text-emerald-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span className='text-sm font-semibold text-slate-200'>{point.scheduleStart} - {point.scheduleEnd} WIB</span>
            </div>
          </div>

          <div>
            <span className='block text-xs text-slate-400 font-medium mb-1'>Instruksi Patroli</span>
            <div className='p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-normal'>
              💬 &quot;{point.instructions}&quot;
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleProceed}
          className='w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2'
        >
          <span>LANJUTKAN KE SELFIE</span>
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M14 5l7 7m0 0l-7 7m7-7H3' />
          </svg>
        </button>
      </div>
    </Page>
  )
}

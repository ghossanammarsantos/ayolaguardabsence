import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import { getStoredLogs } from '@/lib/mock-data'
import { PatrolLog } from '@/types'

export default function ResultSuccess() {
  const router = useRouter()
  const { logId } = router.query
  const [log, setLog] = useState<PatrolLog | null>(null)

  useEffect(() => {
    const logs = getStoredLogs()
    if (logId) {
      const found = logs.find((l) => l.id === logId)
      if (found) setLog(found)
      else setLog(logs[0])
    } else {
      setLog(logs[0])
    }
  }, [logId])

  if (!log) return null

  return (
    <Page title='Absen Berhasil'>
      <div className='max-w-sm mx-auto space-y-6 text-center pt-2 pb-6'>
        {/* Animated Green Success Badge */}
        <div className='relative w-24 h-24 mx-auto'>
          <div className='absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none' />
          <div className='relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border-4 border-slate-900'>
            <svg className='w-14 h-14 text-slate-950' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7' />
            </svg>
          </div>
        </div>

        {/* Success Title */}
        <div>
          <h2 className='text-2xl font-black text-slate-100 tracking-tight'>Absen Berhasil!</h2>
          <p className='text-xs text-slate-400 font-medium mt-1'>Data patroli dan bukti foto telah tersimpan di server</p>
        </div>

        {/* Log Details Card */}
        <div className='bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 text-left shadow-xl'>
          <div>
            <span className='block text-xs text-slate-400 font-medium'>Titik Patroli</span>
            <div className='flex items-center space-x-2 mt-0.5'>
              <span className='text-base font-bold text-amber-400'>{log.pointName}</span>
              <span className='text-xs text-slate-400'>({log.area})</span>
            </div>
          </div>

          <div className='border-t border-slate-800 pt-3'>
            <span className='block text-xs text-slate-400 font-medium'>Jam Datang</span>
            <span className='block text-sm font-bold text-slate-200 font-mono mt-0.5'>{log.timeFormatted}</span>
          </div>

          <div className='border-t border-slate-800 pt-3'>
            <span className='block text-xs text-slate-400 font-medium'>Lokasi (GPS)</span>
            <span className='block text-xs font-bold text-slate-300 font-mono mt-0.5'>
              {log.latitude}, {log.longitude}
            </span>
          </div>

          {/* Photo Preview Thumbnail */}
          <div className='border-t border-slate-800 pt-3'>
            <span className='block text-xs text-slate-400 font-medium mb-2'>Bukti Foto Selfie</span>
            <div className='w-20 h-20 rounded-xl overflow-hidden border border-amber-500/30 shadow-md relative'>
              <img src={log.photoUrl} alt='Selfie' className='w-full h-full object-cover' />
              <div className='absolute bottom-0 right-0 p-0.5 bg-emerald-500 text-slate-950 rounded-tl'>
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Prompt & Next Button */}
        <div className='p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center space-x-3 text-left'>
          <div className='w-8 h-8 rounded-full bg-amber-500/20 shrink-0 flex items-center justify-center text-amber-400'>
            💡
          </div>
          <span>Lanjutkan patroli ke titik berikutnya sesuai rute shift Anda.</span>
        </div>

        <div className='space-y-3 pt-2'>
          <Link
            href='/scan'
            className='w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2'
          >
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M8 8h8v8H8z' />
            </svg>
            <span>LANJUT KE TITIK BERIKUTNYA</span>
          </Link>

          <Link
            href='/'
            className='w-full py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 block'
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    </Page>
  )
}

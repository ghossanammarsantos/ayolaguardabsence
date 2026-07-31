import { useState, useEffect } from 'react'
import Page from '@/components/page'
import { getStoredLogs } from '@/lib/mock-data'
import { PatrolLog } from '@/types'

export default function History() {
  const [logs, setLogs] = useState<PatrolLog[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    setLogs(getStoredLogs())
  }, [])

  return (
    <Page title='Riwayat Patroli'>
      <div className='space-y-4 max-w-sm mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold text-slate-100 flex items-center space-x-2'>
            <svg className='w-5 h-5 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <span>Riwayat Absen Patroli</span>
          </h2>
          <span className='px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold'>
            {logs.length} Log
          </span>
        </div>

        {/* Timeline Log List */}
        <div className='space-y-3'>
          {logs.map((log) => (
            <div
              key={log.id}
              className='p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-md'
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-3'>
                  <button onClick={() => setSelectedPhoto(log.photoUrl)} className='relative group'>
                    <img
                      src={log.photoUrl}
                      alt='Selfie'
                      className='w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-amber-400 transition-all'
                    />
                    <div className='absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-[10px] font-bold'>
                      Lihat
                    </div>
                  </button>
                  <div>
                    <h3 className='text-sm font-bold text-slate-200'>{log.pointName}</h3>
                    <p className='text-xs text-slate-400 font-medium'>{log.area}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    log.status === 'berhasil'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {log.status === 'berhasil' ? 'Tervalidasi' : 'Terlambat'}
                </span>
              </div>

              <div className='flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 font-mono text-slate-400'>
                <span>⏰ {log.timeFormatted}</span>
                <span>📍 {log.latitude}, {log.longitude}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'
          >
            <div className='relative max-w-xs w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl'>
              <img src={selectedPhoto} alt='Bukti Selfie' className='w-full rounded-2xl object-cover aspect-square' />
              <button
                onClick={() => setSelectedPhoto(null)}
                className='mt-3 w-full py-2 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold'
              >
                Tutup Bukti Foto
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}

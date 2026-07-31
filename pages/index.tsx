import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Page from '@/components/page'
import { getStoredLogs, getStoredPoints } from '@/lib/mock-data'
import { GuardUser, PatrolLog, PatrolPoint } from '@/types'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<GuardUser | null>(null)
  const [logs, setLogs] = useState<PatrolLog[]>([])
  const [points, setPoints] = useState<PatrolPoint[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ayola_current_user')
      if (!stored) {
        router.push('/login')
        return
      }
      setUser(JSON.parse(stored))
      setLogs(getStoredLogs())
      setPoints(getStoredPoints())
    }
  }, [router])

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('ayola_current_user')
      router.push('/login')
    }
  }

  const completedToday = logs.filter((l) => l.guardId === (user?.guardId || 'SATPAM01')).length
  const totalPointsCount = points.length || 5

  return (
    <Page title='Beranda Satpam'>
      <div className='space-y-4'>
        {/* Welcome Card Header */}
        <div className='relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-xl transition-colors'>
          <div className='absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none' />

          <div className='flex items-center space-x-4 relative z-10'>
            <div className='relative'>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt='Satpam Avatar'
                className='w-14 h-14 rounded-full object-cover ring-2 ring-amber-400/80 shadow-md'
              />
              <span className='absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full' />
            </div>

            <div>
              <h2 className='text-xl font-bold text-slate-800 dark:text-slate-100'>
                Halo, <span className='text-amber-600 dark:text-amber-400'>{user?.guardId || 'SATPAM01'}</span>
              </h2>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>Selamat bertugas! Shift Pagi (08:00 - 20:00 WIB)</p>
            </div>
          </div>

          {/* Quick Progress Bar */}
          <div className='mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs'>
            <span className='text-slate-500 dark:text-slate-400 font-medium'>Kemajuan Patroli Hari Ini:</span>
            <span className='font-bold text-amber-600 dark:text-amber-400'>{completedToday} dari {totalPointsCount} Titik</span>
          </div>
          <div className='w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500'
              style={{ width: `${Math.min(100, (completedToday / totalPointsCount) * 100)}%` }}
            />
          </div>
        </div>

        {/* PRIMARY CTA: Patroli / Scan QR */}
        <Link href='/scan' className='block group active-press'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-5 shadow-xl shadow-amber-500/20 border border-amber-300/40 text-slate-950'>
            <div className='flex items-center justify-between relative z-10'>
              <div className='flex items-center space-x-3.5'>
                <div className='w-13 h-13 rounded-xl bg-slate-950/15 backdrop-blur-md flex items-center justify-center text-slate-950 group-hover:scale-105 transition-transform'>
                  <svg className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M8 8h8v8H8z' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-base font-extrabold uppercase tracking-wide'>Patroli / Scan QR</h3>
                  <p className='text-xs font-semibold opacity-90'>Mulai absensi titik lokasi patroli</p>
                </div>
              </div>

              <div className='w-8 h-8 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shadow-md'>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9 5l7 7-7 7' />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Menu Grid Options */}
        <div className='grid grid-cols-1 gap-2.5'>
          <Link href='/history' className='flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all group active-press shadow-sm'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20'>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <span className='font-semibold text-slate-800 dark:text-slate-200 text-xs'>Riwayat Patroli</span>
            </div>
            <svg className='w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
            </svg>
          </Link>

          <Link href='/report' className='flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all group active-press shadow-sm'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20'>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <span className='font-semibold text-slate-800 dark:text-slate-200 text-xs'>Laporan Task / Insiden</span>
            </div>
            <svg className='w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
            </svg>
          </Link>

          <Link href='/profile' className='flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all group active-press shadow-sm'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20'>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <span className='font-semibold text-slate-800 dark:text-slate-200 text-xs'>Profil Satpam</span>
            </div>
            <svg className='w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
            </svg>
          </Link>

          <button
            onClick={handleLogout}
            className='w-full flex items-center justify-between p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-left text-red-500 dark:text-red-400 active-press shadow-sm'
          >
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30'>
                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                </svg>
              </div>
              <span className='font-bold text-xs uppercase tracking-wider'>LOGOUT</span>
            </div>
          </button>
        </div>
      </div>
    </Page>
  )
}

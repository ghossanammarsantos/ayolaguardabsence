import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
  title?: string
  children: React.ReactNode
  fullWidth?: boolean
}

const Page = ({ title, children, fullWidth = false }: Props) => {
  const router = useRouter()
  const pageTitle = title ? `${title} | AYOLA OCARINA` : 'AYOLA OCARINA - Absen & Patroli Satpam'
  const [timeString, setTimeString] = useState('09:41')
  const isAdmin = router.pathname.startsWith('/admin')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [])

  // If Admin Page -> Render Fullwidth Desktop Viewport
  if (isAdmin) {
    return (
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans transition-colors'>
        <Head>
          <title>{pageTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main>{children}</main>
      </div>
    )
  }

  // PWA Satpam Mobile Frame Viewport Layout
  return (
    <div className='min-h-screen bg-slate-200 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-0 sm:p-4 selection:bg-amber-500 selection:text-slate-950 transition-colors'>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Sistem Absensi QR & Patroli Satpam Ayola Ocarina" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </Head>

      {/* Mobile App Shell Device Wrapper */}
      <div className='mobile-app-shell w-full relative flex flex-col justify-between shadow-2xl'>

        {/* Smartphone Camera Notch (Visible on Desktop Simulation) */}
        <div className='hidden sm:block mobile-notch'>
          <div className='w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-950 absolute left-4 top-1.5 border border-slate-400 dark:border-slate-800' />
          <div className='w-2 h-2 rounded-full bg-indigo-900/60 dark:bg-indigo-950/80 absolute right-4 top-2 border border-slate-400 dark:border-slate-800' />
        </div>

        {/* Mobile App Status Bar (iOS / Android Style) */}
        <div className='w-full px-5 pt-3 pb-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 z-40 border-b border-slate-200 dark:border-slate-800/40 select-none transition-colors'>
          <span className='font-mono font-bold tracking-tight text-amber-600 dark:text-amber-400'>{timeString} WIB</span>
          <div className='flex items-center space-x-2 text-slate-500 dark:text-slate-400'>
            {/* Cellular Signal Icon */}
            <svg className='w-3.5 h-3.5 text-slate-700 dark:text-slate-300' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 3a1 1 0 011-1h2a1 1 0 011 1v13a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z' />
            </svg>
            {/* WiFi Icon */}
            <svg className='w-3.5 h-3.5 text-slate-700 dark:text-slate-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' />
            </svg>
            {/* Battery 100% Icon */}
            <div className='flex items-center space-x-0.5'>
              <div className='w-5 h-2.5 rounded-sm border border-slate-500 dark:border-slate-300 p-0.5 flex items-center'>
                <div className='w-full h-full bg-emerald-500 dark:bg-emerald-400 rounded-2xs' />
              </div>
              <div className='w-0.5 h-1 bg-slate-500 dark:bg-slate-400 rounded-r-xs' />
            </div>
          </div>
        </div>

        {/* Appbar Component */}
        <Appbar />

        {/* Scrollable Content Container */}
        <main className={`flex-1 overflow-y-auto pt-14 pb-20 px-safe ${fullWidth ? 'px-0' : ''}`}>
          <div className={fullWidth ? '' : 'p-4'}>{children}</div>
        </main>

        {/* Bottom Navigation Component */}
        <BottomNav />

        {/* Bottom Home Indicator Bar (iOS Style) */}
        <div className='w-full py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-center pointer-events-none z-40 border-t border-slate-200 dark:border-slate-800/40 transition-colors'>
          <div className='w-32 h-1 bg-slate-300 dark:bg-slate-700/80 rounded-full' />
        </div>
      </div>
    </div>
  )
}

export default Page

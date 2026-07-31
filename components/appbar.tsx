import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const Appbar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [userName, setUserName] = useState('SATPAM01')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('ayola_current_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setUserName(parsed.guardId || 'SATPAM01')
        } catch (e) {}
      }
    }
  }, [])

  if (router.pathname === '/login' || router.pathname.startsWith('/admin')) return null

  return (
    <div className='sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 shadow-md transition-colors'>
      <header className='px-4 py-2.5 flex items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20'>
            <svg className="w-4 h-4 text-slate-950 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className='block text-[10px] uppercase tracking-widest text-amber-500 dark:text-amber-400 font-semibold leading-none'>AYOLA</span>
            <span className='block text-xs tracking-wider text-slate-800 dark:text-slate-200 font-bold leading-tight'>OCARINA</span>
          </div>
        </Link>

        <div className='flex items-center space-x-2'>
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors'
              title='Ganti Mode Terang / Gelap'
            >
              {theme === 'dark' ? (
                /* Sun Icon */
                <svg className='w-4 h-4 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className='w-4 h-4 text-slate-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                </svg>
              )}
            </button>
          )}

          <Link href='/admin' className='text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors font-semibold'>
            Admin Web
          </Link>
          <div className='flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700'>
            <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse'></div>
            <span className='text-[11px] font-semibold text-slate-700 dark:text-slate-300'>{userName}</span>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Appbar

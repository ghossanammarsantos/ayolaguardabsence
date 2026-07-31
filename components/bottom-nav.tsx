import Link from 'next/link'
import { useRouter } from 'next/router'

const navLinks = [
  {
    label: 'Beranda',
    href: '/',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
      </svg>
    ),
  },
  {
    label: 'Scan QR',
    href: '/scan',
    highlight: true,
    icon: (
      <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M8 8h8v8H8z' />
      </svg>
    ),
  },
  {
    label: 'Riwayat',
    href: '/history',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
  },
  {
    label: 'Profil',
    href: '/profile',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
      </svg>
    ),
  },
]

const BottomNav = () => {
  const router = useRouter()

  if (router.pathname === '/login' || router.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className='sticky bottom-0 z-30 w-full border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors'>
      <div className='flex h-14 items-center justify-around px-2'>
        {navLinks.map(({ href, label, icon, highlight }) => {
          const isActive = router.pathname === href

          if (highlight) {
            return (
              <Link key={label} href={href} className='flex flex-col items-center justify-center -mt-5 active-press'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 p-2.5 shadow-lg shadow-amber-500/30 flex items-center justify-center border-2 border-white dark:border-slate-950'>
                  {icon}
                </div>
                <span className='text-[10px] font-bold text-amber-500 dark:text-amber-400 mt-0.5'>{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={label}
              href={href}
              className={`flex h-full w-full flex-col items-center justify-center space-y-0.5 active-press ${
                isActive ? 'text-amber-500 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {icon}
              <span className='text-[10px]'>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav

import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (username && password) {
        const userData = {
          guardId: username.toUpperCase(),
          name: username.toUpperCase() === 'SATPAM01' ? 'Budi Santoso' : 'Satpam Duty',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
          role: 'guard',
          shiftName: 'Shift Pagi (08:00 - 20:00 WIB)',
        }
        localStorage.setItem('ayola_current_user', JSON.stringify(userData))
        router.push('/')
      } else {
        setError('ID Satpam & Password wajib diisi')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between px-6 py-10 relative overflow-hidden'>
      <Head>
        <title>Login Satpam | AYOLA OCARINA</title>
      </Head>

      {/* Subtle Background Elements */}
      <div className='absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none' />
      <div className='absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none' />

      {/* Brand Header */}
      <div className='text-center pt-8 z-10'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 mb-3 border border-amber-300/30'>
          <svg className='w-9 h-9 text-slate-950' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold tracking-widest text-amber-400 uppercase'>AYOLA</h1>
        <p className='text-xs tracking-widest text-slate-400 uppercase font-semibold -mt-1'>OCARINA</p>
        <h2 className='text-lg font-semibold tracking-wider text-slate-200 mt-6'>LOGIN SATPAM</h2>
      </div>

      {/* Login Card */}
      <div className='w-full max-w-sm mx-auto my-auto z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl'>
        {error && (
          <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1.5'>ID / Username</label>
            <div className='relative'>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Masukkan ID Satpam'
                className='w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono'
                required
              />
              <span className='absolute right-3.5 top-3.5 text-slate-500 text-xs font-semibold'>ID</span>
            </div>
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1.5'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono'
              required
            />
          </div>

          <div className='flex items-center justify-between text-xs py-1'>
            <label className='flex items-center space-x-2 text-slate-400 cursor-pointer'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400'
              />
              <span>Ingat saya</span>
            </label>
            <a href='#' onClick={(e) => { e.preventDefault(); alert('Hubungi Admin untuk reset password satpam.'); }} className='text-amber-400/80 hover:text-amber-400 hover:underline'>
              Lupa Password?
            </a>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2'
          >
            {loading ? 'Memproses...' : 'LOGIN'}
          </button>
        </form>
      </div>

      {/* Footer Branding */}
      <div className='text-center z-10 pt-4'>
        <p className='text-[11px] text-slate-500 font-medium'>Keamanan adalah prioritas. Layanan adalah komitmen.</p>
        <p className='text-[10px] text-slate-600 mt-1'>© 2026 AYOLA OCARINA • Security Absensi PWA</p>
      </div>
    </div>
  )
}

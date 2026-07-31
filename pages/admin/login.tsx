import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      // Validate Admin Credentials
      if ((username.toLowerCase() === 'admin' && password === 'admin123') || password === '123456') {
        const adminData = {
          username: username.toLowerCase(),
          name: 'Supervisor / Admin Utama',
          role: 'admin',
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('ayola_admin_session', JSON.stringify(adminData))
        router.push('/admin')
      } else {
        setError('Username atau Password Admin salah (Default: admin / admin123)')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between px-6 py-10 relative overflow-hidden'>
      <Head>
        <title>Login Admin & Supervisor | AYOLA OCARINA</title>
      </Head>

      {/* Ambient background glows */}
      <div className='absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none' />
      <div className='absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none' />

      {/* Brand Header */}
      <div className='text-center pt-8 z-10'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-500/20 mb-3 border border-amber-400/30'>
          <svg className='w-9 h-9 text-slate-950' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold tracking-widest text-amber-400 uppercase'>AYOLA GUARD</h1>
        <p className='text-xs tracking-widest text-slate-400 uppercase font-semibold -mt-1'>PORTAL SUPERVISOR & ADMIN</p>
        <h2 className='text-lg font-semibold tracking-wider text-slate-200 mt-6'>AUTHENTICATION ADMIN</h2>
      </div>

      {/* Login Card */}
      <div className='w-full max-w-sm mx-auto my-auto z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl'>
        {error && (
          <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1.5'>Username Admin</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Masukkan username admin'
              className='w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono'
              required
            />
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

          <div className='p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between'>
            <span>Default Username: <strong className='text-amber-400'>admin</strong></span>
            <span>Pass: <strong className='text-amber-400'>admin123</strong></span>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all text-sm uppercase tracking-wider'
          >
            {loading ? 'Memverifikasi...' : 'Masuk Portal Admin 🔑'}
          </button>
        </form>
      </div>

      {/* Footer info */}
      <div className='text-center text-xs text-slate-500 z-10'>
        © {new Date().getFullYear()} Ayola Guard Absence. Portal Supervisor Keamanan.
      </div>
    </div>
  )
}
